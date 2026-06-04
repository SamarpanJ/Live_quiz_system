/**
 * Domain types shared between the realtime server and the web client.
 * These intentionally mirror the Prisma models but never leak answer keys
 * to students during an active question.
 */

export const QUIZ_STATUS = {
  DRAFT: "draft",
  LIVE: "live",
  FINISHED: "finished",
} as const;
export type QuizStatus = (typeof QUIZ_STATUS)[keyof typeof QUIZ_STATUS];

/** The live phase the whole room is in. Driven authoritatively by the server. */
export const PHASE = {
  LOBBY: "lobby",
  QUESTION: "question",
  BREAK: "break",
  FINISHED: "finished",
} as const;
export type Phase = (typeof PHASE)[keyof typeof PHASE];

export interface QuizMeta {
  id: string;
  title: string;
  description: string | null;
  joinCode: string;
  questionCount: number;
}

/** Question as the admin authors / stores it (full truth, includes answer). */
export interface FullQuestion {
  id: string;
  order: number;
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
  durationSec: number;
  breakSec: number;
}

/** Question as broadcast to students DURING the question (answer hidden). */
export interface PublicQuestion {
  id: string;
  order: number;
  text: string;
  options: string[];
  marks: number;
  durationSec: number;
  index: number; // zero-based position in the run
  total: number; // total questions in the quiz
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  answeredCurrent: boolean;
}

/** What the student knows about their own submission for the active question. */
export interface MySubmission {
  questionId: string;
  optionIndex: number;
}

/** Reveal payload, only sent once a question's timer has elapsed. */
export interface RevealInfo {
  questionId: string;
  correctIndex: number;
  myOptionIndex: number | null;
  isCorrect: boolean;
  marksAwarded: number;
}

export interface LeaderboardRow {
  participantId: string;
  name: string;
  score: number;
  rank: number;
}

export interface FinalResult {
  participantId: string;
  name: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  totalQuestions: number;
}

/**
 * The full room state. The server sends this on join and on every phase change.
 * `serverNow` + `endsAt` let clients reconcile clock skew; `remainingMs` is the
 * authoritative value they should display (kept identical for everyone).
 */
export interface RoomState {
  phase: Phase;
  quiz: QuizMeta;
  serverNow: number; // server epoch ms at time of emit
  endsAt: number | null; // server epoch ms when current phase ends
  remainingMs: number; // ms left in current phase
  phaseDurationMs: number; // total length of the current phase (for progress rings)
  participantsCount: number;

  // Present during QUESTION
  question: PublicQuestion | null;
  mySubmission: MySubmission | null;

  // Present during BREAK (reveal of the question that just ended)
  reveal: RevealInfo | null;
  nextIndex: number | null; // upcoming question index, if any
  leaderboard: LeaderboardRow[];

  // Present when FINISHED
  finalResults: FinalResult[] | null;
  myScore: number;
}
