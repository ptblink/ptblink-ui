"use client";

import { useEffect, useRef } from "react";

function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

/**
 * 16:9 looping placeholder preview with a tinted accent glow and a play overlay.
 * Used on each video / film sub-slide so visitors see it's a film, not just a row.
 * Real assets drop in by passing `src`; falls back to the bundled placeholder loop.
 */
export default function VideoThumb({
  accent,
  src = "/placeholder-loop.mp4",
  active = true,
}: {
  accent: string;
  src?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  // Pause the loop when this slide is off-screen so we don't burn cycles
  // running N hidden videos in a long carousel.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) void el.play().catch(() => {});
    else el.pause();
  }, [active]);

  return (
    <div
      className="relative w-full rounded-3xl border border-[var(--color-line)] bg-black overflow-hidden glow-ring"
      style={{ aspectRatio: "16 / 9" }}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-75"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(accent, 0.45)} 0%, transparent 55%, rgba(0,0,0,0.55) 100%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex items-center justify-center rounded-full border bg-white/10 backdrop-blur-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          style={{
            borderColor: "rgba(255,255,255,0.25)",
            height: "clamp(3.5rem, 6vw, 5.5rem)",
            width: "clamp(3.5rem, 6vw, 5.5rem)",
          }}
        >
          <svg
            width="20"
            height="24"
            viewBox="0 0 14 16"
            fill="currentColor"
            className="text-white translate-x-[2px]"
          >
            <path d="M0 0L14 8L0 16V0Z" />
          </svg>
        </span>
      </div>
      <div className="absolute top-3 left-3 rounded-full bg-amber-500/15 border border-amber-500/40 px-3 py-1 text-eyebrow font-mono uppercase text-amber-300 pointer-events-none">
        Placeholder
      </div>
    </div>
  );
}
