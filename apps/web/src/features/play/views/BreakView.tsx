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
    ? { icon: Minus, label: "No answer", color: "text-ink-dim", bg: "bg-bg-subtle border border-white/[0.08]" }
    : correct
      ? { icon: Check, label: "Correct!", color: "text-success-soft", bg: "bg-success/10 border border-success/30" }
      : { icon: X, label: "Not quite", color: "text-bad", bg: "bg-bad/12" };

  return (
    <div className="mx-auto grid w-full max-w-3xl animate-fade-up gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="surface-elevated p-8 text-center sm:p-10">
        <div className={`mx-auto grid size-16 place-items-center rounded-3xl border ${tone.bg}`}>
          <tone.icon className={`size-9 ${tone.color}`} />
        </div>
        <h2 className={`heading-display mt-5 text-3xl ${tone.color}`}>{tone.label}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          {answered
            ? correct
              ? `+${reveal.marksAwarded} points added to your score.`
              : "You didn't get that one. Keep going!"
            : "You ran out of time on that question."}
        </p>

        <div className="surface-subtle mx-auto mt-8 max-w-xs p-5">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-faint">Your score</p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-ink">{state.myScore}</p>
        </div>

        <div className="chip mx-auto mt-8">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          Next question in{" "}
          <span className="font-mono font-semibold text-ink">{formatClock(remainingMs)}</span>
        </div>
      </div>

      <div className="surface p-6 sm:p-7">
        <h3 className="mb-4 text-sm font-medium text-ink-dim">Standings</h3>
        <Leaderboard
          rows={state.leaderboard.slice(0, 6)}
          highlightId={participantId ?? undefined}
        />
      </div>
    </div>
  );
}
