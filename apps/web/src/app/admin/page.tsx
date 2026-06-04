import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-guard";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Dashboard } from "@/features/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdminRequest())) redirect("/admin/login");
  return (
    <main className="page-shell">
      <PageBackdrop />
      <AdminTopbar />
      <Dashboard />
    </main>
  );
}
