"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

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
    <main className="relative grid min-h-screen place-items-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="panel animate-fade-up p-7 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Join the quiz</h1>
          <p className="mt-1.5 text-sm text-ink-dim">
            Ask your host for the join code, then jump in.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Join code">
              <Input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="e.g. K7P3Q"
                autoCapitalize="characters"
                autoComplete="off"
                maxLength={8}
                className="text-center font-mono text-2xl tracking-[0.4em]"
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
              />
            </Field>

            {error && <p className="text-sm text-bad">{error}</p>}

            <Button type="submit" size="lg" className="w-full">
              Enter waiting room
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
