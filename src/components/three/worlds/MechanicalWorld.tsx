"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { damp } from "@/lib/utils";

/** A single gear: hub + rim + ring of teeth. Rotation driven by parent. */
function Gear({
  radius,
  teeth,
  thickness = 0.35,
  color = "#8FA3B8",
  accent = "#C9803B",
  position = [0, 0, 0],
  gearRef,
  matReg,
}: {
  radius: number;
  teeth: number;
  thickness?: number;
  color?: string;
  accent?: string;
  position?: [number, number, number];
  gearRef: (g: THREE.Group | null) => void;
  matReg: (m: THREE.Material | null) => void;
}) {
  const toothW = (radius * Math.PI) / teeth;
  const items = useMemo(
    () => Array.from({ length: teeth }, (_, i) => (i / teeth) * Math.PI * 2),
    [teeth]
  );
  return (
    <group ref={gearRef} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, thickness, 40]} />
        <meshStandardMaterial
          ref={matReg}
          color={color}
          metalness={0.9}
          roughness={0.35}
          transparent
        />
      </mesh>
      {/* hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.28, radius * 0.28, thickness * 1.1, 20]} />
        <meshStandardMaterial
          ref={matReg}
          color={accent}
          metalness={0.8}
          roughness={0.3}
          emissive={accent}
          emissiveIntensity={0.12}
          transparent
        />
      </mesh>
      {/* teeth */}
      {items.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
          rotation={[0, 0, a]}
        >
          <boxGeometry args={[toothW * 0.9, toothW * 0.9, thickness]} />
          <meshStandardMaterial
            ref={matReg}
            color={color}
            metalness={0.9}
            roughness={0.35}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * WORLD 5 — MECHANICS.
 * A real gear train: the driver gear turns a shaft, meshing gears respond with
 * correct counter-rotation and speed ratios. Scroll drives the mechanism.
 */
export default function MechanicalWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const g1 = useRef<THREE.Group | null>(null);
  const g2 = useRef<THREE.Group | null>(null);
  const g3 = useRef<THREE.Group | null>(null);
  const shaft = useRef<THREE.Mesh>(null);
  const crank = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Mesh>(null);
  const piston = useRef<THREE.Mesh>(null);
  const opacity = useRef(0);
  const mats = useRef<THREE.Material[]>([]);
  const angle = useRef(0);

  const matReg = (m: THREE.Material | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };

  // radii & teeth chosen so gears mesh (centre distance = r1 + r2)
  const R1 = 1.35;
  const R2 = 0.95;
  const R3 = 0.7;

  // crank-slider (a real reciprocating piston driven by the train)
  const CX = -1.3;
  const CY = -1.9;
  const RC = 0.42; // crank radius
  const ROD = 1.7; // connecting-rod length

  useFrame((_, delta) => {
    const wp = worldProgress.mechanical;
    opacity.current = damp(opacity.current, wp.vis, 6, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = opacity.current > 0.01;
    if (opacity.current <= 0.01) return;

    const local = wp.local;
    // Scroll drives the mechanism; a little idle spin keeps it alive.
    const target = local * Math.PI * 6;
    angle.current = damp(angle.current, target, 4, delta) + delta * 0.25;
    const a = angle.current;

    for (const m of mats.current) {
      (m as THREE.MeshStandardMaterial).opacity = opacity.current;
    }
    if (g1.current) g1.current.rotation.z = a;
    // meshing: opposite direction, speed ratio by radius
    if (g2.current) g2.current.rotation.z = -a * (R1 / R2);
    if (g3.current) g3.current.rotation.z = a * (R2 / R3) * (R1 / R2);
    if (shaft.current) shaft.current.rotation.z = a;

    // crank-slider kinematics: crank pin → connecting rod → sliding piston
    if (crank.current) crank.current.rotation.z = a;
    const pinX = CX + RC * Math.cos(a);
    const pinY = CY + RC * Math.sin(a);
    const s = Math.sqrt(Math.max(0, ROD * ROD - RC * RC * Math.sin(a) * Math.sin(a)));
    const pistonX = CX + RC * Math.cos(a) + s;
    if (piston.current) piston.current.position.x = pistonX;
    if (rod.current) {
      const dx = pistonX - pinX;
      const dy = CY - pinY;
      const len = Math.hypot(dx, dy);
      rod.current.position.set((pinX + pistonX) / 2, (pinY + CY) / 2, 0);
      rod.current.rotation.z = Math.atan2(dy, dx);
      rod.current.scale.x = len; // base rod geometry length = 1
    }

    if (grp) {
      grp.rotation.y = damp(grp.rotation.y, sceneState.mx * 0.25, 3, delta);
      grp.rotation.x = damp(grp.rotation.x, 0.15 - sceneState.my * 0.1, 3, delta);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <Gear
        radius={R1}
        teeth={18}
        color="#8FA3B8"
        accent="#C9803B"
        position={[-1.3, 0.2, 0]}
        gearRef={(g) => (g1.current = g)}
        matReg={matReg}
      />
      <Gear
        radius={R2}
        teeth={13}
        color="#A7B6C6"
        accent="#FF7A3D"
        position={[R1 + R2 - 1.3, 0.2, 0]}
        gearRef={(g) => (g2.current = g)}
        matReg={matReg}
      />
      <Gear
        radius={R3}
        teeth={10}
        color="#8FA3B8"
        accent="#C9803B"
        position={[R1 + R2 + R2 + R3 - 1.3, 0.2, 0]}
        gearRef={(g) => (g3.current = g)}
        matReg={matReg}
      />
      {/* driven shaft behind gear 1 */}
      <mesh ref={shaft} position={[-1.3, 0.2, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 2.4, 16]} />
        <meshStandardMaterial
          ref={matReg}
          color="#6d7d8c"
          metalness={0.9}
          roughness={0.3}
          transparent
        />
      </mesh>

      {/* CRANK-SLIDER: the gear train drives a reciprocating piston */}
      <group ref={crank} position={[CX, CY, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[RC + 0.12, RC + 0.12, 0.16, 24]} />
          <meshStandardMaterial
            ref={matReg}
            color="#8FA3B8"
            metalness={0.9}
            roughness={0.35}
            transparent
          />
        </mesh>
        {/* crank pin */}
        <mesh position={[RC, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.3, 12]} />
          <meshStandardMaterial
            ref={matReg}
            color="#FF7A3D"
            metalness={0.7}
            roughness={0.3}
            emissive="#FF7A3D"
            emissiveIntensity={0.15}
            transparent
          />
        </mesh>
      </group>
      {/* connecting rod (base length 1 → scaled to fit each frame) */}
      <mesh ref={rod}>
        <boxGeometry args={[1, 0.09, 0.09]} />
        <meshStandardMaterial
          ref={matReg}
          color="#A7B6C6"
          metalness={0.85}
          roughness={0.3}
          transparent
        />
      </mesh>
      {/* piston head sliding on the y = CY line */}
      <mesh ref={piston} position={[CX + RC + ROD, CY, 0]}>
        <boxGeometry args={[0.5, 0.42, 0.42]} />
        <meshStandardMaterial
          ref={matReg}
          color="#C9803B"
          metalness={0.9}
          roughness={0.28}
          transparent
        />
      </mesh>
      {/* cylinder housing the piston reciprocates in */}
      <mesh position={[CX + RC + ROD + 0.55, CY, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.4, 20, 1, true]} />
        <meshStandardMaterial
          ref={matReg}
          color="#6d7d8c"
          metalness={0.85}
          roughness={0.4}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}
