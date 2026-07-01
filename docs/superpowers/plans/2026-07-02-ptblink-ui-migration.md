# @ptblink/ui Migration (techcentre → package → demo → consume-back) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote every reusable component the techcentre app grew into the `@ptblink/ui` package (with demo pages), publish 0.6.0, then consume it back in techcentre and delete the local copies — including retiring the three forks (`Slide`, `PageHero`, `VideoPlayerModal`) and the `TcSiteHeader` override.

**Architecture:** The root cause of all three forks is that the library's `Grainient` has no GPU-adaptive fallback. So the foundation task lands `useGPUCapability` + `AnimatedGradient` (Grainient + CSS-blob fallback) in the library first; then `Slide` and `PageHero` reconcile by using `AnimatedGradient` internally, and `VideoModal` gains Vimeo + buffer support. Every change to an EXISTING export is strictly additive (new optional props, defaults preserve today's behavior) so the demo and `ptb-platform-website` consumers are unaffected. One publish (0.5.4 → 0.6.0) sits between the library work and the techcentre consume-back.

**Tech Stack:** Next 15/16, React 19, Tailwind v4, `tsup` (ESM, dts), `motion`/`gsap`/`ogl` (peer deps), pnpm (lib + demo), npm (techcentre).

## Global Constraints

- **Peer-deps only.** `react`, `react-dom`, `next`, `tailwindcss`, `motion`, `gsap`, `@gsap/react`, `ogl` are externalized in `tsup.config.ts`. Do NOT add runtime dependencies. Do NOT add a test framework or any new library to `ptblink-ui` (it has none — verification is `typecheck` + `build` + demo render).
- **No per-file `"use client"`** on plain components — the barrel injects `"use client";` at build (tsup `onSuccess`). Only WebGL/hook-driven files that are imported directly as modules keep their own `"use client"` (e.g. `Grainient`, and `AnimatedGradient` which uses `useEffect`/WebGL).
- **Theme colors via CSS variables only** — `bg-[var(--color-bg)]`, `text-[var(--color-ink)]`, `border-[var(--color-line)]`, accent `var(--color-brand)`. Never hardcode hex for chrome. Literal palette hex is allowed only where it's data passed in by the caller (e.g. Grainient `colors` tuples).
- **Additive-only on existing exports.** `Slide`, `PageHero`, `VideoModal`, `SiteHeader` keep every current prop working with identical default behavior. New props are optional.
- **Literal transcription when moving code.** When a file moves techcentre → library, copy it verbatim; change ONLY import specifiers (`@/lib/...`/relative → library-relative) and drop `"use client"` where the convention says so. No renames of internals, no "while I'm here" refactors, no silent bug fixes.
- **Version:** bump `ptblink-ui/package.json` `0.5.4` → `0.6.0`. Single publish. Auth is already configured (`npm whoami` → `maxou27`); confirm scope publish rights with `npm publish --dry-run` before the real publish.
- **No workspaces / no file: links.** techcentre consumes the PUBLISHED npm version (`@ptblink/ui@^0.6.0`).
- **Repos:**
  - Library source: `/Users/maxg/Documents/GitHub/ptb/ptblink-ui` (pnpm)
  - Demo: `/Users/maxg/Documents/GitHub/ptb/ptblink-ui-demo` (pnpm)
  - Consumer: `/Users/maxg/Documents/GitHub/ptb/ptb-platform-techcentre` (npm)
- **Per-task verification cycle (no unit test framework):**
  1. `cd ptblink-ui && pnpm typecheck` → 0 errors
  2. `cd ptblink-ui && pnpm build` → tsup succeeds, `dist/index.d.ts` contains the new export
  3. demo: add the page, `cd ptblink-ui-demo && pnpm typecheck`, and (for visual tasks) load the page in the browser at iPad 820×1180 + laptop 1440×900
  4. commit
- **Branch:** do all library work on a branch `feat/migrate-techcentre-primitives` in `ptblink-ui`; demo work on `feat/migrate-techcentre-primitives` in `ptblink-ui-demo`; consume-back on `feat/consume-ui-0.6.0` in techcentre.

---

## File Structure

**Library (`ptblink-ui/src/`):**
- `hooks/useGPUCapability.ts` — NEW. GPU tier detection hook (moved from techcentre `lib/`).
- `hooks/useAutoRefresh.ts` — NEW. Interval `router.refresh()` hook (extracted from techcentre `AutoRefresh`).
- `react-bits/AnimatedGradient.tsx` — NEW. GPU-adaptive Grainient + CSS-blob fallback (`"use client"`).
- `components/SignaturePad.tsx` — NEW. Canvas signature island.
- `components/ConfirmModal.tsx` — NEW. Portal confirm dialog.
- `components/ErrorBox.tsx` — NEW. Inline error banner.
- `components/Confirmation.tsx` — NEW. Terminal "done" screen.
- `components/StepDots.tsx` — NEW. Registration/step progress indicator (from `RegProgress`).
- `components/FormActions.tsx` — NEW. Stacked full-width Continue/Back buttons (from `RegButtons`).
- `components/ThemeToggle.tsx` — NEW. Light/Dark toggle button (extracted from `StaffControls`).
- `components/Slide.tsx` — MODIFY (additive: `adaptive`, `themeOverride`, `subtle`, `underlay`).
- `components/PageHero.tsx` — MODIFY (additive: `adaptive`).
- `components/VideoModal.tsx` — MODIFY (additive: Vimeo support + buffer bar; accept bare `src`/`title`).
- `components/SiteHeader.tsx` — MODIFY (additive: `nav`, `cta`, `subtitle`, `homeHref` props with current defaults).
- `utils/video.ts` — NEW module OR fold into VideoModal: `isVimeo`, `toVimeoEmbed` (from techcentre `lib/video.ts`).
- `index.ts` — MODIFY (add all new exports).

**Demo (`ptblink-ui-demo/`):** one `app/<category>/<kebab>/page.tsx` per new export, each registered in `components/Sidebar.tsx` `groups`.

**techcentre (consume-back):** delete locals, swap imports, rebuild `StaffControls`/`RegShell`/`WorldDeck`/`DmiSlide`/`KioskScreen`/staff layout on library pieces.

---

## PHASE 1 — Foundation: GPU-adaptive gradient (library)

### Task 1: `useGPUCapability` hook

**Files:**
- Create: `ptblink-ui/src/hooks/useGPUCapability.ts`
- Modify: `ptblink-ui/src/index.ts`
- Source of truth to transcribe: `ptb-platform-techcentre/lib/useGPUCapability.ts`

**Interfaces:**
- Produces: `useGPUCapability(): "high" | "low"` (module-level cached WebGL renderer probe; SSR-safe — returns `"high"` until mounted).

