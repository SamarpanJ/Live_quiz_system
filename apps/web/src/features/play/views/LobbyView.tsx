"use client";

import { Users } from "lucide-react";
import type { RoomState } from "@quiz/shared";

export function LobbyView({ state, name }: { state: RoomState; name: string }) {
  return (
    <div className="mx-auto w-full max-w-lg animate-fade-up">
      <div className="surface-elevated px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="relative mx-auto mb-8 grid size-24 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand/20 animate-pulse-ring" />
          <span className="absolute inset-3 rounded-full bg-brand/12 animate-pulse-ring [animation-delay:0.4s]" />
          <span className="relative grid size-16 place-items-center rounded-full bg-brand/12 text-brand-soft ring-1 ring-inset ring-brand/25">
            <Users className="size-7" />
          </span>
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">You&apos;re in</p>
        <h1 className="heading-display mt-3 text-balance text-3xl">{state.quiz.title}</h1>
        <p className="mt-4 leading-relaxed text-ink-dim">
          Welcome, <span className="font-medium text-ink">{name}</span>. Hang tight. The host
          will start the quiz any moment.
        </p>

        <div className="chip mx-auto mt-8">
          <Users className="size-4" />
          {state.participantsCount} {state.participantsCount === 1 ? "player" : "players"} in the room
        </div>
      </div>
    </div>
  );
}
