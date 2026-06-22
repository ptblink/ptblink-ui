# Changelog

## 0.3.0 — 2026-06-22

- Form + action primitives. New barrel exports `Button`, `Input`, `Field` —
  token-driven and deliberately restrained (kiosk actions, not billboards):
  ```tsx
  import { Button, Field } from "@ptblink/ui";

  <Field label="Email" name="email" type="email" required />
  <Button type="submit" arrow>Check In</Button>
  <Button href="/" variant="secondary">Back</Button>
  ```
  `Button` is polymorphic (`href` → Next `Link`, otherwise a native
  `<button>` usable as a form submit), with `variant` (`primary` /
  `secondary` / `ghost`), `size` (`sm` / `md` / `lg`), and an optional
  trailing `arrow`. `Field` is a labelled `Input` with an optional error line.

## 0.2.1 — 2026-06-12

- Light-mode Grainients. `PageHero` and `Slide` now treat their `colors`
  tuple as the dark palette: under `data-theme="light"` the two base stops
  render near-white and only the accent (middle stop) pops. New exports:
  `useThemeName()` (tracks `data-theme`) and `grainientColorsForTheme()`.

## 0.2.0 — 2026-06-12

- Light theme. The neutral token ramp now has a light counterpart in
  `styles/tokens.css`, activated by `data-theme="light"` on `<html>`;
  dark remains the default when the attribute is absent. Brand blues are
  shared by both themes. New barrel exports to drive it:
  ```tsx
  import { applyTheme, getAppliedTheme, type ThemeName } from "@ptblink/ui";
  applyTheme("light"); // sets data-theme on <html>; applyTheme("dark") removes it
  ```

## 0.1.3 — 2026-06-05

- Ship the two PT Blink brand assets (`icon-128.png`, `blinklogo-dark.svg`)
  inside the package and consume them directly from `SiteHeader` and
  `SiteFooter` via static import. Consuming apps no longer need to copy these
  into their own `public/brand/` — `SiteHeader`/`SiteFooter` work out of the
  box. The assets are also exposed via the `package.json#exports` map so any
  app can reuse them:
  ```tsx
  import iconUrl from "@ptblink/ui/brand/icon-128.png";
  import logoUrl from "@ptblink/ui/brand/blinklogo-dark.svg";
  ```

## 0.1.2 — 2026-06-05

- Repo transferred to the `ptblink` GitHub org; `package.json#repository`
  updated from `MaxouJS/ptblink-ui` to `ptblink/ptblink-ui`. No source or
  runtime changes — bundled `dist/` is identical to 0.1.1.

## 0.1.1 — 2026-06-03

- Add `@ptblink/ui/utils` subpath that ships without the `"use client"`
  banner so server components can call `displayClassForLength` directly.
  Importing it via the main barrel still works (client context) but server
  callers must use the subpath.

## 0.1.0 — 2026-06-03
Initial extraction from ptb-screens.
