import Link from "next/link";
import CardShell, { type CardAccent } from "./CardShell";

/**
 * A launcher tile that links somewhere — a linkable wrapper around `CardShell`
 * with the hover-lift / press micro-interaction. `hero` enlarges the title for a
 * lead cell. For a domain-typed variant, compose `CardShell` directly.
 */
export default function UtilityCard({
  href,
  label,
  screenLabel,
  accent,
  hero = false,
}: {
  href: string;
  label: string;
  screenLabel: string;
  accent: CardAccent;
  hero?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block h-full select-none transition-transform duration-300 ease-out will-change-transform motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97]"
    >
      <CardShell accent={accent} screenLabel={screenLabel} title={label} hero={hero} />
    </Link>
  );
}
