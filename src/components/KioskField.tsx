import { ReactNode } from "react";

/**
 * A labelled block for kiosk forms: a small mono caption above any control
 * (`Input`, `ChoiceGroup`, …). Full-width so it lines up in a stacked or
 * two-column kiosk form.
 */
export default function KioskField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 text-eyebrow font-mono uppercase text-[var(--color-ink-mute)]">{label}</div>
      {children}
    </div>
  );
}
