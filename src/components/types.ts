/**
 * Structural types for section component props. Consuming apps construct
 * objects matching these shapes; no values are exported from `@ptblink/ui`
 * for these types (use structural typing in your app).
 */

export type Accent = {
  base: string;
  soft: string;
  dim: string;
};

export type Video = {
  title: string;
  durationSec: number;
  topic: string;
};

export type Slide = {
  heading: string;
  bullets: string[];
};

export type Cta = {
  label: string;
  href: string;
};
