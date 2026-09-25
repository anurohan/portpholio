"use client";

import { create } from "zustand";
import type { WorldKey } from "./site";

export type Phase = "intro" | "entering" | "live";
export type Tier = "low" | "mid" | "high";

type State = {
  phase: Phase;
  activeSection: WorldKey;
  tier: Tier;
  reducedMotion: boolean;
  navOpen: boolean;
  canvasReady: boolean;

  start: () => void; // intro -> entering
  enterComplete: () => void; // entering -> live
  setActiveSection: (s: WorldKey) => void;
  setTier: (t: Tier) => void;
  setReducedMotion: (v: boolean) => void;
  setNavOpen: (v: boolean) => void;
  setCanvasReady: (v: boolean) => void;
};

export const useStore = create<State>((set) => ({
  // Start in "intro" so the START button is in the very first paint (incl. SSR).
  phase: "intro",
  activeSection: "hero",
  tier: "high",
  reducedMotion: false,
  navOpen: false,
  canvasReady: false,

  start: () => set({ phase: "entering" }),
  enterComplete: () => set({ phase: "live" }),
  setActiveSection: (s) => set({ activeSection: s }),
  setTier: (t) => set({ tier: t }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setNavOpen: (v) => set({ navOpen: v }),
  setCanvasReady: (v) => set({ canvasReady: v }),
}));
