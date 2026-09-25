"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress } from "@/lib/worldProgress";
import { clamp, norm, smoothstep } from "@/lib/utils";

/**
 * SIGNAL BRIDGE — the AI → ELECTRONICS handoff made literal.
 * As the neural network compresses into a single point and the scroll crosses
 * from the AI world into Electronics, a luminous packet detaches from where the
 * AI core lives and TRAVELS down into the circuit board, its colour morphing
 * from signal-cyan (thought) to ember (current). A short tracer trails behind
 * it. This is the one moment that says, without words: the decision has become
 * a signal, and the signal is now electricity entering hardware.
 *
 * It is intentionally brief and only visible during the transition band, so it
 * never competes with either world — it is the seam between them.
 */
export default function SignalBridge() {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const packetMat = useRef<THREE.MeshBasicMaterial>(null);
  const tracerRef = useRef<THREE.Mesh>(null);
  const tracerMat = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);

  const colNow = useMemo(() => new THREE.Color("#9BFDF0"), []);
  const cyan = useMemo(() => new THREE.Color("#35E0D0"), []);
  const ember = useMemo(() => new THREE.Color("#FF7A3D"), []);

  // Travel path: from where the AI core sits, down onto the board plane.
  const FROM = useMemo(() => new THREE.Vector3(0, 2.6, 0.2), []);
  const TO = useMemo(() => new THREE.Vector3(0, -0.1, 0.3), []);

  useFrame(() => {
    const e = worldProgress.electronics;

    // t = how far we are into the entrance of the electronics world (0..1).
    // The packet travels across this band; opacity peaks in the middle so it
    // eases in from the AI side and eases out as the board takes over.
    const t = smoothstep(norm(e.local, 0.0, 0.5));
    const env = Math.sin(clamp(t) * Math.PI); // 0 → 1 → 0
    const op = clamp(e.vis) * env;

    const grp = groupRef.current;
    if (grp) grp.visible = op > 0.02;
    if (op <= 0.02) return;

    // position along the path
    const y = THREE.MathUtils.lerp(FROM.y, TO.y, t);
    const z = THREE.MathUtils.lerp(FROM.z, TO.z, t);
    if (packetRef.current) {
      packetRef.current.position.set(0, y, z);
      const s = 0.12 + 0.06 * env;
      packetRef.current.scale.setScalar(s);
    }
    // tracer sits just above the packet, pointing back up the path
    if (tracerRef.current) {
      tracerRef.current.position.set(0, y + 0.45, z);
    }
    if (haloRef.current) {
      haloRef.current.position.set(0, y, z);
      haloRef.current.scale.setScalar(0.5 + env * 0.7);
    }

    // colour morphs cyan → ember as it descends into the hardware
    colNow.copy(cyan).lerp(ember, t);
    if (packetMat.current) {
      packetMat.current.color.copy(colNow);
      packetMat.current.opacity = op;
    }
    if (tracerMat.current) {
      tracerMat.current.color.copy(colNow);
      tracerMat.current.opacity = op * 0.5;
    }
    if (haloMat.current) {
      haloMat.current.color.copy(colNow);
      haloMat.current.opacity = op * 0.28;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* the packet */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          ref={packetMat}
          color="#9BFDF0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* soft halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          ref={haloMat}
          color="#9BFDF0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* tracer trailing up the path */}
      <mesh ref={tracerRef}>
        <boxGeometry args={[0.03, 0.9, 0.03]} />
        <meshBasicMaterial
          ref={tracerMat}
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
