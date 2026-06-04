import type { LucideIcon } from "lucide-react";
import { Gauge, ShieldCheck, Timer, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOW = [
  { n: "01", label: "Lobby", detail: "Players join" },
  { n: "02", label: "Question", detail: "Timed answers" },
  { n: "03", label: "Break", detail: "Reveal scores" },
  { n: "04", label: "Results", detail: "Final ranks" },
];

const STANDINGS = [
  { rank: 1, name: "Rajesh", score: 120 },
  { rank: 2, name: "Rohan", score: 105 },
  { rank: 3, name: "Mira", score: 90 },
];

function FeatureIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="icon-badge">
      <Icon className="size-5" strokeWidth={1.75} />
    </div>
  );
}

function SessionFlow() {
  return (
    <ol className="relative z-10 mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
      {FLOW.map((step) => (
        <li key={step.label}>
          <div className="surface-inset flex h-full flex-col px-4 py-3.5 transition group-hover:border-white/[0.14]">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-brand-soft">
              {step.n}
            </span>
            <span className="mt-1 text-sm font-semibold text-ink">{step.label}</span>
            <span className="mt-0.5 text-xs text-ink-faint">{step.detail}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StandingsPreview() {
  return (
    <div className="surface-inset relative z-10 w-full max-w-xs p-4 lg:max-w-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">Live board</p>
      <ul className="mt-3 space-y-2">
        {STANDINGS.map((row) => (
          <li
            key={row.name}
            className="flex items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-lg font-mono text-[11px] font-bold",
                  row.rank === 1 ? "bg-warn/15 text-warn" : "bg-white/[0.05] text-ink-faint",
                )}
              >
                {row.rank}
              </span>
              {row.name}
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">{row.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeatureBento() {
  return (
    <section className="mt-28 lg:mt-36">
      <div className="max-w-3xl">
        <h2 className="heading-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Built for rooms that move together
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-dim sm:text-lg">
          Not another form builder, a live session engine with pacing, fairness, and clarity
          baked in from the first question to the final reveal.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto_auto] lg:gap-5">
        <article className="surface-interactive group relative p-6 sm:p-7 md:col-span-4 md:row-span-2 md:min-h-[320px] lg:p-8">
          <div className="relative z-10">
            <FeatureIcon icon={Timer} />
            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">One shared clock</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-dim sm:text-[15px]">
              The server drives the timer, every player counts down in perfect sync. No drift, no
              refresh hacks, no &ldquo;my screen says 3 seconds left.&rdquo;
            </p>
            <SessionFlow />
          </div>
        </article>

        <article className="surface-interactive group relative p-6 sm:p-7 md:col-span-2 md:min-h-[152px]">
          <div className="relative z-10">
            <FeatureIcon icon={ShieldCheck} />
            <h3 className="mt-5 text-lg font-semibold">Answer-locked</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">
              Submit once. Results reveal only when time&apos;s up, fair for every player in the room.
            </p>
          </div>
        </article>

        <article className="surface-interactive group relative p-6 sm:p-7 md:col-span-2 md:min-h-[152px]">
          <div className="relative z-10">
            <FeatureIcon icon={Gauge} />
            <h3 className="mt-5 text-lg font-semibold">Auto-paced</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">
              Per-question timers and breaks advance on their own once you press start.
            </p>
          </div>
        </article>

        <article className="surface-interactive group relative p-6 sm:p-7 md:col-span-6 lg:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0 flex-1">
              <FeatureIcon icon={Trophy} />
              <h3 className="mt-5 text-xl font-semibold sm:text-2xl">Live standings</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-dim sm:text-[15px]">
                Scores and the leaderboard refresh the moment the timer ends, everyone sees the
                same reveal at the same time.
              </p>
            </div>
            <StandingsPreview />
          </div>
        </article>
      </div>
    </section>
  );
}
