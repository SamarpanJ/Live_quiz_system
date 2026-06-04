"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Brand";
import { AuthCard } from "@/components/layout/AuthCard";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { adminLoginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);

  return (
    <main className="page-shell flex min-h-screen flex-col">
      <PageBackdrop />
      <FloatingHeader innerClassName="max-w-sm justify-center">
        <Logo />
      </FloatingHeader>

      <div className="relative flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-2">
        <div className="w-full max-w-sm animate-fade-up">
          <AuthCard>
            <div className="icon-badge size-12 rounded-2xl border-white/[0.12] bg-brand/10">
              <Lock className="size-5" strokeWidth={1.75} />
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-brand-soft">
              Admin
            </p>
            <h1 className="heading-display mt-2 text-2xl sm:text-[1.75rem]">Admin sign in</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim sm:text-[15px]">
              Enter the admin password to build and run quizzes.
            </p>

            <form action={formAction} className="mt-8 space-y-6">
              <Field label="Password" error={state?.error}>
                <Input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoFocus
                  className="border-white/[0.14] bg-transparent focus:border-brand/45 focus:bg-brand/5"
                />
              </Field>
              <Button type="submit" size="lg" className="w-full" loading={isPending}>
                Sign in
              </Button>
            </form>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}
