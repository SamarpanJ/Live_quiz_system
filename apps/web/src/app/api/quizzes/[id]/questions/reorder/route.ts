import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { reorderSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id: quizId } = await params;
  const parsed = reorderSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  await prisma.$transaction(
    parsed.data.ids.map((qid, order) =>
      prisma.question.update({ where: { id: qid }, data: { order } }),
    ),
  );
  return NextResponse.json({ ok: true });
}
