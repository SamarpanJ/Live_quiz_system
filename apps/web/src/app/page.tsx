import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Timer, Trophy } from "lucide-react";
import { Logo } from "@/components/Brand";

const features = [
  { icon: Timer, title: "One shared clock", desc: "The server drives the timer — every player counts down in perfect sync." },
  { icon: ShieldCheck, title: "Answer-locked", desc: "Once submitted, answers can't change. Results reveal only when time's up." },
  { icon: Gauge, title: "Auto-paced", desc: "Per-question timers and breaks run themselves once you hit start." },
  { icon: Trophy, title: "Live standings", desc: "Scores and a leaderboard update the moment the timer ends." },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Link
          href="/admin/login"
          className="text-sm text-ink-dim transition hover:text-ink"
        >
          Admin sign in
        </Link>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-raised/60 px-3 py-1 text-xs text-ink-dim">
            <span className="size-1.5 animate-pulse rounded-full bg-good" />
            Real-time, synchronized quizzes
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Run live quizzes where
            <span className="bg-gradient-to-r from-brand-soft via-brand to-accent bg-clip-text text-transparent">
              {" "}
              everyone's on the same second.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-ink-dim">
            Build timed questions, hit start, and let the room move together —
            question, then a short break, then the next. No one skips ahead.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/join"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 font-medium text-white shadow-glow transition hover:bg-brand-soft"
            >
              Join a quiz
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-bg-raised/70 px-7 font-medium text-ink transition hover:bg-bg-raised"
            >
              Open admin panel
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="panel animate-fade-up p-5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="grid size-10 place-items-center rounded-lg bg-brand/12 text-brand-soft">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
