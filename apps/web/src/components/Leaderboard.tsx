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
    return <p className="py-6 text-center text-sm text-ink-faint">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const me = highlightId && r.participantId === highlightId;
        return (
          <li
            key={r.participantId}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition",
              me ? "border-brand/50 bg-brand/10" : "border-border bg-bg-subtle/50",
            )}
          >
            <span className="grid w-6 shrink-0 place-items-center font-mono text-sm font-semibold text-ink-dim">
              {r.rank <= 3 ? <Crown className={cn("size-4", medal[r.rank - 1])} /> : r.rank}
            </span>
            <span className="flex-1 truncate text-sm font-medium">
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
