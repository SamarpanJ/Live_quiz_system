import type { Question, Quiz } from "@prisma/client";

export function serializeQuestion(q: Question) {
  let options: string[] = [];
  try {
    const v = JSON.parse(q.options);
    if (Array.isArray(v)) options = v.map(String);
  } catch {
    options = [];
  }
  return {
    id: q.id,
    quizId: q.quizId,
    order: q.order,
    text: q.text,
    options,
    correctIndex: q.correctIndex,
    marks: q.marks,
    durationSec: q.durationSec,
    breakSec: q.breakSec,
  };
}

export function serializeQuiz(
  quiz: Quiz & { questions?: Question[]; _count?: { questions: number; participants: number } },
) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    joinCode: quiz.joinCode,
    status: quiz.status,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    questionCount: quiz._count?.questions ?? quiz.questions?.length ?? 0,
    participantCount: quiz._count?.participants ?? 0,
    questions: quiz.questions ? quiz.questions.map(serializeQuestion) : undefined,
  };
}

export type SerializedQuiz = ReturnType<typeof serializeQuiz>;
export type SerializedQuestion = ReturnType<typeof serializeQuestion>;
