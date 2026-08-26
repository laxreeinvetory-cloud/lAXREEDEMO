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
  // ── Room Amenities ── (premium/lux tier models for previews)
  "mini-bar": "/images/product-catalogue/mini-bar/LRMB-126.webp",
<<<<<<< HEAD
  "tea-kettle": "/images/product-catalogue/excel-images/LRWT--155.jpg",
=======
  "tea-kettle": "/images/product-catalogue/excel-images/LRWT--155.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "kettle-tray": "/images/product-catalogue/excel-images/LRWT-168.webp",
  "safe-box": "/images/product-catalogue/excel-images/LRSB--214.webp",
  "wooden-hangers": "/images/product-catalogue/hangers/LRRA-653.webp",
  "rfid-locks": "/images/product-catalogue/door-lock/LRFD-607.webp",
  "room-telephone": "/images/product-catalogue/excel-images/LRDR--189.webp",
  "docking-pod": "/images/product-catalogue/excel-images/LRDR-177.webp",
  "room-dustbin": "/images/product-catalogue/dustbin/LRRA-657.webp",
  "desktop-accessories": "/images/product-catalogue/desktop-accessories/LRAT-370.webp",
  "rollaway-bed": "/images/product-catalogue/rollaway-bed/LRMR-251.webp",
  "mattress": "/images/product-catalogue/mattress/LRMR-251-8.webp",
<<<<<<< HEAD
  "iron-iron-board": "/images/product-catalogue/excel-images/Ironing-Board.jpg",
  "emergency-torch": "/images/product-catalogue/emergency-torch/LRET-351.jpg",
=======
  "iron-iron-board": "/images/product-catalogue/excel-images/Ironing-Board.webp",
  "emergency-torch": "/images/product-catalogue/emergency-torch/LRET-351.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "luggage-rack": "/images/product-catalogue/furniture/LRGF---673---Luggage-Rack.webp",
  // ── Washroom Amenities ──
  "hair-dryer": "/images/product-catalogue/hair-dryer/LRHD-276.webp",
  "soap-dispenser": "/images/product-catalogue/soap-dispenser/LRWA--358.webp",
  "magnifying-mirror": "/images/product-catalogue/magnifying-mirror/LRMM-302.webp",
  "lobby-soap-dispenser": "/images/product-catalogue/lobby-soap-dispenser/LRWA-372.webp",
  "weighing-scale": "/images/product-catalogue/weighing-scale/LRWA-390.webp",
  "paper-dispenser": "/images/product-catalogue/paper-dispenser/LRWA-327.webp",
  "hand-dryer": "/images/product-catalogue/hand-dryer/LRWA-376.webp",
  "shower-mat": "/images/product-catalogue/shower-mat/LRWA-346.webp",
  "cloth-line": "/images/product-catalogue/cloth-line/LRWA-350.webp",
  "towel-rack": "/images/product-catalogue/towel-rack/LRWA-347.webp",
  "toilet-paper-dispenser": "/images/product-catalogue/toilet-paper-dispenser/LRWA-355.webp",
  "towel-rod": "/images/product-catalogue/towel-rod/LRWA-348.webp",
  "washroom-tray": "/images/product-catalogue/washroom-tray/LRWA--372-Automatic.webp",
  "handicap-grab-bar": "/images/product-catalogue/handicap-grab-bar/LRWA-349.webp",
  // ── Lobby Items ──
  "luggage-trolley": "/images/product-catalogue/luggage-trolley-LT-801.webp",
<<<<<<< HEAD
  "housekeeping-trolley": "/images/product-catalogue/housekeeping-trolley/LRHT--425.jpg",
=======
  "housekeeping-trolley": "/images/product-catalogue/housekeeping-trolley/LRHT--425.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "lobby-dustbin": "/images/product-catalogue/ssp-lobby-dustbins/LRLI-445.webp",
  "q-manager": "/images/product-catalogue/ssp-q-manager/LRLI-457B.webp",
  "sign-board": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.webp",
  "stand-pole": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.webp",
  "digital-signage": "/images/product-catalogue/ssp-digital-signage/LRDS-43.webp",
  // ── Furniture ── (using AI-generated category previews for the right
  // visual match — the LRBF---5xx photos are all banquet/event chairs
  // which gave "Outdoor Furniture" a gold chair preview that looked wrong.)
  "outdoor-furniture": "/images/product-catalogue/furniture/outdoor-furniture-preview.webp",
  "guest-room-furniture": "/images/product-catalogue/furniture/guest-room-furniture-preview.webp",
  "restaurant-furniture": "/images/product-catalogue/furniture/LRBF---528.webp",
  "room-furniture": "/images/product-catalogue/furniture/LRBF---526.webp",
  "pool-lounger": "/images/product-catalogue/furniture/pool-lounger-preview.webp",
<<<<<<< HEAD
  "garden-umbrella": "/images/product-catalogue/excel-images/Golf-Umbrella.jpg",
