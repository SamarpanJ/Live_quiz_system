import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { serializeQuestion } from "@/lib/serialize";
import { questionSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id: quizId } = await params;
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  const parsed = questionSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const count = await prisma.question.count({ where: { quizId } });
  const q = await prisma.question.create({
    data: {
      quizId,
      order: count,
      text: parsed.data.text,
      options: JSON.stringify(parsed.data.options),
      correctIndex: parsed.data.correctIndex,
      marks: parsed.data.marks,
      durationSec: parsed.data.durationSec,
      breakSec: parsed.data.breakSec,
    },
  });
  return NextResponse.json({ question: serializeQuestion(q) }, { status: 201 });
}
