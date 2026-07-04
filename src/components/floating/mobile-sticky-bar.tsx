"use client";

import { Phone, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/laxree/site-data";

/**
 * Mobile-only sticky bottom bar with two thumb-width buttons:
 * "Call Now" (emerald) and "WhatsApp" (WhatsApp green).
 * Hidden on md+ screens — desktop uses the floating WhatsApp launcher.
 */
export function MobileStickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/10 bg-charcoal/85 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Quick contact"
    >
      <a
        href={`tel:${SITE.phoneHref}`}
        className="flex flex-1 flex-row items-center justify-center gap-2 py-4 text-ivory transition-colors duration-200 hover:bg-emerald/30 active:bg-emerald/40"
        aria-label={`Call LaxRee at ${SITE.phoneDisplay}`}
      >
        <Phone className="h-4 w-4" strokeWidth={2.2} />
        <span className="font-mono text-[13px] uppercase tracking-[0.12em]">
          Call Now
        </span>
      </a>

      <span aria-hidden="true" className="my-3 w-px bg-white/10" />

      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-row items-center justify-center gap-2 py-4 text-white transition-colors duration-200 hover:bg-[#1fb855] active:bg-[#1aa849]"
        aria-label="Chat with LaxRee on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
        <span className="font-mono text-[13px] uppercase tracking-[0.12em]">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

export default MobileStickyBar;
