/**
 * The canonical page container. Every page uses this — no bespoke max-w / px / pt values.
 *
 * Horizontal: max-w-7xl, px-4 mobile / px-6 md+ (matches the floating navbar).
 * Vertical: pt-40 (clears the floating navbar + its sub-nav row), kiosk:pt-56, pb-20.
 *
 * Pass `topClear={false}` when this shell sits beneath a PageHero (which already cleared
 * the navbar) so the container only provides horizontal + bottom alignment.
 */
export default function PageShell({
  children,
  topClear = true,
  className = "",
}: {
  children: React.ReactNode;
  topClear?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-7xl px-4 md:px-6 pb-20 ${
        topClear ? "pt-44 kiosk:pt-60" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
