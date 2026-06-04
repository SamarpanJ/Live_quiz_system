import type { Server } from "socket.io";
import {
  PHASE,
  QUIZ_STATUS,
  type ClientToServerEvents,
  type FullQuestion,
  type LeaderboardRow,
  type FinalResult,
  type Phase,
  type PublicQuestion,
  type QuizMeta,
  type RoomState,
  type ServerToClientEvents,
} from "@quiz/shared";
import { prisma } from "../src/lib/prisma";

export interface SocketData {
  participantId?: string;
  quizId?: string;
  isAdmin?: boolean;
  name?: string;
}

type IO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

const TICK_MS = 1000;

function parseOptions(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * One live quiz session. The server is the single source of truth for the
 * clock: it sets `endsAt` (server epoch ms) per phase and ticks every second so
 * every connected student renders the exact same countdown.
 */
export class Room {
  readonly quizId: string;
  private io: IO;

  meta: QuizMeta = {
    id: "",
    title: "",
    description: null,
    joinCode: "",
    questionCount: 0,
  };
  private questions: FullQuestion[] = [];

  phase: Phase = PHASE.LOBBY;
  private index = -1; // index of the current / just-ended question
  private endsAt: number | null = null;

  private phaseTimer: NodeJS.Timeout | null = null;
  private tickTimer: NodeJS.Timeout | null = null;

  private participants = new Map<string, { name: string }>();
  private scores = new Map<string, number>();
  /** Answers for the active (or just-ended) question only. */
  private currentAnswers = new Map<string, number>();
  private finalResultsCache: FinalResult[] | null = null;

  constructor(io: IO, quizId: string) {
    this.io = io;
    this.quizId = quizId;
  }

  // ---- loading -----------------------------------------------------------

  async load(): Promise<boolean> {
    const quiz = await prisma.quiz.findUnique({
      where: { id: this.quizId },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!quiz) return false;
    this.meta = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      joinCode: quiz.joinCode,
      questionCount: quiz.questions.length,
    };
    this.questions = quiz.questions.map((q) => ({
      id: q.id,
      order: q.order,
      text: q.text,
      options: parseOptions(q.options),
      correctIndex: q.correctIndex,
      marks: q.marks,
      durationSec: q.durationSec,
      breakSec: q.breakSec,
    }));
    return true;
  }

  get isRunning(): boolean {
    return this.phase === PHASE.QUESTION || this.phase === PHASE.BREAK;
  }

  // ---- participants ------------------------------------------------------

  async addParticipant(participantId: string, name: string) {
    this.participants.set(participantId, { name });
    if (!this.scores.has(participantId)) {
      // Restore score from DB so a refresh / rejoin keeps progress.
      const agg = await prisma.answer.aggregate({
        where: { quizId: this.quizId, participantId },
        _sum: { marksAwarded: true },
      });
      this.scores.set(participantId, agg._sum.marksAwarded ?? 0);
    }
    // If they're rejoining mid-question, restore their locked answer.
    if (this.phase === PHASE.QUESTION || this.phase === PHASE.BREAK) {
      const cur = this.questions[this.index];
      if (cur) {
        const a = await prisma.answer.findUnique({
          where: { questionId_participantId: { questionId: cur.id, participantId } },
        });
        if (a) this.currentAnswers.set(participantId, a.optionIndex);
      }
    }
  }

  removeParticipant(participantId: string) {
    // We keep score/answer history; only drop them from the live roster.
    this.participants.delete(participantId);
  }

  hasParticipant(participantId: string): boolean {
    return this.participants.has(participantId);
  }

  // ---- run control -------------------------------------------------------

  async start(): Promise<{ ok: boolean; error?: string }> {
    if (this.isRunning) return { ok: false, error: "Quiz already running." };
    await this.load();
    if (this.questions.length === 0) return { ok: false, error: "This quiz has no questions yet." };

    await prisma.quiz.update({
      where: { id: this.quizId },
      data: { status: QUIZ_STATUS.LIVE },
    });
    // Fresh run: clear any prior answers for a clean session.
    await prisma.answer.deleteMany({ where: { quizId: this.quizId } });
    this.scores.clear();
    for (const id of this.participants.keys()) this.scores.set(id, 0);
    this.finalResultsCache = null;

    this.index = -1;
    await this.gotoNextQuestion();
    return { ok: true };
  }

  private async gotoNextQuestion() {
    this.clearTimers();
    this.currentAnswers.clear();
    this.index += 1;

    if (this.index >= this.questions.length) {
      await this.finish();
      return;
    }

    const q = this.questions[this.index];
    this.phase = PHASE.QUESTION;
    this.endsAt = Date.now() + q.durationSec * 1000;
    await this.emitState();
    this.startTicking();
    this.phaseTimer = setTimeout(() => void this.enterBreak(), q.durationSec * 1000);
  }

  private async enterBreak() {
    this.clearTimers();
    const q = this.questions[this.index];
    this.phase = PHASE.BREAK;

    const isLast = this.index >= this.questions.length - 1;
    // After the last question we go straight to the final results screen.
    if (isLast) {
      await this.finish();
      return;
    }

    const breakMs = Math.max(0, q.breakSec) * 1000;
    this.endsAt = Date.now() + breakMs;
    await this.emitState();
    this.startTicking();
    this.phaseTimer = setTimeout(() => void this.gotoNextQuestion(), breakMs);
  }

  private async finish() {
    this.clearTimers();
    this.phase = PHASE.FINISHED;
    this.endsAt = null;
    await prisma.quiz.update({
      where: { id: this.quizId },
      data: { status: QUIZ_STATUS.FINISHED },
    });
    await this.computeFinalResults();
    await this.emitState();
  }

  private async computeFinalResults() {
    const totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
    const totalQuestions = this.questions.length;
    const correctByParticipant = await prisma.answer.groupBy({
      by: ["participantId"],
      where: { quizId: this.quizId, isCorrect: true },
      _count: { _all: true },
    });
    const correctMap = new Map(
      correctByParticipant.map((r) => [r.participantId, r._count._all]),
    );

    this.finalResultsCache = [...this.participants.entries()]
      .map(([participantId, p]) => ({
        participantId,
        name: p.name,
        score: this.scores.get(participantId) ?? 0,
        totalMarks,
        correctCount: correctMap.get(participantId) ?? 0,
        totalQuestions,
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  async skip(): Promise<{ ok: boolean; error?: string }> {
    if (this.phase === PHASE.QUESTION) {
      await this.enterBreak();
      return { ok: true };
    }
    if (this.phase === PHASE.BREAK) {
      await this.gotoNextQuestion();
      return { ok: true };
    }
    return { ok: false, error: "Nothing to skip." };
  }

  async stop(): Promise<{ ok: boolean; error?: string }> {
    if (this.phase === PHASE.FINISHED || this.phase === PHASE.LOBBY) {
      return { ok: false, error: "Quiz is not running." };
    }
    await this.finish();
    return { ok: true };
  }

  // ---- answers -----------------------------------------------------------

  async submitAnswer(
    participantId: string,
    questionId: string,
    optionIndex: number,
  ): Promise<{ ok: boolean; error?: string }> {
    if (this.phase !== PHASE.QUESTION) return { ok: false, error: "No question is open." };
    const q = this.questions[this.index];
    if (!q || q.id !== questionId) return { ok: false, error: "That question is no longer active." };
    if (this.currentAnswers.has(participantId)) return { ok: false, error: "Answer already locked." };
    if (optionIndex < 0 || optionIndex >= q.options.length) {
      return { ok: false, error: "Invalid option." };
    }

    const isCorrect = optionIndex === q.correctIndex;
    const marksAwarded = isCorrect ? q.marks : 0;

    this.currentAnswers.set(participantId, optionIndex);
    this.scores.set(participantId, (this.scores.get(participantId) ?? 0) + marksAwarded);

    try {
      await prisma.answer.create({
        data: {
          quizId: this.quizId,
          questionId: q.id,
          participantId,
          optionIndex,
          isCorrect,
          marksAwarded,
        },
      });
    } catch {
      // Unique violation = double submit race; the in-memory guard already won.
    }

    // Tell the admin room someone answered (no correctness leaked to students).
    await this.emitParticipants();
    return { ok: true };
  }

  // ---- snapshots ---------------------------------------------------------

  private toPublic(q: FullQuestion): PublicQuestion {
    return {
      id: q.id,
      order: q.order,
      text: q.text,
      options: q.options,
      marks: q.marks,
      durationSec: q.durationSec,
      index: this.index,
      total: this.questions.length,
    };
  }

  private leaderboard(): LeaderboardRow[] {
    const rows = [...this.participants.entries()]
      .map(([participantId, p]) => ({
        participantId,
        name: p.name,
        score: this.scores.get(participantId) ?? 0,
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }

  buildState(participantId?: string): RoomState {
    const now = Date.now();
    const remainingMs = this.endsAt ? Math.max(0, this.endsAt - now) : 0;
    const cur = this.index >= 0 ? this.questions[this.index] : null;

    const base: RoomState = {
      phase: this.phase,
      quiz: this.meta,
      serverNow: now,
      endsAt: this.endsAt,
      remainingMs,
      phaseDurationMs:
        this.phase === PHASE.QUESTION && cur
          ? cur.durationSec * 1000
          : this.phase === PHASE.BREAK && cur
            ? Math.max(0, cur.breakSec) * 1000
            : 0,
      participantsCount: this.participants.size,
      question: null,
      mySubmission: null,
      reveal: null,
      nextIndex: null,
      leaderboard: this.leaderboard(),
      finalResults: null,
      myScore: participantId ? this.scores.get(participantId) ?? 0 : 0,
    };

    if (this.phase === PHASE.QUESTION && cur) {
      base.question = this.toPublic(cur);
      if (participantId && this.currentAnswers.has(participantId)) {
        base.mySubmission = {
          questionId: cur.id,
          optionIndex: this.currentAnswers.get(participantId)!,
        };
      }
    }

    if (this.phase === PHASE.BREAK && cur) {
      const myOpt = participantId ? this.currentAnswers.get(participantId) ?? null : null;
      const isCorrect = myOpt !== null && myOpt === cur.correctIndex;
      base.reveal = {
        questionId: cur.id,
        correctIndex: cur.correctIndex,
        myOptionIndex: myOpt,
        isCorrect,
        marksAwarded: isCorrect ? cur.marks : 0,
      };
      base.nextIndex = this.index + 1 < this.questions.length ? this.index + 1 : null;
    }

    if (this.phase === PHASE.FINISHED) {
      base.finalResults = this.finalResultsCache;
    }

    return base;
  }

  // ---- emit helpers ------------------------------------------------------

  async emitState() {
    const sockets = await this.io.in(this.quizId).fetchSockets();
    for (const s of sockets) {
      s.emit("state", this.buildState(s.data.participantId));
    }
  }

  async emitStateTo(socketId: string, participantId?: string) {
    this.io.to(socketId).emit("state", this.buildState(participantId));
  }

  async emitParticipants() {
    const list = [...this.participants.entries()].map(([id, p]) => ({
      id,
      name: p.name,
      score: this.scores.get(id) ?? 0,
      answeredCurrent: this.currentAnswers.has(id),
    }));
    this.io.in(this.quizId).emit("participants", { count: list.length, list });
    this.io.in(this.quizId).emit("leaderboard", this.leaderboard());
  }

  private startTicking() {
    this.stopTicking();
    const tick = () => {
      const remainingMs = this.endsAt ? Math.max(0, this.endsAt - Date.now()) : 0;
      this.io.in(this.quizId).emit("tick", {
        phase: this.phase,
        remainingMs,
        endsAt: this.endsAt,
      });
    };
    tick();
    this.tickTimer = setInterval(tick, TICK_MS);
  }

  private stopTicking() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.tickTimer = null;
  }

  private clearTimers() {
    if (this.phaseTimer) clearTimeout(this.phaseTimer);
    this.phaseTimer = null;
    this.stopTicking();
  }
}

/** Holds every live room, keyed by quizId (MVP runs one, but this scales). */
export class RoomManager {
  private rooms = new Map<string, Room>();
  constructor(private io: IO) {}

  get(quizId: string): Room | undefined {
    return this.rooms.get(quizId);
  }

  async getOrLoad(quizId: string): Promise<Room | null> {
    let room = this.rooms.get(quizId);
    if (room) return room;
    room = new Room(this.io, quizId);
    const ok = await room.load();
    if (!ok) return null;
    this.rooms.set(quizId, room);
    return room;
  }

  async findByJoinCode(joinCode: string): Promise<Room | null> {
    const quiz = await prisma.quiz.findUnique({ where: { joinCode } });
    if (!quiz) return null;
    return this.getOrLoad(quiz.id);
  }
}
