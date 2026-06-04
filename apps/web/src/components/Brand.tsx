import Link from "next/link";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string | null }) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span className="relative grid size-8 place-items-center rounded-lg bg-brand/15 text-brand-soft">
        <Radio className="size-[18px]" />
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-brand/30" />
      </span>
      <span className="text-lg">
        Pulse<span className="text-brand-soft">.</span>
      </span>
    </span>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}

const statusStyles: Record<string, string> = {
  draft: "bg-ink-faint/15 text-ink-dim",
  live: "bg-good/15 text-good ring-1 ring-inset ring-good/30",
  finished: "bg-brand/15 text-brand-soft",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        statusStyles[status] ?? statusStyles.draft,
      )}
    >
      {status === "live" && <span className="size-1.5 animate-pulse rounded-full bg-good" />}
      {status}
    </span>
  );
}
