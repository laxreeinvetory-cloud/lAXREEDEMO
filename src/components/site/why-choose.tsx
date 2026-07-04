"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  BadgeIndianRupee,
  Headset,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Gem,
  type LucideIcon,
} from "lucide-react";
import { USPS, type USP } from "@/lib/laxree/site-data";

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  BadgeIndianRupee,
  Headset,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Gem,
};

export function WhyChoose() {
  return (
    <section id="why-us" className="section section-charcoal py-28 md:py-36">
      <div className="container-laxree">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <span className="eyebrow text-brass">Why Us</span>
          <h2
            className="mt-4 font-display text-ivory leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Why Choose LaxRee Amenities?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr]">
          {USPS.map((usp: USP, i: number) => {
            const Icon = ICON_MAP[usp.icon] ?? Sparkles;
            const isWide = usp.size === "wide";
            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: "easeOut",
                }}
                className={`glass-on-charcoal rounded-[24px] p-6 flex flex-col gap-3 ${
                  isWide ? "sm:col-span-2" : ""
                }`}
              >
                <span className="text-brass inline-flex">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <h3 className="font-body text-base font-medium text-ivory leading-snug">
                  {usp.title}
                </h3>
                <p className="font-body text-[13px] leading-relaxed text-sand">
                  {usp.blurb}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
