"use client";

/**
 * ComingSoonSection — used by the category detail page when the
 * category has no full catalogue in ALL_PRODUCTS (i.e. furniture,
 * linen, roofing, dome — all custom-manufactured lines).
 *
 * Renders:
 *   1. A glass-on-ivory "Coming Soon — Custom Catalogue Available"
 *      card with a "Request Custom Quote" button that opens the
 *      enquiry modal via useEnquiry().
 *   2. A grid of related room solutions from ROOM_SOLUTIONS — the
 *      matching room solution (by slug) first, then two amenity
 *      companions (Room Amenities, Washroom Amenities) so the page
 *      still feels rich without inventing product data.
 *
 * This file is a client component because the "Request Custom Quote"
 * button calls useEnquiry().openModal().
 */

import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  ShowerHead,
  ConciergeBell,
  Armchair,
  Layers,
  Warehouse,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/site/page-primitives";
import { useEnquiry } from "@/components/providers/enquiry-provider";
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

export function ComingSoonSection({
  categoryName,
  categorySlug,
}: {
  categoryName: string;
  categorySlug: string;
}) {
  const { openModal } = useEnquiry();

  // The room solution whose slug matches the current category.
  const matchingSolution = ROOM_SOLUTIONS.find((r) => r.slug === categorySlug);

  // Two amenity companion solutions — every hotel buys these alongside
  // furniture / linen / roofing / dome, so they're genuinely related.
  const amenityCompanions = ROOM_SOLUTIONS.filter((r) =>
    ["room-amenities", "washroom-amenities"].includes(r.slug)
  );

  // Final grid: matching first, then companions. Fall back to first 3
  // solutions if no slug match (defensive — shouldn't happen with
  // current data).
  const gridSolutions: RoomSolution[] = matchingSolution
    ? [matchingSolution, ...amenityCompanions]
    : ROOM_SOLUTIONS.slice(0, 3);

  return (
    <div className="mt-12 md:mt-16">
      {/* ─────────────────────────────────────────────────────────
          Coming Soon — glass card
          ───────────────────────────────────────────────────────── */}
      <GlassCard theme="ivory" radius="24px" className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch">
          {/* Left: copy + buttons */}
          <div className="p-8 md:p-12">
            <div
              className="font-mono text-brass uppercase mb-4 inline-flex items-center gap-2"
              style={{ fontSize: 11, letterSpacing: "0.2em" }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Custom Catalogue
            </div>
            <h3
              className="font-display text-ink"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            >
              Coming Soon — Custom {categoryName} Catalogue Available
            </h3>
            <p
              className="text-ink-muted mt-4 max-w-xl"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              Our {categoryName} line is fully custom-manufactured to your
              project specifications. Tell us what you need — dimensions,
              finish, quantity — and our factory team will prepare a tailored
              quotation within 24 hours.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openModal("enquiry")}
                className="pill pill-brass text-[12px] px-6 py-3 cursor-pointer"
              >
                Request Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <Link
                href="/catalogue"
                className="pill pill-ghost-brass text-[12px] px-6 py-3"
              >
                Download Catalogue
              </Link>
            </div>

            {/* Reassurance row */}
            <div className="mt-8 pt-6 border-t border-ink/10 grid grid-cols-3 gap-4">
              {[
                { label: "Lead Time", value: "2–6 wks" },
                { label: "MOQ", value: "Project-based" },
                { label: "Customisation", value: "Full OEM" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-mono text-ink-muted uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.15em" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="font-display text-ink mt-1"
                    style={{ fontSize: 16, fontWeight: 500 }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: oversized initial decoration */}
          <div
            aria-hidden
            className="relative hidden lg:flex items-center justify-center bg-brass/5 border-l border-ink/5"
          >
            <div
              className="font-display select-none"
              style={{
                fontSize: "clamp(8rem, 14vw, 14rem)",
                fontWeight: 600,
                lineHeight: 1,
                color: "rgba(198,161,91,0.18)",
              }}
            >
              {categoryName.charAt(0)}
            </div>
            <div
              className="absolute bottom-6 right-6 font-mono text-ink-muted uppercase text-right"
              style={{ fontSize: 10, letterSpacing: "0.15em" }}
            >
              Made to
              <br />
              specification
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ─────────────────────────────────────────────────────────
          Related room solutions grid
          ───────────────────────────────────────────────────────── */}
      <div className="mt-10">
        <div
          className="font-mono text-ink-muted uppercase mb-6 flex items-center gap-3"
          style={{ fontSize: 11, letterSpacing: "0.15em" }}
        >
          <span>Related Solutions</span>
          <span className="flex-1 h-px bg-ink-muted/20" />
          <span>{gridSolutions.length} packs</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridSolutions.map((sol) => {
            const Icon = ICONS[sol.icon] ?? ConciergeBell;
            const isMatching = sol.slug === categorySlug;
            return (
              <div
                key={sol.slug}
                className={`rounded-[20px] p-6 h-full flex flex-col transition-colors duration-300 ${
                  isMatching
                    ? "bg-ink text-ivory border border-brass/40"
                    : "glass-on-ivory"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl grid place-items-center ${
                    isMatching
                      ? "bg-brass/15 border border-brass/40"
                      : "bg-brass/12 border border-brass/25"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 text-brass"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>

                <h4
                  className={`mt-5 font-display ${
                    isMatching ? "text-ivory" : "text-ink"
                  }`}
                  style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}
                >
                  {sol.name}
                </h4>
                <p
                  className={`mt-2 ${
                    isMatching ? "text-sand" : "text-ink-muted"
                  }`}
                  style={{ fontSize: 13, lineHeight: 1.5 }}
                >
                  {sol.oneLine}
                </p>

                {/* Item preview chips */}
                <div className="mt-4 pt-4 border-t border-current/10 flex-1">
                  <div
                    className={`font-mono uppercase mb-2 ${
                      isMatching ? "text-brass" : "text-ink-muted"
                    }`}
                    style={{ fontSize: 10, letterSpacing: "0.15em" }}
                  >
                    {sol.items.length} items included
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sol.items.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className={`font-mono uppercase px-2 py-1 rounded-md ${
                          isMatching
                            ? "bg-white/8 text-sand"
                            : "bg-ink/5 text-ink"
                        }`}
                        style={{ fontSize: 10, letterSpacing: "0.05em" }}
                      >
                        {item}
                      </span>
                    ))}
                    {sol.items.length > 4 && (
                      <span
                        className="font-mono text-brass uppercase px-2 py-1"
                        style={{ fontSize: 10, letterSpacing: "0.05em" }}
                      >
                        +{sol.items.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ComingSoonSection;
