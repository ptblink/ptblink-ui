import Button, { type ButtonSize } from "./Button";

/**
 * The two stacked step buttons for a kiosk form: both full-width, same size.
 * Primary submit on top, secondary Back below. `size` defaults to `md` (compact
 * form copy); pass `lg` for full-screen kiosk flows where controls should match
 * the larger landing buttons.
 */
export default function FormActions({
  backHref,
  continueLabel = "Continue",
  backLabel = "Back",
  size = "md",
}: {
  backHref: string;
  continueLabel?: string;
  backLabel?: string;
  size?: ButtonSize;
}) {
  return (
    <div className="mt-6 space-y-2.5">
      <Button type="submit" size={size} arrow className="w-full">
        {continueLabel}
      </Button>
      <Button href={backHref} size={size} variant="secondary" className="w-full">
        {backLabel}
      </Button>
    </div>
  );
}
