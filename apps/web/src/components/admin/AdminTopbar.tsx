"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/Brand";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { api } from "@/lib/axios";

export function AdminTopbar({ back }: { back?: { href: string; label: string } }) {
  const router = useRouter();

  const logout = async () => {
    await api.post("/admin/logout").catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <FloatingHeader>
      <div className="flex min-w-0 items-center gap-4">
        <Logo href="/admin" />
        {back && (
          <Link
            href={back.href}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-ink-dim transition hover:bg-white/[0.06] hover:text-ink"
          >
            <ChevronLeft className="size-4 shrink-0" />
            <span className="truncate">{back.label}</span>
          </Link>
        )}
      </div>
      <button
        onClick={logout}
        className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm text-ink-dim transition hover:bg-white/[0.06] hover:text-ink"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </FloatingHeader>
  );
}
