import Eyebrow from "./Eyebrow";

/**
 * Centred form column. Mirrors the staff sign-in layout — a narrow, page-
 * centred column with an eyebrow + thin display title + dim description above
 * the form — so every form reads the same instead of being stranded top-left.
 * Drop it inside a `PageShell`. `width="lg"` for forms with multi-column grids.
 */
export default function FormShell({
  title,
  eyebrow,
  description,
  children,
  width = "md",
  className = "",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  width?: "md" | "lg";
  className?: string;
}) {
  const maxW = width === "lg" ? "max-w-2xl" : "max-w-md";
  return (
    <div className={`mx-auto w-full ${maxW} mt-12 md:mt-16 ${className}`}>
      <header>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-4 font-display font-thin-tight text-5xl md:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 text-base font-light text-[var(--color-ink-dim)]">{description}</p>
        )}
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
