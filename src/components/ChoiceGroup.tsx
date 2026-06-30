export type ChoiceOption = { value: string; label: string };

/**
 * Single-select choice as tappable chips — the kiosk replacement for a
 * `<select>`. Radio-backed, so it submits with a plain `<form>` / server action
 * and holds no client state. Chips wrap responsively and stay legible at any
 * viewport; the selected one fills with the brand so it never reads as an input.
 */
export default function ChoiceGroup({
  name,
  options,
  defaultValue,
  className = "",
}: {
  name: string;
  options: ChoiceOption[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {options.map((option, i) => {
        const checked = defaultValue != null ? option.value === defaultValue : i === 0;
        return (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={checked}
              className="peer sr-only"
            />
            <span className="inline-flex select-none items-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] px-4 py-2 text-body-sm font-light text-[var(--color-ink-dim)] transition hover:border-[var(--color-ink-mute)] peer-checked:border-[var(--color-brand)] peer-checked:bg-[var(--color-brand)] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(44,144,207,0.4)]">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
