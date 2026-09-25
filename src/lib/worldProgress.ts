/**
 * worldProgress.ts — per-world scroll state, written by WorldDirector each
 * frame (from DOM measurements) and read by individual world components.
 *
 *   vis   : 0..1 how centred/visible the world's section is in the viewport
 *   local : 0..1 progress THROUGH that section (enter bottom → leave top)
 */
export type WorldProgress = { vis: number; local: number };

export const worldProgress: Record<string, WorldProgress> = {
  hero: { vis: 1, local: 0 },
  ai: { vis: 0, local: 0 },
  electronics: { vis: 0, local: 0 },
  robotics: { vis: 0, local: 0 },
  mechanical: { vis: 0, local: 0 },
  builder: { vis: 0, local: 0 },
  studio: { vis: 0, local: 0 },
};

/** World ids that own a distinct 3D environment, in narrative order. */
export const worldOrder = [
  "hero",
  "ai",
  "electronics",
  "robotics",
  "mechanical",
  "builder",
  "studio",
] as const;

/** Which DOM section id represents each world's "studio" grouping. */
export const studioSections = ["projects", "about", "skills", "github", "contact"];
