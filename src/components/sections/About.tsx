"use client";

import { motion } from "framer-motion";
import { Section, Eyebrow, Reveal, revealItem } from "./Section";
import { profile } from "@/content/profile";

export default function About() {
  return (
    <Section id="about" scrim="left" min="min-h-screen">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Eyebrow index="07">About</Eyebrow>
          <motion.h2 variants={revealItem} className="display-lg text-chalk">
            I build across the stack — and past it.
          </motion.h2>
          <motion.p
            variants={revealItem}
            className="mt-6 max-w-xl text-lg leading-relaxed text-chalk/85"
          >
            {profile.subheadline}
          </motion.p>
          <motion.p
            variants={revealItem}
            className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted"
          >
            My core work is software and AI — retrieval systems, computer vision
            and NLP. Alongside that, electronics, robotics and mechanics are
            genuine interests I keep exploring, because I like understanding a
            system all the way down to the physics that runs it.
          </motion.p>

          {/* interest columns */}
          <motion.div variants={revealItem} className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mono mb-3 text-[0.68rem] tracking-[0.24em] text-signal">
                CORE / SOFTWARE & AI
              </p>
              <ul className="space-y-1.5">
                {profile.coreInterests.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-chalk/85">
                    <span className="h-1 w-1 rounded-full bg-signal" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono mb-3 text-[0.68rem] tracking-[0.24em] text-ember">
                INTERESTS / PHYSICAL
              </p>
              <ul className="space-y-1.5">
                {profile.builderInterests.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-chalk/85">
                    <span className="h-1 w-1 rounded-full bg-ember" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Reveal>

        {/* blueprint profile card */}
        <Reveal>
          <motion.div
            variants={revealItem}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-7 backdrop-blur-md"
          >
            <div className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative">
              <p className="mono text-[0.66rem] tracking-[0.24em] text-muted">
                PROFILE // {profile.initials}
              </p>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="mono text-[0.62rem] tracking-[0.2em] text-muted">
                    EDUCATION
                  </dt>
                  <dd className="mt-1 text-chalk">{profile.education.degree}</dd>
                  <dd className="text-sm text-muted">
                    {profile.education.school} · {profile.education.period}
                  </dd>
                  <dd className="mt-1 text-sm text-steel">
                    CGPA {profile.education.cgpa}
                  </dd>
                </div>

                <div className="h-px w-full hairline border-t" />

                <div>
                  <dt className="mono text-[0.62rem] tracking-[0.2em] text-muted">
                    RECOGNITION
                  </dt>
                  {profile.achievements.map((a) => (
                    <div key={a.title} className="mt-2">
                      <dd className="flex items-center gap-2 text-chalk">
                        <span className="text-ember">◆</span>
                        {a.title}
                      </dd>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">
                        {a.detail}
                      </dd>
                    </div>
                  ))}
                </div>

                <div className="h-px w-full hairline border-t" />

                <div>
                  <dt className="mono text-[0.62rem] tracking-[0.2em] text-muted">
                    FOCUS
                  </dt>
                  <dd className="mt-1 text-chalk">
                    {profile.role} · {profile.focus}
                  </dd>
                </div>

                <div className="h-px w-full hairline border-t" />

                <div>
                  <dt className="mono text-[0.62rem] tracking-[0.2em] text-muted">
                    CERTIFICATIONS
                  </dt>
                  {profile.certifications.map((c) => (
                    <div key={c.title} className="mt-2.5">
                      <dd className="flex items-start gap-2 text-sm text-chalk">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-signal" />
                        <span>{c.title}</span>
                      </dd>
                      <dd className="ml-3 text-xs text-muted">
                        {c.issuer} · {c.date}
                      </dd>
                    </div>
                  ))}
                </div>
              </dl>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </Section>
  );
}
