/**
 * site.ts — section registry + scroll narrative map.
 * The whole page is one continuous scroll. Each section owns a [start,end]
 * slice of global scroll progress (0..1) that the 3D WorldDirector reads to
 * drive the camera, palette and which "world" is visible.
 */

export type WorldKey =
  | "hero"
  | "ai"
  | "electronics"
  | "robotics"
  | "mechanical"
  | "builder"
  | "projects"
  | "about"
  | "skills"
  | "github"
  | "contact";

export type Section = {
  id: WorldKey;
  label: string; // nav label
  index: string; // HUD index e.g. "01"
  world: "hero" | "ai" | "electronics" | "robotics" | "mechanical" | "builder" | "studio";
};

/** Order defines DOM order AND scroll order. */
export const sections: Section[] = [
  { id: "hero", label: "Intro", index: "00", world: "hero" },
  { id: "ai", label: "Intelligence", index: "01", world: "ai" },
  { id: "electronics", label: "Electronics", index: "02", world: "electronics" },
  { id: "robotics", label: "Robotics", index: "03", world: "robotics" },
  { id: "mechanical", label: "Mechanics", index: "04", world: "mechanical" },
  { id: "builder", label: "Builder", index: "05", world: "builder" },
  { id: "projects", label: "Projects", index: "06", world: "studio" },
  { id: "about", label: "About", index: "07", world: "studio" },
  { id: "skills", label: "Skills", index: "08", world: "studio" },
  { id: "github", label: "GitHub", index: "09", world: "studio" },
  { id: "contact", label: "Contact", index: "10", world: "studio" },
];

/** Nav shows a curated subset to stay minimal — the continuous story
 *  (electronics/robotics/mechanics) is reached by scrolling, not nav links. */
export const navSections: WorldKey[] = [
  "ai",
  "projects",
  "skills",
  "about",
  "contact",
];

export const meta = {  title: "Raushan Kumar — AI/ML Engineer & Builder",
  description:
    "Interactive portfolio of Raushan Kumar — B.Tech CS student focused on AI/ML, computer vision and NLP, with a builder's curiosity for electronics, robotics and mechanical systems. From intelligence to machines.",
  keywords: [
    "Raushan Kumar",
    "AI",
    "Machine Learning",
    "Computer Vision",
    "NLP",
    "RAG",
    "Robotics",
    "Electronics",
    "Portfolio",
    "React Three Fiber",
  ],
};

/**
 * Canonical public URL for metadata / sitemap / robots / OG.
 * Set NEXT_PUBLIC_SITE_URL in the environment; falls back to a sane default.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://portpholio-git-main-anurohans-projects.vercel.app"
).replace(/\/$/, "");
