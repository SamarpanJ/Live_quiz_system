import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Login/join only — uses .glass-card so admin surface tweaks never affect auth. */
export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-card p-8 sm:rounded-[2.25rem] sm:p-10", className)}>{children}</div>
  );
}
