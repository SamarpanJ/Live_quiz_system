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
      <div className="panel p-7 text-center sm:p-9">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-warn/15 text-warn">
          <Trophy className="size-9" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">That&apos;s a wrap!</h1>
        {me ? (
          <>
            <p className="mt-2 text-ink-dim">
              You finished{" "}
              <span className="font-semibold text-ink">
                #{meIdx + 1} of {results.length}
              </span>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Score" value={`${me.score}/${me.totalMarks}`} />
              <Stat label="Correct" value={`${me.correctCount}/${me.totalQuestions}`} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-ink-dim">The quiz has ended.</p>
        )}
        <Link href="/" className="mt-7 block">
          <Button variant="secondary" className="w-full">
            Back to home
          </Button>
        </Link>
      </div>

      <div className="panel p-5">
        <h3 className="mb-3 text-sm font-medium text-ink-dim">Final leaderboard</h3>
        <Leaderboard rows={rows} highlightId={participantId ?? undefined} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-subtle/50 p-4">
      <p className="text-xs uppercase tracking-widest text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
