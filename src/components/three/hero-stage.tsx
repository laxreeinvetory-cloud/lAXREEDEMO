"use client";

/**
 * HeroStage — the single "wow" 3D moment of the LaxRee Amenities site.
 *
 * Renders a 520×520 (responsive `w-full max-w-[520px] aspect-square`) React
 * Three Fiber stage containing a stylized procedural "LaxRee Minibar" built
 * from drei primitives (RoundedBox + glass + brass trim). Auto-rotates at
 * one revolution per 6 seconds, with a soft key light, a brass-tinted rim
 * light, and a drei <ContactShadows/> grounding plane. On desktop, mouse
 * move adds a ±10° spring tilt on X/Z for a tactile feel.
 *
 * Behaviour matrix (per the master-prompt §2 + §16 guardrails):
 *  - Desktop (≥768px) + no reduced-motion  → full 3D, auto-rotate, mouse-tilt
 *  - Desktop (≥768px) + reduced-motion     → 3D lit scene, NO auto-rotate, NO tilt
 *  - Mobile  (<768px) — any motion pref    → static product photo + 4° scroll parallax
 *
 * Named export `HeroStage`, no props. Intended for dynamic import with
 * `{ ssr: false }` — see src/components/site/hero.tsx.
 */

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─────────────────────────────────────────────────────────────
   Brand palette (mirrors src/app/globals.css tokens)
   ───────────────────────────────────────────────────────────── */
const INK = "#1a1712"; // warm charcoal — body
const CHARCOAL = "#12100d"; // deeper charcoal — interior cavity
const BRASS = "#c6a15b"; // primary accent
const BRASS_EMISSIVE = "#3a2d18"; // dim warm glow for brass w/o env map
const IVORY = "#f7f3ea"; // glass tint

/* 6 seconds per revolution → angular velocity (rad/sec). */
const RAD_PER_SEC = (Math.PI * 2) / 6;

/* ±10° mouse tilt in radians. */
const TILT_RAD = 0.175;

/* ─────────────────────────────────────────────────────────────
   Stylized procedural "LaxRee Minibar"
   ───────────────────────────────────────────────────────────── */

function Minibar() {
  // Reusable brass trim material — emissive gives a warm glow without
  // needing an environment map (kept the scene network-free for sandbox).
  const brassMaterial = (
    <meshStandardMaterial
      color={BRASS}
      metalness={0.9}
      roughness={0.2}
      emissive={BRASS_EMISSIVE}
      emissiveIntensity={0.28}
    />
  );

  return (
    <group>
      {/* ── Body: warm charcoal RoundedBox ── */}
      <RoundedBox
        args={[2.0, 2.2, 1.4]}
        radius={0.08}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={INK}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>

      {/* ── Interior cavity (slightly recessed, darker) ── */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.7, 1.9, 1.3]} />
        <meshStandardMaterial
          color={CHARCOAL}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* ── Glass door panel (front) ── */}
      <mesh position={[0, 0, 0.71]}>
        <boxGeometry args={[1.7, 1.9, 0.04]} />
        <meshPhysicalMaterial
          color={IVORY}
          transmission={0.9}
          roughness={0.05}
          thickness={0.5}
          opacity={0.45}
          transparent
          metalness={0}
          ior={1.4}
        />
      </mesh>

      {/* ── Brass trim: top / bottom / left / right of door ── */}
      <RoundedBox
        position={[0, 0.95, 0.72]}
        args={[1.78, 0.06, 0.04]}
        radius={0.02}
        smoothness={2}
      >
        {brassMaterial}
      </RoundedBox>
      <RoundedBox
        position={[0, -0.95, 0.72]}
        args={[1.78, 0.06, 0.04]}
        radius={0.02}
        smoothness={2}
      >
        {brassMaterial}
      </RoundedBox>
      <RoundedBox
        position={[-0.86, 0, 0.72]}
        args={[0.06, 1.78, 0.04]}
        radius={0.02}
        smoothness={2}
      >
        {brassMaterial}
      </RoundedBox>
      <RoundedBox
        position={[0.86, 0, 0.72]}
        args={[0.06, 1.78, 0.04]}
        radius={0.02}
        smoothness={2}
      >
        {brassMaterial}
      </RoundedBox>

      {/* ── Brass handle (vertical, right of centre) ── */}
      <RoundedBox
        position={[0.55, 0, 0.78]}
        args={[0.08, 0.45, 0.06]}
        radius={0.03}
        smoothness={3}
      >
        {brassMaterial}
      </RoundedBox>

      {/* ── Brass "LaxRee" nameplate above the door ── */}
      <RoundedBox
        position={[0, 1.05, 0.72]}
        args={[0.55, 0.09, 0.03]}
        radius={0.02}
        smoothness={2}
      >
        <meshStandardMaterial
          color={BRASS}
          metalness={0.9}
          roughness={0.2}
          emissive={BRASS_EMISSIVE}
          emissiveIntensity={0.35}
        />
      </RoundedBox>

      {/* ── Interior shelf (visible through the glass) ── */}
      <mesh position={[0, -0.1, 0.3]}>
        <boxGeometry args={[1.4, 0.03, 0.6]} />
        <meshStandardMaterial color={INK} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ── Two small "bottles" on the shelf for character ── */}
      <mesh position={[-0.35, 0.15, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial
          color={BRASS}
          metalness={0.7}
          roughness={0.3}
          emissive={BRASS_EMISSIVE}
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0.1, 0.18, 0.3]}>
        <cylinderGeometry args={[0.07, 0.07, 0.45, 12]} />
        <meshStandardMaterial
          color={IVORY}
          metalness={0.2}
          roughness={0.3}
          emissive={"#1e4638"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ── Interior warm point light — makes the glass glow ── */}
      <pointLight
        position={[0, 0.4, 0.3]}
        intensity={1.4}
        distance={2.5}
        decay={2}
        color={BRASS}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   RotatingStage — wraps Minibar in a group whose rotation is
   updated each frame: auto-rotate on Y, mouse-tilt on X/Z.
   ───────────────────────────────────────────────────────────── */

