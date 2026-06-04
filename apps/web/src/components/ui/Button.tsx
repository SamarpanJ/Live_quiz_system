"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all " +
    "focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-glow hover:bg-brand-soft focus:ring-brand/25 active:scale-[0.98]",
        secondary:
          "border border-border bg-bg-raised/80 text-ink hover:bg-bg-raised focus:ring-brand/15",
        ghost: "text-ink-dim hover:bg-white/5 hover:text-ink focus:ring-white/10",
        danger:
          "border border-bad/30 bg-bad/10 text-bad hover:bg-bad/20 focus:ring-bad/20",
        success:
          "bg-good text-white hover:brightness-110 focus:ring-good/25 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
