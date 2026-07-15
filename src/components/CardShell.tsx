export type CardAccent = { base: string; soft: string; dim: string };

function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

/**
 * A launcher bento tile: a frosted-glass panel with a corner accent glow, a mono
 * screen-label eyebrow (top) and a thin title centred in the tile.
 *
 * Sizes use container-query height units (cqh) so every tile scales with its
 * container's on-screen height — the grid/wrapper that renders these must carry
 * `container-type: size`. `hero` enlarges the title for a lead cell.
 */
export default function CardShell({
  accent,
  screenLabel,
  title,
  hero = false,
}: {
  accent: CardAccent;
  screenLabel: string;
  title: string;
  hero?: boolean;
}) {
  return (
    <div
      className="group/tile relative flex h-full w-full flex-col overflow-hidden rounded-[2cqh] border border-white/10 bg-black/40 p-[2.6cqh] backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
      style={{ "--tint": accent.base } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, ${withAlpha(accent.base, 0.26)} 0%, transparent 58%)`,
        }}
      />
      <div className="relative font-mono text-[1.7cqh] uppercase tracking-[0.24em]" style={{ color: accent.base }}>
        {screenLabel}
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <div
          className={`font-display font-thin-tight leading-[0.98] tracking-[-0.01em] ${
            hero ? "text-[6.4cqh]" : "text-[4.2cqh]"
          }`}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
