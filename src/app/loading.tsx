export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 rotate-45 animate-pulse border border-gold" />
        <span className="font-engrave text-xs tracking-[0.3em] text-gold">Ouverture des archives…</span>
      </div>
    </div>
  );
}
