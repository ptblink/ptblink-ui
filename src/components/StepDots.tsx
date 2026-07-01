/**
 * Multi-step form progress indicator (generalised from the techcentre
 * registration flow). Shows a "Registering · {name}" / "New visitor" caption on
 * the left, "Step X of N · {label}" on the right, and a row of N segment bars.
 *
 * Pass `steps` (an array of step labels) to drive both the count and the
 * per-step label; or pass `total` alone for an unlabelled N-step bar.
 */
export default function StepDots({
  step,
  steps,
  total = steps?.length ?? 4,
  name,
  idleLabel = "New visitor",
}: {
  step: number;
  /** Optional per-step labels; when set, `total` defaults to `steps.length`. */
  steps?: string[];
  total?: number;
  name?: string;
  idleLabel?: string;
}) {
  const currentLabel = steps?.[step - 1];
  return (
    <div className="mb-4 w-full">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-eyebrow font-mono uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
          {name ? `Registering · ${name}` : idleLabel}
        </span>
        <span className="text-eyebrow font-mono uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
          Step {step} of {total}
          {currentLabel ? ` · ${currentLabel}` : ""}
        </span>
      </div>
      <div
        className="mt-2 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full ${i < step ? "bg-[var(--color-brand)]" : "bg-[var(--color-line)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