- [ ] **Step 1: Transcribe the hook verbatim.** Copy `ptb-platform-techcentre/lib/useGPUCapability.ts` to `ptblink-ui/src/hooks/useGPUCapability.ts` byte-for-byte. Change nothing except: if it imports anything via `@/`, rewrite to a relative path. Keep its `"use client"` if present (it's a hook using `useState`/`useEffect`).

- [ ] **Step 2: Export it.** In `ptblink-ui/src/index.ts`, under the `// Hooks` group, add:
```ts
export { useGPUCapability } from "./hooks/useGPUCapability";
```

- [ ] **Step 3: Typecheck.** Run: `cd ptblink-ui && pnpm typecheck` — Expected: 0 errors.

- [ ] **Step 4: Build.** Run: `cd ptblink-ui && pnpm build` — Expected: tsup success; `grep useGPUCapability dist/index.d.ts` prints the declaration.

- [ ] **Step 5: Commit.**
```bash
cd ptblink-ui && git add src/hooks/useGPUCapability.ts src/index.ts && git commit -m "feat: add useGPUCapability hook (from techcentre)"
```

---

### Task 2: `AnimatedGradient` component + demo

**Files:**
- Create: `ptblink-ui/src/react-bits/AnimatedGradient.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/react-bits/animated-gradient/page.tsx`
- Modify demo nav: `ptblink-ui-demo/components/Sidebar.tsx`
- Source to transcribe: `ptb-platform-techcentre/app/_components/AnimatedGradient.tsx`

**Interfaces:**
- Consumes: `Grainient` (library), `useGPUCapability` (Task 1).
- Produces: `AnimatedGradient` default export with props `{ color1: string; color2: string; color3: string; subtle?: boolean }`. On `"high"` GPU renders `Grainient` with the same tuning constants Slide/PageHero use; on `"low"` renders the CSS-blob fallback. Absolutely positioned to fill its parent (`absolute inset-0`).

- [ ] **Step 1: Transcribe the component.** Copy `ptb-platform-techcentre/app/_components/AnimatedGradient.tsx` to `ptblink-ui/src/react-bits/AnimatedGradient.tsx`. Change imports: `import { Grainient } from "@ptblink/ui"` → `import Grainient from "./Grainient"`; `import { useGPUCapability } from "@/lib/useGPUCapability"` → `import { useGPUCapability } from "../hooks/useGPUCapability"`. Keep `"use client"`. Keep the CSS-blob markup and the Grainient tuning constants exactly as-is.

- [ ] **Step 2: Verify the CSS-blob fallback styles exist in the library.** The fallback uses `.blob-1/.blob-2/.blob-3` animation classes. Run: `grep -rn "blob-1\|@keyframes" ptblink-ui/src/styles/` — if MISSING, copy the `.blob-*` rules and their `@keyframes` from `ptb-platform-techcentre/app/globals.css` into `ptblink-ui/src/styles/utilities.css` verbatim. (Check techcentre globals: `grep -n "blob" ptb-platform-techcentre/app/globals.css`.)

- [ ] **Step 3: Export it.** In `ptblink-ui/src/index.ts`, under `// react-bits primitives`, add:
```ts
export { default as AnimatedGradient } from "./react-bits/AnimatedGradient";
```

- [ ] **Step 4: Typecheck + build.** Run: `cd ptblink-ui && pnpm typecheck && pnpm build` — Expected: 0 errors; `grep AnimatedGradient dist/index.d.ts` prints the declaration.

- [ ] **Step 5: Link the fresh build into the demo.** The demo consumes `@ptblink/ui` via its `node_modules`. Run: `cd ptblink-ui-demo && pnpm add "@ptblink/ui@link:../ptblink-ui"` IF the demo isn't already linked; otherwise (already `file:`/`link:`) just ensure `pnpm install` picks up the new `dist`. Confirm: `grep AnimatedGradient node_modules/@ptblink/ui/dist/index.d.ts`.

- [ ] **Step 6: Write the demo page.**
```tsx
// ptblink-ui-demo/app/react-bits/animated-gradient/page.tsx
import { AnimatedGradient } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function AnimatedGradientDemo() {
  return (
    <DemoFrame
      category="react-bits"
      name="AnimatedGradient"
      description="GPU-adaptive Grainient: the full WebGL grain on capable hardware, an animated CSS-blob wash on low-tier GPUs (Intel HD/UHD, Mesa). Drop-in background for any relative/absolute container."
      code={`import { AnimatedGradient } from "@ptblink/ui";

<div className="relative h-80 overflow-hidden rounded-2xl">
  <AnimatedGradient color1="#050608" color2="#2c90cf" color3="#15181c" />
</div>`}
    >
      <div className="relative h-80 overflow-hidden rounded-2xl border border-[var(--color-line)]">
        <AnimatedGradient color1="#050608" color2="#2c90cf" color3="#15181c" />
      </div>
    </DemoFrame>
  );
}
```

- [ ] **Step 7: Register in the sidebar.** In `ptblink-ui-demo/components/Sidebar.tsx`, add to the `react-bits` group's `items` array:
```ts
{ href: "/react-bits/animated-gradient", label: "AnimatedGradient", note: "GPU-adaptive" },
```

- [ ] **Step 8: Demo typecheck + visual.** Run: `cd ptblink-ui-demo && pnpm typecheck`. Then `pnpm dev`, open `/react-bits/animated-gradient`, confirm the gradient renders (screenshot).

- [ ] **Step 9: Commit both repos.**
```bash
cd ptblink-ui && git add -A && git commit -m "feat: add AnimatedGradient (GPU-adaptive Grainient, from techcentre)"
cd ../ptblink-ui-demo && git add -A && git commit -m "docs: AnimatedGradient demo page"
```

---

## PHASE 2 — Tier 1 standalone primitives (library)

### Task 3: `SignaturePad` component + demo

**Files:**
- Create: `ptblink-ui/src/components/SignaturePad.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/forms/signature-pad/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source to transcribe: `ptb-platform-techcentre/app/(kiosk)/check-in/sign/SignaturePad.tsx`

**Interfaces:**
- Produces: `SignaturePad` default export, props `{ name: string }`. Renders a canvas; on each stroke-end serialises to a PNG data-URL into a hidden `<input name={name}>` so a surrounding server-action form submits the image. Uses only React (`useRef`/`useEffect`/`useState`). Keeps its own `"use client"`.

- [ ] **Step 1: Transcribe verbatim.** Copy the file to `ptblink-ui/src/components/SignaturePad.tsx` unchanged (it imports only from `react`). Keep `"use client"`.

- [ ] **Step 2: Export.** `ptblink-ui/src/index.ts` under a `// Components — forms` group:
```ts
export { default as SignaturePad } from "./components/SignaturePad";
```

- [ ] **Step 3: Typecheck + build.** `cd ptblink-ui && pnpm typecheck && pnpm build` — 0 errors; `grep SignaturePad dist/index.d.ts`.

- [ ] **Step 4: Demo page.**
```tsx
// ptblink-ui-demo/app/forms/signature-pad/page.tsx
import { SignaturePad } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function SignaturePadDemo() {
  return (
    <DemoFrame
      category="Forms"
      name="SignaturePad"
      description="A canvas the visitor signs on (iPad). Each stroke serialises to a PNG data-URL in a hidden input, so the surrounding server-action form submits the image with no client router state."
      code={`import { SignaturePad } from "@ptblink/ui";

<form action={submitAction}>
  <SignaturePad name="signature" />
  <button type="submit">Sign</button>
</form>`}
    >
      <form className="max-w-lg">
        <SignaturePad name="signature" />
      </form>
    </DemoFrame>
  );
}
```

- [ ] **Step 5: Register sidebar.** Add to the `forms` group in `Sidebar.tsx`:
```ts
{ href: "/forms/signature-pad", label: "SignaturePad", note: "canvas" },
```

- [ ] **Step 6: Demo typecheck + visual.** `cd ptblink-ui-demo && pnpm typecheck`; load `/forms/signature-pad`, draw a stroke, confirm the hidden input value updates (DevTools).

- [ ] **Step 7: Commit both repos** (messages: `feat: add SignaturePad (from techcentre)` / `docs: SignaturePad demo page`).

---

### Task 4: `ConfirmModal` component + demo

**Files:**
- Create: `ptblink-ui/src/components/ConfirmModal.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/forms/confirm-modal/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source to transcribe: `ptb-platform-techcentre/app/staff/_components/ConfirmModal.tsx`

**Interfaces:**
- Consumes: `Button` (library).
- Produces: `ConfirmModal` default export, props `{ open: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string; busy?: boolean; onConfirm: () => void; onCancel: () => void }`. Portals to `document.body`; click-out + Escape cancel. Keeps `"use client"` (uses `createPortal` + `useEffect`).

- [ ] **Step 1: Transcribe.** Copy the file to `ptblink-ui/src/components/ConfirmModal.tsx`. Change `import { Button } from "@ptblink/ui"` → `import Button from "./Button"`. Keep everything else (portal, key handling, markup) verbatim, including `"use client"`.

- [ ] **Step 2: Export.** In `src/index.ts` under `// Components — forms` (or a `// Components — overlays` group):
```ts
export { default as ConfirmModal } from "./components/ConfirmModal";
```

- [ ] **Step 3: Typecheck + build.** `pnpm typecheck && pnpm build`; `grep ConfirmModal dist/index.d.ts`.

- [ ] **Step 4: Demo page** (a client page with local state to toggle `open`):
```tsx
// ptblink-ui-demo/app/forms/confirm-modal/page.tsx
"use client";
import { useState } from "react";
import { Button, ConfirmModal } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function ConfirmModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoFrame
      category="Forms"
      name="ConfirmModal"
      description="A portal-to-body confirm dialog (not window.confirm). Click-out or Escape cancels. Use it to guard easy-to-mistap actions."
      code={`import { ConfirmModal } from "@ptblink/ui";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete…</Button>
<ConfirmModal
  open={open}
  title="Delete this?"
  message="This can't be undone."
  confirmLabel="Delete"
  onConfirm={() => setOpen(false)}
  onCancel={() => setOpen(false)}
/>`}
    >
      <Button onClick={() => setOpen(true)}>Open confirm…</Button>
      <ConfirmModal
        open={open}
        title="Delete this?"
        message="This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </DemoFrame>
  );
}
```

- [ ] **Step 5: Register sidebar.** `{ href: "/forms/confirm-modal", label: "ConfirmModal", note: "portal" },`

- [ ] **Step 6: Demo typecheck + visual.** Open the dialog, confirm click-out + Escape cancel.

- [ ] **Step 7: Commit both repos.**

---

## PHASE 3 — Tier 2 patterns (library)

### Task 5: `ErrorBox` + `Confirmation` + demo

**Files:**
- Create: `ptblink-ui/src/components/ErrorBox.tsx`, `ptblink-ui/src/components/Confirmation.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/forms/error-box/page.tsx`, `ptblink-ui-demo/app/kiosk/confirmation/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source: `ptb-platform-techcentre/app/_components/kiosk-ui.tsx` (exports `ErrorBox`, `Confirmation`, `EmailForm`).

**Interfaces:**
- Consumes: `Button` (Confirmation).
- Produces: `ErrorBox` (`{ message: string }`) and `Confirmation` (`{ title: string; detail?: string; cta?: string; href?: string }`, default cta "Done"/href "/"). Both server-safe (no client hooks). NOTE: `EmailForm` is techcentre-flow-specific (submits to a check-in server action / route) — do NOT migrate it; leave it in techcentre.

- [ ] **Step 1: Split ErrorBox out.** Create `ptblink-ui/src/components/ErrorBox.tsx` containing exactly the `ErrorBox` function from `kiosk-ui.tsx` (verbatim body), as a default export. No `"use client"`.

- [ ] **Step 2: Split Confirmation out.** Create `ptblink-ui/src/components/Confirmation.tsx` containing exactly the `Confirmation` function from `kiosk-ui.tsx` (verbatim body), as a default export. Change any `import { Button } from "@ptblink/ui"` → `import Button from "./Button"`. No `"use client"`.

- [ ] **Step 3: Export both.** In `src/index.ts`:
```ts
export { default as ErrorBox } from "./components/ErrorBox";
export { default as Confirmation } from "./components/Confirmation";
```

- [ ] **Step 4: Typecheck + build.** `pnpm typecheck && pnpm build`; grep both in `dist/index.d.ts`.

- [ ] **Step 5: Demo — ErrorBox.**
```tsx
// ptblink-ui-demo/app/forms/error-box/page.tsx
import { ErrorBox } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function ErrorBoxDemo() {
  return (
    <DemoFrame
      category="Forms"
      name="ErrorBox"
      description="Inline error banner for kiosk forms — red hairline, tinted background, small body text."
      code={`import { ErrorBox } from "@ptblink/ui";

<ErrorBox message="Something went wrong — please ask at the front desk." />`}
    >
      <ErrorBox message="Something went wrong — please ask at the front desk." />
    </DemoFrame>
  );
}
```

- [ ] **Step 6: Demo — Confirmation.**
```tsx
// ptblink-ui-demo/app/kiosk/confirmation/page.tsx
import { Confirmation } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function ConfirmationDemo() {
  return (
    <DemoFrame
      category="Kiosk"
      name="Confirmation"
      description="Terminal 'done' screen — big centred title, optional detail, a single Done button that returns home."
      code={`import { Confirmation } from "@ptblink/ui";

<Confirmation title="Checked out." detail="Thanks for visiting the technology centre." />`}
    >
      <Confirmation title="Checked out." detail="Thanks for visiting the technology centre." />
    </DemoFrame>
  );
}
```

- [ ] **Step 7: Register sidebar.** Add `{ href: "/forms/error-box", label: "ErrorBox" }` to `forms`; `{ href: "/kiosk/confirmation", label: "Confirmation" }` to `kiosk`.

- [ ] **Step 8: Demo typecheck + visual.** Both pages render.

- [ ] **Step 9: Commit both repos.**

---

### Task 6: `StepDots` (from RegProgress) + `FormActions` (from RegButtons) + demo

**Files:**
- Create: `ptblink-ui/src/components/StepDots.tsx`, `ptblink-ui/src/components/FormActions.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/forms/step-dots/page.tsx`, `ptblink-ui-demo/app/forms/form-actions/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source: `ptb-platform-techcentre/app/(kiosk)/check-in/_components/RegProgress.tsx` and `RegButtons.tsx`

**Interfaces:**
- Consumes: `Button` (FormActions).
- Produces:
  - `StepDots` — props `{ step: number; total?: number; name?: string; label?: string }`. Renders the "Step X of N" indicator. Read `RegProgress.tsx` first; generalise its hardcoded `total` (4) into a prop defaulting to the current value, and its "Registering · {name}" copy into an optional `label`/`name` prop pair (default preserves current text). This is the ONE component that is generalised rather than transcribed verbatim — because its copy/step-count are techcentre-specific.
  - `FormActions` — props `{ continueLabel: string; backHref: string; backLabel?: string }`. Stacked full-width submit + secondary Back, both `size="md"`, matching `RegButtons` exactly.

- [ ] **Step 1: Read the two sources.** Read `RegProgress.tsx` and `RegButtons.tsx` in full to capture exact markup/classes.

- [ ] **Step 2: Write `StepDots.tsx`.** Default export. Signature `{ step, total = 4, name, label = "Registering" }`. Reproduce RegProgress markup; where it hardcodes `of 4`, use `{total}`; where it hardcodes `Registering · {name} · Step {step} of 4`, compose from `label`/`name`/`step`/`total`. No `"use client"` (pure render).

- [ ] **Step 3: Write `FormActions.tsx`.** Default export. Reproduce `RegButtons` markup verbatim, replacing its hardcoded `backHref`/`continueLabel` usage with the props. Change `import { Button } from "@ptblink/ui"` → `import Button from "./Button"`. Keep `size="md"`, `arrow`, `className="w-full"`, secondary Back exactly.

- [ ] **Step 4: Export both.**
```ts
export { default as StepDots } from "./components/StepDots";
export { default as FormActions } from "./components/FormActions";
```

- [ ] **Step 5: Typecheck + build.** grep both in dts.

- [ ] **Step 6: Demo — StepDots.**
```tsx
// ptblink-ui-demo/app/forms/step-dots/page.tsx
import { StepDots } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function StepDotsDemo() {
  return (
    <DemoFrame
      category="Forms"
      name="StepDots"
      description="Multi-step form progress indicator. Defaults to a 4-step registration label; override total/label/name for other flows."
      code={`import { StepDots } from "@ptblink/ui";

<StepDots step={2} total={4} name="Ada Lovelace" />`}
    >
      <div className="space-y-3">
        <StepDots step={1} total={4} name="Ada Lovelace" />
        <StepDots step={3} total={4} name="Ada Lovelace" />
      </div>
    </DemoFrame>
  );
}
```

- [ ] **Step 7: Demo — FormActions.**
```tsx
// ptblink-ui-demo/app/forms/form-actions/page.tsx
import { FormActions } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function FormActionsDemo() {
  return (
    <DemoFrame
      category="Forms"
      name="FormActions"
      description="Stacked, equal-width Continue + Back actions for kiosk forms. Continue is a submit; Back is a secondary link. Buttons stay at size md so form copy never shouts."
      code={`import { FormActions } from "@ptblink/ui";

<form action={next}>
  {/* fields */}
  <FormActions continueLabel="Continue to signature" backHref="/check-in/role" />
</form>`}
    >
      <form className="max-w-lg">
        <FormActions continueLabel="Continue to signature" backHref="#" />
      </form>
    </DemoFrame>
  );
}
```

- [ ] **Step 8: Register sidebar.** `{ href: "/forms/step-dots", label: "StepDots" }`, `{ href: "/forms/form-actions", label: "FormActions" }` in `forms`.

- [ ] **Step 9: Demo typecheck + visual.**

- [ ] **Step 10: Commit both repos.**

---

### Task 7: `useAutoRefresh` hook + demo

**Files:**
- Create: `ptblink-ui/src/hooks/useAutoRefresh.ts`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/hooks/use-auto-refresh/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source: `ptb-platform-techcentre/app/staff/_components/AutoRefresh.tsx`

**Interfaces:**
- Consumes: `useRouter` from `next/navigation`.
- Produces: `useAutoRefresh(intervalMs: number): void` — calls `router.refresh()` on an interval; clears on unmount. `AutoRefresh` was a component wrapping this; expose the hook (cleaner, reusable). Keep `"use client"`.

- [ ] **Step 1: Read `AutoRefresh.tsx`.** Capture the exact interval/cleanup logic.

- [ ] **Step 2: Write the hook.** `ptblink-ui/src/hooks/useAutoRefresh.ts`, `"use client"`, `import { useRouter } from "next/navigation"`, `useEffect` sets `setInterval(() => router.refresh(), intervalMs)` and clears on unmount. Body transcribed from the component's effect.

- [ ] **Step 3: Export.** `export { useAutoRefresh } from "./hooks/useAutoRefresh";`

- [ ] **Step 4: Typecheck + build.** grep in dts.

- [ ] **Step 5: Demo page.**
```tsx
// ptblink-ui-demo/app/hooks/use-auto-refresh/page.tsx
"use client";
import { useAutoRefresh } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function UseAutoRefreshDemo() {
  useAutoRefresh(5000);
  return (
    <DemoFrame
      category="Hooks"
      name="useAutoRefresh"
      description="Calls router.refresh() on an interval so a server-rendered dashboard re-fetches without a full reload. Clears on unmount."
      code={`import { useAutoRefresh } from "@ptblink/ui";

export default function Dashboard() {
  useAutoRefresh(5000); // re-render server data every 5s
  return <>{/* … */}</>;
}`}
    >
      <p className="text-body-sm text-[var(--color-ink-dim)]">This page calls <code>useAutoRefresh(5000)</code> — it re-runs the server render every 5 seconds.</p>
    </DemoFrame>
  );
}
```

- [ ] **Step 6: Register sidebar.** `{ href: "/hooks/use-auto-refresh", label: "useAutoRefresh" }` in `hooks`.

- [ ] **Step 7: Demo typecheck.**

- [ ] **Step 8: Commit both repos.**

---

### Task 8: `ThemeToggle` component + demo

**Files:**
- Create: `ptblink-ui/src/components/ThemeToggle.tsx`
- Modify: `ptblink-ui/src/index.ts`
- Create demo: `ptblink-ui-demo/app/forms/theme-toggle/page.tsx`
- Modify: `ptblink-ui-demo/components/Sidebar.tsx`
- Source (reference, not verbatim): `ptb-platform-techcentre/app/staff/_components/StaffControls.tsx`

**Interfaces:**
- Consumes: `applyTheme`, `useThemeName`, `ThemeName` (library theme system).
- Produces: `ThemeToggle` — props `{ onToggle?: (next: ThemeName) => void; className?: string }`. A single pill button that flips `data-theme` locally via `applyTheme` and calls optional `onToggle` (techcentre uses `onToggle` to broadcast the global theme to its Azure endpoint). Does NOT include sign-out or ConfirmModal (those stay app-specific in `StaffControls`). Keeps `"use client"`.

- [ ] **Step 1: Read `StaffControls.tsx`.** Extract only the theme-flip half (compute `nextTheme`, `applyTheme(next)`), and the pill styling (`pillClass`/`barClass` from `./pill`). For the library, inline equivalent classes using CSS vars (do NOT depend on techcentre's `pill.ts`).

- [ ] **Step 2: Write `ThemeToggle.tsx`.**
```tsx
"use client";
import { applyTheme, useThemeName, type ThemeName } from "@ptblink/ui"; // → relative in lib: "../theme" + "../hooks/useThemeName"

export default function ThemeToggle({
  onToggle,
  className = "",
}: {
  onToggle?: (next: ThemeName) => void;
  className?: string;
}) {
  const theme = useThemeName();
  const next: ThemeName = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        onToggle?.(next);
      }}
      className={`rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/80 px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink-dim)] transition hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-ink)] ${className}`}
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
```
(In the library file, replace the `@ptblink/ui` import with `import { applyTheme, type ThemeName } from "../theme";` and `import { useThemeName } from "../hooks/useThemeName";`.)

