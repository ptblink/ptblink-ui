"use client";

/**
 * A small print trigger — fires `window.print()`. Wrap the surrounding chrome in
 * `print:hidden` in the consuming page so only the content prints. Optional
 * `label` overrides the default.
 */
export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink-dim)] transition hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-ink)]"
    >
      {label} <span aria-hidden>↓</span>
    </button>
  );
}
