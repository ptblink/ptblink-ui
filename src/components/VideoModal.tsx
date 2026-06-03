"use client";

import { useEffect, useRef } from "react";

/** Placeholder MP4 self-hosted in /public — Big Buck Bunny short clip. */
const PLACEHOLDER_SRC = "/placeholder-loop.mp4";

export type VideoModalItem = {
  title: string;
  topic?: string;
  durationSec?: number;
  /** Optional override; falls back to the placeholder when content isn't ready yet. */
  src?: string;
  accent?: string;
};

export default function VideoModal({
  item,
  onClose,
}: {
  item: VideoModalItem | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "video_play",
        label: `Played: ${item.title}`,
      }),
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const src = item.src ?? PLACEHOLDER_SRC;
  const accent = item.accent ?? "#2c90cf";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] max-h-[90vh] flex flex-col"
        style={{ maxWidth: "min(72rem, 90vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-start justify-between gap-4 border-b border-[var(--color-line)]"
          style={{ padding: "clamp(0.875rem, 1.6vw, 1.5rem)" }}
        >
          <div className="min-w-0">
            {item.topic && (
              <div
                className="text-eyebrow font-mono uppercase"
                style={{ color: accent }}
              >
                {item.topic}
              </div>
            )}
            <h2 className="mt-1 font-display font-thin-tight text-display-sm leading-tight truncate">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line-strong)] hover:bg-white/5 hover:border-[var(--color-brand)] transition"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="relative bg-black aspect-video min-h-0">
          <video
            ref={videoRef}
            src={src}
            autoPlay
            controls
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
          {!item.src && (
            <div className="absolute top-3 right-3 rounded-full bg-amber-500/15 border border-amber-500/40 px-3 py-1 text-eyebrow font-mono uppercase text-amber-300 pointer-events-none">
              Placeholder
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
