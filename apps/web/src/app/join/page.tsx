"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Brand";
import { AuthCard } from "@/components/layout/AuthCard";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    const n = name.trim();
    if (!c) return setError("Enter the join code from your host.");
    if (!n) return setError("Enter your name.");
    sessionStorage.setItem("pulse:join", JSON.stringify({ code: c, name: n }));
    router.push(`/play?code=${encodeURIComponent(c)}`);
  };

  return (
    <main className="page-shell flex min-h-screen flex-col">
      <PageBackdrop />
      <FloatingHeader innerClassName="max-w-md justify-center">
        <Logo />
      </FloatingHeader>

      <div className="relative flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-2">
        <div className="w-full max-w-md animate-fade-up">
          <AuthCard>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-soft">
              Player
            </p>
            <h1 className="heading-display mt-3 text-2xl sm:text-[1.75rem]">Join the quiz</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim sm:text-[15px]">
              Ask your host for the join code, then jump in.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              <Field label="Join code">
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="K7P3Q"
                  autoCapitalize="characters"
                  autoComplete="off"
                  maxLength={8}
                  className={cn(
                    "border-white/[0.14] bg-transparent py-4 text-center font-mono text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-brand/45 focus:bg-brand/5",
                    code ? "tracking-[0.32em]" : "tracking-normal placeholder:font-sans placeholder:text-base placeholder:tracking-normal",
                  )}
                />
              </Field>
              <Field label="Your name">
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="What should we call you?"
                  maxLength={40}
                  className="border-white/[0.14] bg-transparent focus:border-brand/45 focus:bg-brand/5"
                />
              </Field>

              {error && <p className="error-banner">{error}</p>}

              <Button type="submit" size="lg" className="w-full">
                Enter waiting room
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}
