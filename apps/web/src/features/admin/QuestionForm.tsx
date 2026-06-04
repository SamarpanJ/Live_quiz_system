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

/** Keeps numeric inputs as plain digit strings so typing never sticks on a leading 0. */
function digitsOnly(raw: string): string {
  if (raw === "") return "";
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? "" : String(n);
}

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
  const [marks, setMarks] = useState(String(initial?.marks ?? 10));
  const [durationSec, setDurationSec] = useState(String(initial?.durationSec ?? 30));
  const [breakSec, setBreakSec] = useState(String(initial?.breakSec ?? 5));
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
    const marksNum = parseInt(marks, 10);
    const durationNum = parseInt(durationSec, 10);
    const breakNum = parseInt(breakSec, 10);
    if (marks === "" || Number.isNaN(marksNum)) return setError("Enter marks.");
    if (durationSec === "" || Number.isNaN(durationNum) || durationNum < 3) {
      return setError("Question time must be at least 3 seconds.");
    }
    if (breakSec === "" || Number.isNaN(breakNum)) return setError("Enter break time.");
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        text: text.trim(),
        options: cleaned,
        correctIndex,
        marks: marksNum,
        durationSec: durationNum,
        breakSec: breakNum,
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
              <div key={i} className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectIndex(i)}
                  className={cn(
                    "option-slab-letter shrink-0 !size-10 text-sm font-semibold transition",
                    isCorrect && "option-slab-letter-correct",
                  )}
                  title="Mark as correct answer"
                >
                  {isCorrect ? <Check className="size-4" /> : LETTERS[i]}
                </button>
                <Input
                  className="min-w-0 w-auto flex-1"
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${LETTERS[i]}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeOption(i);
                    }}
                    className="relative z-10 grid size-10 shrink-0 place-items-center rounded-xl text-ink-faint transition hover:bg-bad/10 hover:text-bad"
                    aria-label={`Remove option ${LETTERS[i]}`}
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
            inputMode="numeric"
            value={marks}
            onChange={(e) => setMarks(digitsOnly(e.target.value))}
          />
        </Field>
        <Field label="Time (sec)">
          <Input
            type="number"
            min={3}
            inputMode="numeric"
            value={durationSec}
            onChange={(e) => setDurationSec(digitsOnly(e.target.value))}
          />
        </Field>
        <Field label="Break after (sec)">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={breakSec}
            onChange={(e) => setBreakSec(digitsOnly(e.target.value))}
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
