export function PageBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />
    </>
  );
}