- [ ] **Step 3: Export.** `export { default as ThemeToggle } from "./components/ThemeToggle";`

- [ ] **Step 4: Typecheck + build.** grep in dts.

- [ ] **Step 5: Demo page.**
```tsx
// ptblink-ui-demo/app/forms/theme-toggle/page.tsx
"use client";
import { ThemeToggle } from "@ptblink/ui";
import DemoFrame from "@/components/DemoFrame";

export default function ThemeToggleDemo() {
  return (
    <DemoFrame
      category="Forms"
      name="ThemeToggle"
      description="Flips the app between dark and light by toggling data-theme via applyTheme. Pass onToggle to also broadcast the change (e.g. persist a global theme server-side)."
      code={`import { ThemeToggle } from "@ptblink/ui";

<ThemeToggle onToggle={(next) => console.log("theme →", next)} />`}
    >
      <ThemeToggle />
    </DemoFrame>
  );
}
```

- [ ] **Step 6: Register sidebar.** `{ href: "/forms/theme-toggle", label: "ThemeToggle" }` in `forms`.

- [ ] **Step 7: Demo typecheck + visual.** Click toggles the whole demo between dark/light.

- [ ] **Step 8: Commit both repos.**

---

## PHASE 4 — Tier 3 additive reconciliations (library)

