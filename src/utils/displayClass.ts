/**
 * Pick a viewport-scaled display class based on text length so titles never
 * overflow. Long titles drop to smaller buckets; short ones get the largest.
 */
/**
 * Pick a viewport-scaled display class based on text length so titles never
 * overflow. `tier` selects the bucket family:
 * - "hero": top-of-page slides where the title is the focal point
 * - "card": column-constrained slides (e.g. video/film with a thumb beside)
 */
export function displayClassForLength(
  text: string,
  tier: "hero" | "card" = "hero"
): string {
  const len = text.replace(/\s+/g, " ").trim().length;
  if (tier === "card") {
    if (len <= 18) return "text-display-lg";
    if (len <= 38) return "text-display-md";
    return "text-display-sm";
  }
  if (len <= 14) return "text-display-2xl";
  if (len <= 26) return "text-display-xl";
  if (len <= 42) return "text-display-lg";
  if (len <= 70) return "text-display-md";
  return "text-display-sm";
}
