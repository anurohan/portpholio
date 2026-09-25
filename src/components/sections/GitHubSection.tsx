"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section, Eyebrow, Reveal, revealItem } from "./Section";
import { profile } from "@/content/profile";
import type { RepoDTO } from "@/lib/github";
import { cx } from "@/lib/utils";

const langColor: Record<string, string> = {
  Python: "#3b82f6",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Jupyter: "#da5b0b",
  "Jupyter Notebook": "#da5b0b",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "";
  const days = Math.floor((Date.now() - d) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<RepoDTO[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "empty">("loading");

  useEffect(() => {
    let alive = true;
    fetch("/api/github")
      .then((r) => r.json())
      .then((data: { ok: boolean; repos: RepoDTO[] }) => {
        if (!alive) return;
        if (data.ok && data.repos.length > 0) {
          setRepos(data.repos);
          setState("ok");
        } else {
          setState("empty");
        }
      })
      .catch(() => alive && setState("empty"));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Section id="github" scrim="left" min="min-h-screen">
      <Reveal className="mb-12 max-w-2xl">
        <Eyebrow index="09">Open source</Eyebrow>
        <motion.h2 variants={revealItem} className="display-lg text-chalk">
          Live from GitHub.
        </motion.h2>
        <motion.p variants={revealItem} className="mt-5 text-lg leading-relaxed text-muted">
          Pulled in real time from{" "}
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal underline-offset-4 hover:underline"
            data-cursor="hover"
          >
            @{profile.github}
          </a>
          . No hand-picked screenshots — the actual repositories, as they are.
        </motion.p>
      </Reveal>

      {state === "loading" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-white/8 bg-white/[0.02]"
            />
          ))}
        </div>
      )}

      {state === "ok" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <motion.a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-ink-800/40 p-5 backdrop-blur-md transition-colors hover:border-signal/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-medium text-chalk group-hover:text-signal">
                  {r.name}
                </span>
                <span className="mono text-[0.62rem] text-muted transition-colors group-hover:text-signal">
                  ↗
                </span>
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                {r.description ?? "No description provided."}
              </p>
              <div className="mono mt-4 flex items-center gap-4 text-[0.68rem] text-steel">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: langColor[r.language] ?? "#8FA3B8" }}
                    />
                    {r.language}
                  </span>
                )}
                {r.stars > 0 && <span>★ {r.stars}</span>}
                {r.forks > 0 && <span>⑂ {r.forks}</span>}
                <span className="ml-auto">{timeAgo(r.updatedAt)}</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {state === "empty" && (
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-ink-800/40 p-8 text-center backdrop-blur-md">
            <p className="text-chalk/85">
              Live repositories couldn&apos;t be loaded right now.
            </p>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className={cx(
                "mt-4 inline-block rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink-900"
              )}
            >
              View @{profile.github} on GitHub ↗
            </a>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
