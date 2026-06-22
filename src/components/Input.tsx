/**
 * The text input primitive: hairline border, elevated background, brand focus
 * ring-by-border. Pairs with `Field` for a labelled control.
 */
export default function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] px-4 py-3 text-body font-light text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] focus:outline-none focus:border-[var(--color-brand)] transition ${className}`}
      {...props}
    />
  );
}
