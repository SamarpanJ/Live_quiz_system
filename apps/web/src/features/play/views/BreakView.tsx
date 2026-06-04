"use client";

import { Check, Minus, X } from "lucide-react";
import type { RoomState } from "@quiz/shared";
import { Leaderboard } from "@/components/Leaderboard";
import { formatClock } from "@/lib/utils";

export function BreakView({
  state,
  remainingMs,
  participantId,
}: {
  state: RoomState;
  remainingMs: number;
  participantId: string | null;
}) {
  const reveal = state.reveal!;
  const answered = reveal.myOptionIndex !== null;
  const correct = reveal.isCorrect;

  const tone = !answered
    ? { icon: Minus, label: "No answer", color: "text-ink-dim", bg: "bg-ink-faint/15" }
    : correct
      ? { icon: Check, label: "Correct!", color: "text-good", bg: "bg-good/15" }
      : { icon: X, label: "Not quite", color: "text-bad", bg: "bg-bad/15" };

  return (
    <div className="mx-auto grid w-full max-w-3xl animate-fade-up gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="panel p-7 text-center sm:p-9">
        <div className={`mx-auto grid size-16 place-items-center rounded-2xl ${tone.bg}`}>
          <tone.icon className={`size-9 ${tone.color}`} />
        </div>
        <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${tone.color}`}>
          {tone.label}
        </h2>
        <p className="mt-2 text-sm text-ink-dim">
          {answered
            ? correct
              ? `+${reveal.marksAwarded} points added to your score.`
              : "You didn't get that one — keep going!"
            : "You ran out of time on that question."}
        </p>

        <div className="mt-6 rounded-xl border border-border bg-bg-subtle/50 p-4">
          <p className="text-xs uppercase tracking-widest text-ink-faint">Your score</p>
          <p className="mt-1 font-mono text-4xl font-semibold text-ink">{state.myScore}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-dim">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          Next question in{" "}
          <span className="font-mono font-semibold text-ink">{formatClock(remainingMs)}</span>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="mb-3 text-sm font-medium text-ink-dim">Standings</h3>
        <Leaderboard
          rows={state.leaderboard.slice(0, 6)}
          highlightId={participantId ?? undefined}
        />
      </div>
    </div>
  );
}
