// Components — kiosk (from remote-presentation)
export { default as Slide } from "./components/Slide";
export { default as SlideDeck } from "./components/SlideDeck";
export type { DeckSection, DeckSlide } from "./components/SlideDeck";
export { default as Reveal } from "./components/Reveal";
export { default as VideoThumb } from "./components/VideoThumb";
export { default as VideoModal } from "./components/VideoModal";
export type { VideoModalItem } from "./components/VideoModal";
export { default as ActionList } from "./components/ActionList";
export type { ActionListItem } from "./components/ActionList";
export { default as Eyebrow } from "./components/Eyebrow";
export { default as SectionHeader } from "./components/SectionHeader";

// Components — kiosk forms (full-screen, no-scroll, iPad portrait + landscape)
export { default as KioskShell } from "./components/KioskShell";
export { default as KioskField } from "./components/KioskField";
export { default as ChoiceGroup } from "./components/ChoiceGroup";
export type { ChoiceOption } from "./components/ChoiceGroup";
export { default as SignaturePad } from "./components/SignaturePad";
export { default as ConfirmModal } from "./components/ConfirmModal";
export { default as ErrorBox } from "./components/ErrorBox";
export { default as Confirmation } from "./components/Confirmation";
export { default as StepDots } from "./components/StepDots";
export { default as FormActions } from "./components/FormActions";
export { default as ThemeToggle } from "./components/ThemeToggle";
export { default as Notice } from "./components/Notice";

// Components — staff/admin data tables
export { default as DataTable, DataRow, DataCell, SectionLabel } from "./components/DataTable";
export type { DataColumn } from "./components/DataTable";
export { default as StatusPill } from "./components/StatusPill";
export { default as Pagination } from "./components/Pagination";

// Components — overlays
export { default as Modal } from "./components/Modal";
export type { ModalSize } from "./components/Modal";

// Components — landing (from pre-infra-pass@d639043)
export { default as PageShell } from "./components/PageShell";
export { default as PageHero } from "./components/PageHero";
export { default as Section } from "./components/Section";
export { default as Card } from "./components/Card";
export { default as Button } from "./components/Button";
export type { ButtonVariant, ButtonSize } from "./components/Button";
export { default as Input } from "./components/Input";
export { default as Field } from "./components/Field";
export { default as FormShell } from "./components/FormShell";
export { default as StatGrid } from "./components/StatGrid";
export { default as BackLink } from "./components/BackLink";
export { default as SiteHeader } from "./components/SiteHeader";
export type { NavItem } from "./components/SiteHeader";
export { default as SiteFooter } from "./components/SiteFooter";
export { default as Hero } from "./components/Hero";
export { default as SectionVideo } from "./components/SectionVideo";
export { default as SectionSlideshow } from "./components/SectionSlideshow";
export { default as SectionPlatformCta } from "./components/SectionPlatformCta";
export { default as SectionContact } from "./components/SectionContact";

// react-bits primitives
export { default as Aurora } from "./react-bits/Aurora";
export { default as BlurText } from "./react-bits/BlurText";
export { default as CountUp } from "./react-bits/CountUp";
export { default as GradientText } from "./react-bits/GradientText";
export { default as Grainient } from "./react-bits/Grainient";
export { default as Magnet } from "./react-bits/Magnet";
export { default as ScrollReveal } from "./react-bits/ScrollReveal";
export { default as ShinyText } from "./react-bits/ShinyText";
export { default as SplitText } from "./react-bits/SplitText";
export { default as TiltedCard } from "./react-bits/TiltedCard";
export { default as AnimatedGradient } from "./react-bits/AnimatedGradient";

// Hooks
export { useScrolled } from "./hooks/useScrolled";
export { useGPUCapability } from "./hooks/useGPUCapability";
export { useAutoRefresh } from "./hooks/useAutoRefresh";

// Utils
export { displayClassForLength } from "./utils/displayClass";
export { isVimeo, toVimeoEmbed } from "./utils/video";
export type { VimeoEmbedOptions } from "./utils/video";

// Theme
export { applyTheme, getAppliedTheme, grainientColorsForTheme, THEME_ATTRIBUTE } from "./theme";
export type { ThemeName } from "./theme";
export { useThemeName } from "./hooks/useThemeName";
