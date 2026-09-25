/** theme.ts — per-world colour language (accents only, no rainbow). */

export type Palette = {
  key: string;
  bg: [number, number, number]; // scene/fog base, 0..1 linear-ish rgb
  bgCss: string; // page background hex
  accent: string; // primary accent hex
  accent2: string; // secondary accent hex
  fog: number; // fog density hint
};

/** Ordered to match the scroll narrative. Cool signal → warm ember. */
export const palettes: Record<string, Palette> = {
  hero: {
    key: "hero",
    bg: [0.031, 0.043, 0.062],
    bgCss: "#080B10",
    accent: "#35E0D0",
    accent2: "#7CF0E4",
    fog: 0.04,
  },
  ai: {
    key: "ai",
    bg: [0.027, 0.055, 0.07],
    bgCss: "#07121A",
    accent: "#35E0D0",
    accent2: "#63B7FF",
    fog: 0.05,
  },
  electronics: {
    key: "electronics",
    bg: [0.05, 0.045, 0.035],
    bgCss: "#120E0A",
    accent: "#FFB347",
    accent2: "#35E0D0",
    fog: 0.06,
  },
  robotics: {
    key: "robotics",
    bg: [0.04, 0.043, 0.05],
    bgCss: "#0C0F14",
    accent: "#FF7A3D",
    accent2: "#8FA3B8",
    fog: 0.055,
  },
  mechanical: {
    key: "mechanical",
    bg: [0.05, 0.048, 0.044],
    bgCss: "#12100C",
    accent: "#C9803B",
    accent2: "#8FA3B8",
    fog: 0.05,
  },
  builder: {
    key: "builder",
    bg: [0.035, 0.05, 0.058],
    bgCss: "#0A1014",
    accent: "#35E0D0",
    accent2: "#FF7A3D",
    fog: 0.045,
  },
  studio: {
    key: "studio",
    bg: [0.043, 0.05, 0.058],
    bgCss: "#0A0E13",
    accent: "#35E0D0",
    accent2: "#FF7A3D",
    fog: 0.03,
  },
};

export const orderedPaletteKeys = [
  "hero",
  "ai",
  "electronics",
  "robotics",
  "mechanical",
  "builder",
  "studio",
] as const;
