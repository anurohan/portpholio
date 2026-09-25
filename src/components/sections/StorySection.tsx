"use client";

import { motion } from "framer-motion";
import { Reveal, revealItem } from "./Section";

export type Story = {
  id: string;
  index: string;
  world: string;
  title: string;
  lede: string;
  body: string;
  stages: string[];
  align: "left" | "right";
  accent: "signal" | "ember";
};

export default function StorySection({ story }: { story: Story }) {
  const accentText = story.accent === "signal" ? "text-signal" : "text-ember";
  const accentBorder =
    story.accent === "signal" ? "border-signal/40" : "border-ember/40";
  const alignWrap =
    story.align === "right" ? "ml-auto text-left" : "mr-auto text-left";

  return (
    <section
      id={story.id}
      className="relative flex min-h-[150vh] w-full items-center"
      aria-label={story.world}
    >
      {/* sticky content panel — 3D world behind reacts to scroll through the tall section */}
      <div className="sticky top-0 flex h-screen w-full items-center">
        <div className="container-x w-full">
          <div
            className={`relative max-w-xl ${alignWrap} rounded-2xl border ${accentBorder} bg-ink-900/45 p-7 backdrop-blur-md sm:p-9`}
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(120deg,rgba(53,224,208,0.06),transparent_40%)]" />
            <Reveal>
              <motion.p
                variants={revealItem}
                className="mono mb-4 flex items-center gap-3 text-[0.7rem] tracking-[0.28em] text-muted"
              >
                <span>{story.index}</span>
                <span className={`h-px w-8 ${story.accent === "signal" ? "bg-signal/60" : "bg-ember/60"}`} />
                <span className={accentText}>{story.world}</span>
              </motion.p>

              <motion.h2
                variants={revealItem}
                className="display-lg text-chalk"
              >
                {story.title}
              </motion.h2>

              <motion.p
                variants={revealItem}
                className="mt-5 text-lg leading-relaxed text-chalk/90"
              >
                {story.lede}
              </motion.p>

              <motion.p
                variants={revealItem}
                className="mt-4 text-[0.95rem] leading-relaxed text-muted"
              >
                {story.body}
              </motion.p>

              <motion.div
                variants={revealItem}
                className="mt-7 flex flex-wrap gap-2"
              >
                {story.stages.map((s, i) => (
                  <span
                    key={s}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-steel"
                  >
                    <span className={`text-[0.6rem] ${accentText}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </span>
                ))}
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
