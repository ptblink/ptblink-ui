/**
 * The single card primitive: rounded-2xl + line border + elev background + p-6.
 * Used everywhere a "content card" appears (stat tiles, info blocks, panels).
 */
export default function Card({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
}) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 md:p-7 ${className}`}
    >
      {children}
    </Tag>
  );
}
