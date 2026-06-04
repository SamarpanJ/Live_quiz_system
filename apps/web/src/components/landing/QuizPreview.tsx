const OPTIONS = [
  { letter: "A", text: "Venus", state: "muted" as const },
  { letter: "B", text: "Mars", state: "selected" as const },
  { letter: "C", text: "Jupiter", state: "muted" as const },
  { letter: "D", text: "Saturn", state: "muted" as const },
];

export function QuizPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
      <div
        className="pointer-events-none absolute -left-8 top-1/2 size-56 -translate-y-1/2 rounded-full border border-white/[0.06]"
        aria-hidden
      />

      <div className="surface-elevated relative z-10 overflow-visible p-6 sm:p-7">
        <div className="absolute -right-3 -top-3 z-20 grid size-[4.5rem] place-items-center rounded-full border border-white/[0.14] bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_-4px_rgba(124,108,255,0.2)] backdrop-blur-md">
          <span className="relative z-10 font-mono text-lg font-semibold tabular-nums text-ink">
            0:18
          </span>
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72" aria-hidden>
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
            />
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="#7c6cff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="201"
              strokeDashoffset="48"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pr-16">
          <span className="chip-mono py-1 text-[11px]">K7P3Q</span>
          <span className="chip border-accent/35 bg-accent/10 text-accent">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(94,200,232,0.5)]" />
            Live now
          </span>
        </div>

        <p className="relative z-10 mt-5 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
          Question 3 · 10 points
        </p>
        <p className="relative z-10 mt-2 text-lg font-semibold leading-snug text-ink">
          Which planet is known as the Red Planet?
        </p>

        <ul className="relative z-10 mt-5 space-y-2">
          {OPTIONS.map((opt) => (
            <li
              key={opt.letter}
              className={`option-slab ${opt.state === "selected" ? "option-slab-correct" : ""}`}
            >
              <span
                className={`option-slab-letter ${opt.state === "selected" ? "option-slab-letter-correct" : ""}`}
              >
                {opt.letter}
              </span>
              <span className="font-medium">{opt.text}</span>
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-4 text-center text-xs text-ink-faint">
          <span className="text-accent">●</span> 24 players · answers locked in
        </p>
      </div>

      <div className="surface-subtle absolute -bottom-5 -left-4 z-20 hidden max-w-[11rem] px-4 py-3 sm:block">
        <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">Standings</p>
        <ul className="mt-2 space-y-1.5 text-xs">
          {["Rajesh", "Rohan", "Mira"].map((name, i) => (
            <li key={name} className="flex justify-between gap-3 text-ink-dim">
              <span>
                <span className="font-mono text-ink-faint">{i + 1}.</span> {name}
              </span>
              <span className="font-mono font-semibold text-ink">{120 - i * 15}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
