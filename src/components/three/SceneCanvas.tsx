"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import WorldDirector from "./WorldDirector";
import { useStore } from "@/lib/store";

export default function SceneCanvas() {
  const tier = useStore((s) => s.tier);
  const setCanvasReady = useStore((s) => s.setCanvasReady);
  const quality = tier === "high" ? 1 : tier === "mid" ? 0.72 : 0.5;
  const maxDpr = tier === "high" ? 2 : tier === "mid" ? 1.5 : 1;

  return (
    <Canvas
      dpr={[1, maxDpr]}
      gl={{
        antialias: tier !== "low",
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 7] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        setCanvasReady(true);
      }}
      frameloop="always"
    >
      <WorldDirector quality={quality} />
    </Canvas>
  );
}
