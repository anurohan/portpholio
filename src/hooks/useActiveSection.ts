"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { sections, type WorldKey } from "@/lib/site";

/**
 * Observes section elements and updates the active section in the store
 * (used by nav + HUD). Uses IntersectionObserver, not a per-frame loop.
 */
export function useActiveSection() {
  const setActiveSection = useStore((s) => s.setActiveSection);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let bestId = "";
        let best = 0;
        visible.forEach((ratio, id) => {
          if (ratio > best) {
            best = ratio;
            bestId = id;
          }
        });
        if (bestId) setActiveSection(bestId as WorldKey);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75], rootMargin: "-10% 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActiveSection]);
}