=======
  "garden-umbrella": "/images/product-catalogue/excel-images/Golf-Umbrella.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "frp-flower-pots": "/images/product-catalogue/furniture/frp-flower-pots-preview.webp",
  // ── Linen ──
  "room-linen": "/images/product-catalogue/room-linen/bedsheet-plain.webp",
  "bath-linen": "/images/product-catalogue/bath-linen/bath-towel-brown.webp",
  // ── Bath Tub ──
  "bath-tub-models": "/images/product-catalogue/bath-tub/LRBT---311-Color-Body.webp",
  // ── Amenities Tray Set ── (LRAT-366/367/368 are bathtub photos — use LRAT-370 which is an actual tray set)
  "amenities-tray-set-models": "/images/product-catalogue/amenities-tray-set/LRAT-370.webp",
  // ── Dome & Space POD ──
  "dome-models": "/images/product-catalogue/dome-space-pod/LRDO---2001--4-2-Mtr.webp",
};

/* ─────────────────────────────────────────────────────────────
   Parent slug → category-level hero image.
   ───────────────────────────────────────────────────────────── */
export const PARENT_FALLBACK_IMAGE: Record<string, string> = {
  "room-amenities": "/images/categories/room-amenities.webp",
  "washroom-amenities": "/images/categories/washroom-amenities.webp",
  "lobby-items": "/images/categories/lobby-items.webp",
  "furniture": "/images/categories/furniture.webp",
<<<<<<< HEAD
  "linen": "/images/categories/linen-new.jpg",
=======
  "linen": "/images/categories/linen-new.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "bath-tub": "/images/products/bath-tub.webp",
  "amenities-tray-set": "/images/categories/amenities-tray-set.webp",
  "dome-space-pod": "/images/categories/space-pod.webp",
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

/* ─────────────────────────────────────────────────────────────
   Product model → correct image override.
   The live DB (Neon Postgres on Vercel) has stale image paths for
   some products (e.g. Docking Pod LRDR-177 points to a telephone
   image). This map overrides those bad DB values with the correct
   image path so the product detail page always shows the right
   product photo.
   ───────────────────────────────────────────────────────────── */
export const PRODUCT_IMAGE_OVERRIDE: Record<string, string> = {
  // Docking Pod products — DB points to telephone images, fix them
  "LRDR-177": "/images/product-catalogue/excel-images/LRDR-177.webp",
  "LRDR 177": "/images/product-catalogue/excel-images/LRDR-177.webp",
<<<<<<< HEAD
  "LRDR-178": "/images/product-catalogue/excel-images/LRDR-180.jpg",
  "LRDR 178": "/images/product-catalogue/excel-images/LRDR-180.jpg",
  "LRDR-176": "/images/product-catalogue/excel-images/LRDR-184.jpg",
  "LRDR 176": "/images/product-catalogue/excel-images/LRDR-184.jpg",
  // Room Telephone products — ensure they point to telephone images
  "LRDR-179": "/images/product-catalogue/excel-images/LRDR-179.webp",
  "LRDR-180": "/images/product-catalogue/excel-images/LRDR-180.jpg",
  "LRDR-181": "/images/product-catalogue/excel-images/LRDR-181.webp",
  "LRDR-182": "/images/product-catalogue/excel-images/LRDR-182.webp",
  "LRDR-183": "/images/product-catalogue/excel-images/LRDR-183.webp",
  "LRDR-184": "/images/product-catalogue/excel-images/LRDR-184.jpg",
  "LRDR-185": "/images/product-catalogue/excel-images/LRDR-185.webp",
  "LRDR-186": "/images/product-catalogue/excel-images/LRDR-186.webp",
  "LRDR-188": "/images/product-catalogue/excel-images/LRDR-188.jpg",
=======
  "LRDR-178": "/images/product-catalogue/excel-images/LRDR-180.webp",
  "LRDR 178": "/images/product-catalogue/excel-images/LRDR-180.webp",
  "LRDR-176": "/images/product-catalogue/excel-images/LRDR-184.webp",
  "LRDR 176": "/images/product-catalogue/excel-images/LRDR-184.webp",
  // Room Telephone products — ensure they point to telephone images
  "LRDR-179": "/images/product-catalogue/excel-images/LRDR-179.webp",
  "LRDR-180": "/images/product-catalogue/excel-images/LRDR-180.webp",
  "LRDR-181": "/images/product-catalogue/excel-images/LRDR-181.webp",
  "LRDR-182": "/images/product-catalogue/excel-images/LRDR-182.webp",
  "LRDR-183": "/images/product-catalogue/excel-images/LRDR-183.webp",
  "LRDR-184": "/images/product-catalogue/excel-images/LRDR-184.webp",
  "LRDR-185": "/images/product-catalogue/excel-images/LRDR-185.webp",
  "LRDR-186": "/images/product-catalogue/excel-images/LRDR-186.webp",
  "LRDR-188": "/images/product-catalogue/excel-images/LRDR-188.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "LRDR-189": "/images/product-catalogue/excel-images/LRDR--189.webp",
  "LRDR-190": "/images/product-catalogue/excel-images/LRDR--190.webp",
  "LRDR-191": "/images/product-catalogue/ssp-telephones/LRDR-191.webp",
  "LRDR-192": "/images/product-catalogue/ssp-telephones/LRDR-192.webp",
  // RFID Lock accessories — DB points all to LRFD-608, fix with correct images
  "DND Set": "/images/product-catalogue/excel-images/DND-Set.webp",
<<<<<<< HEAD
  "Encoder (ZFD)": "/images/product-catalogue/excel-images/Encoder-ZFD.jpg",
  "Encoder (Orbita)": "/images/product-catalogue/excel-images/Encoder-Orbita.webp",
  "Key Tag": "/images/product-catalogue/excel-images/Key-Tag.jpg",
  "Key Card (Z)": "/images/product-catalogue/excel-images/Key-Card-Z.jpg",
  "Key Card (O)": "/images/product-catalogue/excel-images/Key-Card-O.jpg",
=======
  "Encoder (ZFD)": "/images/product-catalogue/excel-images/Encoder-ZFD.webp",
  "Encoder (Orbita)": "/images/product-catalogue/excel-images/Encoder-Orbita.webp",
  "Key Tag": "/images/product-catalogue/excel-images/Key-Tag.webp",
  "Key Card (Z)": "/images/product-catalogue/excel-images/Key-Card-Z.webp",
  "Key Card (O)": "/images/product-catalogue/excel-images/Key-Card-O.webp",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
  "Energy Saver Switch": "/images/product-catalogue/excel-images/Energy-Saver-Switch.webp",
  // Safe Box products — DB has mattress image for LRSB-210 and duplicates
  "LRSB-210": "/images/product-catalogue/safe-box/LRSB-211.webp",
  "LRSB-205": "/images/product-catalogue/safe-box/LRSB-215.webp",
  "LRSB-208": "/images/product-catalogue/safe-box/LRSB-216.webp",
  "LRSB-201": "/images/product-catalogue/safe-box/LRSB-201.webp",
  "LRSB-202": "/images/product-catalogue/safe-box/LRSB-202.webp",
  "LRSB-209": "/images/product-catalogue/safe-box/LRSB-209.webp",
  // Luggage Rack — DB has dustbin (LRRA) and towel rack (LRWA) products
  // miscategorized as Luggage Rack. Show coming-soon instead.
  "LRRA 655": "/images/product-catalogue/coming-soon.webp",
  "LRRA-655": "/images/product-catalogue/coming-soon.webp",
  "LRRA - 650": "/images/product-catalogue/coming-soon.webp",
  "LRRA-650": "/images/product-catalogue/coming-soon.webp",
  "LRRA - 649": "/images/product-catalogue/coming-soon.webp",
  "LRRA-649": "/images/product-catalogue/coming-soon.webp",
  "LRWA-347": "/images/product-catalogue/coming-soon.webp",
  "LRLT 401": "/images/product-catalogue/coming-soon.webp",
  "LRLT-401": "/images/product-catalogue/coming-soon.webp",
  "LRLT 402": "/images/product-catalogue/coming-soon.webp",
  "LRLT-402": "/images/product-catalogue/coming-soon.webp",
  "LRLT 403": "/images/product-catalogue/coming-soon.webp",
  "LRLT-403": "/images/product-catalogue/coming-soon.webp",
};

/**
 * Returns the correct image for a product model, overriding stale
 * DB values when necessary.
 */
export function getProductImage(model: string, dbImage?: string): string {
  // Try exact match first
  let override = PRODUCT_IMAGE_OVERRIDE[model];
  // Try normalized (spaces → dashes, collapse multiple dashes, trim)
  if (!override) {
    const normalized = model.replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    override = PRODUCT_IMAGE_OVERRIDE[normalized];
  }
  // Also try without spaces entirely
  if (!override) {
    const noSpaces = model.replace(/\s+/g, "");
    override = PRODUCT_IMAGE_OVERRIDE[noSpaces];
  }
  if (override) return override;
  // Reject LRMR (mattress) images — they should never show for non-mattress products
  if (dbImage && dbImage.includes("LRMR") && !model.includes("LRMR")) {
    return "/images/product-catalogue/coming-soon.webp";
  }
  // Reject LRRA (dustbin) images for non-dustbin products
  if (dbImage && dbImage.includes("LRRA") && !model.includes("LRRA")) {
    return "/images/product-catalogue/coming-soon.webp";
  }
  // Reject LRWA (washroom accessories) images for products whose model
  // doesn't start with LRWA (prevents towel-rack images showing for luggage racks etc.)
  if (dbImage && dbImage.includes("LRWA") && !model.includes("LRWA")) {
    return "/images/product-catalogue/coming-soon.webp";
  }
  if (dbImage && !dbImage.includes("coming-soon")) return dbImage;
  return "/images/product-catalogue/coming-soon.webp";
}
