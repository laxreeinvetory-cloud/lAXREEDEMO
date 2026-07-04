"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * Count-up animation hook. Counts from 0 to `end` when the
 * element scrolls into view. Respects prefers-reduced-motion.
 *
 * Uses a fallback timer to guarantee the animation starts even if
 * the IntersectionObserver-based `useInView` is slow to fire (which
 * can happen for above-the-fold elements under certain conditions).
 */
export function useCountUp(end: number, duration = 1.8) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  // Fallback: force-start the animation 600ms after mount. This
  // covers the case where useInView fails to fire (rare, but seen
  // on some browsers for elements visible on first paint).
  const [forceStart, setForceStart] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceStart(true), 600);
    return () => clearTimeout(t);
  }, []);
  const started = inView || forceStart;

  useEffect(() => {
    if (!started) return;
    if (reduced) {
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration, reduced]);

  // When reduced-motion is on, short-circuit to the final value.
  const displayValue = reduced ? end : value;
  return { ref, value: displayValue };
}

/** Spring-based mouse tilt hook for 3D-feel card hovers */
export function useTilt(max = 8) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(x, { stiffness: 200, damping: 25 });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px * max * 2);
    y.set(-py * max * 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    rotateX,
    rotateY,
    handleMove,
    handleLeave,
    style: { rotateX, rotateY, transformPerspective: 1000 },
  };
}

const reducedMotionSubscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener?.("change", callback);
  return () => mq.removeEventListener?.("change", callback);
};

const reducedMotionGetSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const reducedMotionGetServerSnapshot = () => false;

/** Returns true if the user prefers reduced motion */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    reducedMotionSubscribe,
    reducedMotionGetSnapshot,
    reducedMotionGetServerSnapshot
  );
}

/** Track scroll progress (0..1) of an element relative to viewport */
export function useScrollProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when element top hits bottom of viewport, 1 when bottom hits top
      const p = 1 - rect.bottom / (rect.height + vh);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { ref, progress };
}
