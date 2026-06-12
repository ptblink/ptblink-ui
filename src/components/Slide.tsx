import Grainient from "../react-bits/Grainient";
import { useThemeName } from "../hooks/useThemeName";
import { grainientColorsForTheme } from "../theme";

/**
 * One full-viewport slide inside a SlideDeck.
 * • Always 100vw × 100vh of its containing layer.
 * • `overflow-hidden` so nothing — text, grids, gradients — can leak out.
 * • Padding scales with viewport (`pad-slide-*`) so the same slide fits
 *   16:9, 4:3, portrait iPad, and a 65" kiosk without tuning.
 */
export default function Slide({
  children,
  colors,
  align = "center",
  className = "",
}: {
  children: React.ReactNode;
  colors?: [string, string, string];
  align?: "center" | "start";
  className?: string;
}) {
  const theme = useThemeName();
  const themed = colors ? grainientColorsForTheme(colors, theme) : undefined;
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden flex">
      {themed && (
        <div className="absolute inset-0 -z-10">
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
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]/60" />
        </div>
      )}
      <div
        className={`relative flex-1 flex flex-col ${justify} mx-auto max-w-7xl w-full pad-slide-x pad-slide-y min-h-0 overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
