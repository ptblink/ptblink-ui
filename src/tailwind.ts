import type { Config } from "tailwindcss";

/**
 * Tailwind v4 preset for @ptblink/ui. Extend it from your consuming app's
 * tailwind config. Tokens live in @ptblink/ui/styles.css under a @theme block;
 * this preset only carries JS-only config (breakpoints, etc.).
 */
const preset: Partial<Config> = {
  content: [],
  theme: {
    extend: {
      screens: {
        kiosk: "1920px",
      },
    },
  },
};

export default preset;