### Task 9: `Slide` — add `adaptive`, `themeOverride`, `subtle`, `underlay`

**Files:**
- Modify: `ptblink-ui/src/components/Slide.tsx`
- Modify demo: `ptblink-ui-demo/app/kiosk/slide/page.tsx` (add a note/example for the new props)
- Reference for behavior: `ptb-platform-techcentre/app/(screens)/_components/Slide.tsx`

**Interfaces:**
- Consumes: `AnimatedGradient` (Task 2), `useThemeName`, `grainientColorsForTheme`.
- Produces: `Slide` with EXISTING props unchanged plus optional `{ adaptive?: boolean; themeOverride?: ThemeName; subtle?: boolean; underlay?: React.ReactNode }`. Defaults: `adaptive=false` (keeps today's direct `Grainient`), `themeOverride` undefined (uses app theme), `subtle=false`, `underlay=undefined`. When `adaptive` is true, render `AnimatedGradient` (GPU fallback) instead of `Grainient`. When `themeOverride` set, use it instead of `useThemeName()`. When `subtle`, use the softer light veil. `underlay` renders behind content, above the gradient, `pointer-events-none`.

- [ ] **Step 1: Rewrite `Slide.tsx` additively.** Starting from the current file (read above), apply:
```tsx
"use client";
import Grainient from "../react-bits/Grainient";
import AnimatedGradient from "../react-bits/AnimatedGradient";
import { useThemeName } from "../hooks/useThemeName";
import { grainientColorsForTheme } from "../theme";
import type { ThemeName } from "../theme";

export default function Slide({
  children,
  colors,
  align = "center",
  className = "",
  adaptive = false,
  themeOverride,
  subtle = false,
  underlay,
}: {
  children: React.ReactNode;
  colors?: [string, string, string];
  align?: "center" | "start";
  className?: string;
  adaptive?: boolean;
  themeOverride?: ThemeName;
  subtle?: boolean;
  underlay?: React.ReactNode;
}) {
  const appTheme = useThemeName();
  const theme = themeOverride ?? appTheme;
  const themed = colors ? grainientColorsForTheme(colors, theme) : undefined;
  const justify = align === "center" ? "justify-center" : "justify-start";
  // Theme-aware veil (from techcentre Slide): keeps text legible over the wash.
  const veil =
    theme === "light"
      ? subtle
        ? "linear-gradient(to bottom, rgba(245,246,248,0.10), transparent 45%, rgba(245,246,248,0.40))"
        : "linear-gradient(to bottom, rgba(245,246,248,0.20), transparent 45%, rgba(245,246,248,0.55))"
      : "linear-gradient(to bottom, rgba(5,6,8,0.30), transparent, rgba(5,6,8,0.60))";
  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden flex">
      {themed && (
        <div className="absolute inset-0 -z-10">
          {adaptive ? (
            <AnimatedGradient color1={themed[0]} color2={themed[1]} color3={themed[2]} subtle={subtle} />
          ) : (
            <Grainient
              color1={themed[0]}
              color2={themed[1]}
              color3={themed[2]}
              timeSpeed={0.13}
              warpStrength={1.0}
              warpAmplitude={60}
              grainAmount={0.18}
              grainAnimated
              contrast={1.4}
              saturation={0.85}
              zoom={1.05}
            />
          )}
          <div className="absolute inset-0" style={{ backgroundImage: veil }} />
        </div>
      )}
      {underlay && <div className="absolute inset-0 -z-[5] pointer-events-none">{underlay}</div>}
      <div
        className={`relative flex-1 flex flex-col ${justify} mx-auto max-w-7xl w-full pad-slide-x pad-slide-y min-h-0 overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
```
NOTE: the current file's veil is `from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]/60` (a Tailwind class). The dark branch above reproduces the SAME visual via inline gradient so both branches share one code path. Verify the dark, non-subtle rendering is visually identical to before (screenshot compare in demo `/kiosk/slide`).

- [ ] **Step 2: `Slide` also needs `"use client"` now?** It already uses `useThemeName` (a hook) — it was relying on the barrel injection. Adding `AnimatedGradient` (which is `"use client"`) as a child is fine. Keep the added `"use client"` at top for safety (Grainient/AnimatedGradient are client). Confirm the barrel still builds.

- [ ] **Step 3: Typecheck + build.** `pnpm typecheck && pnpm build`. Confirm `dist/index.d.ts` shows the 4 new optional props on `Slide`.

- [ ] **Step 4: Demo.** In `ptblink-ui-demo/app/kiosk/slide/page.tsx`, add a second example using `adaptive` + `subtle` + a simple `underlay={<div className="opacity-10">…</div>}`, and a note that `adaptive` swaps the WebGL grain for the GPU-safe fallback. Keep the existing example intact.

- [ ] **Step 5: Visual regression.** `pnpm dev`, open `/kiosk/slide`: the default (non-adaptive, dark) example must look identical to before; the adaptive example must render.

- [ ] **Step 6: Commit both repos** (`feat: Slide gains adaptive/themeOverride/subtle/underlay (additive)`).

---

### Task 10: `PageHero` — add `adaptive`

**Files:**
- Modify: `ptblink-ui/src/components/PageHero.tsx`
- Modify demo: `ptblink-ui-demo/app/landing/page-hero/page.tsx` (if present) or the landing template note.

**Interfaces:**
- Consumes: `AnimatedGradient`.
- Produces: `PageHero` with existing props plus optional `{ adaptive?: boolean }` (default false → today's direct `Grainient`). When true, use `AnimatedGradient`.

- [ ] **Step 1: Edit `PageHero.tsx`.** Add `import AnimatedGradient from "../react-bits/AnimatedGradient";`, add `adaptive = false` to props/type, and wrap the gradient:
```tsx
{adaptive ? (
  <AnimatedGradient color1={themed[0]} color2={themed[1]} color3={themed[2]} />
) : (
  <Grainient color1={themed[0]} color2={themed[1]} color3={themed[2]} timeSpeed={0.13} warpStrength={1.0} warpAmplitude={60} grainAmount={0.18} grainAnimated contrast={1.4} saturation={0.85} zoom={1.05} />
)}
```
Leave the veil `<div>` and container exactly as-is.

- [ ] **Step 2: Typecheck + build.** Confirm `adaptive?` shows on `PageHero` in dts.

- [ ] **Step 3: Demo note.** Add a one-line note to the PageHero/landing demo that `adaptive` enables the GPU-safe fallback. (No new visual needed — behavior identical by default.)

- [ ] **Step 4: Commit both repos.**

---

### Task 11: `VideoModal` — Vimeo support + buffer bar (additive)

**Files:**
- Modify: `ptblink-ui/src/components/VideoModal.tsx`
- Create: `ptblink-ui/src/utils/video.ts` (move `isVimeo`/`toVimeoEmbed`)
- Modify: `ptblink-ui/src/utils.ts` (export the two helpers on the `/utils` subpath) AND `src/index.ts` (optional re-export)
- Modify demo: `ptblink-ui-demo/app/kiosk/video-modal/page.tsx` (add a Vimeo example)
- Reference: `ptb-platform-techcentre/app/(screens)/_components/VideoPlayerModal.tsx`, `ptb-platform-techcentre/lib/video.ts`

**Interfaces:**
- Produces:
  - `VideoModal` — EXISTING `item` prop unchanged. When `item.src` is a Vimeo URL (`isVimeo`), render the `toVimeoEmbed` iframe instead of `<video>` (Vimeo manages its own controls; skip the buffer bar). For non-Vimeo MP4s, ADD a live buffer bar via `requestAnimationFrame` (transcribed from `VideoPlayerModal`). Existing Escape/Delete/Backspace close stays. The library already reads `item.src` and shows a Placeholder badge — keep that.
  - `isVimeo(url: string): boolean` and `toVimeoEmbed(url: string): string` on `@ptblink/ui/utils` (and named re-export from the barrel).

- [ ] **Step 1: Move the helpers.** Read `ptb-platform-techcentre/lib/video.ts`; copy `isVimeo` + `toVimeoEmbed` verbatim into `ptblink-ui/src/utils/video.ts`. Re-export from `ptblink-ui/src/utils.ts`:
```ts
export { isVimeo, toVimeoEmbed } from "./utils/video";
```
And from `src/index.ts` under `// Utils`:
```ts
export { isVimeo, toVimeoEmbed } from "./utils/video";
```

