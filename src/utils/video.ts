/**
 * Vimeo helpers.
 *
 * Kiosk/world/slide configs store the canonical Vimeo share URL
 * (e.g. `https://vimeo.com/1205339149/0e39fdccd6`); players convert it to an
 * embeddable `player.vimeo.com` URL at render time.
 *
 * Direct MP4 URLs are left untouched so a rollback (swap the href back to the
 * `.mp4`) keeps working with the same `<video>` fallback path.
 */

/** True when `url` points at Vimeo (share URL or player URL), not a direct file. */
export function isVimeo(url: string): boolean {
  return /\bvimeo\.com\//i.test(url);
}

export type VimeoEmbedOptions = {
  autoplay?: boolean;
  muted?: boolean;
  /** Set false to hide the Vimeo player chrome. Defaults to shown. */
  controls?: boolean;
  loop?: boolean;
};

/**
 * Convert a Vimeo share/watch URL to a `player.vimeo.com/video/<id>` embed URL.
 * Handles unlisted videos whose privacy hash is the second path segment
 * (`vimeo.com/<id>/<hash>`) by forwarding it as the `h` query param.
 *
 * Returns `null` when `url` is not a Vimeo URL (e.g. a direct `.mp4`), so callers
 * can fall back to a native `<video>` element.
 */
export function toVimeoEmbed(url: string, opts: VimeoEmbedOptions = {}): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([0-9a-z]+))?/i);
  if (!match) return null;

  const [, id, hash] = match;
  const params = new URLSearchParams();
  if (hash) params.set("h", hash);
  if (opts.autoplay) params.set("autoplay", "1");
  if (opts.muted) params.set("muted", "1");
  if (opts.controls === false) params.set("controls", "0");
  if (opts.loop) params.set("loop", "1");

  const qs = params.toString();
  return `https://player.vimeo.com/video/${id}${qs ? `?${qs}` : ""}`;
}
