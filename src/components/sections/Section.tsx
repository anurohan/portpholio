"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Section shell — full-height, content-over-3D, with a legibility scrim. */
export function Section({
  id,
  children,
  className = "",
  min = "min-h-screen",
  scrim = "left",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  min?: string;
  scrim?: "left" | "center" | "right" | "none";
}) {
  const scrimClass =
    scrim === "left"
      ? "bg-[linear-gradient(90deg,rgba(8,11,16,0.82)_0%,rgba(8,11,16,0.4)_45%,transparent_75%)]"
      : scrim === "right"
        ? "bg-[linear-gradient(270deg,rgba(8,11,16,0.82)_0%,rgba(8,11,16,0.4)_45%,transparent_75%)]"
        : scrim === "center"
          ? "bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(8,11,16,0.8),transparent_75%)]"
          : "";

  return (
    <section
      id={id}
      className={`relative flex ${min} w-full items-center ${className}`}
    >
      {scrim !== "none" && (
        <div className={`pointer-events-none absolute inset-0 -z-[1] ${scrimClass}`} />
      )}
      <div className="container-x relative w-full py-24">{children}</div>
    </section>
  );
}

export const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Wraps children in an in-view staggered reveal (supporting animation only). */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={revealParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <motion.p variants={revealItem} className="eyebrow mb-4 flex items-center gap-3">
      <span className="text-muted">{index}</span>
      <span className="h-px w-8 bg-signal/50" />
      {children}
    </motion.p>
  );
}
