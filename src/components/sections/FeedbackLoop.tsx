"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, revealItem } from "./Section";
import { useStore } from "@/lib/store";

/**
 * FEEDBACK LOOP — the signature section.
 * A closed control loop: SEE → THINK → DECIDE → ACT → SENSE → FEEDBACK → ADAPT
 * and back to SEE. This is the idea the whole portfolio orbits: intelligence
 * that perceives, decides, acts on the physical world, then measures the result
 * and corrects itself. Auto-advances (unless reduced motion), hover/focus to
 * inspect a step. No 3D, no new deps — pure SVG + Framer Motion.
 */

type Step = {
  key: string;
  verb: string;
  role: string;
  detail: string;
  accent: "signal" | "ember";
};

const STEPS: Step[] = [
  {
    key: "see",
    verb: "See",
    role: "Perception",
    detail: "Cameras and sensors capture the raw scene — pixels, distances, signals.",
    accent: "signal",
  },
  {
    key: "think",
    verb: "Think",
    role: "Understanding",
    detail: "Models turn those raw signals into meaning: objects, text, intent.",
    accent: "signal",
  },
  {
    key: "decide",
    verb: "Decide",
    role: "Reasoning",
    detail: "Given a goal and the current state, choose the next action to take.",
    accent: "signal",
  },
  {
    key: "act",
    verb: "Act",
    role: "Actuation",
    detail: "Controllers drive motors and outputs — the decision moves the world.",
    accent: "ember",
  },
  {
    key: "sense",
    verb: "Sense",
    role: "Measurement",
    detail: "Sensors read the changed state: did the world move as intended?",
    accent: "ember",
  },
  {
    key: "feedback",
    verb: "Feedback",
    role: "Comparison",
    detail: "Measured versus intended — the gap between them is the error to close.",
    accent: "ember",
  },
  {
    key: "adapt",
    verb: "Adapt",
    role: "Correction",
    detail: "The system adjusts, learns from the error, and the loop begins again.",
    accent: "signal",
  },
];

export default function FeedbackLoop() {
  const reduced = useStore((s) => s.reducedMotion);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, [reduced, paused]);

  // node positions on a circle
  const R = 42; // percent radius within the square stage
  const nodes = useMemo(
    () =>
      STEPS.map((s, i) => {
        const ang = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
        return {
          ...s,
          x: 50 + Math.cos(ang) * R,
          y: 50 + Math.sin(ang) * R,
        };
      }),
    []
  );

  const current = STEPS[active];
  const accentText = current.accent === "signal" ? "text-signal" : "text-ember";

  return (
    <section
      id="feedback"
      aria-label="The feedback loop"
      className="relative flex min-h-screen w-full items-center"
    >
      <div className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(8,11,16,0.85),transparent_78%)]" />

      <div className="container-x w-full py-24">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <motion.p
            variants={revealItem}
            className="eyebrow mb-4 flex items-center justify-center gap-3"
          >
            <span className="text-muted">Signature</span>
            <span className="h-px w-8 bg-signal/50" />
            <span className="text-signal">The Loop</span>
          </motion.p>
          <motion.h2 variants={revealItem} className="display-lg text-chalk">
            Intelligence becomes physical in a loop.
          </motion.h2>
          <motion.p
            variants={revealItem}
            className="mt-5 text-base leading-relaxed text-muted sm:text-lg"
          >
            Every system I care about closes the same circle — perceive, reason,
            act, then measure the result and correct. This is where software stops
            answering questions and starts changing the world.
          </motion.p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* The ring */}
          <div
            className="relative mx-auto aspect-square w-full max-w-[30rem]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="loopgrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#35E0D0" />
                  <stop offset="100%" stopColor="#FF7A3D" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#loopgrad)"
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 / STEPS.length) * (active + 1)}
                style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>

            {/* center readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
              <motion.span
                key={current.key + "-verb"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`font-display text-2xl font-semibold sm:text-3xl ${accentText}`}
              >
                {current.verb}
              </motion.span>
              <span className="mono mt-1 text-[0.6rem] uppercase tracking-[0.24em] text-muted">
                {current.role}
              </span>
            </div>

            {/* nodes */}
            {nodes.map((n, i) => {
              const isActive = i === active;
              const dot =
                n.accent === "signal" ? "bg-signal" : "bg-ember";
              return (
                <button
                  key={n.key}
                  onClick={() => setActive(i)}
                  onFocus={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  onBlur={() => setPaused(false)}
                  data-cursor="hover"
                  aria-label={`${n.verb} — ${n.role}`}
                  aria-pressed={isActive}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <span
                    className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.7rem] transition-all ${
                      isActive
                        ? "border-white/25 bg-white/[0.08] text-chalk"
                        : "border-white/10 bg-ink-900/70 text-muted group-hover:text-chalk"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dot} ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    />
                    {n.verb}
                  </span>
                </button>
              );
            })}
          </div>

          {/* detail panel */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/45 p-7 backdrop-blur-md sm:p-8">
            <div className="mono flex items-center gap-3 text-[0.7rem] tracking-[0.24em] text-muted">
              <span className={accentText}>
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-white/15" />
              <span className="uppercase">{current.role}</span>
            </div>
            <motion.h3
              key={current.key + "-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 font-display text-2xl font-semibold text-chalk"
            >
              {current.verb}
            </motion.h3>
            <motion.p
              key={current.key + "-detail"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-3 text-[0.98rem] leading-relaxed text-muted"
            >
              {current.detail}
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  data-cursor="hover"
                  aria-label={`Go to ${s.verb}`}
                  className={`h-1 rounded-full transition-all ${
                    i === active
                      ? "w-7 bg-signal"
                      : "w-3 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
