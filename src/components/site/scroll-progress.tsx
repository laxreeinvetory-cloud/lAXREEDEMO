"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — a thin brass progress bar fixed at the top of the viewport.
 * Shows how far the user has scrolled down the page.
 * Inspired by award-winning sites that use scroll indicators.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-brass via-brass-light to-brass"
      aria-hidden="true"
    />
  );
}
