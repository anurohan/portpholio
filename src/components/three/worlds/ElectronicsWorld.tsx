"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { clamp, damp, norm, smoothstep } from "@/lib/utils";

/**
 * WORLD 3 — ELECTRONICS.
 * A PCB fades in, copper traces draw across it, components drop into place and
 * assemble, then signal pulses travel the traces and LEDs respond — the board
 * comes alive. (The AI signal core hands off into this board.)
 */
const GRID = 4.6;

export default function ElectronicsWorld({ quality }: { quality: number }) {
  const compCount = Math.round(26 * quality);
  const ledCount = Math.round(14 * quality);

  const groupRef = useRef<THREE.Group>(null);
  const compRef = useRef<THREE.InstancedMesh>(null);
  const capRef = useRef<THREE.InstancedMesh>(null);
  const ledRef = useRef<THREE.InstancedMesh>(null);
  const tracesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const boardMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const opacity = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // component + led layout on the board
  const comps = useMemo(
    () =>
      Array.from({ length: compCount }, () => ({
        x: (Math.random() - 0.5) * GRID,
        z: (Math.random() - 0.5) * GRID,
        w: 0.28 + Math.random() * 0.5,
        d: 0.28 + Math.random() * 0.5,
        h: 0.12 + Math.random() * 0.22,
        drop: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        order: Math.random(),
      })),
    [compCount]
  );
  const caps = useMemo(
    () =>
      Array.from({ length: Math.round(compCount * 0.5) }, () => ({
        x: (Math.random() - 0.5) * GRID,
        z: (Math.random() - 0.5) * GRID,
        r: 0.12 + Math.random() * 0.12,
        h: 0.3 + Math.random() * 0.4,
        drop: 2 + Math.random() * 3,
        order: Math.random(),
      })),
    [compCount]
  );
  const leds = useMemo(
    () =>
      Array.from({ length: ledCount }, () => ({
        x: (Math.random() - 0.5) * GRID,
        z: (Math.random() - 0.5) * GRID,
        phase: Math.random() * Math.PI * 2,
      })),
    [ledCount]
  );

  // Manhattan-routed copper traces + a parametric path for signal pulses.
  const { traceGeom, pulsePositions, pulseParam, pathPts } = useMemo(() => {
    const seg: number[] = [];
    const n = Math.round(30 * quality);
    for (let i = 0; i < n; i++) {
      const x0 = (Math.random() - 0.5) * GRID;
      const z0 = (Math.random() - 0.5) * GRID;
      const x1 = (Math.random() - 0.5) * GRID;
      const z1 = (Math.random() - 0.5) * GRID;
      // L-shape: (x0,z0)->(x1,z0)->(x1,z1)
      seg.push(x0, 0.02, z0, x1, 0.02, z0);
      seg.push(x1, 0.02, z0, x1, 0.02, z1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));

    // one long path for signal pulses
    const pts: THREE.Vector3[] = [];
    let cx = -GRID / 2;
    let cz = -GRID / 2;
    for (let i = 0; i < 8; i++) {
      const nx = (Math.random() - 0.5) * GRID;
      pts.push(new THREE.Vector3(cx, 0.05, cz));
      pts.push(new THREE.Vector3(nx, 0.05, cz));
      cx = nx;
      const nz = (Math.random() - 0.5) * GRID;
      pts.push(new THREE.Vector3(cx, 0.05, nz));
      cz = nz;
    }
    const pulseN = Math.round(10 * quality);
    return {
      traceGeom: geo,
      pulsePositions: new Float32Array(pulseN * 3),
      pulseParam: new Float32Array(pulseN).map((_, i) => i / pulseN),
      pathPts: pts,
    };
  }, [quality]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(pathPts), [pathPts]);

  useFrame((state, delta) => {
    const wp = worldProgress.electronics;
    opacity.current = damp(opacity.current, wp.vis, 6, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = opacity.current > 0.01;
    if (opacity.current <= 0.01) return;

    const local = wp.local;
    const draw = smoothstep(norm(local, 0.0, 0.4)); // traces + board in
    const assemble = smoothstep(norm(local, 0.35, 0.75));
    const alive = smoothstep(norm(local, 0.7, 1.0));
    const t = state.clock.elapsedTime;

    if (boardMatRef.current) {
      boardMatRef.current.opacity = opacity.current;
      boardMatRef.current.emissiveIntensity = 0.15 + alive * 0.5;
    }

    // components rise & assemble
    if (compRef.current) {
      comps.forEach((c, i) => {
        const p = clamp((assemble - c.order * 0.5) / 0.5);
        const y = THREE.MathUtils.lerp(c.drop, c.h / 2 + 0.02, smoothstep(p));
        dummy.position.set(c.x, y, c.z);
        dummy.rotation.set(0, c.rot, 0);
        dummy.scale.set(c.w, c.h, c.d);
        dummy.updateMatrix();
        compRef.current!.setMatrixAt(i, dummy.matrix);
      });
      compRef.current.instanceMatrix.needsUpdate = true;
      (compRef.current.material as THREE.MeshStandardMaterial).opacity =
        opacity.current;
    }
    if (capRef.current) {
      caps.forEach((c, i) => {
        const p = clamp((assemble - c.order * 0.5) / 0.5);
        const y = THREE.MathUtils.lerp(c.drop, c.h / 2 + 0.02, smoothstep(p));
        dummy.position.set(c.x, y, c.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(c.r, c.h, c.r);
        dummy.updateMatrix();
        capRef.current!.setMatrixAt(i, dummy.matrix);
      });
      capRef.current.instanceMatrix.needsUpdate = true;
      (capRef.current.material as THREE.MeshStandardMaterial).opacity =
        opacity.current;
    }

    // LEDs pulse when alive
    if (ledRef.current) {
      leds.forEach((l, i) => {
        const blink = 0.5 + 0.5 * Math.sin(t * 3 + l.phase);
        const s = (0.06 + 0.05 * blink) * (0.2 + alive);
        dummy.position.set(l.x, 0.08, l.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        ledRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ledRef.current.instanceMatrix.needsUpdate = true;
      (ledRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity.current * (0.3 + alive);
    }

    // traces draw-in / glow
    if (tracesRef.current) {
      (tracesRef.current.material as THREE.LineBasicMaterial).opacity =
        opacity.current * (0.25 + 0.55 * draw);
    }

    // signal pulses travel the path
    if (pulseRef.current) {
      for (let i = 0; i < pulseParam.length; i++) {
        pulseParam[i] = (pulseParam[i] + delta * (0.06 + 0.12 * alive)) % 1;
        const v = curve.getPoint(pulseParam[i]);
        pulsePositions[i * 3] = v.x;
        pulsePositions[i * 3 + 1] = v.y;
        pulsePositions[i * 3 + 2] = v.z;
      }
      const attr = pulseRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      attr.needsUpdate = true;
      (pulseRef.current.material as THREE.PointsMaterial).opacity =
        opacity.current * alive;
    }

    if (grp) {
      grp.rotation.y = damp(grp.rotation.y, -0.35 + sceneState.mx * 0.2 + local * 0.3, 3, delta);
      grp.rotation.x = damp(grp.rotation.x, 0.62 - sceneState.my * 0.1 - local * 0.15, 3, delta);
    }
  });

  return (
    <group ref={groupRef} visible={false} position={[0, -0.3, 0]}>
      {/* board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[GRID + 1.2, GRID + 1.2, 1, 1]} />
        <meshStandardMaterial
          ref={boardMatRef}
          color="#0c2a26"
          emissive="#0c6b5f"
          emissiveIntensity={0.2}
          roughness={0.6}
          metalness={0.2}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* copper traces */}
      <lineSegments ref={tracesRef} geometry={traceGeom}>
        <lineBasicMaterial
          color="#FFB347"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* chips */}
      <instancedMesh
        ref={compRef}
        args={[undefined, undefined, compCount]}
        castShadow={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1a1f26"
          emissive="#FF7A3D"
          emissiveIntensity={0.12}
          roughness={0.5}
          metalness={0.6}
          transparent
          opacity={0}
        />
      </instancedMesh>

      {/* capacitors */}
      <instancedMesh
        ref={capRef}
        args={[undefined, undefined, Math.round(compCount * 0.5)]}
      >
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial
          color="#2a2f36"
          roughness={0.4}
          metalness={0.7}
          transparent
          opacity={0}
        />
      </instancedMesh>

      {/* LEDs */}
      <instancedMesh ref={ledRef} args={[undefined, undefined, ledCount]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial
          color="#7CF0E4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* signal pulses */}
      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FFE0A3"
          size={0.16}
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