- [ ] **Step 2: Add Vimeo branch to `VideoModal`.** In the media `<div className="relative bg-black aspect-video min-h-0">`, branch:
```tsx
{isVimeo(src) ? (
  <iframe
    src={toVimeoEmbed(src)}
    className="absolute inset-0 h-full w-full"
    allow="autoplay; fullscreen; picture-in-picture"
    allowFullScreen
    title={item.title}
  />
) : (
  <>
    <video ref={videoRef} src={src} autoPlay controls playsInline className="absolute inset-0 h-full w-full object-contain" />
    {/* buffer bar — transcribed from VideoPlayerModal, MP4 only */}
  </>
)}
```

- [ ] **Step 3: Add the buffer bar.** Transcribe the `requestAnimationFrame` buffer-tracking effect + the buffer bar markup from `VideoPlayerModal.tsx` into `VideoModal`, guarded so it only runs for the non-Vimeo `<video>` path. Keep the existing `/api/track` POST and body-scroll lock.

- [ ] **Step 4: Typecheck + build.** Confirm no signature change on `VideoModal` (still `{ item, onClose }`); confirm `isVimeo`/`toVimeoEmbed` in `dist/utils.d.ts`.

- [ ] **Step 5: Demo.** In `ptblink-ui-demo/app/kiosk/video-modal/page.tsx`, add a second trigger that opens the modal with `item={{ title: "Vimeo example", src: "https://vimeo.com/76979871" }}` and confirm the iframe renders; keep the MP4/placeholder example.

