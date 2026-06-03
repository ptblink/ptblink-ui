/**
 * Tiny mono uppercase label. Every page header and section title is preceded by one.
 * `tone` toggles the muted vs. accent variant; `color` overrides for per-role accents.
 */
export default function Eyebrow({
  children,
  tone = "muted",
  color,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
  color?: string;
  className?: string;
}) {
  const base = "text-eyebrow font-mono uppercase";
  const toneClass =
    tone === "accent"
      ? "text-[var(--color-brand-soft)]"
      : "text-[var(--color-ink-mute)]";
  return (
    <div
      className={`${base} ${color ? "" : toneClass} ${className}`}
      style={color ? { color } : undefined}
    >
      {children}
    </div>
  );
}
