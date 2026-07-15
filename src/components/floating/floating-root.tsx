"use client";

import dynamic from "next/dynamic";
import { WhatsappLauncher } from "@/components/floating/whatsapp-launcher";
import { MobileStickyBar } from "@/components/floating/mobile-sticky-bar";

// Lazy-load modals — they only need to load when triggered, not on every page
const EnquireModal = dynamic(() =>
  import("@/components/floating/enquire-modal").then(m => m.EnquireModal)
);
const CatalogueModal = dynamic(() =>
  import("@/components/floating/catalogue-modal").then(m => m.CatalogueModal)
);

/**
 * Single mount point for every floating element + modal on the page.
 * Drop <FloatingRoot /> once near the page root (e.g. in layout.tsx or page.tsx).
 *
 * Modals are lazy-loaded to reduce initial JS payload.
 */
export function FloatingRoot() {
  return (
    <>
      <WhatsappLauncher />
      <MobileStickyBar />
      <EnquireModal />
      <CatalogueModal />
    </>
  );
}

export default FloatingRoot;
