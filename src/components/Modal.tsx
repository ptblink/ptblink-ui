"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * General-purpose overlay dialog — blurred dark backdrop, portalled to <body>,
 * click-out + Escape to close, body-scroll locked while open. Sizes range from
 * a small centred card to a near-fullscreen panel (`full`) that sits inside a
 * comfortable page margin. Use it to open rich content (a PDF, a form, a big
 * table) OVER the page instead of pushing it below the fold.
 *
 * (`ConfirmModal` stays the small yes/no guard; `VideoModal` stays the video
 * player. This is the everything-else modal.)
 */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const SIZES: Record<ModalSize, string> = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-lg",
  lg: "w-full max-w-2xl",
  xl: "w-full max-w-5xl",
  // Near-fullscreen: fills the viewport bar a comfortable margin.
  full: "w-full h-full max-w-[min(96rem,96vw)] max-h-[92vh]",
};

export default function Modal({
  open,
  onClose,
  size = "lg",
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  /** Optional heading rendered in a sticky top bar with the close button. */
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] ${SIZES[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--color-line)] px-5 py-3.5">
          <div className="min-w-0 font-display font-thin-tight text-lg text-[var(--color-ink)] truncate">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex shrink-0 h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line-strong)] text-[var(--color-ink-dim)] transition hover:bg-white/5 hover:border-[var(--color-brand)] hover:text-[var(--color-ink)]"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
