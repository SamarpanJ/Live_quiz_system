import { z } from "zod";

export const quizCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional().nullable(),
});

export const quizUpdateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
});

export const questionSchema = z
  .object({
    text: z.string().trim().min(1, "Question text is required").max(500),
    options: z
      .array(z.string().trim().min(1, "Options cannot be empty").max(200))
      .min(2, "Add at least two options")
      .max(6, "At most six options"),
    correctIndex: z.number().int().min(0),
    marks: z.number().int().min(0).max(1000),
    durationSec: z.number().int().min(3, "Minimum 3 seconds").max(3600),
    breakSec: z.number().int().min(0).max(3600),
  })
  .refine((d) => d.correctIndex < d.options.length, {
    message: "Correct option is out of range",
    path: ["correctIndex"],
  });

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export type QuestionInput = z.infer<typeof questionSchema>;
