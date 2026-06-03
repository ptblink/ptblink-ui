# Changelog

## 0.1.1 — 2026-06-03

- Add `@ptblink/ui/utils` subpath that ships without the `"use client"`
  banner so server components can call `displayClassForLength` directly.
  Importing it via the main barrel still works (client context) but server
  callers must use the subpath.

## 0.1.0 — 2026-06-03
Initial extraction from ptb-screens.
