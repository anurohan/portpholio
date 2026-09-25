"use client";

import { motion } from "framer-motion";
import { Section, Eyebrow, revealItem, Reveal } from "./Section";
import ProjectCase from "./ProjectCase";
import { projects } from "@/content/profile";

export default function Projects() {
  return (
    <Section id="projects" scrim="center" min="min-h-screen">
      <Reveal className="mb-14 max-w-2xl">
        <Eyebrow index="06">Real work</Eyebrow>
        <motion.h2 variants={revealItem} className="display-lg text-chalk">
          Where the system does real work.
        </motion.h2>
        <motion.p variants={revealItem} className="mt-5 text-lg leading-relaxed text-muted">
          Three software/AI projects — each one a pipeline you can follow end to
          end, from raw input to a useful result.
        </motion.p>
      </Reveal>

      <div className="flex flex-col gap-10">
        {projects.map((p, i) => (
          <ProjectCase key={p.id} project={p} n={`0${i + 1}`} />
        ))}
      </div>
    </Section>
  );
}
