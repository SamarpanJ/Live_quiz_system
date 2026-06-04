"use client";

import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/utils";

interface TimerRingProps {
  remainingMs: number;
  totalMs: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: "brand" | "accent";
  className?: string;
}

export function TimerRing({
  remainingMs,
  totalMs,
  size = 168,
  stroke = 12,
  label,
  tone = "brand",
  className,
}: TimerRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = totalMs > 0 ? Math.min(1, Math.max(0, remainingMs / totalMs)) : 0;
  const offset = c * (1 - frac);

  const low = remainingMs <= 5000 && remainingMs > 0;
  const baseColor = tone === "accent" ? "#22d3ee" : "#6d63ff";
  const color = low ? "#f43f5e" : baseColor;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(148,163,184,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke 0.3s ease",
            filter: `drop-shadow(0 0 10px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-mono text-4xl font-semibold tabular-nums",
            low ? "text-bad" : "text-ink",
          )}
        >
          {formatClock(remainingMs)}
        </span>
        {label && (
          <span className="mt-1 text-xs uppercase tracking-widest text-ink-faint">{label}</span>
        )}
      </div>
    </div>
  );
}
