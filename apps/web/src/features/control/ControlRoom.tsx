"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Play, SkipForward, Square, Users } from "lucide-react";
import { PHASE } from "@quiz/shared";
import { Leaderboard } from "@/components/Leaderboard";
import { TimerRing } from "@/components/TimerRing";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useControlRoom } from "./useControlRoom";
import type { AdminQuestion, AdminQuiz } from "../admin/types";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function ControlRoom({ quizId }: { quizId: string }) {
  const { connected, error, state, participants, leaderboard, start, skip, stop, busy } =
    useControlRoom(quizId);
  const remainingMs = useCountdown(state?.endsAt ?? null, state?.serverNow ?? null);
  const [questions, setQuestions] = useState<Record<string, AdminQuestion>>({});
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    api
      .get<{ quiz: AdminQuiz }>(`/quizzes/${quizId}`)
      .then(({ data }) => {
        setTitle(data.quiz.title);
        setJoinCode(data.quiz.joinCode);
        const map: Record<string, AdminQuestion> = {};
        for (const q of data.quiz.questions ?? []) map[q.id] = q;
        setQuestions(map);
      })
      .catch(() => {});
  }, [quizId]);

  if (!connected || !state) {
    return (
      <div className="admin-main grid place-items-center py-28 text-center">
        {error ? (
          <p className="error-banner max-w-sm">{error}</p>
        ) : (
          <Loader2 className="size-7 animate-spin text-brand-soft" />
        )}
      </div>
    );
  }

  const answeredCount = participants.filter((p) => p.answeredCurrent).length;
  const activeQid = state.question?.id ?? state.reveal?.questionId;
  const activeQuestion = activeQid ? questions[activeQid] : undefined;

  return (
    <div className="admin-main grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="glass-card flex flex-wrap items-center justify-between gap-5 p-6 sm:p-7">
          <div>
            <p className="text-sm text-ink-dim">{title}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
              Join code
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.22em] text-brand-ink">
              {joinCode}
            </p>
          </div>
          <div className="chip">
            <Users className="size-4" />
            {state.participantsCount} joined
          </div>
        </div>

        {state.phase === PHASE.LOBBY && (
          <StageCard>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
              Waiting room
            </p>
            <h2 className="heading-display mt-3 text-2xl sm:text-3xl">Ready when you are</h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink-dim">
              Share the join code above. When you start, the quiz runs automatically through
              each question and break.
            </p>
            <Button size="lg" className="mt-8" onClick={start} loading={busy}>
              <Play className="size-5" />
              Start quiz
            </Button>
          </StageCard>
        )}

        {(state.phase === PHASE.QUESTION || state.phase === PHASE.BREAK) && (
          <div className="glass-card p-7 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      state.phase === PHASE.QUESTION
                        ? "border-brand/30 bg-brand/12 text-brand-soft"
                        : "border-accent/30 bg-accent/10 text-accent",
                    )}
                  >
                    {state.phase === PHASE.QUESTION ? "Question live" : "Break · revealing"}
                  </span>
                  {activeQuestion && (
                    <span className="chip py-1">{activeQuestion.marks} marks</span>
                  )}
                </div>
                <h2 className="heading-display mt-4 text-balance text-xl leading-snug sm:text-2xl">
                  {activeQuestion?.text ?? state.question?.text}
                </h2>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {(activeQuestion?.options ?? state.question?.options ?? []).map((opt, oi) => {
                    const isCorrect = activeQuestion && oi === activeQuestion.correctIndex;
                    const reveal = state.phase === PHASE.BREAK;
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "option-slab",
                          reveal && isCorrect && "option-slab-correct",
                        )}
                      >
                        <span
                          className={cn(
                            "option-slab-letter",
                            reveal && isCorrect && "option-slab-letter-correct",
                          )}
                        >
                          {LETTERS[oi]}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{opt}</span>
                        {reveal && isCorrect && (
                          <CheckCircle2 className="ml-auto size-4 shrink-0 text-brand-soft" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="shrink-0 text-center">
                <TimerRing
                  remainingMs={remainingMs}
                  totalMs={state.phaseDurationMs}
                  size={128}
                  stroke={10}
                  tone={state.phase === PHASE.BREAK ? "accent" : "brand"}
                />
                {state.phase === PHASE.QUESTION && (
                  <p className="mt-3 text-sm text-ink-dim">
                    <span className="font-semibold text-ink">{answeredCount}</span> /{" "}
                    {state.participantsCount} answered
                  </p>
                )}
              </div>
            </div>

            <div className="divider-soft mt-8 flex justify-end gap-2 pt-5">
              <Button variant="secondary" size="sm" onClick={skip} loading={busy}>
                <SkipForward className="size-4" />
                {state.phase === PHASE.QUESTION ? "Reveal now" : "Next question"}
              </Button>
              <Button variant="danger" size="sm" onClick={stop} loading={busy}>
                <Square className="size-4" />
                End quiz
              </Button>
            </div>
          </div>
        )}

        {state.phase === PHASE.FINISHED && (
          <StageCard>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">Finished</p>
            <h2 className="heading-display mt-3 text-2xl sm:text-3xl">The quiz has ended</h2>
            <p className="mt-3 text-ink-dim">Final standings are on the right.</p>
            <Button size="lg" className="mt-8" onClick={start} loading={busy}>
              <Play className="size-5" />
              Run again
            </Button>
          </StageCard>
        )}
      </div>

      <aside className="space-y-5">
        <div className="glass-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-ink-dim">
            <Users className="size-4" />
            Players ({participants.length})
          </h3>
          {participants.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">Waiting for players…</p>
          ) : (
            <ul className="space-y-2">
              {participants.map((p) => (
                <li
                  key={p.id}
                  className="surface-inset flex items-center justify-between px-3.5 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    {state.phase === PHASE.QUESTION && p.answeredCurrent && (
                      <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                    )}
                    {p.name}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-ink-dim">{p.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-medium text-ink-dim">Leaderboard</h3>
          <Leaderboard rows={leaderboard.slice(0, 8)} />
        </div>
      </aside>
    </div>
  );
}

function StageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card flex flex-col items-start p-8 sm:rounded-[2rem] sm:p-10">
      {children}
    </div>
  );
}
