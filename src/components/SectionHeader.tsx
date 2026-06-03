import Eyebrow from "./Eyebrow";

type Size = "sm" | "md" | "lg";

const titleSize: Record<Size, string> = {
  sm: "text-display-sm",
  md: "text-display-md",
  lg: "text-display-lg",
};

/**
 * Eyebrow + headline pair used on every page header and every section header.
 * `side` optionally renders right-aligned content (e.g. a counter or a CTA).
 */
export default function SectionHeader({
  eyebrow,
  eyebrowColor,
  title,
  side,
  size = "md",
}: {
  eyebrow: string;
  eyebrowColor?: string;
  title: React.ReactNode;
  side?: React.ReactNode;
  size?: Size;
}) {
  return (
    <div className="flex items-end justify-between gap-6 flex-wrap">
      <div className="min-w-0">
        <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
        <h2
          className={`mt-stack-sm font-display font-thin-tight ${titleSize[size]}`}
        >
          {title}
        </h2>
      </div>
      {side}
    </div>
  );
}