interface RotatingStageProps {
  tiltX: MotionValue<number>;
  tiltZ: MotionValue<number>;
  autoRotate: boolean;
}

function RotatingStage({ tiltX, tiltZ, autoRotate }: RotatingStageProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (autoRotate) {
      // 6s per revolution → steady angular velocity on Y.
      g.rotation.y += delta * RAD_PER_SEC;
    }
    // Additional ±10° (±0.175 rad) tilt from the mouse spring.
    // tiltX drives pitch (forward/back), tiltZ drives roll (left/right).
    g.rotation.x = tiltX.get() * TILT_RAD;
    g.rotation.z = tiltZ.get() * TILT_RAD;
  });

  return (
    <group ref={groupRef}>
      <Minibar />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Scene — lighting + composition inside the Canvas
   ───────────────────────────────────────────────────────────── */

interface SceneProps {
  tiltX: MotionValue<number>;
  tiltZ: MotionValue<number>;
  autoRotate: boolean;
}

function Scene({ tiltX, tiltZ, autoRotate }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />

      {/* Soft warm key light — front-top-right */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
      />

      {/* Brass-tinted rim light — back-left, gives the brass trim its glow */}
      <pointLight position={[-4, 2, -4]} intensity={2} color={BRASS} />

      {/* Soft ivory fill from camera-right to lift shadowed faces */}
      <pointLight position={[3, -1, 3]} intensity={0.4} color={IVORY} />

      <Suspense fallback={null}>
        <RotatingStage
          tiltX={tiltX}
          tiltZ={tiltZ}
          autoRotate={autoRotate}
        />
      </Suspense>

      {/* Soft contact shadow grounding the minibar */}
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.55}
        scale={7}
        blur={2.8}
        far={4}
        resolution={512}
        color="#000000"
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   HeroStageFallback — static product photo with 4° scroll parallax
   Used for mobile (any motion pref) and as a defensive fallback.
   ───────────────────────────────────────────────────────────── */

function HeroStageFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  // 4°-max scroll parallax: rotate from -2° to +2° as the stage moves
  // through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl"
      style={{ background: "rgba(18,16,13,0.55)" }}
    >
      <motion.div
        style={{ rotate }}
        className="relative w-[82%] h-[82%] flex items-center justify-center"
      >
        {!imgError ? (
          <img
            src="/images/products/mini-bar.png"
            alt="LaxRee Minibar — flagship OEM product"
            className="max-w-full max-h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)]"
            loading="eager"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Procedural CSS placeholder when the photo asset is missing.
             Keeps the stage visually populated instead of broken. */
          <div
            aria-label="LaxRee Minibar"
            className="w-[70%] h-[78%] rounded-2xl border border-brass/40 bg-gradient-to-b from-[#1a1712] to-[#0a0907] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute inset-3 rounded-xl border border-brass/30 bg-[#0e0c09]/60" />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-14 rounded-full bg-brass/70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-brass/80">
                LaxRee
              </span>
            </div>
          </div>
        )}
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,161,91,0.15),transparent_60%)] pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HeroStage — main exported component
   ───────────────────────────────────────────────────────────── */

export function HeroStage() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Mouse-tilt springs (desktop, no reduced-motion only).
  // Range -0.5..0.5 → multiplied by TILT_RAD in useFrame for ±10°.
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  // Mobile (<768px) — static fallback with scroll parallax, regardless of
  // the reduced-motion pref (per §16: "replace it outright with the static
  // fallback below 768px width").
  if (isMobile) {
    return (
      <div className="relative w-full max-w-[520px] aspect-square mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,161,91,0.15),transparent_60%)]" />
        <HeroStageFallback />
      </div>
    );
  }

  // Desktop path: render the 3D Canvas. If reduced-motion is preferred,
  // disable auto-rotation AND mouse-tilt (static lit scene).
  const enableTilt = !reduced;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(px);
    mouseY.set(py);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative w-full max-w-[520px] aspect-square mx-auto"
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
    >
      {/* Subtle radial brass glow behind the stage */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,161,91,0.15),transparent_60%)]" />

      <Canvas
        camera={{ position: [3, 2, 4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Scene
          tiltX={mouseY}
          tiltZ={mouseX}
          autoRotate={!reduced}
        />
      </Canvas>
    </div>
  );
}

export default HeroStage;
