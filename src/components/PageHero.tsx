import Grainient from "../react-bits/Grainient";

/**
 * Hero variant of PageShell — same horizontal container + vertical clearance,
 * with a Grainient background slot underneath. Pass a [color1, color2, color3] tuple
 * (typically [bg, accent, gray]) to tint per-persona.
 */
export default function PageHero({
  children,
  colors,
  className = "",
}: {
  children: React.ReactNode;
  colors: [string, string, string];
  className?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Grainient
          color1={colors[0]}
          color2={colors[1]}
          color3={colors[2]}
          timeSpeed={0.13}
          warpStrength={1.0}
          warpAmplitude={60}
          grainAmount={0.18}
          grainAnimated
          contrast={1.4}
          saturation={0.85}
          zoom={1.05}
        />
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
