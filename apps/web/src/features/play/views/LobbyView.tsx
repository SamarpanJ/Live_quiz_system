"use client";

import { Users } from "lucide-react";
import type { RoomState } from "@quiz/shared";

export function LobbyView({ state, name }: { state: RoomState; name: string }) {
  return (
    <div className="mx-auto w-full max-w-md animate-fade-up text-center">
      <div className="relative mx-auto mb-8 grid size-24 place-items-center">
        <span className="absolute inset-0 rounded-full bg-brand/20 animate-pulse-ring" />
        <span className="absolute inset-2 rounded-full bg-brand/20 animate-pulse-ring [animation-delay:0.4s]" />
        <span className="relative grid size-16 place-items-center rounded-full bg-brand/15 text-brand-soft">
          <Users className="size-7" />
        </span>
      </div>

      <p className="text-sm uppercase tracking-widest text-ink-faint">You&apos;re in</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight">
        {state.quiz.title}
      </h1>
      <p className="mt-3 text-ink-dim">
        Welcome, <span className="font-medium text-ink">{name}</span>. Hang tight — the host
        will start the quiz any moment.
      </p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-raised/60 px-4 py-2 text-sm text-ink-dim">
        <Users className="size-4" />
        {state.participantsCount} {state.participantsCount === 1 ? "player" : "players"} in the room
      </div>
    </div>
  );
}