- [ ] **Step 6: Visual.** MP4 example shows the buffer bar; Vimeo example shows the iframe; Escape/Backspace close both.

- [ ] **Step 7: Commit both repos.**

---

### Task 12: `SiteHeader` — configurable `nav` / `cta` / `subtitle` / `homeHref` (additive)

**Files:**
- Modify: `ptblink-ui/src/components/SiteHeader.tsx`
- Modify demo: `ptblink-ui-demo/app/landing/site-header/page.tsx` (if present) / landing template
- Reference: `ptb-platform-techcentre/app/_components/TcSiteHeader.tsx`

**Interfaces:**
- Produces: `SiteHeader` with new optional props, ALL defaulting to today's hardcoded values:
```ts
type NavItem = { href: string; label: string };
{
  nav?: NavItem[];            // default: current [Home, Library, Platform, Contact]
  cta?: { href: string; label: string } | null; // default: { href: "/staff/checkin", label: "Check in" }; null hides it
  subtitle?: string;          // default: "Tech Centre"
  homeHref?: string;          // default: "/"
}
```
Existing zero-prop usage renders identically.

- [ ] **Step 1: Parameterise.** Edit `SiteHeader.tsx`: lift the module-level `nav` array to a default constant `DEFAULT_NAV`; accept the props above with those defaults; replace hardcoded `href="/"` (logo) with `homeHref`, the subtitle text `Tech Centre` with `{subtitle}`, the `nav.map` source with the `nav` prop, and the CTA block with a render of `cta` (skip when `cta === null`). Keep all classes and the `isActive`/scroll logic identical.

- [ ] **Step 2: Typecheck + build.** Confirm the 4 optional props on `SiteHeader` in dts; confirm no-prop render path unchanged.

- [ ] **Step 3: Demo.** If a `site-header` demo exists, add an example passing a custom `nav` + `subtitle="Technology Centres"`; else add a short note to the landing template. Keep the default example.

- [ ] **Step 4: Commit both repos.**

---

## PHASE 5 — Publish 0.6.0

### Task 13: Version bump, build, publish

**Files:**
- Modify: `ptblink-ui/package.json` (version)
- Modify: `ptblink-ui/README.md` (append the new exports to any catalogue, if one exists)

- [ ] **Step 1: Confirm the full export surface.** `cd ptblink-ui && pnpm build && grep -E "AnimatedGradient|SignaturePad|ConfirmModal|ErrorBox|Confirmation|StepDots|FormActions|ThemeToggle|useGPUCapability|useAutoRefresh|isVimeo|toVimeoEmbed" dist/index.d.ts` — all present.

- [ ] **Step 2: Bump version.** Set `"version": "0.6.0"` in `package.json`.

- [ ] **Step 3: README.** If `README.md` lists exports, append the 10 new ones + note `Slide`/`PageHero`/`VideoModal`/`SiteHeader` gained additive props. Otherwise skip.

- [ ] **Step 4: Dry-run publish (verify scope rights).** `cd ptblink-ui && npm publish --dry-run --access public` — Expected: packs `@ptblink/ui@0.6.0`, lists `dist/**`, no auth/permission error. If it errors on scope permission, STOP and tell the user (the `maxou27` token may lack `@ptblink` publish rights → needs the `ptblink1` token).

