import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-guard";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ControlRoom } from "@/features/control/ControlRoom";

export const dynamic = "force-dynamic";

export default async function ControlPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminRequest())) redirect("/admin/login");
  const { id } = await params;
  return (
    <main className="min-h-screen">
      <AdminTopbar back={{ href: `/admin/quiz/${id}`, label: "Back to editor" }} />
      <ControlRoom quizId={id} />
    </main>
  );
}
