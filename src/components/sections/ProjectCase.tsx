"use client";

import { motion } from "framer-motion";
import { profile, type Project } from "@/content/profile";
import { cx } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** One project = an interactive pipeline case study, not a flat card. */
export default function ProjectCase({
  project,
  n,
}: {
  project: Project;
  n: string;
}) {
  const isEmber = project.accent === "ember";
  const dot = isEmber ? "bg-ember" : "bg-signal";
  const ring = isEmber ? "border-ember/50" : "border-signal/50";
  const glow = isEmber
    ? "shadow-[0_0_40px_-12px_rgba(255,122,61,0.5)]"
    : "shadow-[0_0_40px_-12px_rgba(53,224,208,0.5)]";
  const text = isEmber ? "text-ember" : "text-signal";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="group grid gap-8 rounded-3xl border border-white/10 bg-ink-800/40 p-6 backdrop-blur-md md:grid-cols-[0.9fr_1.1fr] md:p-10"
      data-cursor="hover"
    >
      {/* left: info */}
      <div className="flex flex-col">
        <div className="mono mb-4 flex items-center gap-3 text-[0.7rem] tracking-[0.24em] text-muted">
          <span>{n}</span>
          <span className={cx("h-px w-8", isEmber ? "bg-ember/60" : "bg-signal/60")} />
          <span className={text}>{project.domain}</span>
          <span className="text-muted">· {project.year}</span>
        </div>

        <h3 className="font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-2 text-base text-chalk/80">{project.tagline}</p>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        {/* case-study detail: the honest engineering story */}
        <dl className="mt-6 flex flex-col gap-4 border-l border-white/10 pl-4">
          <div>
            <dt className={cx("mono text-[0.62rem] uppercase tracking-[0.22em]", text)}>
              Problem
            </dt>
            <dd className="mt-1 text-[0.9rem] leading-relaxed text-chalk/85">
              {project.problem}
            </dd>
          </div>
          <div>
            <dt className={cx("mono text-[0.62rem] uppercase tracking-[0.22em]", text)}>
              Engineering challenge
            </dt>
            <dd className="mt-1 text-[0.9rem] leading-relaxed text-chalk/85">
              {project.challenge}
            </dd>
          </div>
          <div>
            <dt className={cx("mono text-[0.62rem] uppercase tracking-[0.22em]", text)}>
              Status
            </dt>
            <dd className="mt-1 text-[0.9rem] leading-relaxed text-chalk/85">
              {project.status}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-steel"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className={cx(
                "rounded-md px-4 py-2 text-sm font-medium text-ink-900",
                isEmber ? "bg-ember" : "bg-signal"
              )}
            >
              Live ↗
            </a>
          )}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-chalk hover:border-white/40"
            >
              Code ↗
            </a>
          ) : (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-muted transition-colors hover:border-white/40 hover:text-chalk"
            >
              More on GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* right: animated pipeline */}
      <div className="relative flex flex-col justify-center rounded-2xl border border-white/5 bg-ink-900/50 p-5 sm:p-7">
        <div className="tech-grid pointer-events-none absolute inset-0 rounded-2xl opacity-40" />
        <div className="relative flex flex-col gap-0">
          {project.pipeline.map((stage, i) => (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 * i, duration: 0.5, ease: EASE }}
              className="relative flex items-start gap-4"
            >
              {/* node + connector */}
              <div className="relative flex flex-col items-center">
                <span
                  className={cx(
                    "z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-ink-900",
                    ring,
                    glow
                  )}
                >
                  <span className={cx("h-2 w-2 rounded-full", dot)} />
                </span>
                {i < project.pipeline.length - 1 && (
                  <span className="relative my-0.5 h-10 w-px overflow-hidden bg-white/10">
                    <motion.span
                      initial={{ y: "-100%" }}
                      whileInView={{ y: "100%" }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.12 * i + 0.2,
                        duration: 0.7,
                        ease: "easeInOut",
                      }}
                      className={cx("absolute inset-x-0 h-1/2", dot)}
                    />
                  </span>
                )}
              </div>

              <div className="pb-6">
                <p className="font-display text-sm font-medium text-chalk">
                  {stage.label}
                </p>
                <p className="text-xs leading-relaxed text-muted">{stage.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
