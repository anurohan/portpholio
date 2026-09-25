"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { worldProgress, studioSections } from "@/lib/worldProgress";
import { sceneState } from "@/lib/sceneState";
import { palettes } from "@/lib/theme";
import { clamp, damp } from "@/lib/utils";
import HeroWorld from "./worlds/HeroWorld";
import AIWorld from "./worlds/AIWorld";
import ElectronicsWorld from "./worlds/ElectronicsWorld";
import RoboticsWorld from "./worlds/RoboticsWorld";
import MechanicalWorld from "./worlds/MechanicalWorld";
import BuilderWorld from "./worlds/BuilderWorld";
import EnvField from "./worlds/EnvField";
import SignalBridge from "./worlds/SignalBridge";

type Rect = { vis: number; local: number };

/** Measure a section by id → visibility (viewport overlap) + local progress. */
function measure(el: HTMLElement | null, vh: number): Rect {
  if (!el) return { vis: 0, local: 0 };
  const r = el.getBoundingClientRect();
  const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  const vis = clamp(overlap / vh);
  const local = clamp((vh - r.top) / (vh + r.height));
  return { vis, local };
}

// Camera keyframe per world (position + lookAt), modulated by local progress.
function camFor(world: string, local: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const P = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  switch (world) {
    case "hero":
      return { pos: P(0, 0, 7), look: P(0, 0, 0) };
    case "ai":
      // dolly through the network
      return { pos: P(0, 0.3, 6.2 - local * 2.4), look: P(0, 0, 0) };
    case "electronics":
      // approach + tilt over the board
      return { pos: P(0, 2.6 - local * 0.9, 5.6 - local * 1.4), look: P(0, 0, 0) };
    case "robotics":
      return { pos: P(0.4, 0.8, 6.4 - local * 1.2), look: P(0, 0.6, 0) };
    case "mechanical":
      return { pos: P(0, 0.4, 5.8 - local * 0.8), look: P(0.2, 0.2, 0) };
    case "builder":
      return { pos: P(0, 0, 6.6 - local * 0.6), look: P(0, 0, 0) };
    default: // studio
      return { pos: P(0, 0, 8), look: P(0, 0, 0) };
  }
}

export default function WorldDirector({ quality }: { quality: number }) {
  const { scene } = useThree();
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  const camPos = useRef(new THREE.Vector3(0, 0, 7));
  const camLook = useRef(new THREE.Vector3(0, 0, 0));
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const accentColor = useMemo(() => new THREE.Color(), []);
  const bgColor = useMemo(() => new THREE.Color(palettes.hero.bgCss), []);

  // fog
  const fog = useMemo(() => new THREE.FogExp2(palettes.hero.bgCss, 0.045), []);

  useFrame((state, delta) => {
    const vh = state.size.height;
    const g = (id: string) => document.getElementById(id);

    // --- global scroll progress 0..1 (drives the evolving EnvField + rail) ---
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - vh;
    sceneState.progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;

    // --- measure worlds ---
    const worldKeys = ["hero", "ai", "electronics", "robotics", "mechanical", "builder"];
    for (const k of worldKeys) {
      const m = measure(g(k), vh);
      worldProgress[k].vis = m.vis;
      worldProgress[k].local = m.local;
    }
    // studio = union of projects..contact
    let sVis = 0;
    let sLocalTop: Rect | null = null;
    for (const id of studioSections) {
      const m = measure(g(id), vh);
      if (m.vis > sVis) sVis = m.vis;
      if (!sLocalTop) sLocalTop = m;
    }
    worldProgress.studio.vis = sVis;
    worldProgress.studio.local = sLocalTop ? sLocalTop.local : 0;

    // --- damped mouse ---
    sceneState.mx = damp(sceneState.mx, sceneState.tmx, 4, delta);
    sceneState.my = damp(sceneState.my, sceneState.tmy, 4, delta);

    // --- blend camera + palette by visibility weights ---
    const allKeys = [...worldKeys, "studio"];
    let wSum = 0;
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3();
    bgColor.set(0, 0, 0);
    accentColor.set(0, 0, 0);
    for (const k of allKeys) {
      const w = worldProgress[k].vis;
      if (w <= 0.001) continue;
      wSum += w;
      const c = camFor(k, worldProgress[k].local);
      pos.addScaledVector(c.pos, w);
      look.addScaledVector(c.look, w);
      const pal = palettes[k] ?? palettes.studio;
      tmpColor.set(pal.bgCss);
      bgColor.r += tmpColor.r * w;
      bgColor.g += tmpColor.g * w;
      bgColor.b += tmpColor.b * w;
      tmpColor.set(pal.accent);
      accentColor.r += tmpColor.r * w;
      accentColor.g += tmpColor.g * w;
      accentColor.b += tmpColor.b * w;
    }
    if (wSum > 0.001) {
      pos.multiplyScalar(1 / wSum);
      look.multiplyScalar(1 / wSum);
      bgColor.multiplyScalar(1 / wSum);
      accentColor.multiplyScalar(1 / wSum);
    } else {
      pos.set(0, 0, 7);
      bgColor.set(palettes.hero.bgCss);
      accentColor.set(palettes.hero.accent);
    }

    // mouse parallax + entry dolly (hero wakes → camera eases in)
    const entryDolly = (1 - sceneState.entry) * (worldProgress.hero.vis * 1.2);
    pos.x += sceneState.mx * 0.5;
    pos.y += sceneState.my * 0.3;
    pos.z += entryDolly;

    camPos.current.x = damp(camPos.current.x, pos.x, 3, delta);
    camPos.current.y = damp(camPos.current.y, pos.y, 3, delta);
    camPos.current.z = damp(camPos.current.z, pos.z, 3, delta);
    camLook.current.x = damp(camLook.current.x, look.x, 3, delta);
    camLook.current.y = damp(camLook.current.y, look.y, 3, delta);
    camLook.current.z = damp(camLook.current.z, look.z, 3, delta);

    state.camera.position.copy(camPos.current);
    state.camera.lookAt(camLook.current);

    // background + fog
    scene.background = bgColor;
    fog.color.copy(bgColor);
    scene.fog = fog;

    // lights follow accent
    if (fillLight.current) fillLight.current.color.copy(accentColor);
    if (keyLight.current)
      keyLight.current.intensity = 1.1 + sceneState.entry * 0.4;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        ref={keyLight}
        position={[4, 6, 5]}
        intensity={1.2}
        color="#ffffff"
      />
      <pointLight ref={fillLight} position={[-4, 2, 3]} intensity={30} distance={20} color="#35E0D0" />

      {/* The one continuous environment behind every world — evolves with scroll. */}
      <EnvField quality={quality} />

      <HeroWorld quality={quality} />
      <AIWorld quality={quality} />
      <ElectronicsWorld quality={quality} />
      {/* the AI decision → signal → circuit handoff, made literal */}
      <SignalBridge />
      <RoboticsWorld />
      <MechanicalWorld />
      <BuilderWorld quality={quality} />
    </>
  );
}
