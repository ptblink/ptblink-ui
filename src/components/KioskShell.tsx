import { ReactNode } from "react";

/**
 * Full-viewport kiosk surface for an iPad station.
 *
 * • Exactly 100dvh × 100% of its layer — `overflow-hidden`, so a screen NEVER
 *   scrolls vertically or horizontally.
 * • A flex column: centred content takes the free space (`flex-1`), an optional
 *   `footer` sits at the bottom — both stay inside the one viewport.
 * • Content is built from the viewport-scaled type/spacing utilities
 *   (`text-display-*`, `gap-stack-*`, `pad-kiosk-*`), so the same screen fits
 *   iPad portrait, iPad landscape and a wall display without tuning.
 * • Background-agnostic: pass an animated gradient (or anything) via
 *   `background`; it sits behind everything.
 */
export default function KioskShell({
  children,
  background,
  footer,
  align = "center",
  className = "",
}: {
  children: ReactNode;
  background?: ReactNode;
  footer?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <section className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden">
      {background ? <div className="absolute inset-0 -z-10">{background}</div> : null}
      <div
        className={`relative mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col items-center overflow-hidden text-center kiosk:max-w-4xl pad-kiosk-x pad-kiosk-y ${justify} ${className}`}
      >
        {children}
      </div>
      {footer ? <div className="relative shrink-0">{footer}</div> : null}
    </section>
  );
}
