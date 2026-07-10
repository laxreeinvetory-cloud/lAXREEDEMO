"use client";

/**
 * HeroStage — the single "wow" 3D moment of the LaxRee Amenities site.
 *
 * Enhanced 3D hero (Task ENHANCE-3D):
 *  - Ambient brass particles floating slowly upward (depth & atmosphere)
 *  - Scroll-driven camera rig (pulls back + tilts as user scrolls past)
 *  - drei <Environment preset="apartment"/> for realistic reflections on
 *    brass/glass (wrapped in a SafeBoundary so a CDN failure can't crash
 *    the whole Canvas)
 *  - Scene fog (#12100d, near 5 / far 15) for depth
 *  - Enhanced minibar: 3 coloured bottles (amber/green/clear), flickering
 *    interior point light, brass nameplate (slightly emissive), and a
 *    subtle MeshReflectorMaterial plane beneath the contact shadow
 *  - Camera mouse-parallax (±0.3 on x/z) layered on top of the existing
 *    group-tilt parallax — creates foreground/background separation
 *
 * Behaviour matrix (preserved from the previous version):
 *  - Desktop (≥768px) + no reduced-motion  → full 3D + scroll rig + particles + parallax
 *  - Desktop (≥768px) + reduced-motion     → 3D lit scene, NO auto-rotate, NO tilt, NO rig
 *  - Mobile  (<768px) — any motion pref    → static product photo + 4° scroll parallax
 *
 * Named export `HeroStage`, no props. Intended for dynamic import with
 * `{ ssr: false }` — see src/components/site/hero.tsx.
 */

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useMotionValue,
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
const CHARCOAL = "#12100d"; // deeper charcoal — interior cavity / fog
const BRASS = "#c6a15b"; // primary accent
const BRASS_LIGHT = "#e4c989"; // lighter brass for cap variety
const BRASS_EMISSIVE = "#3a2d18"; // dim warm glow for brass w/o env map
const IVORY = "#f7f3ea"; // glass tint

/* 6 seconds per revolution → angular velocity (rad/sec). */
const RAD_PER_SEC = (Math.PI * 2) / 6;

/* ±10° mouse tilt in radians. */
const TILT_RAD = 0.175;

/* Number of ambient brass particles. */
const PARTICLE_COUNT = 110;

/* ─────────────────────────────────────────────────────────────
   SafeBoundary — keeps Environment failures (CDN unreachable,
   HDR decode error, etc.) from crashing the whole Canvas. The
   scene still has its manual lights to fall back on.
   ───────────────────────────────────────────────────────────── */
class SafeBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    // Non-fatal — the manual lights still illuminate the scene.
    console.warn("[HeroStage] Environment failed to load:", error.message);
  }
  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* ─────────────────────────────────────────────────────────────
   Particles — ambient brass dots floating slowly upward.
   Positions are memoised once; only Y is updated per-frame.
   ───────────────────────────────────────────────────────────── */
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4; // 4-unit radius
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.random() * 5 - 2; // -2..3
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    // Clamp delta so a tab-switch doesn't teleport particles to the sky.
    const dt = Math.min(delta, 0.1);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += dt * 0.3;
      if (arr[i * 3 + 1] > 3) {
        // Reset to bottom + re-randomise x/z for variety.
        arr[i * 3 + 1] = -2;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 4;
        arr[i * 3] = Math.cos(angle) * radius;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={BRASS}
        size={0.035}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stylized procedural "LaxRee Minibar" (enhanced)
   ───────────────────────────────────────────────────────────── */
function Minibar() {
  const interiorLightRef = useRef<THREE.PointLight>(null);

  // Reusable brass trim material — emissive gives a warm glow without
  // needing an environment map (kept the scene resilient if the env HDR
  // fails to load).
  const brassMaterial = (
    <meshStandardMaterial
      color={BRASS}
      metalness={0.9}
      roughness={0.2}
      emissive={BRASS_EMISSIVE}
      emissiveIntensity={0.28}
    />
  );

  // Subtle flicker on the interior point light (sum of two sines).
  useFrame((state) => {
    const light = interiorLightRef.current;
    if (!light) return;
    const t = state.clock.elapsedTime;
    // Base 1.4, oscillates ±0.15 — readable but never strobing.
    light.intensity = 1.4 + Math.sin(t * 4.0) * 0.1 + Math.sin(t * 11.3) * 0.05;
  });

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
        <meshStandardMaterial color={INK} metalness={0.3} roughness={0.4} />
      </RoundedBox>

      {/* ── Interior cavity (slightly recessed, darker) ── */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.7, 1.9, 1.3]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.1} roughness={0.7} />
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

      {/* ── Brass "LaxRee" nameplate above the door (slightly emissive) ── */}
      <RoundedBox
        position={[0, 1.05, 0.72]}
        args={[0.55, 0.09, 0.03]}
        radius={0.02}
        smoothness={2}
      >
        <meshStandardMaterial
          color={BRASS}
          metalness={0.9}
          roughness={0.15}
          emissive={BRASS}
          emissiveIntensity={0.18}
        />
      </RoundedBox>

      {/* ── Interior shelf (visible through the glass) ── */}
      <mesh position={[0, -0.1, 0.3]}>
        <boxGeometry args={[1.4, 0.03, 0.6]} />
        <meshStandardMaterial color={INK} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ── Three bottles: amber / green / clear ── */}
      {/* Amber bottle + brass cap */}
      <group position={[-0.4, 0.125, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.42, 16]} />
          <meshStandardMaterial
            color="#a8642a"
            metalness={0.6}
            roughness={0.25}
            emissive="#3a2008"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Green bottle + brass-light cap */}
      <group position={[0, 0.145, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.46, 16]} />
          <meshStandardMaterial
            color="#1e4638"
            metalness={0.5}
            roughness={0.2}
            emissive="#0e231c"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
          <meshStandardMaterial
            color={BRASS_LIGHT}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Clear bottle (transmissive) + brass cap */}
      <group position={[0.4, 0.115, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.4, 16]} />
          <meshPhysicalMaterial
            color={IVORY}
            metalness={0.1}
            roughness={0.05}
            transmission={0.8}
            thickness={0.3}
            transparent
            opacity={0.5}
            ior={1.5}
          />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Interior warm point light — flickers subtly, makes glass glow ── */}
      <pointLight
        ref={interiorLightRef}
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
   updated each frame: auto-rotate on Y (slowed by scroll),
   mouse-tilt on X/Z.
   ───────────────────────────────────────────────────────────── */
interface RotatingStageProps {
  tiltX: MotionValue<number>;
  tiltZ: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  autoRotate: boolean;
}

