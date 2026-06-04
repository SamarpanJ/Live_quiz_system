"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListChecks, Loader2, Pencil, Play, Plus, Trash2, Users } from "lucide-react";
import { StatusBadge } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api, apiError } from "@/lib/axios";
import type { AdminQuiz } from "./types";

export function Dashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<AdminQuiz[] | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get<{ quizzes: AdminQuiz[] }>("/quizzes");
      setQuizzes(data.quizzes);
    } catch (err) {
      if (apiError(err).includes("authorized")) router.push("/admin/login");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const { data } = await api.post<{ quiz: AdminQuiz }>("/quizzes", { title, description });
      router.push(`/admin/quiz/${data.quiz.id}`);
    } catch (err) {
      setError(apiError(err));
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this quiz and all its questions?")) return;
    await api.delete(`/quizzes/${id}`).catch(() => {});
    setQuizzes((qs) => qs?.filter((q) => q.id !== id) ?? null);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your quizzes</h1>
          <p className="mt-1.5 text-ink-dim">Build questions, set timers, then run them live.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New quiz
        </Button>
      </div>

      {quizzes === null ? (
        <div className="mt-16 grid place-items-center">
          <Loader2 className="size-6 animate-spin text-brand-soft" />
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState onCreate={() => setOpen(true)} />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((q) => (
            <QuizCard key={q.id} quiz={q} onDelete={() => remove(q.id)} />
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New quiz"
        description="Give it a name. You'll add timed questions next."
      >
        <form onSubmit={create} className="space-y-4">
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Friday Trivia Night"
              autoFocus
            />
          </Field>
          <Field label="Description" hint="Optional — shown to you only.">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A quick 5-question warm-up."
              rows={3}
            />
          </Field>
          {error && <p className="text-sm text-bad">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating} disabled={!title.trim()}>
              Create & add questions
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function QuizCard({ quiz, onDelete }: { quiz: AdminQuiz; onDelete: () => void }) {
  const runnable = quiz.questionCount > 0;
  return (
    <div className="panel group flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={quiz.status} />
        <span className="rounded-md border border-border bg-bg-subtle/60 px-2 py-0.5 font-mono text-xs text-ink-dim">
          {quiz.joinCode}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-tight">{quiz.title}</h3>
      {quiz.description && (
        <p className="mt-1 line-clamp-2 text-sm text-ink-dim">{quiz.description}</p>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <ListChecks className="size-3.5" />
          {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          {quiz.participantCount}
        </span>
      </div>

      <div className="mt-5 flex gap-2 border-t border-border pt-4">
        <Link href={`/admin/quiz/${quiz.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            <Pencil className="size-4" />
            Edit
          </Button>
        </Link>
        <Link
          href={`/admin/quiz/${quiz.id}/control`}
          className={runnable ? "flex-1" : "pointer-events-none flex-1 opacity-40"}
        >
          <Button size="sm" className="w-full">
            <Play className="size-4" />
            Run
          </Button>
        </Link>
        <Button variant="danger" size="sm" onClick={onDelete} aria-label="Delete quiz">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="panel mt-8 grid place-items-center py-16 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-brand/12 text-brand-soft">
        <ListChecks className="size-6" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No quizzes yet</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-dim">
        Create your first quiz, add a few timed questions, and run it live.
      </p>
      <Button className="mt-5" onClick={onCreate}>
        <Plus className="size-4" />
        New quiz
      </Button>
    </div>
  );
}
