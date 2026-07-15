"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Kiosk idle timeout — if the screen sits untouched for `seconds`, navigates to
 * `href`. Any real navigation unmounts this and clears the timer. Renders
 * nothing; drop it on any screen that should bounce back to a home/idle route.
 */
export default function AutoRedirect({
  href,
  seconds = 20,
}: {
  href: string;
  seconds?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(href), seconds * 1000);
    return () => clearTimeout(timer);
  }, [router, href, seconds]);

  return null;
}
