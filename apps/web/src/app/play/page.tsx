"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { PHASE } from "@quiz/shared";
import { Logo } from "@/components/Brand";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Button } from "@/components/ui/Button";
import { useCountdown } from "@/hooks/useCountdown";
import { usePlayRoom } from "@/features/play/usePlayRoom";
import { LobbyView } from "@/features/play/views/LobbyView";
import { QuestionView } from "@/features/play/views/QuestionView";
import { BreakView } from "@/features/play/views/BreakView";
import { FinishedView } from "@/features/play/views/FinishedView";

export default function PlayPage() {
  const router = useRouter();
  const [creds, setCreds] = useState<{ code: string; name: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pulse:join");
    if (!raw) {
      router.replace("/join");
      return;
    }
    try {
      setCreds(JSON.parse(raw));
    } catch {
      router.replace("/join");
    }
  }, [router]);

  if (!creds) return <CenterMessage spinner label="Getting you in…" />;
  return <PlayRoom code={creds.code} name={creds.name} />;
}

function PlayRoom({ code, name }: { code: string; name: string }) {
  const { status, error, state, submit, pendingOption, participantId } = usePlayRoom(code, name);
  const remainingMs = useCountdown(state?.endsAt ?? null, state?.serverNow ?? null);

  if (status === "error") {
    return (
      <CenterMessage
        icon={<WifiOff className="size-8 text-bad" />}
        label={error ?? "Couldn't join the quiz."}
        action={
          <Link href="/join">
            <Button variant="secondary">Try a different code</Button>
          </Link>
        }
      />
    );
  }

  if (status !== "joined" || !state) {
    return <CenterMessage spinner label="Connecting to the room…" />;
  }

  return (
    <main className="page-shell">
      <PageBackdrop />
      <FloatingHeader innerClassName="max-w-3xl">
        <Logo href={null} />
        <span className="chip-mono py-1 text-[11px]">{state.quiz.joinCode}</span>
      </FloatingHeader>

      <section className="play-main">
        {state.phase === PHASE.LOBBY && <LobbyView state={state} name={name} />}
        {state.phase === PHASE.QUESTION && state.question && (
          <QuestionView
            state={state}
            remainingMs={remainingMs}
            pendingOption={pendingOption}
            onSubmit={submit}
          />
        )}
        {state.phase === PHASE.BREAK && state.reveal && (
          <BreakView state={state} remainingMs={remainingMs} participantId={participantId} />
        )}
        {state.phase === PHASE.FINISHED && (
          <FinishedView state={state} participantId={participantId} />
        )}
      </section>
    </main>
  );
}

function CenterMessage({
  label,
  spinner,
  icon,
  action,
}: {
  label: string;
  spinner?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <main className="page-shell">
      <PageBackdrop />
      <div className="page-center px-5">
        <div className="surface-elevated flex max-w-sm flex-col items-center gap-5 p-8 text-center sm:p-10">
          {spinner ? <Loader2 className="size-8 animate-spin text-brand-soft" /> : icon}
          <p className="leading-relaxed text-ink-dim">{label}</p>
          {action}
        </div>
      </div>
    </main>
  );
}
