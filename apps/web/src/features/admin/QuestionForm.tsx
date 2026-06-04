"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { AdminQuestion } from "./types";

export interface QuestionValues {
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
  durationSec: number;
  breakSec: number;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: AdminQuestion;
  onSubmit: (values: QuestionValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [options, setOptions] = useState<string[]>(initial?.options ?? ["", ""]);
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0);
  const [marks, setMarks] = useState(initial?.marks ?? 10);
  const [durationSec, setDurationSec] = useState(initial?.durationSec ?? 30);
  const [breakSec, setBreakSec] = useState(initial?.breakSec ?? 5);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setOption = (i: number, v: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? v : o)));

  const addOption = () => options.length < 6 && setOptions((p) => [...p, ""]);

  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    setCorrectIndex((ci) => (ci === i ? 0 : ci > i ? ci - 1 : ci));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = options.map((o) => o.trim());
    if (!text.trim()) return setError("Add the question text.");
    if (cleaned.some((o) => !o)) return setError("Every option needs text.");
    if (durationSec < 3) return setError("Question time must be at least 3 seconds.");
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        text: text.trim(),
        options: cleaned,
        correctIndex,
        marks,
        durationSec,
        breakSec,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Question">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is the capital of France?"
          autoFocus
        />
      </Field>

      <div>
        <p className="label-base">Options · tap the circle to mark the correct one</p>
        <div className="space-y-2">
          {options.map((opt, i) => {
            const isCorrect = i === correctIndex;
            return (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectIndex(i)}
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg border text-sm font-semibold transition",
                    isCorrect
                      ? "border-good bg-good/20 text-good"
                      : "border-border bg-bg-subtle/60 text-ink-dim hover:border-good/50",
                  )}
                  title="Mark as correct answer"
                >
                  {isCorrect ? <Check className="size-4" /> : LETTERS[i]}
                </button>
                <Input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${LETTERS[i]}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-bad/10 hover:text-bad"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-soft transition hover:text-brand"
          >
            <Plus className="size-4" />
            Add option
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Marks">
          <Input
            type="number"
            min={0}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </Field>
        <Field label="Time (sec)">
          <Input
            type="number"
            min={3}
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
          />
        </Field>
        <Field label="Break after (sec)">
          <Input
            type="number"
            min={0}
            value={breakSec}
            onChange={(e) => setBreakSec(Number(e.target.value))}
          />
        </Field>
      </div>

      {error && <p className="text-sm text-bad">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
