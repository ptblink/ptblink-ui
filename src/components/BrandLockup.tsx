import Link from "next/link";

/**
 * A brand lockup: a square logo mark + wordmark + mono caption, linking home.
 * Render it in every header so the logo never drifts between surfaces.
 *
 * - `logoSrc` — URL of the square mark (e.g. a `/brand/…svg` asset in the app).
 * - `wordmark` — the brand text ("Blink Hub" by default).
 * - `subtitle` — the mono caption under the wordmark.
 * - `interactive` — adds the hover-grow / press-shrink micro-interaction (use in
 *   the floating site navbar).
 */
export default function BrandLockup({
  logoSrc,
  wordmark = "Blink Hub",
  homeHref = "/",
  subtitle = "Technology Centres",
  interactive = false,
  className = "",
}: {
  logoSrc: string;
  wordmark?: string;
  homeHref?: string;
  subtitle?: string;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={homeHref}
      aria-label={`${wordmark} home`}
      className={`group flex items-center gap-3 text-left ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt=""
        aria-hidden
        className={`h-9 w-9${
          interactive ? " transition-transform duration-300 group-hover:scale-110 group-active:scale-95" : ""
        }`}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-light tracking-[0.01em]">{wordmark}</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-white/70">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
