"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";

/** Syncs prefers-reduced-motion into the store AND the render-loop scratch. */
export function usePrefersReducedMotion() {
  const setReducedMotion = useStore((s) => s.setReducedMotion);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      sceneState.reduced = mq.matches;
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [setReducedMotion]);
}
