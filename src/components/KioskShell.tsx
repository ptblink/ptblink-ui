import { ReactNode } from "react";

/**
 * Full-viewport kiosk surface for an iPad station.
 *
 * • Exactly 100dvh × 100% of its layer — `overflow-hidden`, so a screen NEVER
 *   scrolls vertically or horizontally.
 * • Content is centred and built from the viewport-scaled type/spacing
 *   utilities (`text-display-*`, `gap-stack-*`, `pad-kiosk-*`), so the same
 *   screen fits iPad portrait, iPad landscape and a wall display without tuning.
 * • Background-agnostic: pass an animated gradient (or anything) via
 *   `background`; it sits behind the content. Children are the form/list/copy.
 */
export default function KioskShell({
  children,
  background,
  align = "center",
  className = "",
}: {
  children: ReactNode;
  background?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <section className="relative isolate flex h-[100dvh] w-full overflow-hidden">
      {background ? <div className="absolute inset-0 -z-10">{background}</div> : null}
      <div
        className={`relative mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col items-center overflow-hidden text-center kiosk:max-w-4xl pad-kiosk-x pad-kiosk-y ${justify} ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
