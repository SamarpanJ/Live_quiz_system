"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OptionVariant = "default" | "selected" | "correct" | "wrong" | "muted";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface OptionButtonProps {
  index: number;
  text: string;
  variant?: OptionVariant;
  disabled?: boolean;
  onClick?: () => void;
}

export function OptionButton({
  index,
  text,
  variant = "default",
  disabled,
  onClick,
}: OptionButtonProps) {
  const styles: Record<OptionVariant, string> = {
    default:
      "border-border bg-bg-subtle/60 hover:border-brand/50 hover:bg-brand/10 hover:-translate-y-0.5",
    selected: "border-brand bg-brand/15 ring-2 ring-brand/40",
    correct: "border-good/60 bg-good/15 ring-2 ring-good/40",
    wrong: "border-bad/60 bg-bad/15 ring-2 ring-bad/40",
    muted: "border-border bg-bg-subtle/40 opacity-55",
  };
  const badgeStyles: Record<OptionVariant, string> = {
    default: "bg-bg-raised text-ink-dim",
    selected: "bg-brand text-white",
    correct: "bg-good text-white",
    wrong: "bg-bad text-white",
    muted: "bg-bg-raised text-ink-faint",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-150",
        "disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-brand/30",
        styles[variant],
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg text-sm font-semibold transition",
          badgeStyles[variant],
        )}
      >
        {variant === "correct" ? (
          <Check className="size-5" />
        ) : variant === "wrong" ? (
          <X className="size-5" />
        ) : (
          LETTERS[index] ?? index + 1
        )}
      </span>
      <span className="text-[15px] font-medium text-ink">{text}</span>
    </button>
  );
}
