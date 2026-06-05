import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tailwind: "src/tailwind.ts",
    utils: "src/utils.ts",
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
    // Keep static asset imports as literal so the consumer's bundler
    // (Next.js webpack/turbopack) resolves them via package.json#exports
    // and feeds them through its own static-image loader.
    /\.(png|svg)$/,
  ],
  esbuildOptions(options) {
    options.banner = {};
    // Use the automatic JSX runtime (React 17+) so components don't need
    // `import React` and the bundle doesn't emit bare `React.createElement`.
    options.jsx = "automatic";
  },
  async onSuccess() {
    const { cp, readFile, writeFile, readdir } = await import("node:fs/promises");

    await cp("src/styles", "dist/styles", { recursive: true });
    await cp("src/brand", "dist/brand", { recursive: true });

    // dist/styles.css is the public entrypoint (exports["./styles.css"]).
    // Its @imports must be relative to dist/, not dist/styles/, so we
    // rewrite the sibling-relative refs to point into the styles/ subdir.
    const srcStylesCss = await readFile("src/styles/styles.css", "utf8");
    const distStylesCss = srcStylesCss
      .replace(/^@import "\.\/tokens\.css";$/m, '@import "./styles/tokens.css";')
      .replace(/^@import "\.\/utilities\.css";$/m, '@import "./styles/utilities.css";');
    await writeFile("dist/styles.css", distStylesCss);

    // Normalize externalized asset imports so they resolve relative to dist/.
    // Source files (e.g. src/components/SiteHeader.tsx) import as "../brand/…";
    // after bundling into dist/*.js, that string would point one level above dist,
    // so rewrite both "../brand/" and "./brand/" forms to a stable "./brand/" path.
    const distFiles = await readdir("dist", { recursive: true }) as string[];
    for (const rel of distFiles) {
      if (!rel.endsWith(".js")) continue;
      const path = `dist/${rel}`;
      const src = await readFile(path, "utf8");
      const rewritten = src.replace(/(["'])\.\.\/brand\//g, '$1./brand/');
      if (rewritten !== src) await writeFile(path, rewritten);
    }

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
