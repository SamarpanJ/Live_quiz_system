import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string | null }) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <Image
        src="/aurogurukul-logo.png"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 object-contain object-left"
        priority
        aria-hidden
      />
      <span className="text-lg">
        Aurogurukul <span className="text-brand-soft">Quiz</span>
      </span>
    </span>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}

const statusStyles: Record<string, string> = {
  draft: "border-white/[0.1] bg-bg-subtle text-ink-dim",
  live: "border-accent/35 bg-accent/10 text-accent",
  finished: "border-brand/35 bg-brand/10 text-brand-soft",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm",
        statusStyles[status] ?? statusStyles.draft,
      )}
    >
      {status === "live" && <span className="size-1.5 animate-pulse rounded-full bg-accent" />}
      {status}
    </span>
  );
}
