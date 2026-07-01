"use client";

import { useEffect, useRef, useState } from "react";

// One legitimate client island: an HTML canvas the visitor signs on (iPad).
// On each stroke end it serialises to a PNG data-URL in a hidden input so the
// surrounding server-action form submits the image. No client router state.
export default function SignaturePad({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0a0a0a";
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvasRef.current!.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    hiddenRef.current!.value = canvasRef.current!.toDataURL("image/png");
    setDirty(true);
  };
  const clear = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hiddenRef.current!.value = "";
    setDirty(false);
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="h-48 w-full touch-none rounded-2xl"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-eyebrow font-mono uppercase text-[var(--color-ink-mute)]">
          {dirty ? "Signed" : "Sign above"}
        </span>
        <button type="button" onClick={clear} className="text-body-sm font-light text-[var(--color-ink-dim)] underline">
          Clear
        </button>
      </div>
      <input ref={hiddenRef} type="hidden" name={name} />
    </div>
  );
}
