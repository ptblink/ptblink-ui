/**
 * The recurring "stats row" — a grid of label/value tiles separated by 1px lines,
 * wrapped in a single rounded border. Used in the home hero, visitor detail, welcome page.
 */

export type StatItem = {
  label: string;
  value: React.ReactNode;
  accent?: string;
  primary?: boolean;
};

export default function StatGrid({
  items,
  cols = 4,
  className = "",
}: {
  items: StatItem[];
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  const colsClass =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

  return (
    <dl
      className={`grid ${colsClass} gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden ${className}`}
    >
      {items.map((s) => (
        <div
          key={s.label}
          className="bg-[var(--color-bg-elev)] p-6 md:p-8 flex flex-col gap-2"
        >
          <dt className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-mute)] font-light">
            {s.label}
          </dt>
          <dd
            className="font-display font-thin-tight text-4xl md:text-5xl lg:text-6xl kiosk:text-7xl leading-none"
            style={s.primary && s.accent ? { color: s.accent } : undefined}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