- [ ] **Step 5: Publish.** `cd ptblink-ui && pnpm build && npm publish --access public`. Expected: `+ @ptblink/ui@0.6.0`.

- [ ] **Step 6: Verify on registry.** `npm view @ptblink/ui version` → `0.6.0`.

- [ ] **Step 7: Commit + tag.** `cd ptblink-ui && git add -A && git commit -m "chore: release 0.6.0" && git tag v0.6.0`.

---

## PHASE 6 — Consume back in techcentre

> Do these only AFTER 0.6.0 is on the registry. Branch: `feat/consume-ui-0.6.0`.

### Task 14: Bump the dependency

**Files:** `ptb-platform-techcentre/package.json`

- [ ] **Step 1:** `cd ptb-platform-techcentre && git checkout -b feat/consume-ui-0.6.0`.
- [ ] **Step 2:** Set `@ptblink/ui` to `^0.6.0` in `package.json`, then `npm install`.
- [ ] **Step 3:** Confirm: `grep '"version"' node_modules/@ptblink/ui/package.json` → `0.6.0`; `grep AnimatedGradient node_modules/@ptblink/ui/dist/index.d.ts`.
- [ ] **Step 4:** `npx tsc --noEmit` (baseline — still green before swaps).
- [ ] **Step 5:** Commit (`chore: bump @ptblink/ui to 0.6.0`).

---

### Task 15: Swap AnimatedGradient + useGPUCapability → package

**Files:**
- Delete: `ptb-platform-techcentre/app/_components/AnimatedGradient.tsx`, `ptb-platform-techcentre/lib/useGPUCapability.ts`
- Modify importers: `app/_components/KioskScreen.tsx`, `app/_components/PageHero.tsx`, `app/(screens)/_components/Slide.tsx` (all import `AnimatedGradient` from `@/app/_components/AnimatedGradient`).

- [ ] **Step 1:** In each importer, change `import AnimatedGradient from "@/app/_components/AnimatedGradient"` (or relative) → `import { AnimatedGradient } from "@ptblink/ui"`. Fix prop name only if the library's props differ (they don't — `color1/2/3`, `subtle`).
- [ ] **Step 2:** Delete the two local files.
- [ ] **Step 3:** `grep -rn "useGPUCapability\|_components/AnimatedGradient" app lib` → no matches.
- [ ] **Step 4:** `npx tsc --noEmit` → 0 errors.
- [ ] **Step 5:** Commit (`refactor: use @ptblink/ui AnimatedGradient + useGPUCapability`).

---

### Task 16: Swap the standalone primitives → package

**Files:**
- Delete: `app/staff/_components/ConfirmModal.tsx`, `app/(kiosk)/check-in/sign/SignaturePad.tsx`, `app/staff/_components/AutoRefresh.tsx`, `app/(kiosk)/check-in/_components/RegProgress.tsx`, `app/(kiosk)/check-in/_components/RegButtons.tsx`.
- Modify: `app/_components/kiosk-ui.tsx` (remove `ErrorBox` + `Confirmation`, keep `EmailForm`; re-export the two from the package OR update all importers), and every importer identified in the consumption map.
- Rebuild on library pieces: `app/staff/_components/StaffControls.tsx` (use library `ConfirmModal` + `ThemeToggle`), `app/staff/page.tsx`/`visitors`/`hubspot` (replace `<AutoRefresh intervalMs=… />` with the `useAutoRefresh` hook in a tiny client wrapper, or keep a 3-line local `AutoRefresh` that just calls the hook), `RegShell.tsx` (import `StepDots` for `RegProgress`), `check-in` step pages (import `FormActions` for `RegButtons`, `StepDots` for `RegProgress`).

- [ ] **Step 1: ConfirmModal.** In `StaffControls.tsx`, change the import to `import { ConfirmModal } from "@ptblink/ui"`; delete the local file. `grep -rn "_components/ConfirmModal" app` → none.
- [ ] **Step 2: SignaturePad.** In `app/(kiosk)/check-in/sign/page.tsx`, `import { SignaturePad } from "@ptblink/ui"`; delete the local island. Confirm the server-action form still receives the `signature` field.
- [ ] **Step 3: ErrorBox + Confirmation.** For each importer of `Confirmation` (`check-in/welcome`, `register/done`, `check-out/done`) and `EmailForm`/`ErrorBox`: import `Confirmation`/`ErrorBox` from `@ptblink/ui`; in `kiosk-ui.tsx` remove those two functions but keep `EmailForm` (still exported locally). Update `EmailForm` if it used the now-removed local `ErrorBox` → import from package.
- [ ] **Step 4: RegProgress → StepDots.** In `RegShell.tsx` and `check-in/documents/[key]/page.tsx`, replace `RegProgress` usage with `StepDots` (`import { StepDots } from "@ptblink/ui"`). Map props: `RegProgress step/name` → `StepDots step/name` (total defaults to 4). Delete `RegProgress.tsx`.
- [ ] **Step 5: RegButtons → FormActions.** In the three check-in step pages, replace `RegButtons` with `FormActions` (`import { FormActions } from "@ptblink/ui"`), mapping `backHref`/`continueLabel`. Delete `RegButtons.tsx`.
- [ ] **Step 6: AutoRefresh → useAutoRefresh.** Replace `app/staff/_components/AutoRefresh.tsx` with a 3-line client component that calls the hook, OR update the 5 importers to a tiny inline wrapper. Simplest: keep `AutoRefresh.tsx` but make its body `"use client"; import { useAutoRefresh } from "@ptblink/ui"; export default function AutoRefresh({ intervalMs }: { intervalMs: number }) { useAutoRefresh(intervalMs); return null; }`. (Keeps all 5 call sites unchanged.)
- [ ] **Step 7: ThemeToggle.** In `StaffControls.tsx`, replace the inline theme-flip button with `<ThemeToggle onToggle={broadcastGlobalTheme} />` where `broadcastGlobalTheme` is the existing call to the Azure `/api/staff/theme` endpoint (keep that logic; it just moves into the `onToggle` callback). Keep the sign-out half and its ConfirmModal.
- [ ] **Step 8:** `grep -rn "RegProgress\|RegButtons\|_components/ConfirmModal\|sign/SignaturePad" app` → none (except the kept `AutoRefresh` wrapper).
- [ ] **Step 9:** `npx tsc --noEmit` → 0 errors; `npm run build` → succeeds.
- [ ] **Step 10:** Commit (`refactor: consume ConfirmModal/SignaturePad/ErrorBox/Confirmation/StepDots/FormActions/ThemeToggle/useAutoRefresh from @ptblink/ui`).

---

### Task 17: Retire the local `Slide` fork

**Files:**
- Delete: `ptb-platform-techcentre/app/(screens)/_components/Slide.tsx`
- Modify: `app/(screens)/_components/WorldDeck.tsx`, `app/(screens)/_components/dmi-deck/DmiSlide.tsx`
- Reference CLAUDE.md rule ("use local Slide") — update it after.