function RotatingStage({
  tiltX,
  tiltZ,
  scrollProgress,
  autoRotate,
}: RotatingStageProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (autoRotate) {
      // Slow rotation as the user scrolls: at scroll=0 → full speed,
      // at scroll=1 → 30% speed (1 - 1*0.7).
      const scroll = scrollProgress.get();
      const speedMul = 1 - scroll * 0.7;
      g.rotation.y += delta * RAD_PER_SEC * speedMul;
    }
    // ±10° (±0.175 rad) tilt from the mouse spring.
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
   CameraRig — scroll-driven camera dolly + mouse parallax.
   At scroll=0 → camera at [3, 2, 4] (current close-up).
   At scroll=1 → camera at [5, 3.5, 6] (pulled back, looking down).
   Plus ±0.3 mouse parallax on x/z for foreground/background depth.
   ───────────────────────────────────────────────────────────── */
interface CameraRigProps {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  enabled: boolean;
}

function CameraRig({
  scrollProgress,
  mouseX,
  mouseY,
  enabled,
}: CameraRigProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  // Reusable temp vector to avoid per-frame allocation.
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!enabled) return;
    const scroll = scrollProgress.get();
    const px = THREE.MathUtils.lerp(3, 5, scroll);
    const py = THREE.MathUtils.lerp(2, 3.5, scroll);
    const pz = THREE.MathUtils.lerp(4, 6, scroll);

    // Mouse parallax — ±0.3 on x, ±0.3 on y, subtle z shift for depth.
    const mx = mouseX.get();
    const my = mouseY.get();
    desired.set(px + mx * 0.3, py - my * 0.3, pz - mx * 0.15);

    // Critically-damped lerp toward the desired position.
    camera.position.lerp(desired, 0.08);
    camera.lookAt(target);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────
   Scene — lighting + composition inside the Canvas
   ───────────────────────────────────────────────────────────── */
interface SceneProps {
  tiltX: MotionValue<number>;
  tiltZ: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  autoRotate: boolean;
  cameraRigEnabled: boolean;
}

function Scene({
  tiltX,
  tiltZ,
  mouseX,
  mouseY,
  scrollProgress,
  autoRotate,
  cameraRigEnabled,
}: SceneProps) {
  return (
    <>
      {/* Scene fog — depth & atmosphere (charcoal, matches hero bg) */}
      <fog attach="fog" args={[CHARCOAL, 5, 15]} />

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

      {/* Environment for realistic reflections on glass/brass.
          Wrapped in SafeBoundary so a CDN failure degrades gracefully. */}
      <SafeBoundary fallback={null}>
        <Suspense fallback={null}>
          <Environment preset="apartment" />
        </Suspense>
      </SafeBoundary>

      {/* Floating brass particles (depth atmosphere) */}
      <Particles />

      <Suspense fallback={null}>
        <RotatingStage
          tiltX={tiltX}
          tiltZ={tiltZ}
          scrollProgress={scrollProgress}
          autoRotate={autoRotate}
        />
      </Suspense>

      {/* Reflection plane — subtle mirror beneath the contact shadow.
          Low resolution + heavy blur keeps it cheap; `mirror={0.35}` mixes
          35% reflection with the dark base for a "polished floor" look. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <planeGeometry args={[14, 14]} />
        <MeshReflectorMaterial
          blur={[400, 150]}
          resolution={256}
          mixBlur={1.2}
          mixStrength={15}
          roughness={0.9}
          depthScale={1.0}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.2}
          color="#0a0907"
          metalness={0.6}
          mirror={0.35}
        />
      </mesh>

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

      {/* Scroll + mouse-parallax camera rig */}
      <CameraRig
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
        enabled={cameraRigEnabled}
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
            src="/images/products/mini-bar.jpg"
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
  // Range -0.5..0.5 → multiplied by TILT_RAD in useFrame for ±10°,
  // and by 0.3 in CameraRig for ±0.3 parallax units.
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  // Scroll progress 0..1 — one viewport height ≈ "scrolled past the hero".
  // Tracked via a MotionValue (no React re-render per scroll tick).
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    if (isMobile || reduced) return;
    const update = () => {
      const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
      scrollProgress.set(p);
    };
    update(); // initialise on mount
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isMobile, reduced, scrollProgress]);

  // Mobile (<768px) — static fallback with scroll parallax, regardless of
  // the reduced-motion pref.
  if (isMobile) {
    return (
      <div className="relative w-full max-w-[520px] aspect-square mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,161,91,0.15),transparent_60%)]" />
        <HeroStageFallback />
      </div>
    );
  }

  // Desktop path: render the 3D Canvas. If reduced-motion is preferred,
  // disable auto-rotation, mouse-tilt, AND the scroll camera rig
  // (camera stays at the Canvas default [3, 2, 4]).
  const enableTilt = !reduced;
  const cameraRigEnabled = !reduced;

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
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Scene
          tiltX={mouseY}
          tiltZ={mouseX}
          mouseX={mouseX}
          mouseY={mouseY}
          scrollProgress={scrollProgress}
          autoRotate={!reduced}
          cameraRigEnabled={cameraRigEnabled}
        />
      </Canvas>
    </div>
  );
}

export default HeroStage;
