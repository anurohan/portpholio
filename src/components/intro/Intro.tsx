"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StartButton from "./StartButton";
import { useStore } from "@/lib/store";
import { sceneState } from "@/lib/sceneState";
import { profile } from "@/content/profile";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Intro() {
  const phase = useStore((s) => s.phase);
  const reduced = useStore((s) => s.reducedMotion);
  const start = useStore((s) => s.start);
  const enterComplete = useStore((s) => s.enterComplete);
  const panelRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    sceneState.awake = true;

    if (reduced) {
      sceneState.entry = 1;
      start();
      enterComplete();
      return;
    }

    start(); // phase -> entering (scene begins waking, overlay fades)

    // Tween the entry value 0..1 for the 3D wake-up sequence.
    const dur = 2200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      // easeOutCubic
      sceneState.entry = 1 - Math.pow(1 - t, 3);
      if (t < 1) requestAnimationFrame(tick);
      else enterComplete();
    };
    requestAnimationFrame(tick);
  }, [reduced, start, enterComplete]);

  // Focus trap while the intro gate is up.
  useEffect(() => {
    if (phase === "live") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>("button, a[href]");
    focusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === document.body) {
        handleStart();
      }
      if (e.key !== "Tab") return;
      const nodes = panel.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, handleStart]);

  return (
    <AnimatePresence>
      {phase !== "live" && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Intro — start the experience"
          initial={false}
          animate={{ opacity: phase === "entering" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === "entering" ? 1.1 : 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ pointerEvents: phase === "entering" ? "none" : "auto" }}
        >
          {/* vignette so text is legible over the live 3D behind it */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(8,11,16,0.35),rgba(8,11,16,0.85))]" />

          <div className="relative flex max-w-2xl flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
              className="eyebrow mb-6"
            >
              Portfolio // Intelligence → Machines
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              className="display-xl text-chalk"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
              className="mono mt-5 text-sm tracking-[0.24em] text-steel"
            >
              AI / ML &nbsp;•&nbsp; COMPUTER SCIENCE &nbsp;•&nbsp; BUILDER
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.7, ease: EASE }}
              className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted"
            >
              {profile.headline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
              className="mt-10"
            >
              <StartButton onStart={handleStart} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mono mt-8 text-[0.6rem] tracking-[0.24em] text-muted/70"
            >
              PRESS START · THEN SCROLL TO TRAVEL THE SYSTEM
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
