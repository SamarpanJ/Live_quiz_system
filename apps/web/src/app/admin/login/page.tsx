"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { api, apiError } from "@/lib/axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/admin/login", { password });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(apiError(err, "Incorrect password."));
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="panel animate-fade-up p-7 sm:p-8">
          <div className="grid size-11 place-items-center rounded-xl bg-brand/15 text-brand-soft">
            <Lock className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-ink-dim">
            Enter the admin password to build and run quizzes.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Password" error={error ?? undefined}>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                autoFocus
              />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
