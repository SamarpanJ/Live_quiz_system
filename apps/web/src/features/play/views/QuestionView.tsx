"use client";

import { Lock } from "lucide-react";
import type { RoomState } from "@quiz/shared";
import { TimerRing } from "@/components/TimerRing";
import { OptionButton, type OptionVariant } from "../OptionButton";

export function QuestionView({
  state,
  remainingMs,
  pendingOption,
  onSubmit,
}: {
  state: RoomState;
  remainingMs: number;
  pendingOption: number | null;
  onSubmit: (i: number) => void;
}) {
  const q = state.question!;
  const selected = state.mySubmission?.optionIndex ?? pendingOption;
  const locked = selected !== null && selected !== undefined;

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-ink-dim">
          <span className="chip-mono py-1">
            {q.index + 1} / {q.total}
          </span>
          <span className="text-ink-faint">
            {q.marks} {q.marks === 1 ? "point" : "points"}
          </span>
        </div>
        <TimerRing
          remainingMs={remainingMs}
          totalMs={state.phaseDurationMs}
          size={64}
          stroke={6}
        />
      </div>

      <div className="surface-elevated p-7 sm:p-9">
        <h2 className="heading-display text-balance text-2xl leading-snug">
          {q.text}
        </h2>

        <div className="mt-7 grid gap-3.5">
          {q.options.map((opt, i) => {
            let variant: OptionVariant = "default";
            if (locked) variant = i === selected ? "selected" : "muted";
            return (
              <OptionButton
                key={i}
                index={i}
                text={opt}
                variant={variant}
                disabled={locked}
                onClick={() => onSubmit(i)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-dim">
        {locked ? (
          <>
            <Lock className="size-4 text-success" />
            Answer locked. You&apos;ll see if it&apos;s right when the timer ends.
          </>
        ) : (
          <>Tap your answer. You can&apos;t change it once submitted.</>
        )}
      </div>
    </div>
  );
}
