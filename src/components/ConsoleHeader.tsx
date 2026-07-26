/**
 * Live console strip — a section title with a pulsing telemetry status cluster
 * and dot-separated metadata. The header for control-room screens. Pass
 * `liveColor` to tint the status dot (e.g. a positive green); defaults to brand.
 */
export default function ConsoleHeader({
  title,
  meta = [],
  live = true,
  liveColor = "var(--color-brand)",
  liveLabel = "Live",
}: {
  title: string;
  meta?: string[];
  live?: boolean;
  liveColor?: string;
  liveLabel?: string;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--color-line)] pb-2.5">
      <span className="font-mono text-sm uppercase tracking-[0.28em] text-[var(--color-brand-soft)]">{title}</span>
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
        {live && (
          <span className="flex items-center gap-1.5 text-[var(--color-ink-dim)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: liveColor }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: liveColor }} />
            </span>
            {liveLabel}
          </span>
        )}
        {meta.map((m) => (
          <span key={m} className="before:mr-3 before:text-[var(--color-ink-mute)] before:content-['·']">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
