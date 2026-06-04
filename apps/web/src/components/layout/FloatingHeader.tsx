import { cn } from "@/lib/utils";

export function FloatingHeader({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <header className={cn("relative z-20 px-5 py-5 sm:px-6 sm:py-6", className)}>
      <div
        className={cn(
          "chrome-bar mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5",
          innerClassName,
        )}
      >
        {children}
      </div>
    </header>
  );
}
