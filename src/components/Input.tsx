/**
 * The text input primitive: hairline border, elevated background, a soft brand
 * focus ring, and a comfortable kiosk-friendly height. Pairs with `Field` for a
 * labelled control.
 */
export default function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] px-4 py-3.5 min-h-[52px] text-body font-light text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] hover:border-[var(--color-ink-mute)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[rgba(44,144,207,0.28)] transition ${className}`}
      {...props}
    />
  );
}
