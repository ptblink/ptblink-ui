"use client";

import { useState, useEffect } from "react";

type GPUTier = "high" | "low";

function detect(): GPUTier {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return "low";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = (
        gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
      ).toLowerCase();
      // Release context immediately — we only needed the renderer string.
      gl.getExtension("WEBGL_lose_context")?.loseContext();

      // Older Intel integrated and software renderers struggle with
      // continuous per-frame WebGL shaders on kiosk hardware.
      const lowTierPatterns = [
        "intel hd",
        "intel uhd",
        "mesa",
        "llvmpipe",
        "swiftshader",
        "microsoft basic",
      ];
      if (lowTierPatterns.some((p) => renderer.includes(p))) return "low";
    }

    // Secondary signal: reported device memory (not available in all browsers).
    const mem = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    if (mem !== undefined && mem < 4) return "low";

    return "high";
  } catch {
    return "low";
  }
}

// Cached so every mounted component shares one detection result.
let cached: GPUTier | null = null;

export function useGPUCapability(): GPUTier | null {
  const [tier, setTier] = useState<GPUTier | null>(cached);

  useEffect(() => {
    if (cached !== null) {
      setTier(cached);
      return;
    }
    cached = detect();
    setTier(cached);
  }, []);

  return tier;
}
