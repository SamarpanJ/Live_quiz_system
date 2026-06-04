"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/Brand";
import { api } from "@/lib/axios";

export function AdminTopbar({ back }: { back?: { href: string; label: string } }) {
  const router = useRouter();

  const logout = async () => {
    await api.post("/admin/logout").catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-4">
          <Logo href="/admin" />
          {back && (
            <Link
              href={back.href}
              className="flex items-center gap-1 text-sm text-ink-dim transition hover:text-ink"
            >
              <ChevronLeft className="size-4" />
              {back.label}
            </Link>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-ink-dim transition hover:bg-white/5 hover:text-ink"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
