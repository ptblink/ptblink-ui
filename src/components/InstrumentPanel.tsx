/** Faint graph-paper grid, painted behind plots for the instrument feel. */
const PAPER: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
};

/** Four corner ticks that read a panel as an instrument frame. */
export function PanelBrackets() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-[-1px] top-[-1px] h-2 w-2 border-l border-t border-[var(--color-brand)]/50" />
      <span aria-hidden className="pointer-events-none absolute right-[-1px] top-[-1px] h-2 w-2 border-r border-t border-[var(--color-brand)]/50" />
      <span aria-hidden className="pointer-events-none absolute bottom-[-1px] left-[-1px] h-2 w-2 border-b border-l border-[var(--color-brand)]/50" />
      <span aria-hidden className="pointer-events-none absolute bottom-[-1px] right-[-1px] h-2 w-2 border-b border-r border-[var(--color-brand)]/50" />
    </>
  );
}

/**
 * Instrument panel — a crisp cornered frame with bracket ticks, an optional mono
 * caption bar (with a right slot for legends/readouts) and optional graph-paper
 * texture behind the body. The building block of the control-room surfaces.
 */
export default function InstrumentPanel({
  caption,
  right,
  paper = false,
  brackets = true,
  className = "",
  bodyClassName = "",
  children,
}: {
  caption?: React.ReactNode;
  right?: React.ReactNode;
  paper?: boolean;
  brackets?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative flex min-h-0 flex-col rounded-[3px] border border-[var(--color-line)] bg-[var(--color-bg-elev)] ${className}`}>
      {brackets && <PanelBrackets />}
      {caption != null && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-line)] px-3.5 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-mute)]">{caption}</span>
          {right}
        </div>
      )}
      <div className="relative min-h-0 flex-1" style={paper ? PAPER : undefined}>
        <div className={`flex h-full min-h-0 flex-col ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  );
}
