"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListChecks, Loader2, Pencil, Play, Plus, Trash2, Users } from "lucide-react";
import { StatusBadge } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import axios from "axios";
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
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/admin/login");
      }
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
    <div className="admin-main">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="section-header">
          <h1 className="text-3xl sm:text-4xl">Your quizzes</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-dim">
            Build questions, set timers, then run them live.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New quiz
        </Button>
      </div>

      {quizzes === null ? (
        <div className="mt-20 grid place-items-center">
          <Loader2 className="size-7 animate-spin text-brand-soft" />
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState onCreate={() => setOpen(true)} />
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <Field label="Description" hint="Optional, shown to you only.">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A quick 5-question warm-up."
              rows={3}
            />
          </Field>
          {error && <p className="error-banner">{error}</p>}
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
    <div className="glass-card glass-card-hover flex flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={quiz.status} />
        <span className="chip-mono py-1 text-[11px]">{quiz.joinCode}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-tight">{quiz.title}</h3>
      {quiz.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-dim">{quiz.description}</p>
      )}

      <div className="mt-5 flex items-center gap-4 text-xs text-ink-faint">
        <span className="chip py-1">
          <ListChecks className="size-3.5" />
          {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
        </span>
        <span className="chip py-1">
          <Users className="size-3.5" />
          {quiz.participantCount}
        </span>
      </div>

      <div className="divider-soft mt-6 flex gap-2 pt-5">
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
    <div className="glass-card mt-10 grid place-items-center rounded-[2rem] py-24 text-center">
      <div className="icon-badge-lg">
        <ListChecks className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold">No quizzes yet</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-dim">
        Create your first quiz, add a few timed questions, and run it live.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="size-4" />
        New quiz
      </Button>
    </div>
  );
}
