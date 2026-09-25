"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { damp, norm, smoothstep } from "@/lib/utils";

/**
 * WORLD 6 — BUILDER MINDSET (+ studio backdrop).
 * A blueprint wireframe assembles into a solid "working system": idea → design
 * → build → test → working. Small nodes orbit like components under test.
 * Persists softly behind the studio sections (projects/about/skills/contact).
 */
export default function BuilderWorld({ quality }: { quality: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const wireMat = useRef<THREE.LineBasicMaterial>(null);
  const solidMat = useRef<THREE.MeshStandardMaterial>(null);
  const opacity = useRef(0);

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.5, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  const orbitN = Math.round(60 * quality);
  const { nodePos, nodeSeed } = useMemo(() => {
    const nodePos = new Float32Array(orbitN * 3);
    const nodeSeed = new Float32Array(orbitN * 3);
    for (let i = 0; i < orbitN; i++) {
      const r = 2.2 + Math.random() * 1.6;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;
      nodePos[i * 3] = Math.cos(a) * r;
      nodePos[i * 3 + 1] = y;
      nodePos[i * 3 + 2] = Math.sin(a) * r;
      nodeSeed[i * 3] = r;
      nodeSeed[i * 3 + 1] = a;
      nodeSeed[i * 3 + 2] = 0.3 + Math.random() * 0.8;
    }
    return { nodePos, nodeSeed };
  }, [orbitN]);

  useFrame((state, delta) => {
    const b = worldProgress.builder;
    const s = worldProgress.studio;
    const vis = Math.max(b.vis, s.vis * 0.55);
    opacity.current = damp(opacity.current, vis, 6, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = opacity.current > 0.01;
    if (opacity.current <= 0.01) return;

    const built = smoothstep(norm(b.local, 0.1, 0.85));
    const t = state.clock.elapsedTime;

    if (wireMat.current)
      wireMat.current.opacity = opacity.current * (0.7 - 0.4 * built);
    if (solidMat.current) {
      solidMat.current.opacity = opacity.current * built * 0.9;
      solidMat.current.emissiveIntensity = 0.15 + built * 0.4;
    }
    if (solidRef.current) {
      const sc = 0.4 + 0.6 * built;
      solidRef.current.scale.setScalar(sc);
    }

    // orbiting component nodes
    if (nodesRef.current) {
      const arr = nodesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < orbitN; i++) {
        const r = nodeSeed[i * 3];
        const a = nodeSeed[i * 3 + 1] + t * nodeSeed[i * 3 + 2] * 0.4;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 2] = Math.sin(a) * r;
      }
      nodesRef.current.geometry.attributes.position.needsUpdate = true;
      (nodesRef.current.material as THREE.PointsMaterial).opacity =
        opacity.current * 0.8;
    }

    if (grp) {
      grp.rotation.y += delta * 0.15;
      grp.rotation.x = damp(grp.rotation.x, -sceneState.my * 0.1, 3, delta);
      grp.position.x = damp(grp.position.x, sceneState.mx * 0.3, 3, delta);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <lineSegments ref={wireRef} geometry={edges}>
        <lineBasicMaterial
          ref={wireMat}
          color="#35E0D0"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <mesh ref={solidRef} geometry={geo}>
        <meshStandardMaterial
          ref={solidMat}
          color="#0e3b38"
          emissive="#35E0D0"
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0}
          flatShading
        />
      </mesh>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FFA875"
          size={0.07}
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
