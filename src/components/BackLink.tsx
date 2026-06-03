import Link from "next/link";

/**
 * "← Back" link used at the top of detail pages. Small, muted, hover-brightens.
 */
export default function BackLink({
  href,
  label = "Back",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] transition"
    >
      <span aria-hidden>←</span>
      {label}
    </Link>
  );
}
