# @ptblink/ui

PT Blink shared UI primitives, design tokens, and animation helpers for Next.js 15 + Tailwind v4 apps.

## Install

```bash
npm install @ptblink/ui
```

Peer dependencies (you must install these too):
`react@^19 react-dom@^19 next@^15 motion@^12 gsap@^3 tailwindcss@^4`

## Wire it up

1. **Tailwind preset** — extend in your `tailwind.config.ts`:

```ts
import blink from "@ptblink/ui/tailwind";
export default { presets: [blink], content: ["./app/**/*.{ts,tsx}"] };
```

2. **Base CSS** — import once at the top of your global stylesheet:

```css
@import "@ptblink/ui/styles.css";
```

3. **Use a primitive**:

```tsx
import { Slide, Reveal, Eyebrow } from "@ptblink/ui";
```

## Exported surface

### Components — kiosk

| Export | Description |
|---|---|
| `Slide` | Full-viewport slide wrapper with optional `Grainient` background. Optional `adaptive` (GPU-safe gradient), `themeOverride`, `subtle`, `underlay`. |
| `SlideDeck` | 2D remote-driven slide deck. Owns arrow/Esc/Enter keyboard, HomePill, EnterHint. |
| `Reveal` | Blur + rise + fade entrance wrapper (motion-based). |
| `VideoThumb` | 16:9 looping placeholder with play overlay. Auto-pauses off-screen. |
| `VideoModal` | Full-screen video dialog. Esc / click-out close. Plays Vimeo share URLs (iframe) and direct MP4s (with a buffer bar). |
| `Eyebrow` | Mono uppercase label. `tone` and `color` props for variants. |
| `SectionHeader` | `Eyebrow` + headline + optional side slot. |
| `Confirmation` | Terminal "done" screen — title + detail + a single Done button. |

### Components — forms & kiosk chrome

| Export | Description |
|---|---|
| `SignaturePad` | Canvas signature island; serialises each stroke to a PNG data-URL in a hidden input for server-action forms. |
| `ConfirmModal` | Portal-to-body confirm dialog (not `window.confirm`). Click-out + Escape cancel. |
| `ErrorBox` | Inline red error banner for forms. |
| `StepDots` | Multi-step form progress indicator (`steps`/`total`/`name`). |
| `FormActions` | Stacked full-width Continue + Back actions for kiosk forms. |
| `ThemeToggle` | Dark/light pill that flips `data-theme` via `applyTheme`; optional `onToggle` to broadcast. |

### Components — landing

| Export | Description |
|---|---|
| `PageShell` | Top-padded container that clears the floating navbar. |
| `PageHero` | Hero section frame with optional `Grainient` background. Optional `adaptive` swaps in the GPU-safe `AnimatedGradient`. |
| `Section` | Body section spacing wrapper. |
| `Card` | Bordered elevated card. |
| `StatGrid` | Stat grid. |
| `BackLink` | "← Back" mono link. |
| `SiteHeader` | Floating navbar with logo, nav links, scroll-aware styling. Optional `nav`, `cta` (pass `null` to hide), `subtitle`, `homeHref`, `inFlow` — all default to the standard PT Blink chrome. |
| `SiteFooter` | Footer with brand logo. Expects `/brand/blinklogo-dark.svg` in `public/`. |
| `Hero` | Landing hero composition (Eyebrow + headline + stats). |
| `SectionVideo` | Video gallery section block with `VideoModal` integration. |
| `SectionSlideshow` | Numbered-bullet slideshow block with `ScrollReveal`. |
| `SectionPlatformCta` | "Launch the platform" CTA card with `Grainient` background. |
| `SectionContact` | Contact CTA section with link list. |

### Animation primitives (react-bits)

| Export | Description |
|---|---|
| `Aurora` | WebGL aurora background (requires `ogl`). |
| `BlurText` | Per-word blur-in entrance. |
| `CountUp` | Numeric count-up animation. |
| `GradientText` | Animated gradient text. |
| `Grainient` | WebGL grainy gradient background (requires `ogl`). |
| `Magnet` | Magnetic cursor-attract effect. |
| `ScrollReveal` | Scroll-triggered reveal wrapper. |
| `ShinyText` | Shiny shimmer text. |
| `SplitText` | GSAP per-character split animation (requires `gsap`, `@gsap/react`). |
| `TiltedCard` | 3D tilt-on-hover card. |
| `AnimatedGradient` | GPU-adaptive `Grainient`: WebGL grain on capable hardware, animated CSS-blob wash on low-tier GPUs. |

### Hooks

| Export | Description |
|---|---|
| `useScrolled(threshold = 12)` | Boolean — true when window scrollY exceeds threshold. |
| `useGPUCapability()` | `"high" \| "low" \| null` — cached WebGL renderer probe (null while detecting). |
| `useAutoRefresh(intervalMs)` | Calls `router.refresh()` on an interval; clears on unmount. |

### Utilities

| Export | Description |
|---|---|
| `displayClassForLength(text, sizes?)` | Returns a length-aware `text-display-*` class for the given string. |
| `isVimeo(url)` | True when `url` points at Vimeo (share or player URL). |
| `toVimeoEmbed(url, opts?)` | Converts a Vimeo share URL to a `player.vimeo.com` embed URL (or `null`). |

### Types

| Export | Description |
|---|---|
| `DeckSection`, `DeckSlide` | `SlideDeck` content shape. |
| `VideoModalItem` | `VideoModal` content shape. |

Section component props (`Accent`, `Video`, `Slide`, `Cta`) are NOT exported as named types — construct matching objects structurally in the consuming app.

## Caveats

- **`"use client"` on the entire barrel.** The bundled `dist/index.js` is marked `"use client"` so all exports work in App Router server contexts. Pure-server components (e.g., `Eyebrow`, `Card`) still render correctly but run in the client bundle when imported via `@ptblink/ui`. If you need them as RSC, copy the source directly.
- **Branded assets are bundled.** From `0.1.3` onward, `icon-128.png` and `blinklogo-dark.svg` ship inside the package and are consumed directly by `SiteHeader` / `SiteFooter` — no `public/brand/` files needed in the consuming app. Reuse them anywhere with `import url from "@ptblink/ui/brand/icon-128.png"` / `... /blinklogo-dark.svg"`.
- **Tailwind v4 only.** Tokens live in a `@theme` block inside `@ptblink/ui/styles.css`. There is no v3 compatibility build.
