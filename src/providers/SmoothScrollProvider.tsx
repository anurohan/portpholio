"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";
import { setLenis } from "@/lib/lenis";

/**
 * Single source of scroll:
 *  - Lenis for buttery smoothing (skipped on reduced-motion / touch fallback)
 *  - GSAP ScrollTrigger driven off the SAME ticker (no competing rAF loops)
 *  - writes global progress (0..1) into sceneState for the render loop
 *  - locks scroll until the intro "live" phase
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const phase = useStore((s) => s.phase);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const lenisRef = useRef<Lenis | null>(null);

  // --- progress tracking (works with or without Lenis) ---
  useEffect(() => {
    const computeFromNative = () => {
      const doc = document.documentElement;
      const limit = doc.scrollHeight - window.innerHeight;
      sceneState.progress = limit > 0 ? doc.scrollTop / limit : 0;
    };
    if (reducedMotion) {
      window.addEventListener("scroll", computeFromNative, { passive: true });
      window.addEventListener("resize", computeFromNative);
      computeFromNative();
      return () => {
        window.removeEventListener("scroll", computeFromNative);
        window.removeEventListener("resize", computeFromNative);
      };
    }
  }, [reducedMotion]);

  // --- Lenis + GSAP wiring (motion path only) ---
  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      sceneState.progress = limit > 0 ? scroll / limit : 0;
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // keep ScrollTrigger measurements in sync with Lenis
    ScrollTrigger.scrollerProxy(document.body, {});
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reducedMotion]);

  // --- scroll lock until the experience goes live ---
  useEffect(() => {
    const locked = phase !== "live";
    const lenis = lenisRef.current;
    if (locked) {
      lenis?.stop();
      document.body.classList.add("is-locked");
    } else {
      lenis?.start();
      document.body.classList.remove("is-locked");
      // recompute in case layout changed while locked
      requestAnimationFrame(() => {
        if (!reducedMotion) ScrollTrigger.refresh();
      });
    }
    return () => document.body.classList.remove("is-locked");
  }, [phase, reducedMotion]);

  return <>{children}</>;
}
