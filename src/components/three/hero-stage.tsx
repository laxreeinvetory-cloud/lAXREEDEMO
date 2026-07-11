"use client";

/**
 * HeroStage — the single "wow" 3D moment of the LaxRee Amenities site.
 *
 * Uses a real 3D minibar model embedded from Sketchfab:
 *   https://sketchfab.com/3d-models/bar-fridge-low-poly-af72eb035ed44acab49f3f6b9d28ed29
 *
 * The embed is wrapped in a charcoal-themed stage with:
 *  - CSS brass particles floating upward (depth & atmosphere)
 *  - Radial brass glow behind the model
 *  - Mouse-parallax tilt on the stage container
 *  - Scroll-based opacity/scale shift (model slowly fades as you scroll)
 *
 * Behaviour matrix:
 *  - Desktop (≥768px)  → Sketchfab 3D embed + particles + parallax
 *  - Mobile  (<768px)  → static product photo + subtle scroll parallax
 *  - Reduced motion    → static product photo, no particles
 *
 * Named export `HeroStage`, no props. Intended for dynamic import with
 * `{ ssr: false }` — see src/components/site/hero.tsx.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────── */

const SKETCHFAB_MODEL_ID = "af72eb035ed44acab49f3f6b9d28ed29";

// Sketchfab embed URL with minimal UI — just the 3D model auto-rotating
const SKETCHFAB_EMBED = `https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&autospin=0.4&ui_infos=0&ui_watermark=0&ui_controls=0&ui_hint=0&ui_annotations=0&ui_stop=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_snapshots=0&ui_ar=0&ui_vr=0&ui_fullscreen=0&ui_related=0`;

const BRASS = "#c6a15b";
const CHARCOAL = "#12100d";

/* ─────────────────────────────────────────────────────────────
   Hooks
   ───────────────────────────────────────────────────────────── */

const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
}

const reducedMotionSubscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
};
const reducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reducedMotionServer = () => false;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    reducedMotionSubscribe,
    reducedMotionSnapshot,
    reducedMotionServer
  );
}

function useIsMobile(breakpoint = 768) {
  const isClient = useIsClient();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (!isClient) return;
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [isClient, breakpoint]);
  return isMobile;
}

/* ─────────────────────────────────────────────────────────────
   CSSParticles — brass particles floating upward (pure CSS)
   ───────────────────────────────────────────────────────────── */

function CSSParticles() {
  // Pre-generate particle positions
  const particles = Array.from({ length: 24 }, (_, i) => {
    const left = Math.random() * 100;
    const size = 2 + Math.random() * 4;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 8;
    const opacity = 0.15 + Math.random() * 0.35;
    return { left, size, duration, delay, opacity, id: i };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: BRASS,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${BRASS}`,
            animation: `particle-float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-500px) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SketchfabEmbed — the real 3D minibar model
   ───────────────────────────────────────────────────────────── */

function SketchfabEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Mouse-parallax tilt
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 6);  // ±6° tilt
    mouseY.set(-y * 6);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scroll-based opacity/scale
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 0.95]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity,
        scale,
        rotateX: mouseY,
        rotateY: mouseX,
        transformPerspective: 1200,
      }}
      className="relative w-full h-full"
    >
      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-brass/30 border-t-brass"
              aria-hidden
            />
            <span className="data-label text-[10px] text-sand">
              Loading 3D Model…
            </span>
          </div>
        </div>
      )}

      {/* Sketchfab iframe */}
      <iframe
        title="LaxRee Minibar 3D Model"
        src={SKETCHFAB_EMBED}
        onLoad={() => setLoaded(true)}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "20px",
          background: CHARCOAL,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   StaticFallback — mobile / reduced-motion
   ───────────────────────────────────────────────────────────── */

function StaticFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate, scale }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <img
        src="/images/products/mini-bar.jpg"
        alt="LaxRee Minibar"
        loading="eager"
        className="max-h-full max-w-full object-contain rounded-[20px]"
        onError={(e) => {
          // Fallback: charcoal box with brass label
          const target = e.currentTarget;
          target.style.display = "none";
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HeroStage — exported component
   ───────────────────────────────────────────────────────────── */

export function HeroStage() {
  const isClient = useIsClient();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Decision: show 3D embed or static fallback
  const show3D = isClient && !reduced && !isMobile;

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 520, aspectRatio: "1 / 1" }}>
      {/* Radial brass glow behind the stage */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(198,161,91,0.15), transparent 60%)",
        }}
      />

      {/* CSS particles (desktop, no reduced motion) */}
      {show3D && <CSSParticles />}

      {/* Brass ring frame */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] border border-brass/15"
      />

      {/* 3D model or fallback */}
      <div className="relative w-full h-full p-2">
        {show3D ? <SketchfabEmbed /> : <StaticFallback />}
      </div>

      {/* Floating badge — "3D" indicator */}
      {show3D && (
        <div className="absolute -top-3 -right-3 z-10 flex items-center gap-1.5 rounded-full border border-brass/40 bg-charcoal/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass" />
          <span className="data-label text-[9px] text-brass">3D LIVE</span>
        </div>
      )}
    </div>
  );
}

export default HeroStage;
