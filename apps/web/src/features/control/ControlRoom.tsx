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
      <div className="grid place-items-center py-24 text-center">
        {error ? (
          <p className="max-w-sm text-bad">{error}</p>
        ) : (
          <Loader2 className="size-6 animate-spin text-brand-soft" />
        )}
      </div>
    );
  }

  const answeredCount = participants.filter((p) => p.answeredCurrent).length;
  const activeQid = state.question?.id ?? state.reveal?.questionId;
  const activeQuestion = activeQid ? questions[activeQid] : undefined;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="panel flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm text-ink-dim">{title}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xs uppercase tracking-widest text-ink-faint">Join code</span>
              <span className="font-mono text-2xl font-semibold tracking-[0.25em] text-brand-soft">
                {joinCode}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg-subtle/60 px-3 py-1.5 text-sm text-ink-dim">
            <Users className="size-4" />
            {state.participantsCount} joined
          </div>
        </div>

        {state.phase === PHASE.LOBBY && (
          <StageCard>
            <p className="text-sm uppercase tracking-widest text-ink-faint">Waiting room</p>
            <h2 className="mt-2 text-2xl font-semibold">Ready when you are</h2>
            <p className="mt-2 max-w-md text-ink-dim">
              Share the join code above. When you start, the quiz runs automatically through
              each question and break.
            </p>
            <Button size="lg" className="mt-6" onClick={start} loading={busy}>
              <Play className="size-5" />
              Start quiz
            </Button>
          </StageCard>
        )}

        {(state.phase === PHASE.QUESTION || state.phase === PHASE.BREAK) && (
          <div className="panel p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm text-ink-dim">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      state.phase === PHASE.QUESTION
                        ? "bg-brand/15 text-brand-soft"
                        : "bg-accent/15 text-accent",
                    )}
                  >
                    {state.phase === PHASE.QUESTION ? "Question live" : "Break · revealing"}
                  </span>
                  {activeQuestion && (
                    <span className="text-ink-faint">{activeQuestion.marks} marks</span>
                  )}
                </div>
                <h2 className="mt-3 text-balance text-xl font-semibold leading-snug">
                  {activeQuestion?.text ?? state.question?.text}
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(activeQuestion?.options ?? state.question?.options ?? []).map((opt, oi) => {
                    const isCorrect = activeQuestion && oi === activeQuestion.correctIndex;
                    const reveal = state.phase === PHASE.BREAK;
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                          reveal && isCorrect
                            ? "border-good/60 bg-good/15 text-ink"
                            : "border-border bg-bg-subtle/40 text-ink-dim",
                        )}
                      >
                        <span className="font-mono text-xs text-ink-faint">{LETTERS[oi]}</span>
                        <span className="truncate">{opt}</span>
                        {reveal && isCorrect && (
                          <CheckCircle2 className="ml-auto size-4 text-good" />
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

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
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
            <p className="text-sm uppercase tracking-widest text-ink-faint">Finished</p>
            <h2 className="mt-2 text-2xl font-semibold">The quiz has ended</h2>
            <p className="mt-2 text-ink-dim">Final standings are on the right.</p>
            <Button size="lg" className="mt-6" onClick={start} loading={busy}>
              <Play className="size-5" />
              Run again
            </Button>
          </StageCard>
        )}
      </div>

      <aside className="space-y-4">
        <div className="panel p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-dim">
            <Users className="size-4" />
            Players ({participants.length})
          </h3>
          {participants.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-faint">Waiting for players…</p>
          ) : (
            <ul className="space-y-1.5">
              {participants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-bg-subtle/40 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    {state.phase === PHASE.QUESTION && p.answeredCurrent && (
                      <CheckCircle2 className="size-3.5 text-good" />
                    )}
                    {p.name}
                  </span>
                  <span className="font-mono text-xs text-ink-dim">{p.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 text-sm font-medium text-ink-dim">Leaderboard</h3>
          <Leaderboard rows={leaderboard.slice(0, 8)} />
        </div>
      </aside>
    </div>
  );
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="panel flex flex-col items-start p-7 sm:p-9">{children}</div>;
}
