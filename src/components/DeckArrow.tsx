export type DeckArrowDirection = "left" | "right" | "up" | "down";
export type DeckArrowSize = "sm" | "md" | "lg";

const PATHS: Record<DeckArrowDirection, string> = {
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
};

const SIZES: Record<DeckArrowSize, { box: string; icon: number }> = {
  sm: { box: "h-12 w-12 md:h-14 md:w-14", icon: 24 },
  md: { box: "h-14 w-14 md:h-16 md:w-16", icon: 24 },
  lg: { box: "h-20 w-20 md:h-24 md:w-24", icon: 36 },
};

/**
 * Round chevron navigation button — the deck arrow used across PT Blink kiosk
 * decks. Renders only the button; position it via `className`
 * (e.g. `fixed left-8 top-1/2 -translate-y-1/2`) so it works for both edge
 * navigation (SlideDeck) and stacked prev/next controls (scroll decks).
 */
export default function DeckArrow({
  direction,
  onClick,
  disabled = false,
  label,
  size = "lg",
  className = "",
}: {
  direction: DeckArrowDirection;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  size?: DeckArrowSize;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex items-center justify-center rounded-full border-2 border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 text-[var(--color-ink)] backdrop-blur-md transition active:scale-95 ${s.box} ${
        disabled
          ? "cursor-not-allowed opacity-20"
          : "hover:border-[var(--color-brand)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-brand)]"
      } ${className}`}
    >
      <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none">
        <path d={PATHS[direction]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
