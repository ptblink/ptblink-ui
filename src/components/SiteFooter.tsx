import Image from "next/image";
import logoUrl from "../brand/blinklogo-dark.svg";

export default function SiteFooter() {
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
            © {new Date().getFullYear()} PT Blink Technologies · Tech Centre Companion
          </div>
        </div>
        <div className="text-[10px] font-mono text-[var(--color-ink-mute)] uppercase tracking-[0.3em]">
          v0.1 · scaffold
        </div>
      </div>
    </footer>
  );
}
