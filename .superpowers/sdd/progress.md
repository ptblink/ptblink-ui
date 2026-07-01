# Migration progress — techcentre primitives → @ptblink/ui 0.6.0

Plan: ptblink-ui/docs/superpowers/plans/2026-07-02-ptblink-ui-migration.md
Library branch: feat/migrate-techcentre-primitives
Demo branch: feat/migrate-techcentre-primitives (ptblink-ui-demo)
Consume branch: feat/consume-ui-0.6.0 (techcentre)

## Ledger
(pending)

Task 1-8 (Phase 1-3, library side): complete (commit 61677eb) — useGPUCapability, AnimatedGradient, SignaturePad, ConfirmModal, ErrorBox, Confirmation, StepDots, FormActions, useAutoRefresh, ThemeToggle. Typecheck+build green, 10 exports in dist, "use client" banner + blob CSS confirmed. Demo pages deferred to a pre-publish batch (single local-tarball install).

Task 9-12 (Phase 4, library side): complete — Slide/PageHero/VideoModal/SiteHeader extended additively (defaults byte-identical). +src/utils/video.ts (isVimeo/toVimeoEmbed on barrel + /utils). Typecheck+build green; new props in dist dts.
