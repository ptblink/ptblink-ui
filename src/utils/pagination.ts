/**
 * Slice an array into a page. Pure + server-safe (exported from `@ptblink/ui/utils`,
 * not the `"use client"` barrel, so server components can call it). 1-indexed;
 * clamps out-of-range pages into [1, pageCount].
 */
export function paginate<T>(
  items: T[],
  page: number,
  perPage: number,
): { rows: T[]; page: number; pageCount: number; total: number } {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const clamped = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);
  const start = (clamped - 1) * perPage;
  return { rows: items.slice(start, start + perPage), page: clamped, pageCount, total };
}
