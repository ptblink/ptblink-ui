/** Colored magnitude bar on a rounded hairline track. */
export function Meter({
  pct,
  accent = "var(--color-brand)",
  className = "",
}: {
  pct: number;
  accent?: string;
  className?: string;
}) {
  const w = Math.max(2, Math.min(100, pct));
  return (
    <div className={`relative h-[3px] w-full rounded-full bg-[var(--color-line)] ${className}`}>
      <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${w}%`, background: accent }} />
    </div>
  );
}

/**
 * KPI readout — an accent rail, mono label, big value, optional magnitude meter
 * and note. Fills a tile with an instrument reading instead of leaving a lonely
 * number floating in empty space. `accent` colours the rail + meter; pass
 * `valueColor` to also tint the number (e.g. a positive green).
 */
export default function Readout({
  label,
  value,
  accent = "var(--color-brand)",
  valueColor,
  meterPct,
  note,
  size = "md",
  className = "",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: string;
  valueColor?: string;
  meterPct?: number;
  note?: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={`relative flex min-h-0 flex-col justify-center gap-2 overflow-hidden rounded-[3px] border border-[var(--color-line)] bg-[var(--color-bg-elev)] py-3 pl-5 pr-4 ${className}`}>
      <span className="absolute left-0 top-0 h-full w-[2px]" style={{ background: accent }} />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">{label}</span>
      <span
        className={`font-display leading-none tabular-nums ${size === "lg" ? "text-[2.6rem]" : "text-3xl"}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
      {meterPct != null && <Meter pct={meterPct} accent={accent} />}
      {note != null && <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]">{note}</span>}
    </div>
  );
}
