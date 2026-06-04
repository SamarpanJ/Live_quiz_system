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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "option-slab w-full py-3 transition-all duration-200 sm:py-3.5",
        "disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        variant === "default" && "hover:border-white/[0.14] hover:bg-white/[0.03]",
        (variant === "selected" || variant === "correct") && "option-slab-correct ring-1 ring-brand/20",
        variant === "wrong" &&
          "border-bad/25 bg-bad/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        variant === "muted" && "opacity-45",
      )}
    >
      <span
        className={cn(
          "option-slab-letter size-9 sm:size-10",
          (variant === "selected" || variant === "correct") &&
            "border-brand/40 bg-brand text-white",
          variant === "wrong" && "border-bad/30 bg-bad/15 text-bad",
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
      <span className="text-[15px] font-medium leading-snug">{text}</span>
    </button>
  );
}
