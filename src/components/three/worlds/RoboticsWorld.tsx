"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { damp, lerp, norm, smoothstep } from "@/lib/utils";

/**
 * WORLD 4 — ROBOTICS.
 * An exploded mechatronic arm converges into place as you scroll, then the
 * joints articulate, a motor spins and a sensor pulses — the machine becomes
 * active. This is a visual representation of an engineering interest, not a
 * claim of a specific built robot.
 */
type PartRef = { mesh: THREE.Object3D; home: THREE.Vector3; explode: THREE.Vector3 };

export default function RoboticsWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const motor = useRef<THREE.Mesh>(null);
  const sensorMat = useRef<THREE.MeshBasicMaterial>(null);
  const opacity = useRef(0);
  const parts = useRef<PartRef[]>([]);
  const materials = useRef<THREE.Material[]>([]);

  const reg = (home: [number, number, number], explode: [number, number, number]) => (
    m: THREE.Object3D | null
  ) => {
    if (!m) return;
    if (!parts.current.find((p) => p.mesh === m)) {
      parts.current.push({
        mesh: m,
        home: new THREE.Vector3(...home),
        explode: new THREE.Vector3(...explode),
      });
    }
  };
  const regMat = (m: THREE.Material | null) => {
    if (m && !materials.current.includes(m)) materials.current.push(m);
  };

  const steel = useMemo(
    () => ({ color: "#8FA3B8", metalness: 0.85, roughness: 0.35 }),
    []
  );
  const dark = useMemo(
    () => ({ color: "#2a3038", metalness: 0.7, roughness: 0.4 }),
    []
  );

  useFrame((state, delta) => {
    const wp = worldProgress.robotics;
    opacity.current = damp(opacity.current, wp.vis, 6, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = opacity.current > 0.01;
    if (opacity.current <= 0.01) return;

    const local = wp.local;
    const assemble = smoothstep(norm(local, 0.05, 0.6));
    const alive = smoothstep(norm(local, 0.55, 1));
    const t = state.clock.elapsedTime;

    for (const p of parts.current) {
      p.mesh.position.set(
        lerp(p.explode.x, p.home.x, assemble),
        lerp(p.explode.y, p.home.y, assemble),
        lerp(p.explode.z, p.home.z, assemble)
      );
    }
    for (const m of materials.current) {
      (m as THREE.MeshStandardMaterial).opacity = opacity.current;
      (m as THREE.MeshStandardMaterial).transparent = true;
    }

    if (shoulder.current)
      shoulder.current.rotation.z = Math.sin(t * 0.9) * 0.4 * alive;
    if (elbow.current)
      elbow.current.rotation.z = (0.5 + Math.sin(t * 1.3) * 0.5) * alive;
    if (motor.current) motor.current.rotation.y += delta * 6 * alive;
    if (sensorMat.current)
      sensorMat.current.opacity =
        opacity.current * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 4))) * alive;

    if (grp) {
      grp.rotation.y = damp(grp.rotation.y, sceneState.mx * 0.3 + 0.4, 3, delta);
      grp.rotation.x = damp(grp.rotation.x, -sceneState.my * 0.12, 3, delta);
    }
  });

  return (
    <group ref={groupRef} visible={false} position={[0, -0.4, 0]} scale={0.95}>
      {/* base */}
      <mesh ref={reg([0, -1.1, 0], [0, -3.2, 0])}>
        <cylinderGeometry args={[0.85, 1, 0.4, 24]} />
        <meshStandardMaterial {...dark} transparent ref={regMat} />
      </mesh>
      {/* rotating motor beside base */}
      <mesh ref={motor} position={[1.1, -0.9, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.5, 16]} />
        <meshStandardMaterial
          color="#FF7A3D"
          emissive="#FF7A3D"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.4}
          transparent
          ref={regMat}
        />
      </mesh>

      {/* shoulder pivot */}
      <group ref={shoulder} position={[0, -0.9, 0]}>
        <mesh ref={reg([0, 0, 0], [-2.6, 0.4, 0.6])}>
          <sphereGeometry args={[0.36, 20, 20]} />
          <meshStandardMaterial {...steel} transparent ref={regMat} />
        </mesh>
        {/* link 1 */}
        <mesh ref={reg([0, 0.7, 0], [-3.4, 1.2, 0])}>
          <boxGeometry args={[0.34, 1.5, 0.34]} />
          <meshStandardMaterial {...steel} transparent ref={regMat} />
        </mesh>

        {/* elbow pivot */}
        <group ref={elbow} position={[0, 1.5, 0]}>
          <mesh ref={reg([0, 0, 0], [2.8, 1.4, -0.5])}>
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial {...steel} transparent ref={regMat} />
          </mesh>
          {/* link 2 */}
          <mesh ref={reg([0, 0.65, 0], [3.6, 2.0, 0])}>
            <boxGeometry args={[0.28, 1.3, 0.28]} />
            <meshStandardMaterial {...steel} transparent ref={regMat} />
          </mesh>
          {/* end effector */}
          <mesh ref={reg([0, 1.35, 0], [3.2, 3.0, 0.8])}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            <meshStandardMaterial {...dark} transparent ref={regMat} />
          </mesh>
          {/* sensor */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              ref={sensorMat}
              color="#7CF0E4"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
