import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { generateJoinCode } from "@/lib/joincode";
import { serializeQuiz } from "@/lib/serialize";
import { quizCreateSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true, participants: true } } },
  });
  return NextResponse.json({ quizzes: quizzes.map(serializeQuiz) });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const parsed = quizCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const joinCode = await generateJoinCode();
  const quiz = await prisma.quiz.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      joinCode,
    },
    include: { _count: { select: { questions: true, participants: true } } },
  });
  return NextResponse.json({ quiz: serializeQuiz(quiz) }, { status: 201 });
}
