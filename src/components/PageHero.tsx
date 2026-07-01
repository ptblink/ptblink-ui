import Grainient from "../react-bits/Grainient";
import AnimatedGradient from "../react-bits/AnimatedGradient";
import { useThemeName } from "../hooks/useThemeName";
import { grainientColorsForTheme } from "../theme";

/**
 * Hero variant of PageShell — same horizontal container + vertical clearance,
 * with a Grainient background slot underneath. Pass a [color1, color2, color3] tuple
 * (typically [bg, accent, gray]) to tint per-persona. The tuple is the DARK
 * palette — in light mode the base stops render near-white and only the
 * accent (middle stop) pops.
 *
 * `adaptive` swaps the WebGL `Grainient` for `AnimatedGradient` (GPU-safe
 * CSS-blob fallback on low-tier hardware). Defaults to today's direct Grainient.
 */
export default function PageHero({
  children,
  colors,
  className = "",
  adaptive = false,
}: {
  children: React.ReactNode;
  colors: [string, string, string];
  className?: string;
  adaptive?: boolean;
}) {
  const themed = grainientColorsForTheme(colors, useThemeName());
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {adaptive ? (
          <AnimatedGradient color1={themed[0]} color2={themed[1]} color3={themed[2]} />
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
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]" />
      </div>

      <div
        className={`mx-auto max-w-7xl px-4 md:px-6 pt-44 kiosk:pt-60 pb-20 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
