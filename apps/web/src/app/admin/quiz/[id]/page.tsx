import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-guard";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { QuizEditor } from "@/features/admin/QuizEditor";

export const dynamic = "force-dynamic";

export default async function QuizEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminRequest())) redirect("/admin/login");
  const { id } = await params;
  return (
    <main className="page-shell">
      <PageBackdrop />
      <AdminTopbar back={{ href: "/admin", label: "All quizzes" }} />
      <QuizEditor quizId={id} />
    </main>
  );
}
