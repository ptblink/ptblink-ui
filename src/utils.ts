/**
 * Pure utility entrypoint. Exported on a SEPARATE bundle from `./index.ts`
 * so the consuming app can call these from server components without going
 * through the `"use client"` barrier that wraps the main barrel.
 *
 * Import: `import { displayClassForLength } from "@ptblink/ui/utils";`
 */
export { displayClassForLength } from "./utils/displayClass";
export { isVimeo, toVimeoEmbed } from "./utils/video";
export type { VimeoEmbedOptions } from "./utils/video";
export { paginate } from "./utils/pagination";
