import Button from "./Button";

/**
 * The two stacked step buttons for a kiosk form: both full-width, same size,
 * compact font (size md, not lg, so form copy never shouts). Primary submit on
 * top, secondary Back below.
 */
export default function FormActions({
  backHref,
  continueLabel = "Continue",
  backLabel = "Back",
}: {
  backHref: string;
  continueLabel?: string;
  backLabel?: string;
}) {
  return (
    <div className="mt-6 space-y-2.5">
      <Button type="submit" size="md" arrow className="w-full">
        {continueLabel}
      </Button>
      <Button href={backHref} size="md" variant="secondary" className="w-full">
        {backLabel}
      </Button>
    </div>
  );
}
