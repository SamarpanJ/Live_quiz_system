"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 " +
    "focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "border border-brand/30 bg-brand text-white shadow-glow hover:bg-brand-soft hover:shadow-lift focus:ring-brand/25 active:scale-[0.98]",
        secondary:
          "border border-white/[0.12] bg-white/[0.03] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-white/[0.18] hover:bg-white/[0.05] focus:ring-white/10",
        ghost:
          "rounded-xl text-ink-dim hover:bg-white/[0.06] hover:text-ink focus:ring-white/10",
        danger:
          "border border-bad/35 bg-bad/10 text-bad hover:border-bad/50 hover:bg-bad/15 focus:ring-bad/20",
        success:
          "border border-success/35 bg-success text-black hover:bg-success-soft focus:ring-success/25 active:scale-[0.98]",
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
