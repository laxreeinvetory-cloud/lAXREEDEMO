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
  "mini-bar": "/images/product-catalogue/mini-bar/LRMB-126.jpg",
  "tea-kettle": "/images/product-catalogue/tea-kettle/LRWT--143.jpg",
  "kettle-tray": "/images/product-catalogue/tray/LRWT-158.jpg",
  "safe-box": "/images/product-catalogue/safe-box/LRMR-252-10.jpg",
  "wooden-hangers": "/images/product-catalogue/hangers/LRRA-653.jpg",
  "rfid-locks": "/images/product-catalogue/door-lock/LRFD--613.jpg",
  "room-telephone": "/images/product-catalogue/ssp-telephones/LRDR-189.jpg",
  "docking-pod": "/images/product-catalogue/excel-images/LRDR-177.jpg",
  "room-dustbin": "/images/product-catalogue/dustbin/LRRA--649.jpg",
  "desktop-accessories": "/images/product-catalogue/desktop-accessories/LRAT-370.jpg",
  "rollaway-bed": "/images/product-catalogue/rollaway-bed/LRMR-251.jpg",
  "mattress": "/images/product-catalogue/mattress/LRMR-251-8.jpg",
  "iron-iron-board": "/images/product-catalogue/excel-images/Ironing-Board.jpg",
  "emergency-torch": "/images/product-catalogue/emergency-torch/LRET-351.jpg",
  "luggage-rack": "/images/product-catalogue/furniture/LRGF---673---Luggage-Rack.jpg",
  // ── Washroom Amenities ──
  "hair-dryer": "/images/product-catalogue/hair-dryer/LRHD-276.jpg",
  "soap-dispenser": "/images/product-catalogue/soap-dispenser/LRWA--358.jpg",
  "magnifying-mirror": "/images/product-catalogue/magnifying-mirror/LRMM-302.jpg",
  "lobby-soap-dispenser": "/images/product-catalogue/lobby-soap-dispenser/LRWA-372.jpg",
  "weighing-scale": "/images/product-catalogue/weighing-scale/LRWA-390.jpg",
  "paper-dispenser": "/images/product-catalogue/paper-dispenser/LRWA-327.jpg",
  "hand-dryer": "/images/product-catalogue/ssp-hand-dryers/LRWA-376.jpg",
  "shower-mat": "/images/product-catalogue/shower-mat/LRWA-346.jpg",
  "cloth-line": "/images/product-catalogue/cloth-line/LRWA-350.jpg",
  "towel-rack": "/images/product-catalogue/towel-rack/LRWA-347.jpg",
  "toilet-paper-dispenser": "/images/product-catalogue/toilet-paper-dispenser/LRWA-355.jpg",
  "towel-rod": "/images/product-catalogue/towel-rod/LRWA-348.jpg",
  "washroom-tray": "/images/product-catalogue/washroom-tray/LRWA--372-Automatic.jpg",
  "handicap-grab-bar": "/images/product-catalogue/handicap-grab-bar/LRWA-349.jpg",
  // ── Lobby Items ──
  "luggage-trolley": "/images/product-catalogue/luggage-trolley-LT-801.jpg",
  "housekeeping-trolley": "/images/product-catalogue/housekeeping-trolley/LRHT--425.jpg",
  "lobby-dustbin": "/images/product-catalogue/ssp-lobby-dustbins/LRLI-445.jpg",
  "q-manager": "/images/product-catalogue/ssp-q-manager/LRLI-457B.jpg",
  "sign-board": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.jpg",
  "stand-pole": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.jpg",
  "digital-signage": "/images/product-catalogue/ssp-digital-signage/LRDS-43.jpg",
  // ── Furniture ──
  "outdoor-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "guest-room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "restaurant-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "garden-umbrella": "/images/product-catalogue/excel-images/Golf-Umbrella.jpg",
  // ── Linen ──
  "room-linen": "/images/product-catalogue/room-linen/bedsheet-plain.jpg",
  "bath-linen": "/images/product-catalogue/bath-linen/bath-towel-brown.jpg",
  // ── Bath Tub ──
  "bath-tub-models": "/images/product-catalogue/bath-tub/LRBT---311-Color-Body.jpg",
  // ── Amenities Tray Set ──
  "amenities-tray-set-models": "/images/product-catalogue/amenities-tray-set/LRAT-366.jpg",
  // ── Dome & Space POD ──
  "dome-models": "/images/product-catalogue/dome-space-pod/LRDO---2001--4-2-Mtr.jpg",
};

/* ─────────────────────────────────────────────────────────────
   Parent slug → category-level hero image.
   ───────────────────────────────────────────────────────────── */
export const PARENT_FALLBACK_IMAGE: Record<string, string> = {
  "room-amenities": "/images/categories/room-amenities.png",
  "washroom-amenities": "/images/categories/washroom-amenities.png",
  "lobby-items": "/images/categories/lobby-items.png",
  "furniture": "/images/categories/furniture.jpg",
  "linen": "/images/categories/linen-new.jpg",
  "bath-tub": "/images/products/bath-tub.jpg",
  "amenities-tray-set": "/images/categories/amenities-tray-set.jpg",
  "dome-space-pod": "/images/categories/space-pod.png",
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
  return SUBCATEGORY_FALLBACK_IMAGE[slug] || "/images/product-catalogue/coming-soon.jpg";
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
  return PARENT_FALLBACK_IMAGE[slug] || "/images/product-catalogue/coming-soon.jpg";
}
