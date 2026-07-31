/**
 * LaxRee Amenities — product image fallback maps.
 *
 * Shared between:
 *   - src/app/products/page.tsx          (Explore by Category grid)
 *   - src/app/products/[slug]/page.tsx   (Browse by Type grid + Other Categories rail)
 *   - src/app/products/[slug]/[itemSlug]/page.tsx (Other Item Types rail)
 *
 * Every path below exists on disk, so the UI never shows the
 * /images/product-catalogue/coming-soon.webp placeholder when a fallback
 * is available.
 */

/* ─────────────────────────────────────────────────────────────
   Sub-category slug → representative real product image.
   ───────────────────────────────────────────────────────────── */
export const SUBCATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  // ── Room Amenities ──
  "mini-bar": "/images/product-catalogue/mini-bar/LRMB-126.webp",
  "tea-kettle": "/images/product-catalogue/tea-kettle/LRWT--143.webp",
  "kettle-tray": "/images/product-catalogue/tray/LRWT-158.webp",
  "safe-box": "/images/product-catalogue/safe-box/LRMR-252-10.webp",
  "wooden-hangers": "/images/product-catalogue/hangers/LRRA-653.webp",
  "rfid-locks": "/images/product-catalogue/door-lock/LRFD--613.webp",
  "room-telephone": "/images/product-catalogue/telephone/LRDR--189.webp",
  "docking-pod": "/images/product-catalogue/ssp-docking-pod/LRDR-177.webp",
  "room-dustbin": "/images/product-catalogue/dustbin/LRRA--649.webp",
  "desktop-accessories": "/images/product-catalogue/desktop-accessories/LRAT-370.webp",
  "rollaway-bed": "/images/product-catalogue/rollaway-bed/LRMR-251.webp",
  "mattress": "/images/product-catalogue/mattress/LRMR-251-8.webp",
  "iron-iron-board": "/images/product-catalogue/excel-images/Ironing-Board.webp",
  "emergency-torch": "/images/product-catalogue/emergency-torch/LRET-351.webp",
  "luggage-rack": "/images/product-catalogue/furniture/LRGF---673---Luggage-Rack.webp",
  // ── Washroom Amenities ──
  "hair-dryer": "/images/product-catalogue/hair-dryer/LRHD-276.webp",
  "soap-dispenser": "/images/product-catalogue/soap-dispenser/LRWA--358.webp",
  "magnifying-mirror": "/images/product-catalogue/magnifying-mirror/LRMM-302.webp",
  "lobby-soap-dispenser": "/images/product-catalogue/lobby-soap-dispenser/LRWA-372.webp",
  "weighing-scale": "/images/product-catalogue/weighing-scale/LRWA-327.webp",
  "paper-dispenser": "/images/product-catalogue/paper-dispenser/LRWA-378.webp",
  "hand-dryer": "/images/product-catalogue/hand-dryer/LRHD--285.webp",
  "shower-mat": "/images/product-catalogue/shower-mat/LRWA-346.webp",
  "cloth-line": "/images/product-catalogue/cloth-line/LRWA-350.webp",
  "towel-rack": "/images/product-catalogue/towel-rack/LRWA-347.webp",
  "toilet-paper-dispenser": "/images/product-catalogue/toilet-paper-dispenser/LRWA-355.webp",
  "towel-rod": "/images/product-catalogue/towel-rod/LRWA-348.webp",
  "washroom-tray": "/images/product-catalogue/washroom-tray/LRWA--372-Automatic.webp",
  "handicap-grab-bar": "/images/product-catalogue/handicap-grab-bar/LRWA-349.webp",
  // ── Lobby Items ──
  "luggage-trolley": "/images/product-catalogue/luggage-trolley-LT-801.webp",
  "housekeeping-trolley": "/images/product-catalogue/housekeeping-trolley/LRHT--425.webp",
  "lobby-dustbin": "/images/product-catalogue/ssp-lobby-dustbins/LRLI-445.webp",
  "q-manager": "/images/product-catalogue/ssp-q-manager/LRLI-457B.webp",
  "sign-board": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.webp",
  "stand-pole": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.webp",
  "digital-signage": "/images/product-catalogue/ssp-digital-signage/LRDS-43.webp",
  // ── Furniture ──
  "outdoor-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.webp",
  "guest-room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.webp",
  "restaurant-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.webp",
  "room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.webp",
  "garden-umbrella": "/images/product-catalogue/excel-images/Golf-Umbrella.webp",
  // ── Linen ──
  "room-linen": "/images/product-catalogue/room-linen/bedsheet-plain.webp",
  "bath-linen": "/images/product-catalogue/bath-linen/bath-towel-brown.webp",
  // ── Bath Tub ──
  "bath-tub-models": "/images/product-catalogue/bath-tub/LRBT---311-Color-Body.webp",
  // ── Amenities Tray Set ──
  "amenities-tray-set-models": "/images/product-catalogue/amenities-tray-set/LRAT-366.webp",
  // ── Dome & Space POD ──
  "dome-models": "/images/product-catalogue/dome-space-pod/LRDO---2001--4-2-Mtr.webp",
};

/* ─────────────────────────────────────────────────────────────
   Parent slug → category-level hero image.
   ───────────────────────────────────────────────────────────── */
export const PARENT_FALLBACK_IMAGE: Record<string, string> = {
  "room-amenities": "/images/categories/amenities.webp",
  "washroom-amenities": "/images/categories/washroom.webp",
  "lobby-items": "/images/categories/lobby.webp",
  "furniture": "/images/categories/furniture.webp",
  "linen": "/images/categories/linen.webp",
  "bath-tub": "/images/products/bath-tub.webp",
  "amenities-tray-set": "/images/product-catalogue/amenities-tray-set/LRAT-366.webp",
  "dome-space-pod": "/images/categories/dome.webp",
};

/**
 * Returns a real product image for a sub-category slug, falling back
 * to the coming-soon placeholder only when no mapping exists.
 */
export function getSubcategoryImage(
  slug: string,
  productImage?: string,
): string {
  if (productImage && !productImage.includes("coming-soon")) {
    return productImage;
  }
  return SUBCATEGORY_FALLBACK_IMAGE[slug] || "/images/product-catalogue/coming-soon.webp";
}

/**
 * Returns a real category image for a parent slug, falling back to
 * the coming-soon placeholder only when no mapping exists.
 */
export function getParentImage(
  slug: string,
  productImage?: string,
): string {
  if (productImage && !productImage.includes("coming-soon")) {
    return productImage;
  }
  return PARENT_FALLBACK_IMAGE[slug] || "/images/product-catalogue/coming-soon.webp";
}
