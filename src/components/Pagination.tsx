import Link from "next/link";

/**
 * SSR pagination for staff/admin lists — prev/next + a compact numbered window,
 * rendered as links so it works with no client state. The consumer owns URL
 * shape via `hrefForPage(page)`, so it can preserve its own params (filters,
 * selection). 1-indexed. Renders nothing when there's a single page.
 *
 * Pair with `paginate(items, page, perPage)` to slice the current page.
 */
export function paginate<T>(items: T[], page: number, perPage: number): { rows: T[]; page: number; pageCount: number; total: number } {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const clamped = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);
  const start = (clamped - 1) * perPage;
  return { rows: items.slice(start, start + perPage), page: clamped, pageCount, total };
}

/** The compact page window around the current page (with 1 and last always shown). */
function pageWindow(page: number, pageCount: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const push = (n: number | "…") => out.push(n);
  const near = (n: number) => Math.abs(n - page) <= 1;
  let lastPushed = 0;
  for (let n = 1; n <= pageCount; n++) {
    if (n === 1 || n === pageCount || near(n)) {
      if (lastPushed && n - lastPushed > 1) push("…");
      push(n);
      lastPushed = n;
    }
  }
  return out;
}

const cell =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[11px] font-mono uppercase tracking-widest transition";

export default function Pagination({
  page,
  pageCount,
  hrefForPage,
  className = "",
}: {
  page: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const active = "border-[var(--color-line-strong)] bg-[var(--color-bg-elev-2)] text-[var(--color-ink)]";
  const idle = "border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-ink)]";
  const disabled = "border-[var(--color-line)] text-[var(--color-ink-mute)] opacity-40 pointer-events-none";

  return (
    <nav className={`mt-5 flex items-center justify-center gap-1.5 ${className}`} aria-label="Pagination">
      <Link href={hrefForPage(page - 1)} className={`${cell} ${page <= 1 ? disabled : idle}`} aria-label="Previous page">
        ‹
      </Link>
      {pageWindow(page, pageCount).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-[11px] font-mono text-[var(--color-ink-mute)]">
            …
          </span>
        ) : (
          <Link key={n} href={hrefForPage(n)} className={`${cell} ${n === page ? active : idle}`} aria-current={n === page ? "page" : undefined}>
            {n}
          </Link>
        ),
      )}
      <Link href={hrefForPage(page + 1)} className={`${cell} ${page >= pageCount ? disabled : idle}`} aria-label="Next page">
        ›
      </Link>
    </nav>
  );
}
