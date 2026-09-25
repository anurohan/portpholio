"use client";

import { useEffect } from "react";
import { useStore, type Tier } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";

/**
 * Heuristic device tiering. Runs once on mount. Weak devices get a
 * deliberately simplified scene (fewer particles, lower DPR, less motion).
 */
export function useDeviceTier() {
  const setTier = useStore((s) => s.setTier);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 4;
    const mem = nav.deviceMemory ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = Math.min(window.innerWidth, window.innerHeight) < 640;
    const isMobile = coarse || narrow;

    let tier: Tier = "high";
    if (isMobile || cores <= 4 || mem <= 4) tier = "mid";
    if ((isMobile && cores <= 4) || cores <= 2 || mem <= 2) tier = "low";

    setTier(tier);
    sceneState.isMobile = isMobile;
    sceneState.quality = tier === "high" ? 1 : tier === "mid" ? 0.72 : 0.5;
  }, [setTier]);
}
