import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Brand";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { FeatureBento } from "@/components/landing/FeatureBento";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { QuizPreview } from "@/components/landing/QuizPreview";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="page-shell">
      <PageBackdrop />

      <FloatingHeader>
        <Logo />
        <Link href="/admin/login" className="nav-link">
          Admin sign in
        </Link>
      </FloatingHeader>

      <section className="relative mx-auto max-w-6xl px-5 pb-28 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-20">
          <div className="animate-fade-up">
            <h1 className="heading-display max-w-xl text-[2.65rem] leading-[1.06] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
              The whole room{" "}
              <span className="relative mt-1 inline-block text-brand-ink">
                on the same beat.
                <span
                  className="absolute -bottom-1 left-0 right-0 h-px rounded-full bg-gradient-to-r from-brand/80 via-brand/50 to-brand/20"
                  aria-hidden
                />
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-dim sm:text-lg">
              Host timed quizzes where everyone answers together, waits together, and sees results
              together, no one races ahead.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/join">
                <Button size="lg" className="w-full sm:w-auto sm:min-w-[210px]">
                  Join a quiz
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-[210px]">
                  Host a quiz
                </Button>
              </Link>
            </div>

            <HowItWorks />
          </div>

          <div className="relative mt-14 animate-fade-up lg:mt-0" style={{ animationDelay: "120ms" }}>
            <QuizPreview />
          </div>
        </div>

        <FeatureBento />
      </section>

      <footer className="relative border-t border-white/[0.08] py-8">
        <p className="text-center text-xs text-ink-faint">
          Aurogurukul Quiz for classrooms, events, and team sessions.
        </p>
      </footer>
    </main>
  );
}
