"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { getCircleTexture } from "../shaders/particleTexture";
import { damp, norm, smoothstep } from "@/lib/utils";

/**
 * WORLD 1 — AI / INTELLIGENCE.
 * Scattered particles ORGANIZE into a layered neural network as you scroll,
 * connections form, then the whole structure COMPRESSES toward a central
 * point and brightens into a single signal — the bridge to the next world.
 */
export default function AIWorld({ quality }: { quality: number }) {
  const count = Math.round(1500 * quality);
  const nodeCount = Math.round(80 * quality);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const opacity = useRef(0);

  const { scattered, home, colors, positions } = useMemo(() => {
    const scattered = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const layers = 5;
    const cyan = new THREE.Color("#35E0D0");
    const blue = new THREE.Color("#63B7FF");
    for (let i = 0; i < count; i++) {
      // scattered: large sphere shell
      const r = 6 + Math.random() * 7;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      scattered[i * 3] = r * Math.sin(ph) * Math.cos(th);
      scattered[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      scattered[i * 3 + 2] = r * Math.cos(ph);

      // organized: layered lattice along x (neural layers)
      const layer = Math.floor((i / count) * layers);
      const lx = (layer - (layers - 1) / 2) * 2.4;
      const gy = (Math.random() - 0.5) * 4.6;
      const gz = (Math.random() - 0.5) * 4.6;
      home[i * 3] = lx + (Math.random() - 0.5) * 0.5;
      home[i * 3 + 1] = gy;
      home[i * 3 + 2] = gz;

      const c = cyan.clone().lerp(blue, Math.random() * 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      positions[i * 3] = scattered[i * 3];
      positions[i * 3 + 1] = scattered[i * 3 + 1];
      positions[i * 3 + 2] = scattered[i * 3 + 2];
    }
    return { scattered, home, colors, positions };
  }, [count]);

  // Edges between node particles (indices 0..nodeCount).
  const { edgePositions, edgePairs } = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      const conns = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < conns; k++) {
        const j = Math.min(nodeCount - 1, i + 1 + Math.floor(Math.random() * 6));
        if (j !== i) pairs.push([i, j]);
      }
    }
    return {
      edgePairs: pairs,
      edgePositions: new Float32Array(pairs.length * 6),
    };
  }, [nodeCount]);

  const tex = useMemo(() => getCircleTexture(), []);

  useFrame((_, delta) => {
    const wp = worldProgress.ai;
    opacity.current = damp(opacity.current, wp.vis, 6, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = opacity.current > 0.01;
    if (opacity.current <= 0.01) return;

    const local = wp.local;
    // organize 0..0.55, structured 0.55..0.85, compress 0.85..1
    const orgT = smoothstep(norm(local, 0.05, 0.55));
    const compress = smoothstep(norm(local, 0.82, 1.0));
    const scale = 1 - 0.92 * compress;

    const pos = positions;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const hx = home[ix] * scale;
      const hy = home[ix + 1] * scale;
      const hz = home[ix + 2] * scale;
      pos[ix] = THREE.MathUtils.lerp(scattered[ix], hx, orgT);
      pos[ix + 1] = THREE.MathUtils.lerp(scattered[ix + 1], hy, orgT);
      pos[ix + 2] = THREE.MathUtils.lerp(scattered[ix + 2], hz, orgT);
    }
    const pts = pointsRef.current;
    if (pts) {
      const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
      attr.needsUpdate = true;
      const mat = pts.material as THREE.PointsMaterial;
      mat.opacity = opacity.current * (0.5 + 0.5 * orgT);
      mat.size = (0.06 + 0.05 * compress) * (1 + sceneState.entry * 0.2);
    }

    // edges
    const ep = edgePositions;
    for (let e = 0; e < edgePairs.length; e++) {
      const [a, b] = edgePairs[e];
      const eo = e * 6;
      ep[eo] = pos[a * 3];
      ep[eo + 1] = pos[a * 3 + 1];
      ep[eo + 2] = pos[a * 3 + 2];
      ep[eo + 3] = pos[b * 3];
      ep[eo + 4] = pos[b * 3 + 1];
      ep[eo + 5] = pos[b * 3 + 2];
    }
    const lines = linesRef.current;
    if (lines) {
      const attr = lines.geometry.attributes.position as THREE.BufferAttribute;
      attr.needsUpdate = true;
      const lmat = lines.material as THREE.LineBasicMaterial;
      lmat.opacity = opacity.current * orgT * (1 - compress) * 0.5;
    }

    // central signal core appears during compression
    const core = coreRef.current;
    if (core) {
      const s = 0.15 + compress * 1.1;
      core.scale.setScalar(s);
      (core.material as THREE.MeshBasicMaterial).opacity =
        opacity.current * compress;
    }

    // gentle rotation + mouse parallax
    if (grp) {
      grp.rotation.y = damp(grp.rotation.y, sceneState.mx * 0.25 + local * 0.6, 3, delta);
      grp.rotation.x = damp(grp.rotation.x, -sceneState.my * 0.15, 3, delta);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          map={tex}
          size={0.08}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#35E0D0"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#9BFDF0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
