import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tailwind: "src/tailwind.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "next",
    "next/link",
    "next/navigation",
    "next/font",
    "motion",
    "motion/react",
    "gsap",
    "tailwindcss",
  ],
  esbuildOptions(options) {
    options.banner = {};
  },
  async onSuccess() {
    const { cp } = await import("node:fs/promises");
    await cp("src/styles", "dist/styles", { recursive: true });
    await cp("src/styles/styles.css", "dist/styles.css");
  },
});
