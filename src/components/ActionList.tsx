"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";

export type ActionListItem = { label: string };

/**
 * One vertical column of large remote-friendly action buttons, designed for
 * 60" kiosk screens driven by an air-mouse remote (pointer + d-pad).
 *
 * Remote contract while mounted:
 *   ↑ ↓    move the selection between buttons. Captured before SlideDeck's
 *          window listener, so the deck's global sub-slide navigation only
 *          fires when ↑ is pressed on the FIRST button (leaving the slide).
 *          ↓ on the last button falls through to the deck (clamps, no-op).
 *   Enter  activates the selected button.
 *   hover  (air-mouse pointer) syncs the selection.
 *
 * While a modal is open ([aria-modal="true"]), all keys are left to it.
 */
export default function ActionList({
  items,
  accent = "#2c90cf",
  onActivate,
}: {
  items: ActionListItem[];
  /** Solid hex for the selection border + bullet dots. */
  accent?: string;
  onActivate?: (item: ActionListItem, index: number) => void;
}) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[aria-modal="true"]')) return;

      switch (e.key) {
        case "ArrowDown":
          if (selected < items.length - 1) {
            e.preventDefault();
            e.stopPropagation();
            setSelected(selected + 1);
          }
          break;
        case "ArrowUp":
          if (selected > 0) {
            e.preventDefault();
            e.stopPropagation();
            setSelected(selected - 1);
          }
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          onActivate?.(items[selected], selected);
          break;
      }
    };
    // Capture phase: runs before SlideDeck's window-level bubble listener.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [selected, items, onActivate]);

  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-3 w-full">
      {items.map((item, i) => {
        const isSelected = i === selected;
        return (
          <Reveal as="li" key={i} delay={0.28 + i * 0.07}>
            <button
              type="button"
              onClick={() => onActivate?.(item, i)}
              onMouseEnter={() => setSelected(i)}
              aria-current={isSelected}
              className={`w-full flex items-center gap-4 min-h-[72px] rounded-xl border px-6 py-4 text-lg font-light text-left transition-colors active:scale-[0.99] ${
                isSelected
                  ? "bg-[var(--color-bg-elev-2)]"
                  : "bg-[var(--color-bg-elev)]/70 backdrop-blur-md"
              }`}
              style={{ borderColor: isSelected ? accent : "var(--color-line)" }}
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
              <span className="truncate">{item.label}</span>
            </button>
          </Reveal>
        );
      })}
    </ul>
  );
}
