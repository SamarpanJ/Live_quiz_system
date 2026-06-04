import { ArrowRight, KeyRound, Radio, Trophy } from "lucide-react";

const steps = [
  {
    icon: KeyRound,
    title: "Share a code",
    desc: "Players join from any phone, no accounts.",
  },
  {
    icon: Radio,
    title: "Run in sync",
    desc: "One clock, one question, one reveal for the whole room.",
  },
  {
    icon: Trophy,
    title: "See who won",
    desc: "Standings update live after every question.",
  },
];

export function HowItWorks() {
  return (
    <ol className="mt-12 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-2">
      {steps.map((step, i) => (
        <li key={step.title} className="contents">
          <div className="surface flex items-center gap-3 px-4 py-3.5 sm:flex-col sm:items-start sm:rounded-[1.75rem] sm:p-5">
            <div className="icon-badge size-10 shrink-0 rounded-2xl">
              <step.icon className="size-4" />
            </div>
            <div className="sm:mt-3">
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">{step.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight
              className="mx-auto hidden size-4 text-ink-faint sm:block"
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}
