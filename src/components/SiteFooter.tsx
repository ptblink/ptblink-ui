import Image from "next/image";
import logoUrl from "../brand/blinklogo-dark.svg";

/**
 * Footer with the PT Blink wordmark. All props default to today's chrome, so
 * `<SiteFooter />` with no props renders exactly as before.
 * • `tagline` — the text after "© {year} PT Blink Technologies ·" (default
 *   "Tech Centre Companion").
 * • `version` — the small right-hand label (default "v0.1 · scaffold"); pass
 *   `null` to hide it.
 */
export default function SiteFooter({
  tagline = "Tech Centre Companion",
  version = "v0.1 · scaffold",
}: {
  tagline?: string;
  version?: string | null;
} = {}) {
  return (
    <footer className="relative mt-32 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-7xl px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <Image
            src={logoUrl}
            alt="PT Blink"
            width={130}
            height={50}
            className="h-8 w-auto opacity-70"
          />
          <div className="mt-4 font-display font-thin-tight text-3xl max-w-md leading-tight">
            Build smarter. Faster. Lighter.
          </div>
          <div className="mt-3 text-[10px] font-mono text-[var(--color-ink-mute)] uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} PT Blink Technologies · {tagline}
          </div>
        </div>
        {version && (
          <div className="text-[10px] font-mono text-[var(--color-ink-mute)] uppercase tracking-[0.3em]">
            {version}
          </div>
        )}
      </div>
    </footer>
  );
}
