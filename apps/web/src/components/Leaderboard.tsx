"use client";

import { Crown } from "lucide-react";
import type { LeaderboardRow } from "@quiz/shared";
import { cn } from "@/lib/utils";

const medal = ["text-warn", "text-ink-dim", "text-[#cd7f32]"];

export function Leaderboard({
  rows,
  highlightId,
  emptyLabel = "No players yet.",
}: {
  rows: LeaderboardRow[];
  highlightId?: string;
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-faint">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const me = highlightId && r.participantId === highlightId;
        return (
          <li
            key={r.participantId}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
              me
                ? "border-brand/40 bg-brand/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "border-white/[0.08] bg-bg-subtle",
            )}
          >
            <span className="grid w-7 shrink-0 place-items-center font-mono text-sm font-semibold text-ink-dim">
              {r.rank <= 3 ? <Crown className={cn("size-4", medal[r.rank - 1])} /> : r.rank}
            </span>
            <span className="flex-1 truncate text-sm font-medium text-ink">
              {r.name}
              {me && <span className="ml-2 text-xs text-brand-soft">you</span>}
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
              {r.score}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
