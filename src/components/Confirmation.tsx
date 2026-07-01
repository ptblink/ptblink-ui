import Button from "./Button";

/**
 * Terminal confirmation screen — big centred title + detail + a single Done
 * button that returns home (or wherever `href` points). Server-safe.
 */
export default function Confirmation({
  title,
  detail,
  cta = "Done",
  href = "/",
}: {
  title: string;
  detail: string;
  cta?: string;
  href?: string;
}) {
  return (
    <>
      <h1 className="font-display font-thin-tight text-display-md">{title}</h1>
      <p className="mt-stack max-w-2xl text-body font-light text-[var(--color-ink-dim)]">{detail}</p>
      <div className="mt-stack-lg">
        <Button href={href} size="lg" arrow>
          {cta}
        </Button>
      </div>
    </>
  );
}
