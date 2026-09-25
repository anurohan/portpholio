/** utils.ts — tiny shared helpers (no deps). */

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

/** Map x from [a,b] to [0,1], clamped. */
export const norm = (x: number, a: number, b: number) =>
  clamp((x - a) / (b - a || 1));

/** Smoothstep easing on a 0..1 input. */
export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate independent damping toward a target.
 * `lambda` ~ higher = snappier. `dt` in seconds.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Concatenate class names, skipping falsy. */
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/**
 * Returns 1 while progress is inside [start,end] with a `fade` ramp on each
 * edge, else 0..1 on the ramps and 0 outside. Used to cross-fade worlds.
 */
export const window01 = (p: number, start: number, end: number, fade = 0.06) => {
  if (p <= start - fade || p >= end + fade) return 0;
  if (p < start) return smoothstep((p - (start - fade)) / fade);
  if (p > end) return 1 - smoothstep((p - end) / fade);
  return 1;
};
