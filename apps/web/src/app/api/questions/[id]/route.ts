import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { serializeQuestion } from "@/lib/serialize";
import { questionSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const parsed = questionSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const q = await prisma.question.update({
    where: { id },
    data: {
      text: parsed.data.text,
      options: JSON.stringify(parsed.data.options),
      correctIndex: parsed.data.correctIndex,
      marks: parsed.data.marks,
      durationSec: parsed.data.durationSec,
      breakSec: parsed.data.breakSec,
    },
  });
  return NextResponse.json({ question: serializeQuestion(q) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q) return NextResponse.json({ ok: true });
  await prisma.question.delete({ where: { id } });
  // Re-pack order so there are no gaps.
  const rest = await prisma.question.findMany({
    where: { quizId: q.quizId },
    orderBy: { order: "asc" },
  });
  await prisma.$transaction(
    rest.map((r, order) => prisma.question.update({ where: { id: r.id }, data: { order } })),
  );
  return NextResponse.json({ ok: true });
}
