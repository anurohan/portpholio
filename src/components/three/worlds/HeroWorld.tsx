"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { getCircleTexture } from "../shaders/particleTexture";
import { clamp, damp } from "@/lib/utils";

/**
 * WORLD 0 — HERO / "AN INTELLIGENT MACHINE WAKING UP".
 *
 * An OFF-CENTRE engineered system on the right ~40% of the frame — never behind
 * the name. It reads top→bottom as one connected machine:
 *   AI CORE (icosa + node cluster, connections activating)
 *     → SIGNAL packets travelling a spine (cyan → amber as they descend)
 *       → CONTROLLER / PCB (traces + indicator lights)
 *         → MECHANICAL (motor + two meshing gears + a small actuator)
 * Motion is layered (ambient drift, core breathing, node activation, signal
 * flow, gear rotation, pointer parallax at different depths). Controlled
 * complexity: rich enough to feel like a robotics-lab visualisation, far
 * lighter than a particle storm. It WAKES with `sceneState.entry` and scroll.
 */
export default function HeroWorld({ quality }: { quality: number }) {
  const dustCount = Math.round(120 * quality); // sparse depth only

  // ---- refs (animated parts) ----
  const groupRef = useRef<THREE.Group>(null);
  const coreWrapRef = useRef<THREE.Group>(null); // parallax layer 1 (nearest)
  const coreSpinRef = useRef<THREE.Group>(null); // breathing + rotation
  const coreEdgesRef = useRef<THREE.LineSegments>(null);
  const clusterLinesRef = useRef<THREE.LineSegments>(null);
  const orbitRef = useRef<THREE.Points>(null);
  const boardWrapRef = useRef<THREE.Group>(null); // parallax layer 2
  const traceRef = useRef<THREE.LineSegments>(null);
  const indicatorRef = useRef<THREE.Points>(null);
  const mechWrapRef = useRef<THREE.Group>(null); // parallax layer 3 (deepest)
  const gearARef = useRef<THREE.Group>(null);
  const gearBRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Mesh>(null);
  const pistonRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const spineRef = useRef<THREE.LineSegments>(null);
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const packetMats = useRef<THREE.MeshBasicMaterial[]>([]);

  const fade = useRef(0);
  const baseOp = useRef<Map<THREE.Material, number>>(new Map());
  const tex = useMemo(() => getCircleTexture(), []);

  // ---- palette ----
  const cyan = useMemo(() => new THREE.Color("#35E0D0"), []);
  const amber = useMemo(() => new THREE.Color("#FFB347"), []);
  const tmpCol = useMemo(() => new THREE.Color(), []);

  /* GEOMETRY */
  const coreEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1)),
    []
  );

  // node cluster hugging the core + nearest-neighbour edges
  const { clusterPos, clusterEdges } = useMemo(() => {
    const N = 14;
    const clusterPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 0.6 + Math.random() * 0.4;
      clusterPos[i * 3] = r * Math.sin(ph) * Math.cos(a);
      clusterPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(a) * 0.85;
      clusterPos[i * 3 + 2] = r * Math.cos(ph);
    }
    const pairs: number[] = [];
    for (let i = 0; i < N; i++) {
      let best = -1;
      let bd = Infinity;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = clusterPos[i * 3] - clusterPos[j * 3];
        const dy = clusterPos[i * 3 + 1] - clusterPos[j * 3 + 1];
        const dz = clusterPos[i * 3 + 2] - clusterPos[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bd) { bd = d; best = j; }
      }
      if (best >= 0) {
        pairs.push(clusterPos[i * 3], clusterPos[i * 3 + 1], clusterPos[i * 3 + 2]);
        pairs.push(clusterPos[best * 3], clusterPos[best * 3 + 1], clusterPos[best * 3 + 2]);
      }
    }
    return { clusterPos, clusterEdges: new Float32Array(pairs) };
  }, []);

  // two faint orbital rings of dots around the core
  const orbitPos = useMemo(() => {
    const ORB = 46;
    const p = new Float32Array(ORB * 3);
    for (let i = 0; i < ORB; i++) {
      const ring = i % 2;
      const r = ring ? 1.28 : 1.02;
      const a = (i / ORB) * Math.PI * 2 * 3;
      const tilt = ring ? 0.5 : -0.32;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      p[i * 3] = x;
      p[i * 3 + 1] = y * Math.cos(tilt);
      p[i * 3 + 2] = y * Math.sin(tilt);
    }
    return p;
  }, []);

  // signal spine (core → board → mechanical) as a smooth curve
  const { spineGeom, curve } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.12, 0),
      new THREE.Vector3(0.02, 0.5, 0.04),
      new THREE.Vector3(0, -0.15, 0.06),
      new THREE.Vector3(0.03, -0.9, 0.02),
      new THREE.Vector3(0.06, -1.55, 0),
    ]);
    const pts = curve.getPoints(56);
    const seg: number[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      seg.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { spineGeom: g, curve };
  }, []);

  // PCB-ish traces on the controller board (local XY)
  const traceGeom = useMemo(() => {
    const seg: number[] = [
      -0.7, 0.16, 0, 0.2, 0.16, 0,
      0.2, 0.16, 0, 0.2, -0.05, 0,
      0.2, -0.05, 0, 0.66, -0.05, 0,
      -0.66, -0.02, 0, -0.28, -0.02, 0,
      -0.28, -0.02, 0, -0.28, -0.22, 0,
      -0.28, -0.22, 0, 0.44, -0.22, 0,
      0.02, 0.16, 0, 0.02, 0.34, 0,
    ];
    return new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: seg.length / 3 }, (_, i) =>
        new THREE.Vector3(seg[i * 3], seg[i * 3 + 1], seg[i * 3 + 2])
      )
    );
  }, []);

  // indicator lights on the board (some cyan, some amber)
  const { indPos, indColors } = useMemo(() => {
    const spots: [number, number, number][] = [
      [-0.66, -0.02, 0.02], [-0.28, 0.16, 0.02], [0.2, 0.16, 0.02],
      [0.66, -0.05, 0.02], [0.44, -0.22, 0.02], [-0.28, -0.22, 0.02],
      [0.02, 0.34, 0.02], [-0.5, 0.16, 0.02],
    ];
    const indPos = new Float32Array(spots.length * 3);
    const indColors = new Float32Array(spots.length * 3);
    spots.forEach((s, i) => {
      indPos[i * 3] = s[0]; indPos[i * 3 + 1] = s[1]; indPos[i * 3 + 2] = s[2];
      const c = i % 3 === 0 ? amber : cyan;
      indColors[i * 3] = c.r; indColors[i * 3 + 1] = c.g; indColors[i * 3 + 2] = c.b;
    });
    return { indPos, indColors };
  }, [amber, cyan]);

  const teethA = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  const teethB = useMemo(() => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2), []);

  // sparse depth dust around the whole system
  const { dustPos, dustSpeed } = useMemo(() => {
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 4;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      dustSpeed[i] = 0.05 + Math.random() * 0.16;
    }
    return { dustPos, dustSpeed };
  }, [dustCount]);


  /* FRAME */
  const PK_BASE = 0.95;
  useFrame((state, delta) => {
    const wp = worldProgress.hero;
    fade.current = damp(fade.current, wp.vis, 5, delta);
    const grp = groupRef.current;
    if (grp) grp.visible = fade.current > 0.008;
    if (fade.current <= 0.008) return;

    const t = state.clock.elapsedTime;
    const mo = sceneState.reduced ? 0 : 1;
    const entry = sceneState.entry; // 0 dormant → 1 awake
    const spd = 0.6 + 0.6 * entry; // everything speeds up a touch on wake
    const mx = sceneState.mx;
    const my = sceneState.my;

    // uniform fade-in: capture each material's intended opacity once, scale it.
    if (grp) {
      grp.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m && "opacity" in m) {
          if (!baseOp.current.has(m)) baseOp.current.set(m, (m as THREE.Material & { opacity: number }).opacity);
          m.transparent = true;
          (m as THREE.Material & { opacity: number }).opacity =
            baseOp.current.get(m)! * fade.current;
        }
      });
    }

    // ambient drift of the whole system + gentle pointer sway
    if (grp) grp.rotation.y = damp(grp.rotation.y, mx * 0.1 + t * 0.02 * mo, 2.5, delta);

    // ---- parallax layers (different depths move differently) ----
    if (coreWrapRef.current) {
      coreWrapRef.current.position.x = damp(coreWrapRef.current.position.x, mx * 0.22, 3, delta);
      coreWrapRef.current.position.y = damp(coreWrapRef.current.position.y, 1.55 - my * 0.12, 3, delta);
    }
    if (boardWrapRef.current) {
      boardWrapRef.current.position.x = damp(boardWrapRef.current.position.x, mx * 0.13, 3, delta);
      boardWrapRef.current.position.y = damp(boardWrapRef.current.position.y, -0.15 - my * 0.07, 3, delta);
    }
    if (mechWrapRef.current) {
      mechWrapRef.current.position.x = damp(mechWrapRef.current.position.x, 0.05 + mx * 0.06, 3, delta);
      mechWrapRef.current.position.y = damp(mechWrapRef.current.position.y, -1.72 - my * 0.04, 3, delta);
    }

    // ---- AI core: breathing + slow rotation, edges pulse ----
    if (coreSpinRef.current) {
      coreSpinRef.current.rotation.y += delta * 0.25 * mo;
      coreSpinRef.current.rotation.x = damp(coreSpinRef.current.rotation.x, my * 0.2, 3, delta);
      const s = 1 + Math.sin(t * 1.2) * 0.04 * mo + entry * 0.06;
      coreSpinRef.current.scale.setScalar(s);
    }
    if (coreEdgesRef.current) {
      const m = coreEdgesRef.current.material as THREE.LineBasicMaterial;
      m.opacity = (baseOp.current.get(m) ?? 0.7) * fade.current * (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 0.9)));
    }
    if (clusterLinesRef.current) {
      const m = clusterLinesRef.current.material as THREE.LineBasicMaterial;
      const act = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.7 * mo));
      m.opacity = (baseOp.current.get(m) ?? 0.4) * fade.current * act;
    }
    if (orbitRef.current) orbitRef.current.rotation.z += delta * 0.08 * mo;

    // ---- signal packets travelling the spine (cyan → amber) ----
    for (let i = 0; i < packetRefs.current.length; i++) {
      const mesh = packetRefs.current[i];
      const mat = packetMats.current[i];
      if (!mesh || !mat) continue;
      const base = i * 0.5;
      const tp = mo ? (t * 0.13 * spd + base) % 1 : base;
      const p = curve.getPoint(tp);
      mesh.position.set(p.x, p.y, p.z);
      const env = Math.sin(clamp(tp) * Math.PI);
      const sc = 0.05 + 0.03 * env;
      mesh.scale.setScalar(sc);
      tmpCol.copy(cyan).lerp(amber, tp);
      mat.color.copy(tmpCol);
      mat.opacity = PK_BASE * fade.current * (0.35 + 0.65 * env);
    }

    // ---- controller: traces + indicators shimmer ----
    if (traceRef.current) {
      const m = traceRef.current.material as THREE.LineBasicMaterial;
      m.opacity = (baseOp.current.get(m) ?? 0.4) * fade.current * (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2.2 * mo)));
    }
    if (indicatorRef.current) {
      const m = indicatorRef.current.material as THREE.PointsMaterial;
      m.size = 0.06 + 0.02 * (0.5 + 0.5 * Math.sin(t * 3 * mo));
    }

    // ---- mechanical: gears mesh, actuator reciprocates ----
    const a = t * 0.5 * spd * mo;
    if (gearARef.current) gearARef.current.rotation.z = a;
    if (gearBRef.current) gearBRef.current.rotation.z = -a * 1.5;
    // crank-slider off gear B (local mech coords; gearB centred at x=0.34)
    const theta = -a * 1.5;
    const rc = 0.12;
    const rod = 0.36;
    const pinX = 0.34 + rc * Math.cos(theta);
    const pinY = rc * Math.sin(theta);
    const s = Math.sqrt(Math.max(0, rod * rod - pinY * pinY));
    const pistonX = pinX + s;
    if (pistonRef.current) pistonRef.current.position.x = pistonX;
    if (rodRef.current) {
      const dx = pistonX - pinX;
      const dy = -pinY;
      rodRef.current.position.set((pinX + pistonX) / 2, (pinY + 0) / 2, 0);
      rodRef.current.rotation.z = Math.atan2(dy, dx);
      rodRef.current.scale.x = Math.hypot(dx, dy);
    }

    // ---- depth dust ----
    if (dustRef.current && mo) {
      const arr = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        arr[i * 3 + 1] += delta * dustSpeed[i];
        if (arr[i * 3 + 1] > 3) arr[i * 3 + 1] = -3;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });


  /* JSX */
  return (
    <group ref={groupRef} position={[2.2, 0, -0.4]} visible={false}>
      {/* sparse depth dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={tex}
          color="#35E0D0"
          size={0.028}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* signal spine */}
      <lineSegments ref={spineRef} geometry={spineGeom}>
        <lineBasicMaterial
          color="#35E0D0"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* travelling signal packets */}
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) packetRefs.current[i] = el; }}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            ref={(el) => { if (el) packetMats.current[i] = el; }}
            color="#7CF0E4"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* ================= AI CORE ================= */}
      <group ref={coreWrapRef} position={[0, 1.55, 0]}>
        <group ref={coreSpinRef}>
          <lineSegments ref={coreEdgesRef} geometry={coreEdges}>
            <lineBasicMaterial
              color="#7CF0E4"
              transparent
              opacity={0.7}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[clusterPos, 3]} />
            </bufferGeometry>
            <pointsMaterial
              map={tex}
              color="#9BFDF0"
              size={0.075}
              transparent
              opacity={0.95}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              sizeAttenuation
            />
          </points>
          <lineSegments ref={clusterLinesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[clusterEdges, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#35E0D0"
              transparent
              opacity={0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        </group>
        <points ref={orbitRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[orbitPos, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={tex}
            color="#35E0D0"
            size={0.04}
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      </group>

      {/* ================= CONTROLLER / PCB ================= */}
      <group ref={boardWrapRef} position={[0, -0.15, 0]}>
        <mesh>
          <boxGeometry args={[1.7, 0.92, 0.05]} />
          <meshStandardMaterial
            color="#0b171c"
            metalness={0.35}
            roughness={0.65}
            transparent
            opacity={0.92}
          />
        </mesh>
        <lineSegments ref={traceRef} geometry={traceGeom} position={[0, 0, 0.03]}>
          <lineBasicMaterial
            color="#35E0D0"
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
        <points ref={indicatorRef} position={[0, 0, 0.03]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[indPos, 3]} />
            <bufferAttribute attach="attributes-color" args={[indColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            map={tex}
            size={0.07}
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
        {/* a small processor chip */}
        <mesh position={[0.02, 0.05, 0.05]}>
          <boxGeometry args={[0.34, 0.34, 0.06]} />
          <meshStandardMaterial color="#12232a" metalness={0.5} roughness={0.5} transparent opacity={0.95} />
        </mesh>
      </group>

      {/* ================= MECHANICAL ================= */}
      <group ref={mechWrapRef} position={[0.05, -1.72, 0]}>
        {/* motor body, coaxial behind gear A */}
        <mesh position={[-0.15, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.3, 24]} />
          <meshStandardMaterial color="#6b7c8b" metalness={0.85} roughness={0.35} transparent opacity={0.95} />
        </mesh>

        {/* gear A */}
        <group ref={gearARef} position={[-0.15, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 28]} />
            <meshStandardMaterial color="#8fa3b8" metalness={0.85} roughness={0.32} transparent opacity={0.95} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
            <meshStandardMaterial color="#5a6b7a" metalness={0.9} roughness={0.3} transparent opacity={0.95} />
          </mesh>
          {teethA.map((ang, i) => (
            <mesh key={i} position={[Math.cos(ang) * 0.35, Math.sin(ang) * 0.35, 0]} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.08, 0.05, 0.08]} />
              <meshStandardMaterial color="#8fa3b8" metalness={0.85} roughness={0.32} transparent opacity={0.95} />
            </mesh>
          ))}
        </group>

        {/* gear B (meshes with A) */}
        <group ref={gearBRef} position={[0.34, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.07, 24]} />
            <meshStandardMaterial color="#7d8ea0" metalness={0.85} roughness={0.34} transparent opacity={0.95} />
          </mesh>
          {teethB.map((ang, i) => (
            <mesh key={i} position={[Math.cos(ang) * 0.23, Math.sin(ang) * 0.23, 0]} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.07, 0.045, 0.07]} />
              <meshStandardMaterial color="#7d8ea0" metalness={0.85} roughness={0.34} transparent opacity={0.95} />
            </mesh>
          ))}
          {/* crank pin (amber) */}
          <mesh position={[0.12, 0, 0.05]}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
            <meshStandardMaterial color="#FFB347" emissive="#FF7A3D" emissiveIntensity={0.5} metalness={0.6} roughness={0.4} transparent opacity={0.95} />
          </mesh>
        </group>

        {/* connecting rod + piston (actuator) */}
        <mesh ref={rodRef}>
          <boxGeometry args={[1, 0.035, 0.035]} />
          <meshStandardMaterial color="#a9b7c4" metalness={0.8} roughness={0.35} transparent opacity={0.95} />
        </mesh>
        <mesh ref={pistonRef} position={[0.85, 0, 0]}>
          <boxGeometry args={[0.16, 0.14, 0.14]} />
          <meshStandardMaterial color="#8fa3b8" metalness={0.85} roughness={0.3} transparent opacity={0.95} />
        </mesh>
        {/* actuator guide rail */}
        <mesh position={[1.0, 0, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.2]} />
          <meshStandardMaterial color="#3a4854" metalness={0.6} roughness={0.6} transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );

}
