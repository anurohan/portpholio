"use client";

import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";

// The whole WebGL scene is client-only and code-split out of the initial bundle.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Fixed, full-viewport 3D backdrop that sits behind all content.
 * Content sections scroll over it; the scene reacts to scroll + mouse.
 */
export default function Background() {
  const tier = useStore((s) => s.tier);
  // Extremely weak devices: skip WebGL entirely, show a static gradient.
  const skip3D = tier === "low" && typeof window !== "undefined" &&
    Math.min(window.innerWidth, window.innerHeight) < 380;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "#080B10" }}
    >
      {!skip3D && <SceneCanvas />}
      {/* subtle top/bottom vignette for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_55%,rgba(8,11,16,0.55)_100%)]" />
    </div>
  );
}
