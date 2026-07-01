"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Calls `router.refresh()` on an interval so a server-rendered surface re-fetches
 * its data without a full reload. Clears the interval on unmount.
 */
export function useAutoRefresh(intervalMs = 5000): void {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(t);
  }, [router, intervalMs]);
}
