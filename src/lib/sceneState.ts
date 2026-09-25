/**
 * sceneState.ts — module-level MUTABLE scratch read imperatively inside
 * useFrame. This keeps per-frame values (scroll progress, mouse, entry
 * animation) OFF the React render path → zero re-renders while scrolling.
 *
 * Providers/hooks WRITE here; three components READ here in useFrame.
 */

export const sceneState = {
  /** Global scroll progress 0..1 across the whole page. */
  progress: 0,
  /** Smoothed pointer, -1..1 on each axis (0,0 = centre). */
  mx: 0,
  my: 0,
  /** Raw target pointer (before damping). */
  tmx: 0,
  tmy: 0,
  /** Entry animation 0..1 (driven by START). 0 = dormant, 1 = fully awake. */
  entry: 0,
  /** True once the user pressed START. */
  awake: false,
  /** Viewport aspect helper set by canvas. */
  isMobile: false,
  /** Quality multiplier from device tier (0.5..1). */
  quality: 1,
  /** prefers-reduced-motion flag mirrored for the render loop. */
  reduced: false,
};

export type SceneState = typeof sceneState;
