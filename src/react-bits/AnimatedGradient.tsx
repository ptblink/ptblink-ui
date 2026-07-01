"use client";

import Grainient from "./Grainient";
import { useGPUCapability } from "../hooks/useGPUCapability";

function CSSGradient({
  color1,
  color2,
  color3,
  subtle = false,
}: {
  color1: string;
  color2: string;
  color3: string;
  subtle?: boolean;
}) {
  // Lighter blobs for the subtle (light) wash so it stays airy, not saturated.
  const o = subtle ? { a: 0.55, b: 0.4, c: 0.28 } : { a: 0.9, b: 0.6, c: 0.45 };
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: color1 }}>
      <div
        className="blob-1 absolute"
        style={{
          width: "110%",
          height: "110%",
          top: "-25%",
          left: "-15%",
          background: `radial-gradient(ellipse at 40% 50%, ${color2} 0%, transparent 70%)`,
          opacity: o.a,
          filter: "blur(32px)",
        }}
      />
      <div
        className="blob-2 absolute"
        style={{
          width: "90%",
          height: "90%",
          bottom: "-20%",
          right: "-15%",
          background: `radial-gradient(ellipse at 60% 50%, ${color2} 0%, transparent 70%)`,
          opacity: o.b,
          filter: "blur(44px)",
        }}
      />
      <div
        className="blob-3 absolute"
        style={{
          width: "70%",
          height: "70%",
          top: "25%",
          left: "25%",
          background: `radial-gradient(ellipse at center, ${color3} 0%, transparent 70%)`,
          opacity: o.c,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

export default function AnimatedGradient({
  color1,
  color2,
  color3,
  subtle = false,
}: {
  color1: string;
  color2: string;
  color3: string;
  /** Calmer, lower-contrast wash — used by the light deck theme. */
  subtle?: boolean;
}) {
  const tier = useGPUCapability();

  // Default to CSS while detecting (safe) and for low-tier hardware.
  if (tier !== "high") {
    return <CSSGradient color1={color1} color2={color2} color3={color3} subtle={subtle} />;
  }

  return (
    <Grainient
      color1={color1}
      color2={color2}
      color3={color3}
      grainAmount={0}
      grainAnimated={false}
      timeSpeed={0.13}
      warpStrength={1}
      warpAmplitude={subtle ? 40 : 60}
      contrast={subtle ? 1.0 : 1.4}
      saturation={subtle ? 0.55 : 0.85}
      zoom={1.05}
    />
  );
}
