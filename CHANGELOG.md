# Changelog

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
