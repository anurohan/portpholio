"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { damp } from "@/lib/utils";

/**
 * ENV FIELD — the one continuous environment that lives BEHIND every world.
 * A receding engineering-floor grid + a sparse depth-dust field. It is always
 * faintly present, and its colour + grid pulse EVOLVE with global scroll
 * progress: cool signal-cyan in the AI stretch, warming to ember/copper in the
 * physical (electronics → mechanical → robotics) stretch, then easing back.
 * This is what makes the whole page feel like a single evolving space instead
 * of six disconnected scenes. Deliberately low-contrast so it never competes
 * with the foreground worlds or the text.
 */
export default function EnvField({ quality }: { quality: number }) {
  const dust = Math.round(150 * quality); // sparse depth, not a starfield

  const gridRef = useRef<THREE.LineSegments>(null);
  const gridMat = useRef<THREE.LineBasicMaterial>(null);
  const dustRef = useRef<THREE.Points>(null);
  const dustMat = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const opacity = useRef(0);
  const colNow = useMemo(() => new THREE.Color("#35E0D0"), []);
  const signal = useMemo(() => new THREE.Color("#35E0D0"), []);
  const ember = useMemo(() => new THREE.Color("#FF7A3D"), []);

  // A flat grid on the floor plane, receding toward the horizon.
  const gridGeom = useMemo(() => {
    const seg: number[] = [];
    const N = 22; // lines each axis
    const S = 44; // total size
    const half = S / 2;
    const step = S / N;
    for (let i = 0; i <= N; i++) {
      const p = -half + i * step;
      seg.push(-half, 0, p, half, 0, p); // lines along X
      seg.push(p, 0, -half, p, 0, half); // lines along Z
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return g;
  }, []);

  // Sparse depth dust spread through a large volume.
  const { dustPos, dustSeed } = useMemo(() => {
    const dustPos = new Float32Array(dust * 3);
    const dustSeed = new Float32Array(dust);
    for (let i = 0; i < dust; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 34;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;
      dustSeed[i] = 0.2 + Math.random() * 0.9;
    }
    return { dustPos, dustSeed };
  }, [dust]);

  useFrame((state, delta) => {
    // fade in with the entry animation, stay subtle
    const target = 0.06 + sceneState.entry * 0.06;
    opacity.current = damp(opacity.current, target, 3, delta);

    // palette morph: peak "physical" warmth in the mid scroll (0.5),
    // cool at both ends (AI intro + return to studio).
    const p = sceneState.progress;
    const warm = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI); // 0→1→0
    colNow.copy(signal).lerp(ember, warm * 0.85);

    const t = state.clock.elapsedTime;

    if (gridMat.current) {
      gridMat.current.color.copy(colNow);
      // gentle breathing pulse so the grid feels alive but calm
      const pulse = sceneState.reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.4);
      gridMat.current.opacity = opacity.current * (0.5 + pulse * 0.5);
    }
    if (dustMat.current) {
      dustMat.current.color.copy(colNow);
      dustMat.current.opacity = opacity.current * 1.1;
    }

    // slow drift of the dust (frozen for reduced motion)
    if (dustRef.current && !sceneState.reduced) {
      const arr = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dust; i++) {
        arr[i * 3 + 1] += delta * dustSeed[i] * 0.25;
        if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -10;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // parallax: the environment counter-drifts to the pointer + sinks with scroll
    if (groupRef.current) {
      groupRef.current.position.y = damp(
        groupRef.current.position.y,
        -6 - sceneState.my * 0.4,
        2,
        delta
      );
      groupRef.current.rotation.y = damp(
        groupRef.current.rotation.y,
        sceneState.mx * 0.06 + p * 0.4,
        2,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -6, -4]}>
      <lineSegments ref={gridRef} geometry={gridGeom}>
        <lineBasicMaterial
          ref={gridMat}
          color="#35E0D0"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points ref={dustRef} position={[0, 6, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMat}
          color="#35E0D0"
          size={0.04}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