- [ ] **Step 1:** In `WorldDeck.tsx` and `DmiSlide.tsx`, change `import Slide from "./Slide"` (local) → `import { Slide } from "@ptblink/ui"`. Add `adaptive` to their `<Slide>` usages so they keep the GPU fallback (the local fork always used `AnimatedGradient`). `DmiSlide` already passes `themeOverride`/`subtle`/`underlay` — those now exist on the library `Slide`.
- [ ] **Step 2:** Delete `app/(screens)/_components/Slide.tsx`.
- [ ] **Step 3:** Update `CLAUDE.md`: remove the "Never import `Slide` from `@ptblink/ui` — use the local version" rule (now false); note `Slide` supports `adaptive`.
- [ ] **Step 4:** `grep -rn "_components/Slide" app` → none.
- [ ] **Step 5:** `npx tsc --noEmit` + `npm run build`.
- [ ] **Step 6:** Visual: run techcentre, open a screen route that renders a deck (e.g. `/builders`) + the DMI deck light mode; confirm gradients + underlay grid + veil look as before.
- [ ] **Step 7:** Commit (`refactor: retire local Slide fork; use @ptblink/ui Slide adaptive`).

---

### Task 18: Retire `VideoPlayerModal` fork

**Files:**
- Delete: `app/(screens)/_components/VideoPlayerModal.tsx`
- Modify: `app/(screens)/_components/WorldDeck.tsx`
- Possibly delete/trim: `lib/video.ts` (if now unused, since helpers live in the package)

- [ ] **Step 1:** In `WorldDeck.tsx`, replace `VideoPlayerModal` (`{ src, title, onClose }`) with library `VideoModal` (`{ item, onClose }`): map `src`/`title` → `item={{ title, src }}`. The library modal now handles Vimeo + buffer + Backspace close.
- [ ] **Step 2:** Delete `VideoPlayerModal.tsx`. If `lib/video.ts` is no longer imported anywhere (`grep -rn "lib/video\|from \"@/lib/video\"" app lib`), delete it (helpers now come from `@ptblink/ui/utils`); otherwise leave it.
- [ ] **Step 3:** `npx tsc --noEmit` + `npm run build`.
- [ ] **Step 4:** Visual: open a resource video (MP4 → buffer bar; a Vimeo URL if present in `worlds.ts` → iframe); confirm Backspace closes (kiosk layout swallows Escape).
- [ ] **Step 5:** Commit (`refactor: retire VideoPlayerModal; use @ptblink/ui VideoModal`).

---

### Task 19: Retire `TcSiteHeader` → configurable `SiteHeader`

**Files:**
- Delete: `app/_components/TcSiteHeader.tsx`
- Modify: `app/_components/KioskScreen.tsx`, `app/staff/layout.tsx`
- Source of the techcentre nav: `TcSiteHeader.tsx` (`nav` items from `lib/worlds` or a static list) + subtitle "Technology Centres".

- [ ] **Step 1: Extract the techcentre nav config.** Read `TcSiteHeader.tsx`; capture its `nav` array + the "Check in"/CTA target + subtitle. Put this as a small local const (e.g. `app/_components/tcNav.ts`) if it derives from `lib/worlds`, so both `KioskScreen` and staff layout share it.
- [ ] **Step 2: Replace usages.** In `KioskScreen.tsx` and `app/staff/layout.tsx`, replace `<TcSiteHeader … />` with `<SiteHeader nav={TC_NAV} subtitle="Technology Centres" cta={{ href: "/check-in", label: "Check in" }} homeHref="/" />` (match the exact targets TcSiteHeader used). If `TcSiteHeader` had an `inFlow` prop that changed positioning (it did — `KioskScreen` passes `inFlow`), verify the library `SiteHeader` fixed-position header works inside `KioskShell`'s header slot; if `inFlow` behavior is essential and absent, KEEP `TcSiteHeader` and instead have IT render `<SiteHeader …>` with the nav — but prefer full retirement if layout holds.
- [ ] **Step 3:** Delete `TcSiteHeader.tsx` only if fully replaced. `grep -rn "TcSiteHeader" app` → none.
- [ ] **Step 4:** `npx tsc --noEmit` + `npm run build`.
- [ ] **Step 5:** Visual: home (closed + open), a kiosk step, and staff dashboard — header nav/active-state/CTA all correct at iPad + laptop.
- [ ] **Step 6:** Commit (`refactor: retire TcSiteHeader; use configurable @ptblink/ui SiteHeader`).

---

### Task 20: Delete dead local `PageHero`, final sweep + verify

**Files:**
- Delete: `app/_components/PageHero.tsx` (agent confirmed it has no importers)
- Modify: `CLAUDE.md` (drop the "use local PageHero" rule)

- [ ] **Step 1:** Confirm no importers: `grep -rn "_components/PageHero" app` → none. Delete `app/_components/PageHero.tsx`.
- [ ] **Step 2:** Update `CLAUDE.md`: remove the "Never import `PageHero` from `@ptblink/ui`" rule.
- [ ] **Step 3: Full sweep.** `grep -rn "@/app/_components/AnimatedGradient\|_components/Slide\|_components/PageHero\|VideoPlayerModal\|TcSiteHeader\|RegProgress\|RegButtons" app lib` → only intended survivors.
- [ ] **Step 4:** `npx tsc --noEmit` → 0 errors; `npm run build` → succeeds; `npm test` (vitest) if present → green.
- [ ] **Step 5: End-to-end visual verification** at iPad portrait 820×1180 + landscape 1180×820:
  - Home (closed + open), check-in 4-step flow (details → role → documents → a document page → signature), welcome, check-out, staff dashboard (auto-refresh + theme toggle + a confirm modal), a screen deck + DMI light mode + a resource video.
  - Confirm nothing regressed vs. pre-migration.
- [ ] **Step 6:** Commit (`refactor: delete dead local PageHero; migration complete`). Push branch `feat/consume-ui-0.6.0` (do NOT merge — leave for review, per how Max runs these).

---

## Self-Review Notes

- **Spec coverage:** Tier 1 (Tasks 1–4: AnimatedGradient+hook, SignaturePad, ConfirmModal), Tier 2 (Tasks 5–8: ErrorBox/Confirmation, StepDots/FormActions, useAutoRefresh, ThemeToggle), Tier 3 (Tasks 9–12: Slide, PageHero, VideoModal, SiteHeader). Publish (13). Consume-back retiring all forks + TcSiteHeader (14–20). All items from the agreed scope are covered.
- **EmailForm** is intentionally NOT migrated (techcentre-flow-specific server action) — noted in Task 5.
- **Type consistency:** `AnimatedGradient` props `{color1,color2,color3,subtle}` are referenced identically in Tasks 2, 9, 10, 15. `Slide` new props `{adaptive,themeOverride,subtle,underlay}` defined in Task 9, consumed in Task 17. `SiteHeader` props `{nav,cta,subtitle,homeHref}` defined in Task 12, consumed in Task 19. `useAutoRefresh(intervalMs)` defined in Task 7, consumed in Task 16.
- **Risk flags:** Task 9 (Slide veil re-expressed as inline gradient — needs visual regression check), Task 19 (`inFlow` positioning — may keep a thin TcSiteHeader wrapper if the fixed header doesn't sit right in KioskShell). Both have explicit fallback instructions.
- **Blast radius:** all existing-export changes are additive with defaults; the demo + `ptb-platform-website` are unaffected until they opt into new props.
</content>
</invoke>
