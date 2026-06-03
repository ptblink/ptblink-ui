/**
 * Vertical rhythm between major sections inside a PageShell / PageHero.
 * mt-32 mobile, mt-36 md, mt-40 lg — generous + consistent.
 *
 * `first` skips the top margin (for the first section after a hero).
 */
export default function Section({
  children,
  first = false,
  className = "",
}: {
  children: React.ReactNode;
  first?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`${
        first ? "" : "mt-32 md:mt-36 lg:mt-40"
      } ${className}`}
    >
      {children}
    </section>
  );
}
