import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-guard";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Dashboard } from "@/features/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdminRequest())) redirect("/admin/login");
  return (
    <main className="min-h-screen">
      <AdminTopbar />
      <Dashboard />
    </main>
  );
}
