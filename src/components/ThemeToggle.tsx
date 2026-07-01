"use client";

import { applyTheme, type ThemeName } from "../theme";
import { useThemeName } from "../hooks/useThemeName";

/**
 * A single pill button that flips the app between dark and light by toggling
 * `data-theme` via `applyTheme`. Pass `onToggle` to also broadcast the change
 * (e.g. persist a global theme server-side) — it fires with the theme just
 * switched to.
 */
export default function ThemeToggle({
  onToggle,
  className = "",
}: {
  onToggle?: (next: ThemeName) => void;
  className?: string;
}) {
  const theme = useThemeName();
  const next: ThemeName = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        onToggle?.(next);
      }}
      className={`rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/80 px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink-dim)] transition hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-ink)] ${className}`}
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
