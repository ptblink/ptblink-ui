/**
 * A centred page-title block: a big thin display title with an optional subtle
 * description. Placement (top vs centre of the screen) is decided by the shell
 * that renders it. The single title typography for kiosk flow routes.
 */
export default function FlowHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center">
      <h1 className="font-display font-thin-tight text-5xl md:text-6xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-base font-light text-[var(--color-ink-dim)] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
