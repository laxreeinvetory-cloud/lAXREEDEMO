"use client";

/**
 * LaxRee Amenities — Deep Category Explorer (Section 7)
 * A 7-card accordion grid (Room / Washroom / Lobby / Furniture / Linen /
 * Roofing / Dome) on a charcoal section. Clicking a card expands it in place
 * to reveal its full item list as a two-column Plex-Mono tag grid. Only one
 * card is open at a time. Framer Motion `layout` + `AnimatePresence` drive the
 * smooth height/opacity and grid reflow; the expanded card spans the full row
 * width so the two-column item list is never visually clipped.
 */

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  ChevronDown,
  BedDouble,
  ShowerHead,
  ConciergeBell,
  Armchair,
  Layers,
  Warehouse,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { ROOM_SOLUTIONS, type RoomSolution } from "@/lib/laxree/site-data";

const ICONS: Record<string, LucideIcon> = {
  BedDouble,
  ShowerHead,
  ConciergeBell,
  Armchair,
  Layers,
  Warehouse,
  Globe,
};

function SolutionCard({
  solution,
  isExpanded,
  onToggle,
}: {
  solution: RoomSolution;
  isExpanded: boolean;
  onToggle: (slug: string) => void;
}) {
  const Icon = ICONS[solution.icon] ?? ConciergeBell;

  return (
    <motion.div
      layout
      className={`glass-on-charcoal rounded-[24px] p-6 cursor-pointer transition-colors duration-300 hover:border-white/20 focus-visible:border-brass ${
        isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
      onClick={() => onToggle(solution.slug)}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(solution.slug);
        }
      }}
    >
      {/* Header row: icon + name/desc + chevron */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0 mt-0.5">
            <Icon
              size={28}
              className="text-brass"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-display text-ivory"
              style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}
            >
              {solution.name}
            </h3>
            <p
              className="text-sand mt-1.5"
              style={{ fontSize: 14, lineHeight: 1.5 }}
            >
              {solution.oneLine}
            </p>
          </div>
        </div>

        {/* Chevron rotates 180° when expanded */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 mt-1"
          aria-hidden
        >
          <ChevronDown size={20} className="text-brass" />
        </motion.div>
      </div>

      {/* Expanded item list — two-column Plex Mono tags with brass dot bullets */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-white/10">
              <div
                className="font-mono text-brass uppercase mb-4 flex items-center gap-3"
                style={{ fontSize: 11, letterSpacing: "0.15em" }}
              >
                <span>{solution.items.length} Items Included</span>
                <span className="flex-1 h-px bg-brass/20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {solution.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brass shrink-0" />
                    <span
                      className="text-sand uppercase truncate"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CategoryExplorer() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(
    ROOM_SOLUTIONS[0]?.slug ?? null
  );

  const toggle = (slug: string) => {
    setExpandedSlug((cur) => (cur === slug ? null : slug));
  };

  return (
    <section id="solutions" className="section section-charcoal py-28 md:py-36">
      <div className="container-laxree">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-brass mb-3">BY ROOM</div>
          <h2
            className="font-display text-ivory font-medium"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Hospitality Solutions, By Room
          </h2>
          <p className="text-sand mt-4 max-w-xl mx-auto text-base">
            Seven complete procurement packages, organised by where they live in
            the property. Tap any card to see the full bill of materials.
          </p>
        </div>

        <LayoutGroup>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROOM_SOLUTIONS.map((solution) => (
              <SolutionCard
                key={solution.slug}
                solution={solution}
                isExpanded={expandedSlug === solution.slug}
                onToggle={toggle}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

export default CategoryExplorer;
