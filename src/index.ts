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

// Components — landing (from pre-infra-pass@d639043)
export { default as PageShell } from "./components/PageShell";
export { default as PageHero } from "./components/PageHero";
export { default as Section } from "./components/Section";
export { default as Card } from "./components/Card";
export { default as Button } from "./components/Button";
export type { ButtonVariant, ButtonSize } from "./components/Button";
export { default as Input } from "./components/Input";
export { default as Field } from "./components/Field";
export { default as StatGrid } from "./components/StatGrid";
export { default as BackLink } from "./components/BackLink";
export { default as SiteHeader } from "./components/SiteHeader";
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

// Hooks
export { useScrolled } from "./hooks/useScrolled";

// Utils
export { displayClassForLength } from "./utils/displayClass";

// Theme
export { applyTheme, getAppliedTheme, grainientColorsForTheme, THEME_ATTRIBUTE } from "./theme";
export type { ThemeName } from "./theme";
export { useThemeName } from "./hooks/useThemeName";
