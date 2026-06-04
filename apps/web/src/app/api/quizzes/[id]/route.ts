import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { serializeQuiz } from "@/lib/serialize";
import { quizUpdateSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      _count: { select: { questions: true, participants: true } },
    },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  return NextResponse.json({ quiz: serializeQuiz(quiz) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const parsed = quizUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const quiz = await prisma.quiz.update({
    where: { id },
    data: parsed.data,
    include: { _count: { select: { questions: true, participants: true } } },
  });
  return NextResponse.json({ quiz: serializeQuiz(quiz) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
