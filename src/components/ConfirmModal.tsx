"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

/**
 * Custom confirmation modal — NOT window.confirm. Portalled to <body> so it
 * sits above the fixed header/bars, with a click-out + Escape to cancel. Used
 * to guard easy-to-mistap controls (theme switch, sign out).
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !busy && onCancel()}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
        <h2 className="font-display font-thin-tight text-2xl md:text-3xl">{title}</h2>
        <p className="mt-3 text-body-sm font-light text-[var(--color-ink-dim)]">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? "…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
