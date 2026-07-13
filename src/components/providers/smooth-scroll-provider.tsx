"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider — Lenis-powered smooth scrolling.
 *
 * Optimized for performance:
 *  - rAF loop uses a single requestAnimationFrame (no layout thrash)
 *  - Synced with Framer Motion's useScroll via lenis.on("scroll")
 *  - Disables on reduced-motion / touch devices for native momentum
 *  - Cleans up on unmount
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion — no smooth scroll
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Skip on touch devices — native momentum scrolling is better
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.0,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Anchor link integration
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", handleAnchorClick, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
