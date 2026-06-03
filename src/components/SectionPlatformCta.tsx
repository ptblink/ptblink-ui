"use client";

import Link from "next/link";
import Grainient from "../react-bits/Grainient";
import type { Accent } from "./types";
import Section from "./Section";
import Eyebrow from "./Eyebrow";

export default function SectionPlatformCta({
  features,
  accent,
}: {
  features: string[];
  accent: Accent;
}) {
  if (features.length === 0) return null;
  return (
    <Section>
      <div className="relative isolate overflow-hidden rounded-3xl border border-[var(--color-line-strong)]">
        <div className="absolute inset-0 -z-10">
          <Grainient
            color1="#0d0f12"
            color2={accent.base}
            color3="#15181c"
            timeSpeed={0.1}
            warpStrength={0.8}
            warpAmplitude={50}
            grainAmount={0.22}
            grainAnimated
            contrast={1.5}
            saturation={0.9}
            zoom={1.1}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)]/40 via-transparent to-[var(--color-bg)]/70" />
        </div>

        <div className="relative p-8 md:p-12 lg:p-16 flex flex-col gap-10">
          <div>
            <Eyebrow color={accent.soft}>03 · 3D Blink Platform</Eyebrow>
            <h2 className="mt-4 font-display font-thin-tight text-5xl md:text-6xl lg:text-7xl kiosk:text-8xl max-w-3xl leading-[1.02]">
              Open the platform.
              <br />
              <span style={{ color: accent.base }}>Touch the tool.</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)]/70 backdrop-blur-md px-4 py-3.5 text-sm md:text-base font-light"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accent.base }}
                />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/platform"
            className="inline-flex items-center self-start gap-3 rounded-full text-[var(--color-bg)] px-7 py-4 min-h-[52px] text-base font-medium transition select-none"
            style={{ backgroundColor: accent.base }}
          >
            Launch the demo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
