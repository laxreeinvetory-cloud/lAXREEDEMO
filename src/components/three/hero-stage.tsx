"use client";

/**
 * HeroStage — the single "wow" 3D moment of the LaxRee Amenities site.
 *
 * Uses a high-quality architectural visualization 3D bedroom model embedded
 * from Sketchfab. The model auto-loads (no click gate) so visitors see the
 * 3D room immediately on page load.
 *
 * Model: "bedroom archviz" — a realistic, fully furnished bedroom with
 * furniture, lighting, and decor that showcases the hospitality context.
 * https://sketchfab.com/3d-models/bedroom-archviz-277aad94542a412790dc6d6ff8d9b2ea
 *
 * The embed is wrapped in a charcoal-themed stage with:
 *  - Radial brass glow behind the model
 *  - Mouse-parallax tilt on the stage container
 *  - Smooth loading skeleton → fade-in transition
 *  - Auto-rotation enabled (autospin)
 *
 * Behaviour matrix:
 *  - Desktop (≥768px)  → Sketchfab 3D embed (auto-loads) + parallax tilt
 *  - Mobile  (<768px)  → static product photo (saves bandwidth)
 *  - Reduced motion    → static product photo
 *
 * Named export `HeroStage`, no props. Intended for dynamic import with
 * `{ ssr: false }` — see src/components/site/hero.tsx.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────── */

// "bedroom archviz" — high-quality architectural visualization bedroom.
// Realistic materials, professional lighting, fully furnished.
const SKETCHFAB_MODEL_ID = "277aad94542a412790dc6d6ff8d9b2ea";

// Sketchfab embed URL — auto-start, auto-spin, minimal UI, preload enabled
const SKETCHFAB_EMBED = `https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&autospin=0.2&ui_infos=0&ui_watermark=0&ui_controls=0&ui_hint=0&ui_annotations=0&ui_stop=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_snapshots=0&ui_ar=0&ui_vr=0&ui_fullscreen=0&ui_related=0&preload=1`;

const CHARCOAL = "#12100d";

/* ─────────────────────────────────────────────────────────────
   Hooks (inlined to keep this self-contained)
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
   SketchfabEmbed — the 3D hotel room, auto-loads on mount
   ───────────────────────────────────────────────────────────── */

function SketchfabEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Mouse-parallax tilt (subtle, smooth)
  const mouseX = useSpring(0, { stiffness: 120, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 5);
    mouseY.set(-y * 5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: mouseY,
        rotateY: mouseX,
        transformPerspective: 1200,
      }}
      className="relative w-full h-full"
    >
      {/* Loading skeleton — shown until iframe finishes loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-charcoal/80">
          <div className="flex flex-col items-center gap-4">
            {/* Animated 3D cube loader */}
            <div className="relative h-12 w-12">
              <div
                className="absolute inset-0 rounded-full border-2 border-brass/20 border-t-brass animate-spin"
                style={{ animationDuration: "0.8s" }}
              />
              <div
                className="absolute inset-2 rounded-full border-2 border-brass/10 border-b-brass animate-spin"
                style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
              />
            </div>
            <span className="data-label text-[10px] text-sand">
              Loading 3D Room…
            </span>
          </div>
        </div>
      )}

      {/* Sketchfab iframe — auto-loads on mount (no click gate) */}
      <iframe
        title="LaxRee 3D Hotel Room Showcase"
        src={SKETCHFAB_EMBED}
        onLoad={() => setLoaded(true)}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "20px",
          background: CHARCOAL,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
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
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <img
        src="/images/products/mini-bar.jpg"
        alt="LaxRee Minibar"
        loading="eager"
        className="max-h-full max-w-full object-contain rounded-[20px]"
        onError={(e) => {
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
            "radial-gradient(circle at center, rgba(198,161,91,0.18), transparent 60%)",
        }}
      />

      {/* Brass ring frame */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] border border-brass/15"
      />

      {/* 3D model or fallback */}
      <div className="relative w-full h-full p-1.5">
        {show3D ? <SketchfabEmbed /> : <StaticFallback />}
      </div>

      {/* Floating badge — "3D LIVE" indicator */}
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
