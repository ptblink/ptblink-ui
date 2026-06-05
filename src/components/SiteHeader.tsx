"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScrolled } from "../hooks/useScrolled";
import iconUrl from "../brand/icon-128.png";

const nav = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/platform", label: "Platform" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(12);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div
        className={`mx-auto max-w-7xl px-4 md:px-6 transition-all duration-300 ${
          scrolled ? "pt-3" : "pt-5"
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-3 rounded-full pl-3 pr-3 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-[var(--color-bg)]/75 border border-[var(--color-line-strong)] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(44,144,207,0.4)]"
              : "bg-[var(--color-bg-elev)]/40 border border-[var(--color-line)] backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 group pr-2 pl-1 min-h-[44px]"
            aria-label="PT Blink home"
          >
            <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full overflow-hidden bg-[var(--color-bg-elev-2)]">
              <Image
                src={iconUrl}
                alt=""
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-95"
              />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-[var(--color-line-strong)] group-hover:ring-[var(--color-brand)]/60 transition-colors" />
            </span>
            <span className="hidden md:flex flex-col leading-none">
              <span className="font-display font-thin-tight text-base">Blink</span>
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[var(--color-ink-mute)] mt-1">
                Tech Centre
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 px-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-5 py-2.5 min-h-[44px] flex items-center text-sm font-light rounded-full transition-colors ${
                    active
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[var(--color-bg-elev-2)] ring-1 ring-inset ring-[var(--color-line-strong)]"
                    />
                  )}
                  <span className="relative">{item.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 -bottom-px h-px w-6 -translate-x-1/2 bg-[var(--color-brand)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/staff/checkin"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] active:bg-[var(--color-brand-dim)] hover:bg-[var(--color-brand-soft)] text-[var(--color-bg)] pl-5 pr-3.5 py-2.5 min-h-[44px] text-sm font-medium tracking-wide transition select-none"
          >
            <span>Check in</span>
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[var(--color-bg)]/15">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 5h8M5 1l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
