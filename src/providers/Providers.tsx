"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import SmoothScrollProvider from "./SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useStore } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";

export default function Providers({ children }: { children: React.ReactNode }) {
  usePrefersReducedMotion();
  useDeviceTier();
  useActiveSection();
  const reducedMotion = useStore((s) => s.reducedMotion);

  // Global pointer → normalized target (-1..1). Damped in the render loop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      sceneState.tmx = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.tmy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </MotionConfig>
  );
}
