"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Coffee,
  Loader2,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api, apiError } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { QuestionForm, type QuestionValues } from "./QuestionForm";
import type { AdminQuestion, AdminQuiz } from "./types";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizEditor({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<AdminQuiz | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<AdminQuestion | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const load = async () => {
    const { data } = await api.get<{ quiz: AdminQuiz }>(`/quizzes/${quizId}`);
    setQuiz(data.quiz);
    setQuestions(data.quiz.questions ?? []);
  };

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const addQuestion = async (values: QuestionValues) => {
    const { data } = await api
      .post<{ question: AdminQuestion }>(`/quizzes/${quizId}/questions`, values)
      .catch((err) => {
        throw new Error(apiError(err));
      });
    setQuestions((qs) => [...qs, data.question]);
    setAddOpen(false);
  };

  const saveQuestion = async (values: QuestionValues) => {
    if (!editing) return;
    const { data } = await api
      .patch<{ question: AdminQuestion }>(`/questions/${editing.id}`, values)
      .catch((err) => {
        throw new Error(apiError(err));
      });
    setQuestions((qs) => qs.map((q) => (q.id === editing.id ? data.question : q)));
    setEditing(null);
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await api.delete(`/questions/${id}`).catch(() => {});
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= questions.length) return;
    const reordered = [...questions];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setQuestions(reordered);
    await api
      .patch(`/quizzes/${quizId}/questions/reorder`, { ids: reordered.map((q) => q.id) })
      .catch(() => {});
  };

  if (!quiz) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="size-6 animate-spin text-brand-soft" />
      </div>
    );
  }

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <StatusBadge status={quiz.status} />
              <span className="rounded-md border border-border bg-bg-subtle/60 px-2 py-0.5 font-mono text-xs text-ink-dim">
                Join code: {quiz.joinCode}
              </span>
            </div>
            <h1 className="mt-3 truncate text-3xl font-semibold tracking-tight">{quiz.title}</h1>
            {quiz.description && <p className="mt-1.5 text-ink-dim">{quiz.description}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDetailsOpen(true)}>
              <Pencil className="size-4" />
              Details
            </Button>
            <Link href={`/admin/quiz/${quizId}/control`} className={questions.length ? "" : "pointer-events-none opacity-40"}>
              <Button size="sm">
                <Play className="size-4" />
                Run quiz
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex gap-5 border-t border-border pt-4 text-sm text-ink-dim">
          <span>{questions.length} questions</span>
          <span>{totalMarks} total marks</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Questions</h2>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus className="size-4" />
          Add question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="panel mt-4 grid place-items-center py-14 text-center">
          <div className="grid size-11 place-items-center rounded-xl bg-brand/12 text-brand-soft">
            <Sparkles className="size-5" />
          </div>
          <p className="mt-3 font-medium">No questions yet</p>
          <p className="mt-1 text-sm text-ink-dim">Add your first timed question to get started.</p>
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {questions.map((q, i) => (
            <li key={q.id} className="panel p-5">
              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-bg-subtle/70 font-mono text-sm text-ink-dim">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{q.text}</p>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm",
                          oi === q.correctIndex
                            ? "border-good/50 bg-good/10 text-ink"
                            : "border-border bg-bg-subtle/40 text-ink-dim",
                        )}
                      >
                        <span className="font-mono text-xs text-ink-faint">{LETTERS[oi]}</span>
                        <span className="truncate">{opt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-faint">
                    <span className="rounded-md bg-bg-subtle/60 px-2 py-1">{q.marks} marks</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {q.durationSec}s to answer
                    </span>
                    <span className="flex items-center gap-1">
                      <Coffee className="size-3.5" />
                      {q.breakSec}s break after
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <IconBtn onClick={() => move(i, -1)} disabled={i === 0} label="Move up">
                    <ArrowUp className="size-4" />
                  </IconBtn>
                  <IconBtn
                    onClick={() => move(i, 1)}
                    disabled={i === questions.length - 1}
                    label="Move down"
                  >
                    <ArrowDown className="size-4" />
                  </IconBtn>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
                <Button variant="ghost" size="sm" onClick={() => setEditing(q)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteQuestion(q.id)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add question" size="lg">
        <QuestionForm
          onSubmit={addQuestion}
          onCancel={() => setAddOpen(false)}
          submitLabel="Add question"
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit question" size="lg">
        {editing && (
          <QuestionForm
            initial={editing}
            onSubmit={saveQuestion}
            onCancel={() => setEditing(null)}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <QuizDetailsModal
        open={detailsOpen}
        quiz={quiz}
        onClose={() => setDetailsOpen(false)}
        onSaved={(updated) => {
          setQuiz((q) => (q ? { ...q, ...updated } : q));
          setDetailsOpen(false);
        }}
      />
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-7 place-items-center rounded-md text-ink-faint transition hover:bg-white/5 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function QuizDetailsModal({
  open,
  quiz,
  onClose,
  onSaved,
}: {
  open: boolean;
  quiz: AdminQuiz;
  onClose: () => void;
  onSaved: (v: { title: string; description: string | null }) => void;
}) {
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description ?? "");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.patch(`/quizzes/${quiz.id}`, { title, description }).catch(() => {});
    setSaving(false);
    onSaved({ title, description: description || null });
  };

  return (
    <Modal open={open} onClose={onClose} title="Quiz details">
      <form onSubmit={save} className="space-y-4">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!title.trim()}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
