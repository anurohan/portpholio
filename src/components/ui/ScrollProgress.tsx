"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";

/**
 * Fixed vertical progress rail (desktop) reading sceneState.progress via rAF.
 * No store writes → no re-renders while scrolling. Deliberately minimal —
 * a slim signal→ember rail with no numeric HUD labels.
 */
export default function ScrollProgress() {
  const phase = useStore((s) => s.phase);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "live") return;
    let raf = 0;
    let last = -1;
    let lastVis = -1;
    const loop = () => {
      const p = sceneState.progress;
      if (Math.abs(p - last) > 0.001) {
        last = p;
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      }
      // The rail is HUD — it should not exist on the clean initial Hero.
      // It fades in only once the user has begun to scroll into the story.
      const vis = p > 0.035 ? 1 : 0;
      if (vis !== lastVis) {
        lastVis = vis;
        if (wrapRef.current) wrapRef.current.style.opacity = String(vis);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (phase !== "live") return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center opacity-0 transition-opacity duration-500 md:flex"
      aria-hidden
    >
      <div className="relative h-48 w-px overflow-hidden bg-white/10">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top bg-gradient-to-b from-signal to-ember"
          style={{ transform: "scaleY(0)" }}
        />
      </div>
    </div>
  );
}
