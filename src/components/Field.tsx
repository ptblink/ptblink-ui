import Input from "./Input";

/**
 * A labelled text input: mono uppercase label + `Input` + optional error line.
 * The label is associated by `id` (falls back to `name`).
 */
export default function Field({
  label,
  error,
  className = "",
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id ?? props.name;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-eyebrow font-mono uppercase text-[var(--color-ink-mute)]"
      >
        {label}
      </label>
      <Input id={id} {...props} />
      {error && <p className="mt-2 text-body-sm text-red-300">{error}</p>}
    </div>
  );
}
