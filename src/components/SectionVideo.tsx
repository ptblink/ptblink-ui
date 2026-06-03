"use client";

import { useState } from "react";
import type { Video, Accent } from "./types";
import VideoModal, { type VideoModalItem } from "./VideoModal";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export default function SectionVideo({
  videos,
  accent,
}: {
  videos: Video[];
  accent: Accent;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [openVideo, setOpenVideo] = useState<VideoModalItem | null>(null);
  if (videos.length === 0) return null;

  return (
    <Section>
      <SectionHeader
        eyebrow="01 · Video library"
        title="Watch what's running on the screen."
        side={
          <span className="text-[10px] md:text-[11px] font-mono text-[var(--color-ink-mute)] uppercase tracking-widest">
            {videos.length.toString().padStart(2, "0")} films
          </span>
        }
      />

      <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden">
        {videos.map((v, idx) => (
          <li
            key={v.title}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive((cur) => (cur === idx ? null : cur))}
            onTouchStart={() => setActive(idx)}
            onClick={() =>
              setOpenVideo({
                title: v.title,
                topic: v.topic,
                durationSec: v.durationSec,
                accent: accent.base,
              })
            }
            className="group relative bg-[var(--color-bg-elev)] overflow-hidden cursor-pointer active:bg-[var(--color-bg-elev-2)]"
          >
            <div className="relative aspect-video">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(70% 50% at 50% 30%, ${withAlpha(accent.base, 0.22)}, transparent)`,
                }}
              />
              <div
                className={`absolute inset-0 bg-[var(--color-bg)]/30 transition-opacity duration-500 ${
                  active === idx ? "opacity-0" : "opacity-100"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex items-center justify-center h-16 w-16 md:h-14 md:w-14 rounded-full border backdrop-blur-md transition-all duration-500"
                  style={
                    active === idx
                      ? {
                          transform: "scale(1.1)",
                          backgroundColor: withAlpha(accent.base, 0.25),
                          borderColor: withAlpha(accent.base, 0.5),
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderColor: "rgba(255,255,255,0.15)",
                        }
                  }
                >
                  <svg width="16" height="18" viewBox="0 0 14 16" fill="currentColor">
                    <path d="M0 0L14 8L0 16V0Z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="p-5 md:p-6 flex items-start justify-between gap-4 border-t border-[var(--color-line)]">
              <div>
                <div className="font-light text-base">{v.title}</div>
                <div className="mt-1 text-[10px] text-[var(--color-ink-mute)] font-mono uppercase tracking-[0.3em]">
                  {v.topic}
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--color-ink-dim)] shrink-0">
                {fmt(v.durationSec)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <VideoModal item={openVideo} onClose={() => setOpenVideo(null)} />
    </Section>
  );
}
