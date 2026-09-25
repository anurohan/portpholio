"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, Eyebrow, Reveal, revealItem } from "./Section";
import { skillGroups } from "@/content/profile";
import { cx } from "@/lib/utils";

export default function Skills() {
  const [active, setActive] = useState<string>(skillGroups[0].key);
  const current = skillGroups.find((g) => g.key === active) ?? skillGroups[0];

  return (
    <Section id="skills" scrim="right" min="min-h-screen">
      <Reveal className="mb-12 max-w-2xl">
        <Eyebrow index="08">Capabilities</Eyebrow>
        <motion.h2 variants={revealItem} className="display-lg text-chalk">
          The technical map.
        </motion.h2>
        <motion.p variants={revealItem} className="mt-5 text-lg leading-relaxed text-muted">
          Not a wall of logos — the actual layers I work in, from models and
          data down to the physical systems that interest me.
        </motion.p>
      </Reveal>

      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        {/* selector rail */}
        <div className="flex flex-col gap-2">
          {skillGroups.map((g) => {
            const on = g.key === active;
            const isEmber = g.accent === "ember";
            return (
              <button
                key={g.key}
                onMouseEnter={() => setActive(g.key)}
                onFocus={() => setActive(g.key)}
                onClick={() => setActive(g.key)}
                data-cursor="hover"
                className={cx(
                  "group relative overflow-hidden rounded-xl border px-5 py-4 text-left transition-colors",
                  on
                    ? "border-white/20 bg-white/[0.04]"
                    : "border-white/8 bg-transparent hover:border-white/15"
                )}
              >
                {on && (
                  <motion.span
                    layoutId="skill-active"
                    className={cx(
                      "absolute left-0 top-0 h-full w-0.5",
                      isEmber ? "bg-ember" : "bg-signal"
                    )}
                  />
                )}
                <span className="flex items-center justify-between">
                  <span
                    className={cx(
                      "font-display text-lg font-medium transition-colors",
                      on ? "text-chalk" : "text-chalk/70"
                    )}
                  >
                    {g.title}
                  </span>
                  <span
                    className={cx(
                      "mono text-[0.62rem] tracking-[0.2em]",
                      isEmber ? "text-ember" : "text-signal"
                    )}
                  >
                    {g.items.length}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted">{g.blurb}</span>
              </button>
            );
          })}
        </div>

        {/* detail panel */}
        <div className="relative min-h-[18rem] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-7 backdrop-blur-md">
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p
              className={cx(
                "mono text-[0.66rem] tracking-[0.24em]",
                current.accent === "ember" ? "text-ember" : "text-signal"
              )}
            >
              {current.title.toUpperCase()}
            </p>
            <p className="mt-2 max-w-md text-chalk/80">{current.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {current.items.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                  className={cx(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    current.accent === "ember"
                      ? "border-ember/25 bg-ember/[0.06] text-chalk/90"
                      : "border-signal/25 bg-signal/[0.06] text-chalk/90"
                  )}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
