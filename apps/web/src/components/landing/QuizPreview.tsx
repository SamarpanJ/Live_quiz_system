const OPTIONS = [
  { letter: "A", text: "Venus", state: "muted" as const },
  { letter: "B", text: "Mars", state: "selected" as const },
  { letter: "C", text: "Jupiter", state: "muted" as const },
  { letter: "D", text: "Saturn", state: "muted" as const },
];

const STANDINGS = [
  { name: "Rajesh", score: 120 },
  { name: "Rohan", score: 105 },
  { name: "Mira", score: 90 },
];

const TIMER_SIZE = 52;
const TIMER_R = 22;

function PreviewTimer() {
  const c = 2 * Math.PI * TIMER_R;
  const offset = c * 0.25;

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: TIMER_SIZE, height: TIMER_SIZE }}
      role="img"
      aria-label="18 seconds remaining"
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={TIMER_SIZE}
        height={TIMER_SIZE}
        viewBox={`0 0 ${TIMER_SIZE} ${TIMER_SIZE}`}
      >
        <circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={TIMER_R}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={TIMER_R}
          fill="none"
          stroke="#7c6cff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="relative font-mono text-[13px] font-semibold leading-none tabular-nums text-ink">
        0:18
      </span>
    </div>
  );
}

export function QuizPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
      <div className="surface-elevated relative p-6 sm:p-7">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="chip-mono py-1 text-[11px]">K7P3Q</span>
            <span className="chip border-accent/35 bg-accent/10 text-accent">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(94,200,232,0.5)]" />
              Live now
            </span>
          </div>
          <PreviewTimer />
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

        <div className="divider-soft relative z-10 mt-5 border-t border-white/[0.08] pt-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                Standings
              </p>
              <ul className="mt-2 space-y-1.5 text-xs">
                {STANDINGS.map((row, i) => (
                  <li key={row.name} className="flex max-w-[12rem] justify-between gap-4 text-ink-dim">
                    <span>
                      <span className="font-mono text-ink-faint">{i + 1}.</span> {row.name}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-ink">
                      {row.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs leading-relaxed text-ink-faint sm:max-w-[9rem] sm:text-right">
              <span className="text-accent">●</span> 24 players · answers locked in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
