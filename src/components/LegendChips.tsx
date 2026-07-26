/** Small legend chip cluster for a plot header — a dot + label per series. */
export default function LegendChips({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex items-center gap-3">
      {items.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
