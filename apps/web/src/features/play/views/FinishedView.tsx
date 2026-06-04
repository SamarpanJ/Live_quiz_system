"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import type { LeaderboardRow, RoomState } from "@quiz/shared";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/Button";

export function FinishedView({
  state,
  participantId,
}: {
  state: RoomState;
  participantId: string | null;
}) {
  const results = state.finalResults ?? [];
  const meIdx = results.findIndex((r) => r.participantId === participantId);
  const me = meIdx >= 0 ? results[meIdx] : null;

  const rows: LeaderboardRow[] = results.map((r, i) => ({
    participantId: r.participantId,
    name: r.name,
    score: r.score,
    rank: i + 1,
  }));

  return (
    <div className="mx-auto grid w-full max-w-3xl animate-fade-up gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="surface-elevated p-8 text-center sm:p-10">
        <div className="icon-badge-lg mx-auto bg-warn/12 text-warn ring-warn/25">
          <Trophy className="size-8" />
        </div>
        <h1 className="heading-display mt-5 text-3xl">That&apos;s a wrap!</h1>
        {me ? (
          <>
            <p className="mt-3 text-ink-dim">
              You finished{" "}
              <span className="font-semibold text-ink">
                #{meIdx + 1} of {results.length}
              </span>
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="Score" value={`${me.score}/${me.totalMarks}`} />
              <Stat label="Correct" value={`${me.correctCount}/${me.totalQuestions}`} />
            </div>
          </>
        ) : (
          <p className="mt-3 text-ink-dim">The quiz has ended.</p>
        )}
        <Link href="/" className="mt-8 block">
          <Button variant="secondary" className="w-full">
            Back to home
          </Button>
        </Link>
      </div>

      <div className="surface p-6 sm:p-7">
        <h3 className="mb-4 text-sm font-medium text-ink-dim">Final leaderboard</h3>
        <Leaderboard rows={rows} highlightId={participantId ?? undefined} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-tile">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-faint">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
