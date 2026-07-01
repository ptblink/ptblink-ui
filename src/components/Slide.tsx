"use client";

import Grainient from "../react-bits/Grainient";
import AnimatedGradient from "../react-bits/AnimatedGradient";
import { useThemeName } from "../hooks/useThemeName";
import { grainientColorsForTheme } from "../theme";
import type { ThemeName } from "../theme";

/**
 * One full-viewport slide inside a SlideDeck.
 * • Always 100vw × 100vh of its containing layer.
 * • `overflow-hidden` so nothing — text, grids, gradients — can leak out.
 * • Padding scales with viewport (`pad-slide-*`) so the same slide fits
 *   16:9, 4:3, portrait iPad, and a 65" kiosk without tuning.
 *
 * Optional, all defaulting to today's behaviour:
 * • `adaptive` — swap the WebGL `Grainient` for `AnimatedGradient` (GPU-safe
 *   CSS-blob fallback on low-tier hardware).
 * • `themeOverride` — pin the slide's theme (e.g. a deck-scoped light mode)
 *   instead of following the app-wide theme.
 * • `subtle` — calmer, lower-contrast wash for light palettes.
 * • `underlay` — a decorative, non-interactive layer between the gradient and
 *   the content (e.g. a tech grid).
 */
export default function Slide({
  children,
  colors,
  align = "center",
  className = "",
  adaptive = false,
  themeOverride,
  subtle = false,
  underlay,
}: {
  children: React.ReactNode;
  colors?: [string, string, string];
  align?: "center" | "start";
  className?: string;
  adaptive?: boolean;
  themeOverride?: ThemeName;
  subtle?: boolean;
  underlay?: React.ReactNode;
}) {
  const appTheme = useThemeName();
  const theme = themeOverride ?? appTheme;
  const themed = colors ? grainientColorsForTheme(colors, theme) : undefined;
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden flex">
      {themed && (
        <div className="absolute inset-0 -z-10">
          {adaptive ? (
            <AnimatedGradient color1={themed[0]} color2={themed[1]} color3={themed[2]} subtle={subtle} />
          ) : (
            <Grainient
              color1={themed[0]}
              color2={themed[1]}
              color3={themed[2]}
              timeSpeed={0.13}
              warpStrength={1.0}
              warpAmplitude={60}
              grainAmount={0.18}
              grainAnimated
              contrast={1.4}
              saturation={0.85}
              zoom={1.05}
            />
          )}
          {/* Theme-aware light veil applies ONLY to deck-scoped theming (an
              explicit themeOverride). Without it, the default path renders the
              original dark veil regardless of the ambient app theme, so plain
              `<Slide colors={...} />` is byte-identical to before. */}
          {themeOverride !== undefined && theme === "light" ? (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: subtle
                  ? "linear-gradient(to bottom, rgba(245,246,248,0.10), transparent 45%, rgba(245,246,248,0.40))"
                  : "linear-gradient(to bottom, rgba(245,246,248,0.20), transparent 45%, rgba(245,246,248,0.55))",
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]/60" />
          )}
        </div>
      )}
      {underlay && <div className="absolute inset-0 -z-[5] pointer-events-none">{underlay}</div>}
      <div
        className={`relative flex-1 flex flex-col ${justify} mx-auto max-w-7xl w-full pad-slide-x pad-slide-y min-h-0 overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
