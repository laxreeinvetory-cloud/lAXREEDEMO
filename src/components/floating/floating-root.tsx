"use client";

import { WhatsappLauncher } from "@/components/floating/whatsapp-launcher";
import { EnquireModal } from "@/components/floating/enquire-modal";
import { CatalogueModal } from "@/components/floating/catalogue-modal";
import { MobileStickyBar } from "@/components/floating/mobile-sticky-bar";

/**
 * Single mount point for every floating element + modal on the page.
 * Drop <FloatingRoot /> once near the page root (e.g. in layout.tsx or page.tsx).
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
