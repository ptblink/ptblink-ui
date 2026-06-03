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

(Surface table — filled in during Task 13.)
