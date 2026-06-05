# Changelog

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
