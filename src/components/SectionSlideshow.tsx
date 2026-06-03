"use client";

import ScrollReveal from "../react-bits/ScrollReveal";
import type { Slide, Accent } from "./types";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

export default function SectionSlideshow({
  slides,
  accent,
}: {
  slides: Slide[];
  accent: Accent;
}) {
  if (slides.length === 0) return null;
  return (
    <Section>
      <SectionHeader
        eyebrow="02 · Slideshow"
        title="The same deck the screen runs."
      />

      <ol className="mt-14 relative">
        <div
          className="absolute left-[18px] top-2 bottom-2 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${accent.dim}, transparent)`,
          }}
          aria-hidden
        />
        {slides.map((s, idx) => (
          <li key={s.heading} className="relative pl-16 pb-14 last:pb-0">
            <div
              className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border bg-[var(--color-bg-elev)] text-[10px] font-mono"
              style={{ borderColor: accent.dim, color: accent.soft }}
            >
              {(idx + 1).toString().padStart(2, "0")}
            </div>
            <ScrollReveal
              enableBlur
              baseOpacity={0.15}
              baseRotation={2}
              blurStrength={5}
              containerClassName="!my-0"
              textClassName="!font-display !font-thin-tight !text-3xl md:!text-4xl lg:!text-5xl !leading-tight !my-0"
            >
              {s.heading}
            </ScrollReveal>
            <ul className="mt-4 space-y-2 text-[15px] md:text-base font-light text-[var(--color-ink-dim)]">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="font-mono" style={{ color: accent.base }}>
                    —
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
