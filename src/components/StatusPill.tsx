/**
 * The status dot-pill — emerald + pulsing dot when active, hairline + muted
 * when not. Used for on-site/off-site, active/inactive, open/closed states in
 * staff tables and headers. Server-safe.
 */
export default function StatusPill({
  active,
  children,
  pulse = true,
  className = "",
}: {
  active: boolean;
  children: React.ReactNode;
  /** Animate the dot when active (default true). */
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-widest ${
        active
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-[var(--color-line)] text-[var(--color-ink-mute)]"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? `bg-emerald-400${pulse ? " animate-pulse" : ""}` : "bg-[var(--color-ink-mute)]"}`}
        aria-hidden
      />
      {children}
    </span>
  );
}
