"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isVimeo, toVimeoEmbed } from "../utils/video";

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
  const rafRef = useRef<number | null>(null);
  const [bufferPct, setBufferPct] = useState(0);

  const updateBuffer = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) {
      const b = v.buffered;
      if (b.length > 0) setBufferPct((b.end(b.length - 1) / v.duration) * 100);
    }
    rafRef.current = requestAnimationFrame(updateBuffer);
  }, []);

  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      // Delete/Backspace are the air-mouse remote's "back"; Escape for keyboards.
      if (e.key === "Escape" || e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);

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
      window.removeEventListener("keydown", onKey, true);
    };
  }, [item, onClose]);

  // Buffer bar for direct MP4s only — Vimeo's iframe manages its own buffering.
  useEffect(() => {
    if (!item) return;
    const s = item.src ?? PLACEHOLDER_SRC;
    if (isVimeo(s)) return;
    setBufferPct(0);
    rafRef.current = requestAnimationFrame(updateBuffer);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [item, updateBuffer]);

  if (!item) return null;

  const src = item.src ?? PLACEHOLDER_SRC;
  const accent = item.accent ?? "#2c90cf";
  const vimeoSrc = isVimeo(src) ? toVimeoEmbed(src, { autoplay: true }) : null;

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
          {!vimeoSrc && (
            <div className="absolute top-0 inset-x-0 h-1 bg-white/15 z-10">
              <div
                className="h-full bg-white/75 transition-[width] duration-500 ease-out"
                style={{ width: `${bufferPct}%` }}
              />
            </div>
          )}
          {vimeoSrc ? (
            <iframe
              key={vimeoSrc}
              src={vimeoSrc}
              title={item.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={src}
              autoPlay
              controls
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
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
