/**
 * Theme switching for the PT Blink canvas. The palette lives in
 * styles/tokens.css: dark is the default; `data-theme="light"` on the
 * <html> element flips the neutral ramp (brand colors are shared).
 * Apps decide where the theme value comes from (server state, user
 * setting, …) — this module only applies it to the document.
 */

export type ThemeName = "dark" | "light";

export const THEME_ATTRIBUTE = "data-theme";

/** Apply a theme to the document. No-op outside the browser. */
export function applyTheme(theme: ThemeName): void {
  if (typeof document === "undefined") return;
  if (theme === "light") {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, "light");
  } else {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  }
}

/** Theme currently applied to the document ("dark" when unset / SSR). */
export function getAppliedTheme(): ThemeName {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "light" ? "light" : "dark";
}

/**
 * Near-white base stops used for Grainient backgrounds in light mode —
 * only the middle (accent) stop should pop on a light canvas.
 */
const LIGHT_GRAINIENT_BASE: [string, string] = ["#f7f9fb", "#e8eef5"];

/**
 * Map a `[base, accent, base]` Grainient tuple to the active theme.
 * Callers declare the dark palette; in light mode the two base stops are
 * swapped for near-white while the accent (position 1) stays untouched.
 */
export function grainientColorsForTheme(
  colors: [string, string, string],
  theme: ThemeName,
): [string, string, string] {
  if (theme !== "light") return colors;
  return [LIGHT_GRAINIENT_BASE[0], colors[1], LIGHT_GRAINIENT_BASE[1]];
}
