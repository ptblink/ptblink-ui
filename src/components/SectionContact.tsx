"use client";

import Link from "next/link";
import type { Cta, Accent } from "./types";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

export default function SectionContact({
  ctas,
  accent,
}: {
  ctas: Cta[];
  accent: Accent;
}) {
  if (ctas.length === 0) return null;
  return (
    <Section>
      <SectionHeader
        eyebrow="04 · Next step"
        title="Where do you want to go next?"
      />

      <div className="mt-10 flex flex-wrap gap-3">
        {ctas.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] px-6 py-3.5 min-h-[52px] text-sm md:text-base font-light hover:bg-[var(--color-bg-elev-2)] active:scale-[0.98] transition select-none"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent.base;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          >
            {c.label}
            <span
              className="transition-transform group-hover:translate-x-0.5"
              style={{ color: accent.base }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
