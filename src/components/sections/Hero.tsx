"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { profile } from "@/content/profile";
import { scrollToId } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Hero() {
  const phase = useStore((s) => s.phase);
  const show = phase === "live";

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden"
    >
      {/* Legibility scrim — darkens the left where the text lives, fades to
          transparent on the right where the neural constellation breathes. */}
      <div className="pointer-events-none absolute inset-0 -z-[1] bg-[linear-gradient(100deg,rgba(8,11,16,0.9)_0%,rgba(8,11,16,0.55)_42%,rgba(8,11,16,0)_74%)]" />

      <div className="container-x relative">
        <div className="flex max-w-2xl flex-col items-center text-center md:items-start md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
            className="eyebrow mb-8 flex items-center gap-3"
          >
            <span className="hidden h-px w-8 bg-signal/60 md:inline-block" />
            Intelligence that can move
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.9, ease: EASE }}
            className="display-xl text-chalk"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.46, duration: 0.8, ease: EASE }}
            className="mono mt-8 text-[0.72rem] tracking-[0.32em] text-steel sm:text-xs"
          >
            AI / ML &nbsp;·&nbsp; COMPUTER SCIENCE &nbsp;·&nbsp; BUILDER
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.62, duration: 0.8, ease: EASE }}
            className="mt-9 max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg"
          >
            Building intelligent systems where software reasons, decides, and
            acts on the physical world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            className="mt-12 flex items-center gap-7"
          >
            <button
              onClick={() => scrollToId("ai")}
              data-cursor="hover"
              className="rounded-md bg-signal px-7 py-3 text-sm font-medium text-ink-900 shadow-[0_0_0_0_rgba(53,224,208,0.4)] transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_-12px_rgba(53,224,208,0.6)]"
            >
              Enter the system →
            </button>
            <button
              onClick={() => scrollToId("projects")}
              data-cursor="hover"
              className="mono text-xs tracking-[0.2em] text-steel underline-offset-8 transition-colors hover:text-chalk hover:underline"
            >
              View projects
            </button>
          </motion.div>
        </div>
      </div>

      {/* Minimal scroll cue — a single quiet scanning line, bottom-left. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 0.6 } : {}}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-white/12">
          <span className="absolute inset-0 block animate-scan bg-signal" />
        </span>
      </motion.div>
    </section>
  );
}
