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
    "next/image",
    "motion",
    "motion/react",
    "gsap",
    "gsap/ScrollTrigger",
    "gsap/SplitText",
    "@gsap/react",
    "ogl",
    "tailwindcss",
  ],
  esbuildOptions(options) {
    options.banner = {};
  },
  async onSuccess() {
    const { cp, readFile, writeFile } = await import("node:fs/promises");
    await cp("src/styles", "dist/styles", { recursive: true });
    await cp("src/styles/styles.css", "dist/styles.css");
    // Prepend "use client" to dist/index.js so the barrel works in Next.js
    // App Router server contexts. rollup strips the per-source directives
    // during bundling; we re-add at the top of the single bundled output.
    const indexPath = "dist/index.js";
    const indexJs = await readFile(indexPath, "utf8");
    if (!indexJs.startsWith('"use client"')) {
      await writeFile(indexPath, '"use client";\n' + indexJs);
    }
  },
});
