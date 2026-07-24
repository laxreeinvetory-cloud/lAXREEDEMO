/**
 * LaxRee Amenities — Master Catalogue Data
 * ─────────────────────────────────────────────────────────────────────────
 * COMPLETELY RESTRUCTURED — Task ID: MEGA-RESTRUCTURE
 *
 * The catalogue is now organised into 6 PARENT GROUPS containing 50
 * sub-categories (each sub-category = an item type such as Mini Bar,
 * Tea Kettle, Safe Box, etc.).
 *
 * PARENT GROUPS:
 *   1. room-amenities        (20 sub-categories) — guest-room products
 *   2. washroom-amenities    (11 sub-categories) — bathroom products
 *   3. lobby-items           ( 7 sub-categories) — public-area products
 *   4. furniture             ( 7 sub-categories) — all Coming Soon
 *   5. linen                 ( 2 sub-categories) — all Coming Soon
 *   6. more-categories       ( 3 sub-categories) — all Coming Soon
 *
 * PRODUCT TIERS (where applicable): Essential / Premium / Lux
 *
 * IMAGE PATHS:
 *   - Existing products (minibar, kettle, tray, safe, lock, hair dryer,
 *     mirror, hand dryer, trolley): kept as-is.
 *   - NEW products from SSP (hangers, phones, dustbins, desktop, soap
 *     dispensers, paper dispensers, lobby dustbins, Q managers, signage,
 *     digital signage, washroom accessories): /images/product-catalogue/
 *     ssp-<category>/<model>.jpg  (images to be extracted later).
 *   - Coming Soon placeholder: /images/product-catalogue/coming-soon.jpg
 *
 * No SSP prices are stored in this file.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type CatalogueProduct = {
  model: string;
  name: string;
  category: string;
  image: string;
  specs: { label: string; value: string }[];
  description: string;
  tier?: string; // "Essential" | "Premium" | "Lux" — product quality tier
  price?: string; // SSP price (e.g. "₹6,700")
};

export type CatalogueCategory = {
  slug: string;
  name: string;
  products: CatalogueProduct[];
};

/**
 * A parent group (e.g., "Room Amenities") bundles related sub-categories.
 * The flat `CATALOGUE_CATEGORIES` array remains the source of truth for
 * individual item types; this parent structure is additive metadata used
 * for navigation, landing-page sections, and sitemap organisation.
 */
export type CatalogueParent = {
  slug: string;
  name: string;
  description: string;
  /** Sub-category slugs that belong to this parent. */
  children: string[];
};

/* ───────────────────────────────────────────────────────────────────────
   PARENT GROUPS
   ─────────────────────────────────────────────────────────────────────── */
export const CATALOGUE_PARENTS: CatalogueParent[] = [
  {
    slug: "room-amenities",
    name: "Room Amenities",
    description:
      "Complete guest-room amenities — minibars, kettles, trays, safes, RFID locks, wooden hangers, room telephones, docking pods, dustbins, desktop accessories and more.",
    children: [
      "mini-bar",
      "tea-kettle",
      "kettle-tray",
      "safe-box",
      "wooden-hangers",
      "rfid-locks",
      "room-telephone",
      "docking-pod",
      "room-dustbin",
      "desktop-accessories",
      "rollaway-bed",
      "mattress",
      "iron-iron-board",
      "baby-cot",
      "coat-stand",
      "luggage-rack",
      "emergency-torch",
    ],
  },
  {
    slug: "washroom-amenities",
    name: "Washroom Amenities",
    description:
      "Bathroom and washroom products — hair dryers, soap dispensers, magnifying mirrors, lobby soap dispensers, weighing scales, paper dispensers, hand dryers, shower mats, cloth lines, towel racks, towel rods, handicap grab bars and more.",
    children: [
      "hair-dryer",
      "soap-dispenser",
      "magnifying-mirror",
      "lobby-soap-dispenser",
      "weighing-scale",
      "paper-dispenser",
      "hand-dryer",
      "shower-mat",
      "cloth-line",
      "towel-rack",
      "toilet-paper-dispenser",
      "towel-rod",
      "washroom-tray",
      "handicap-grab-bar",
    ],
  },
  {
    slug: "lobby-items",
    name: "Lobby Amenities",
    description:
      "Public-area and lobby products — luggage trolleys, housekeeping trolleys, lobby dustbins, Q managers (stanchions), sign boards, stand poles and digital signage totems.",
    children: [
      "luggage-trolley",
      "housekeeping-trolley",
      "lobby-dustbin",
      "q-manager",
      "sign-board",
      "stand-pole",
      "digital-signage",
    ],
  },
  {
    slug: "furniture",
    name: "Furniture",
    description:
      "Premium hotel furniture — outdoor, guest-room, restaurant, pool lounger, garden umbrella, FRP flower pots and room furniture. (Catalogue being finalised.)",
    children: [
      "outdoor-furniture",
      "guest-room-furniture",
      "restaurant-furniture",
      "pool-lounger",
      "garden-umbrella",
      "frp-flower-pots",
      "room-furniture",
    ],
  },
  {
    slug: "linen",
    name: "Linen",
    description:
      "Hotel linen — room linen (bed sheets, pillows, duvets, mattress protectors) and bath linen (bath towels, hand towels, bathrobes, face towels). (Catalogue being finalised.)",
    children: ["room-linen", "bath-linen"],
  },
  {
    slug: "bath-tub",
    name: "Bath Tub",
    description:
      "Premium freestanding bath tubs — solid surface construction, multiple sizes, elegant designs for luxury hotel bathrooms.",
    children: ["bath-tub-models"],
  },
  {
    slug: "amenities-tray-set",
    name: "Amenities Tray Set",
    description:
      "Premium amenities tray sets for hotel rooms — complete tray arrangements for guest room amenities.",
    children: ["amenities-tray-set-models"],
  },
  {
    slug: "dome-space-pod",
    name: "Dome & Space POD",
    description:
      "Geodesic domes and space pods for resorts, glamping sites and event venues. Premium structure solutions.",
    children: ["dome-models"],
  },
];

/* ───────────────────────────────────────────────────────────────────────
   HELPERS
   ─────────────────────────────────────────────────────────────────────── */

/** Returns a single "Coming Soon" placeholder product for a category. */
function comingSoon(categoryName: string): CatalogueProduct {
  return {
    model: "TBD",
    name: "Coming Soon",
    category: categoryName,
    image: "/images/product-catalogue/coming-soon.jpg",
    description:
      "This category is being finalised. Contact us for custom quotes.",
    tier: "Essential",
    specs: [
      { label: "Status", value: "Coming Soon" },
      { label: "Availability", value: "On Request" },
    ],
  };
}

/** Returns all sub-categories that belong to a given parent slug. */
export function getCategoriesByParent(
  parentSlug: string,
): CatalogueCategory[] {
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === parentSlug);
  if (!parent) return [];
  return CATALOGUE_CATEGORIES.filter((c) =>
    parent.children.includes(c.slug),
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CATALOGUE CATEGORIES — flat array of all 50 sub-categories.
   Each sub-category has its own slug, name and products[] list.
   ═══════════════════════════════════════════════════════════════════════ */
export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [
  /* ════════════════════════════════════════════════════════════════════
     PARENT 1 — ROOM AMENITIES  (20 sub-categories)
     ════════════════════════════════════════════════════════════════════ */

  /* ── 1.1 Mini Bar — 7 models (existing, kept as-is) ───────────────── */
  {
    slug: "mini-bar",
    name: "Mini Bar",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRMB-132",
        name: "45L Solid Door Compressor Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Automatic defrost, low noise and vibration, LED light inside, right side open, 1 pc shelf. Compressor based cooling. Size: W400 × D390 × H480mm.",
        tier: "Essential",
        specs: [
          { label: "Capacity", value: "45 Litres" },
          { label: "Cooling", value: "Compressor" },
          { label: "Door", value: "Solid, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D390 × H480mm" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── PREMIUM TIER (Thermoelectric) ──
      {
        model: "LRMB-126",
        name: "30L Glass Door Thermoelectric Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Low noise & vibration, CFC free, internal LED light, right side open, 1 pc shelf. Thermoelectric cooling. Size: W400 × D390 × H480mm.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "30 Litres" },
          { label: "Cooling", value: "Thermoelectric" },
          { label: "Door", value: "Glass, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D390 × H480mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRMB-127",
        name: "30L Solid Door Thermoelectric Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Low noise & vibration, CFC free, internal LED light, right side open, 1 pc shelf. Thermoelectric cooling. Size: W400 × D390 × H480mm.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "30 Litres" },
          { label: "Cooling", value: "Thermoelectric" },
          { label: "Door", value: "Solid, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D390 × H480mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRMB-128",
        name: "40L Glass Door Thermoelectric Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Low noise & vibration, CFC free, internal LED light, right side open, 1 pc shelf. Thermoelectric cooling. Size: W400 × D425 × H540mm.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "40 Litres" },
          { label: "Cooling", value: "Thermoelectric" },
          { label: "Door", value: "Glass, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D425 × H540mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRMB-129",
        name: "40L Solid Door Thermoelectric Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Low noise & vibration, CFC free, internal LED light, right side open, 1 pc shelf. Thermoelectric cooling. Size: W400 × D425 × H540mm.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "40 Litres" },
          { label: "Cooling", value: "Thermoelectric" },
          { label: "Door", value: "Solid, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D425 × H540mm" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── LUX TIER (Absorption) ──
      {
        model: "LRMB-130",
        name: "30L Mirror Finish Solid Door Absorption Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Zero noise and vibration, internal LED light, right side open, 1 pc shelf. Absorption cooling. Mirror finish solid door. Size: W400 × D425 × H475mm.",
        tier: "Lux",
        specs: [
          { label: "Capacity", value: "30 Litres" },
          { label: "Cooling", value: "Absorption" },
          { label: "Door", value: "Mirror Finish Solid, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Size", value: "W400 × D425 × H475mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRMB-131",
        name: "40L Mirror Finish Solid Door Absorption Mini Bar",
        category: "Mini Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Zero noise and vibration, internal LED light, right side open, 1 pc shelf. Absorption cooling. Mirror finish solid door for luxury rooms. Size: W400 × D425 × H550mm.",
        tier: "Lux",
        specs: [
          { label: "Capacity", value: "40 Litres" },
          { label: "Cooling", value: "Absorption" },
          { label: "Door", value: "Solid Mirror Finish, Right Open" },
          { label: "Shelves", value: "1 Glass" },
          { label: "Temp Range", value: "5°C – 12°C" },
          { label: "Size", value: "W400 × D425 × H550mm" },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ── 1.2 Tea Kettle — 4 models (moved from kettle-set) ────────────── */
  {
    slug: "tea-kettle",
    name: "Tea Kettle",
    products: [
      // ── PREMIUM TIER ──
      {
        model: "LRWT-155",
        name: "0.8L Electric Kettle — Double Layer SS304",
        category: "Tea Kettle",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "0.8L electric kettle, double layer with SS 304 food-grade inner stainless steel body. Matt finish PP outer surface. Automatic shut-off, anti-scalding. Power: 220V, 50Hz, 1200W.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "0.8 Litre" },
          { label: "Material", value: "SS304 Inner + PP Outer" },
          { label: "Power", value: "1200W, 220V 50Hz" },
          { label: "Features", value: "Auto Shut-off, Anti-Scalding" },
          { label: "Body", value: "Double Layer" },
          { label: "Color", value: "Black / White" },
        ],
      },
      {
        model: "LRWT-146",
        name: "0.6L Electric Kettle — Wooden Finish",
        category: "Tea Kettle",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "0.6L electric kettle with wooden finish and 304 SS inner body. Power: 220V-240V, 50-60Hz, 1000W. Stylish wooden exterior with food-grade steel interior.",
        tier: "Premium",
        specs: [
          { label: "Capacity", value: "0.6 Litre" },
          { label: "Material", value: "304 SS Inner + Wooden Finish" },
          { label: "Power", value: "1000W, 220-240V 50-60Hz" },
          { label: "Features", value: "Auto Shut-off" },
          { label: "Color", value: "Wooden + SS" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWT-150",
        name: "0.8L Electric Kettle — Strix Controller, Pastel",
        category: "Tea Kettle",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "0.8L electric kettle with premium Strix controller. Pastel off-white finish. Power: 220-240V, 50-60Hz, 1000W. Luxury tier for premium rooms.",
        tier: "Lux",
        specs: [
          { label: "Capacity", value: "0.8 Litre" },
          { label: "Controller", value: "Strix (Premium)" },
          { label: "Power", value: "1000W, 220-240V 50-60Hz" },
          { label: "Features", value: "Auto Shut-off" },
          { label: "Color", value: "Off-white + Pastel" },
        ],
      },
      {
        model: "LRWT-156",
        name: "1L Electric Kettle — Strix Controller, Double Layer",
        category: "Tea Kettle",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "1L electric kettle with Strix controller. Double layer body with SS 304 food-grade inner stainless steel, PP housing outer. Anti-scratch round spout, flat lid design. Auto shut-off, anti-scalding. Power: 220V, 50Hz, 1000W.",
        tier: "Lux",
        specs: [
          { label: "Capacity", value: "1.0 Litre" },
          { label: "Controller", value: "Strix (Premium)" },
          { label: "Material", value: "SS304 Inner + PP Outer" },
          { label: "Power", value: "1000W, 220V 50Hz" },
          {
            label: "Features",
            value: "Auto Shut-off, Anti-Scalding, Anti-Scratch",
          },
          { label: "Body", value: "Double Layer, Flat Lid" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWT 151",
        name: "0.8L Electric Kettle — Single Layer",
        category: "Tea Kettle",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "0.8L electric kettle, single layer. Power supply: 220V, 50Hz, 1000W. Automatic shut-off.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRWT 151" },
          { label: "Capacity", value: "0.8 Litre" },
          { label: "Power", value: "1000W, 220V 50Hz" },
          { label: "Body", value: "Single Layer" },
        ],
      },
    ],
  },

  /* ── 1.3 Kettle Tray (TCM Trays) — 13 models ──────────────────────── */
  {
    slug: "kettle-tray",
    name: "Kettle Tray",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRWT-160",
        name: "TCM Tray Set — ABS Material",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray set comprising main tray and sachet holder. Made in ABS material. Suitable for all kettles. Size: W380 × D260 × H55mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "ABS" },
          { label: "Includes", value: "Main Tray + Sachet Holder" },
          { label: "Size", value: "W380 × D260 × H55mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWT-158",
        name: "TCM Tray with Anti-Theft Mechanism — ABS",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. In-built sachet holder, separate compartment for stirrer, water spill collector. Made in ABS material. Size: W440 × D225 × H30mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "ABS" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W440 × D225 × H30mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWT-161",
        name: "TCM Tray with Anti-Theft — ABS, Compact",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. In-built sachet holder, separate compartment for stirrer, water spill collector. Made in ABS material. Size: W355 × D235 × H30mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "ABS" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W355 × D235 × H30mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black / White" },
        ],
      },
      {
        model: "LRWT-168",
        name: "TCM Tray — Melamine with Sachet Holder",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray made in melamine material with sachet holder. Main tray size: W395 × D280 × H24mm. Sachet holder: 155 × 115 × 50mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "Melamine" },
          { label: "Includes", value: "Main Tray + Sachet Holder" },
          { label: "Main Tray Size", value: "W395 × D280 × H24mm" },
          { label: "Sachet Holder", value: "155 × 115 × 50mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWT-171",
        name: "TCM Tray with Anti-Theft — Melamine",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. In-built sachet holder, separate compartment for stirrer, water spill collector. Made in melamine material. Size: W440 × D225 × H30mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "Melamine" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W440 × D225 × H30mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRWT-167",
        name: "TCM Tray with Anti-Theft — ABS + SS",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. In-built sachet holder, separate compartment for stirrer, water spill collector. Made in ABS with SS accents. Size: W350 × D204 × H50mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "ABS + Stainless Steel" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W350 × D204 × H50mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black + SS" },
        ],
      },
      {
        model: "LRWT-166",
        name: "TCM Tray Complete Set — Melamine, Anti-Theft",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Complete TCM tray set with anti-theft mechanism. Includes main tray, sachet holder, and service tray for mugs and glasses. Made in melamine. Main tray: W380 × D300 × H22.5mm. Service tray: W335 × D130 × H11mm. Tea box: W155 × D115 × H50mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Melamine" },
          { label: "Features", value: "Anti-Theft, Complete Set" },
          {
            label: "Includes",
            value: "Main Tray + Sachet Holder + Service Tray + Tea Box",
          },
          { label: "Main Tray", value: "W380 × D300 × H22.5mm" },
          { label: "Service Tray", value: "W335 × D130 × H11mm" },
          { label: "Tea Box", value: "W155 × D115 × H50mm" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWT-170",
        name: "TCM Tray with Anti-Theft — Wooden Finish + SS",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. ABS tray with wooden finish and SS accents. In-built sachet holder, separate compartment for stirrer, water spill collector. Size: W350 × D204 × H50mm.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "ABS + Wooden Finish + SS" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W350 × D204 × H50mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Wooden + SS" },
        ],
      },
      {
        model: "LRWT-163",
        name: "TCM Tray — ABS with PU Leatherette Covering",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray comprising main tray and sachet holder. ABS body with PU leatherette covering. Suitable for all kettles. Size: W390 × D260 × H30mm.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "ABS + PU Leatherette" },
          { label: "Includes", value: "Main Tray + Sachet Holder" },
          { label: "Size", value: "W390 × D260 × H30mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black + Grey" },
        ],
      },
      {
        model: "LRWT-159",
        name: "TCM Tray — Melamine, In-Built Compartments",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with in-built compartments for sachet, stirrer, mugs, and water bottle. Made in melamine material. Suitable for all kettle types. Size: W420 × D300 × H28mm.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "Melamine" },
          {
            label: "Compartments",
            value: "Sachet, Stirrer, Mugs, Water Bottle",
          },
          { label: "Size", value: "W420 × D300 × H28mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWT-164",
        name: "TCM Tray — Leatherette, Premium",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray made in leatherette. In-built sachet holder. Suitable for all kettle types. Size: W340 × D300 × H40mm. Luxury finish for premium rooms.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Features", value: "In-built Sachet Holder" },
          { label: "Size", value: "W340 × D300 × H40mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black / Brown" },
        ],
      },
      {
        model: "LRWT-165",
        name: "TCM Tray with Anti-Theft — ABS + SS, Compact",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray with anti-theft mechanism. In-built sachet holder, separate compartment for stirrer, water spill collector. Made in ABS with SS accents. Size: W267 × D198 × H70mm.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "ABS + Stainless Steel" },
          {
            label: "Features",
            value: "Anti-Theft, Sachet Holder, Stirrer Compartment",
          },
          { label: "Size", value: "W267 × D198 × H70mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black + SS" },
        ],
      },
      {
        model: "LRWT-162",
        name: "TCM Tray — Leatherette, Large",
        category: "Kettle Tray",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "TCM tray comprising main tray and sachet holder. Made in leatherette material. Suitable for all kettles. Size: W450 × D300 × H55mm. Large premium tray for luxury rooms.",
        tier: "Lux",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Includes", value: "Main Tray + Sachet Holder" },
          { label: "Size", value: "W450 × D300 × H55mm" },
          { label: "Compatibility", value: "All Kettle Types" },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ── 1.4 Safe Box — 11 models (existing, kept as-is) ─────────────── */
  {
    slug: "safe-box",
    name: "Safe Box",
    products: [
      {
        model: "LRSB-201",
        name: "Essential Safe Box (Black)",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Right hand flip with 4-6 digit personal codes. Low energy consumption. Individual manual over-ride key. Pre-drilled mount holes in the bottom. Master over-ride key option available.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Right Hand Flip" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Override", value: "Manual + Master Key" },
          { label: "Mount", value: "Pre-Drilled Holes" },
          { label: "Size", value: "W230 × D170 × H170mm" },
          { label: "Color", value: "Black / White" },
        ],
      },
      {
        model: "LRSB-206",
        name: "Medium Size Safe Box",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Right hand flip with 4-6 digit personal codes. Auto lock on 4 times wrong codes input. Low energy consumption. Manual over-ride key. Pre-drilled mount holes. Master over-ride key option available.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Right Hand Flip" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Security", value: "Auto Lock on 4 Wrong Codes" },
          { label: "Override", value: "Manual + Master Key" },
          { label: "Size", value: "W200 × D310 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-211",
        name: "Medium Size Safe Box — Essential",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Right hand flip with 4-6 digit personal codes. Auto lock on 4 times wrong codes input. Low energy consumption. Manual over-ride key. Pre-drilled mount holes. Master over-ride key option available.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Right Hand Flip" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Security", value: "Auto Lock on 4 Wrong Codes" },
          { label: "Override", value: "Manual + Master Key" },
          { label: "Size", value: "W315 × D200 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-212",
        name: "Laptop Size Safe Box — LED Display",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Individual over-ride key. Last 100 event records. Pre-drilled mount holes.",
        tier: "Essential",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-214",
        name: "Laptop Size Safe Box — LED, Premium",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Individual over-ride key. Last 100 event records. Pre-drilled mount holes.",
        tier: "Premium",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-202",
        name: "Laptop Size Safe Box — LED, Back-Lit",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Individual over-ride key. Last 100 event records.",
        tier: "Premium",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-213",
        name: "Laptop Size Safe Box — LED Display",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Individual over-ride key. Last 100 event records.",
        tier: "Premium",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-203",
        name: "Laptop Size Safe Box — Back-Lit Keypad",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display with back-lit keypad. Right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Master over-ride key option. Last 100 event records.",
        tier: "Lux",
        specs: [
          { label: "Display", value: "LED + Back-Lit Keypad" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-216",
        name: "Laptop Size Safe Box — Lux",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside for better visibility. Auto lock on 4 times wrong codes input. Individual over-ride key. Last 100 event records. Pre-drilled mount holes.",
        tier: "Lux",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-204",
        name: "Laptop Size Safe Box — Steel Ring, Lux",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display with back-lit keypad with aesthetic steel ring around the display panel. Right hand flip with 4-6 digit personal codes. LED light inside. Auto lock on 4 times wrong codes input. Master over-ride key option. Last 100 event records.",
        tier: "Lux",
        specs: [
          { label: "Display", value: "LED + Back-Lit + Steel Ring" },
          { label: "Codes", value: "4-6 Digit Personal" },
          { label: "Features", value: "LED Light Inside, Auto Lock" },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-209",
        name: "Laptop Size Safe Box — ORBITA, Lux",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED display, right hand flip with 4-6 digit personal codes. LED light inside. Auto lock on 4 times wrong codes input. Master password available. Mechanical override optional. Pre-drilled mount holes. Last 100 event records.",
        tier: "Lux",
        specs: [
          { label: "Display", value: "LED" },
          { label: "Codes", value: "4-6 Digit Personal" },
          {
            label: "Features",
            value: "Master Password, Mechanical Override",
          },
          { label: "Records", value: "Last 100 Events" },
          { label: "Size", value: "W420 × D370 × H200mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRSB-210",
        name: "Laptop Size Safe Box — Top Open Lid",
        category: "Safe Box",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Laptop size safe box with top open lid. Size: 410 × 350 × 200mm. Electronic keypad with override key.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRSB-210" },
          { label: "Type", value: "Top Open Lid" },
          { label: "Size", value: "410 × 350 × 200mm" },
        ],
      },
    ],
  },

  /* ── 1.5 Wooden Hangers — 11 models (NEW from SSP pages 4-5) ─────── */
  {
    slug: "wooden-hangers",
    name: "Wooden Hangers",
    products: [
      // ── ESSENTIAL TIER (B grade lotus wood) ──
      {
        model: "LRWH-229B",
        name: "Solid Wood Hanger with Anti-Slip Notch — B Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'B' grade lotus wood with central hook that can be 360° swiveled and a multi-function cross bar with anti-slip notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Essential",
        specs: [
          { label: "Wood Grade", value: "B Grade Lotus Wood" },
          { label: "Hook", value: "360° Swivel Central Hook" },
          { label: "Features", value: "Anti-Slip Notch, Cross Bar" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-227B",
        name: "Solid Wood Hanger — Antitheft, U-Shape Notch, B Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'B' grade Lotus wood with antitheft attachment, multi-function cross bar and U-shape notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Essential",
        specs: [
          { label: "Wood Grade", value: "B Grade Lotus Wood" },
          { label: "Security", value: "Antitheft Attachment" },
          { label: "Features", value: "Multi-Function Cross Bar, U-Shape Notch" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-231B",
        name: "Solid Wood Hanger with Anti-Slip Notch & Metal Clips — B Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'B' grade lotus wood with central hook that can be 360° swiveled and metal clips for pants. Anti-slip notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Essential",
        specs: [
          { label: "Wood Grade", value: "B Grade Lotus Wood" },
          { label: "Hook", value: "360° Swivel Central Hook" },
          { label: "Features", value: "Anti-Slip Notch, Metal Clips for Pants" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-226B",
        name: "Solid Wood Hanger — Antitheft, SS Clip, B Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'B' grade wood with antitheft attachment, U-shape notch and stainless-steel clip for pants. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Essential",
        specs: [
          { label: "Wood Grade", value: "B Grade Wood" },
          { label: "Security", value: "Antitheft Attachment" },
          { label: "Features", value: "U-Shape Notch, SS Clip for Pants" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      // ── PREMIUM TIER (A grade lotus wood) ──
      {
        model: "LRWH-229",
        name: "Solid Wood Hanger with Anti-Slip Notch — A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade lotus wood with central hook that can be 360° swiveled and a multi-function cross bar with anti-slip notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Premium",
        specs: [
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Hook", value: "360° Swivel Central Hook" },
          { label: "Features", value: "Anti-Slip Notch, Cross Bar" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-234",
        name: "Solid Wood Hanger — Anti-Slip Teeth Bar, A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade lotus wood with anti-slip teeth bar. Premium build with smooth finish. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Premium",
        specs: [
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Features", value: "Anti-Slip Teeth Bar" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-227",
        name: "Solid Wood Hanger — Antitheft, U-Shape, A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade Lotus wood with antitheft attachment, multi-function cross bar and U-shape notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Premium",
        specs: [
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Security", value: "Antitheft Attachment" },
          { label: "Features", value: "Multi-Function Cross Bar, U-Shape Notch" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-231",
        name: "Solid Wood Hanger with Anti-Slip Notch & Metal Clips — A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade lotus wood with central hook that can be 360° swiveled and metal clips for pants. Anti-slip notch. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Premium",
        specs: [
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Hook", value: "360° Swivel Central Hook" },
          { label: "Features", value: "Anti-Slip Notch, Metal Clips for Pants" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      {
        model: "LRWH-233",
        name: "Solid Wood Hanger — Antitheft, Teeth Bar, A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade Lotus wood with antitheft attachment and anti-slip teeth bar. Premium build. Colour: Natural Wood. Size: 44.5 cm.",
        tier: "Premium",
        specs: [
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Security", value: "Antitheft Attachment" },
          { label: "Features", value: "Anti-Slip Teeth Bar" },
          { label: "Size", value: "44.5 cm" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWH-228",
        name: "Satin Finish Shawl Hanger — Antitheft",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Satin finish shawl hanger with antitheft attachment. Luxury off-white finish for premium wardrobes. Size: 44.5 cm.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Shawl Hanger" },
          { label: "Finish", value: "Satin, Off-White" },
          { label: "Security", value: "Antitheft Attachment" },
          { label: "Size", value: "44.5 cm" },
        ],
      },
      {
        model: "LRWH-232",
        name: "Solid Wood Structure Coat Hanger — Flat Hook, A Grade",
        category: "Wooden Hangers",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in 'A' grade lotus wood with flat hook that can be 360° swiveled. Multifunction anti-slip bar with teeth. Designed for coats and heavier garments. Colour: Natural Wood.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Coat Hanger" },
          { label: "Wood Grade", value: "A Grade Lotus Wood" },
          { label: "Hook", value: "Flat, 360° Swivel" },
          { label: "Features", value: "Multifunction Anti-Slip Bar with Teeth" },
          { label: "Color", value: "Natural Wood" },
        ],
      },
    ],
  },

  /* ── 1.6 RFID Locks — 6 models (existing, kept as-is) ────────────── */
  {
    slug: "rfid-locks",
    name: "RFID Locks",
    products: [
      {
        model: "LRFD-608",
        name: "RFID Lock — SS Outer Body",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in SS outer body with 5 match SS finish mortise lock. Override key. Size: 242 × 32.5 × 77mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lock", value: "5 Match Mortise" },
          { label: "Override", value: "Key" },
          { label: "Size", value: "242 × 32.5 × 77mm" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRFD-609",
        name: "RFID Lock — Aluminium Alloy",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in aluminium alloy body and coated gloss paint with 5 match mortise lock. Master over-ride key. Size: 330 × 45 × 16mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Aluminium Alloy" },
          { label: "Lock", value: "5 Match Mortise" },
          { label: "Override", value: "Master Key" },
          { label: "Size", value: "330 × 45 × 16mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRFD-610",
        name: "RFID Lock — SS Body",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Made in stainless steel body with 5 SS finish latch mortise lock. Master key for override. Size: 242 × 32.5 × 77mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lock", value: "5 SS Latch Mortise" },
          { label: "Override", value: "Master Key" },
          { label: "Size", value: "242 × 32.5 × 77mm" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRFD-611",
        name: "DND Set — Do Not Disturb",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "With a pair of two switches — DND switch set and integrated door bell for guest room. Outer body made of glossy acrylic material. AC: 220V / 50Hz. Size: 86 × 89mm.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "DND Switch + Door Bell" },
          { label: "Body", value: "Glossy Acrylic" },
          { label: "Power", value: "220V / 50Hz AC" },
          { label: "Size", value: "86 × 89mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRFD-607",
        name: "RFID Hotel Room Lock — SS, Premium",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "RFID Lock + Mifare Card + Mortise Lock. 304 stainless steel body. Moisture proof, fire rated. Suitable for 35mm to 65mm doors. External panel: H280 × W40mm × D13mm. Audit records latest 1680. Interface with most PMS systems (Fidelio/Opera). Low battery detection. Up to 16 public areas integration.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Access", value: "RFID + Mifare Card" },
          { label: "Features", value: "Moisture Proof, Fire Rated" },
          { label: "Audit", value: "1680 Records" },
          { label: "PMS", value: "Fidelio/Opera Compatible" },
          { label: "Door Thickness", value: "35-65mm" },
          { label: "Panel Size", value: "H280 × W40 × D13mm" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRFD-606",
        name: "RFID Hotel Room Lock — Black, Lux",
        category: "RFID Locks",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "RFID Lock + Mifare Card + Mortise Lock. 304 stainless steel body. Moisture proof, fire rated. Suitable for 35mm to 65mm doors. External panel: H52 × W52mm × D12mm. Audit records latest 1680. Interface with most PMS systems (Fidelio/Opera). Low battery detection. Up to 16 public areas integration.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Access", value: "RFID + Mifare Card" },
          { label: "Features", value: "Moisture Proof, Fire Rated" },
          { label: "Audit", value: "1680 Records" },
          { label: "PMS", value: "Fidelio/Opera Compatible" },
          { label: "Door Thickness", value: "35-65mm" },
          { label: "Panel Size", value: "H52 × W52 × D12mm" },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ── 1.7 Room Telephone — 7 models (NEW from SSP pages 6-7) ──────── */
  {
    slug: "room-telephone",
    name: "Room Telephone",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRDR-191",
        name: "Basic Room Telephone",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Basic room telephone unit for standard hotel guest rooms. Simple, reliable and easy to use.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Basic Room Telephone" },
          { label: "Use", value: "Guest Room" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDR-192",
        name: "Bathroom Telephone",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Bathroom telephone unit designed for humid environments. Compact and discreet.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Bathroom Telephone" },
          { label: "Use", value: "Bathroom" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRDR-181",
        name: "Telephone Unit — Large Panel, 8 Speed Dialing",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Telephone unit with large panel cardboard, 8 speed dialing keys, dual tone electric ringing, hands-free function, mute key, auto dynamic redial key, flash key, dual tone dialing, hold key.",
        tier: "Premium",
        specs: [
          { label: "Panel", value: "Large Cardboard" },
          { label: "Speed Dial", value: "8 Keys" },
          {
            label: "Features",
            value: "Hands-Free, Mute, Auto Redial, Flash, Hold",
          },
          { label: "Ringing", value: "Dual Tone Electric" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDR-183",
        name: "Telephone Unit — Large Message Light, 6 Speed Dialing",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Telephone unit with large panel cardboard, large message light, message extraction one-touch to talk, 6 speed dialing keys, automatic line take-up function, long earphone cable, power-off memory, hands-free function.",
        tier: "Premium",
        specs: [
          { label: "Panel", value: "Large Cardboard" },
          { label: "Speed Dial", value: "6 Keys" },
          { label: "Message Light", value: "Large" },
          {
            label: "Features",
            value: "One-Touch Talk, Auto Line Take-Up, Power-Off Memory, Hands-Free",
          },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDR-190",
        name: "Wall Mountable Bathroom Telephone — Waterproof",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wall mountable bathroom telephone unit. Soft humanized ring, efficient light for ringer, double audio dialing, auto redial, flash/transfer, mute button lighting proof, moisture proof and water proof.",
        tier: "Premium",
        specs: [
          { label: "Mount", value: "Wall Mountable" },
          { label: "Use", value: "Bathroom" },
          {
            label: "Features",
            value: "Soft Humanized Ring, Auto Redial, Flash/Transfer, Mute",
          },
          { label: "Protection", value: "Moisture Proof, Water Proof" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRDR-182",
        name: "Lobby House Telephone — Panel Indicator",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby house telephone unit with panel indicator for call connect. Designed for lobby and house use.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Lobby House Telephone" },
          { label: "Features", value: "Panel Indicator for Call Connect" },
          { label: "Use", value: "Lobby / House" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDR-189",
        name: "Telephone Unit — Lux",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Premium telephone unit for luxury rooms and suites. High-grade build and finish.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Telephone Unit" },
          { label: "Tier", value: "Lux" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDR-184",
        name: "Wall Mountable Bathroom Telephone",
        category: "Room Telephone",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wall mountable bathroom telephone unit with soft humanized design. Moisture-resistant build for washroom installation.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRDR-184" },
          { label: "Type", value: "Wall Mountable Bathroom Telephone" },
          { label: "Features", value: "Moisture-Resistant" },
        ],
      },
    ],
  },

  /* ── 1.8 Docking Pod — 1 model (NEW from SSP page 6) ─────────────── */
  {
    slug: "docking-pod",
    name: "Docking Pod",
    products: [
      {
        model: "LRDR-177",
        name: "Electronic FM Radio with Bluetooth — Dual USB Charging",
        category: "Docking Pod",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Electronic FM Radio with Bluetooth. Rotatable lightning connector / Micro USB & Type C connector. Dual USB charging, supports 2.1A charging current. AC input: 100-240V / 50-60Hz, DC output: 5V/2A. Size: L150 × W110 × H13.8mm.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "FM Radio + Bluetooth" },
          { label: "Connectors", value: "Lightning / Micro USB / Type C" },
          { label: "USB Charging", value: "Dual, 2.1A" },
          { label: "AC Input", value: "100-240V / 50-60Hz" },
          { label: "DC Output", value: "5V / 2A" },
          { label: "Size", value: "L150 × W110 × H13.8mm" },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ── 1.9 Room Dustbin — 11 models (NEW from SSP pages 7-8) ───────── */
  {
    slug: "room-dustbin",
    name: "Room Dustbin",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRRA-658",
        name: "Perforated SS Dustbin — Round",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Perforated stainless steel dustbin, full round shape, with soft rubber grip at the bottom for anti-scratch. Size: 175 × 250mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Perforated Stainless Steel" },
          { label: "Shape", value: "Round" },
          { label: "Features", value: "Soft Rubber Anti-Scratch Grip" },
          { label: "Size", value: "175 × 250mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRRA-656",
        name: "Peddle SS Dustbin — 5 Ltr",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Peddle stainless steel dustbin, full round shape, with inner plastic bucket and soft rubber grip at the bottom for anti-scratch. Capacity: 5 ltr.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Shape", value: "Round" },
          { label: "Lid", value: "Peddle" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Features", value: "Inner Plastic Bucket, Anti-Scratch Grip" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRRA-659",
        name: "Double Layer Room Dustbin — PP, Leather Finish",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer room dustbin. Outer cover made in leather finish PP, inner cover of plain finish PP with soft rubber grip at the bottom for anti-scratch. Size: 225 × 255mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Double Layer PP" },
          { label: "Outer Finish", value: "Leather Finish" },
          { label: "Features", value: "Soft Rubber Anti-Scratch Grip" },
          { label: "Size", value: "225 × 255mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRRA-667",
        name: "SS 5 Ltr Swing Lid Dustbin",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless steel 5 ltr dustbin with swing lid. Rubber ring at the bottom for scratch resistance. Size: 8 × 12 inches.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lid", value: "Swing" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Features", value: "Rubber Anti-Scratch Ring" },
          { label: "Size", value: "8 × 12 inches" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRRA-669",
        name: "Double Layer Dustbin — Wooden Finish, 5 Ltr",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer dustbin with outer layer in wooden finish, rectangle shape and SS strip. Capacity: 5 ltr.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Double Layer" },
          { label: "Outer Finish", value: "Wooden" },
          { label: "Shape", value: "Rectangle" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Accent", value: "SS Strip" },
        ],
      },
      {
        model: "LRRA-670",
        name: "Double Layer Dustbin — ABS, Brown & Orange, 5 Ltr",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer dustbin with outer layer made with ABS material, rectangle shape. Capacity: 5 ltr. Brown & orange / grey finish.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Double Layer ABS" },
          { label: "Shape", value: "Rectangle" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Color", value: "Brown & Orange / Grey" },
        ],
      },
      {
        model: "LRRA-668",
        name: "Double Layer Dustbin — Marble Finish, 5 Ltr",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer dustbin with outer layer in marble finish, rectangle shape and SS strip. Capacity: 5 ltr.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Double Layer" },
          { label: "Outer Finish", value: "Marble" },
          { label: "Shape", value: "Rectangle" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Accent", value: "SS Strip" },
          { label: "Color", value: "Marble White" },
        ],
      },
      {
        model: "LRRA-657",
        name: "Double Layer SS Dustbin — Matt Finish",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer SS dustbin. Outer cover made in matt finish SS, inner cover of PP with soft rubber grip at the bottom for anti-scratch. Size: 225 × 255mm.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Double Layer SS" },
          { label: "Outer Finish", value: "Matt" },
          { label: "Inner", value: "PP" },
          { label: "Features", value: "Soft Rubber Anti-Scratch Grip" },
          { label: "Size", value: "225 × 255mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRRA-665",
        name: "Peddle SS Dustbin — Soft Close, 5 Ltr",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Soft-close lid SS dustbin with inner plastic bucket, round shape. Capacity: 5 ltr. Size: dia-200 × H270mm.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lid", value: "Peddle, Soft Close" },
          { label: "Shape", value: "Round" },
          { label: "Capacity", value: "5 Ltr" },
          { label: "Size", value: "Ø200 × H270mm" },
          { label: "Features", value: "Inner Plastic Bucket" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRRA-660",
        name: "Square Leatherette Room Dustbin",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Room dustbin made in leatherette material. Size: D265 × H265mm. Luxury finish for premium rooms.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Leatherette" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "D265 × H265mm" },
          { label: "Color", value: "Black / Brown" },
        ],
      },
      {
        model: "LRRA-671",
        name: "ABS Dustbin — With Partition",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "ABS dustbin with partition in the middle for waste segregation. Modern design.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Features", value: "Partition in Middle (Waste Segregation)" },
          { label: "Color", value: "Grey" },
        ],
      },
      {
        model: "LRRA-666 SP+PP",
        name: "Double Layer Dustbin — SS Outer, SP+PP Inner",
        category: "Room Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Double layer dustbin made in SS outer body with SP+PP inner. Durable and hygienic.",
        tier: "Premium",
        specs: [
          { label: "Model", value: "LRRA-666 SP+PP" },
          { label: "Body", value: "SS Outer, SP+PP Inner" },
          { label: "Type", value: "Double Layer" },
        ],
      },
    ],
  },

  /* ── 1.10 Desktop Accessories — 13 models (NEW from SSP pages 8-9) ─ */
  {
    slug: "desktop-accessories",
    name: "Desktop Accessories",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRDA-805",
        name: "Rectangle Tissue Box — ABS + PU Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Rectangle tissue box made in ABS body with top cover of PU leatherette. Size: W205 × D100 × H70mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Top Cover", value: "PU Leatherette" },
          { label: "Shape", value: "Rectangle" },
          { label: "Size", value: "W205 × D100 × H70mm" },
          { label: "Color", value: "Black + Grey" },
        ],
      },
      {
        model: "LRDA-806",
        name: "Square Tissue Box — ABS + PU Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Square tissue box made in ABS body with top cover of PU leatherette. Size: W100 × D100 × H80mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Top Cover", value: "PU Leatherette" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "W100 × D100 × H80mm" },
          { label: "Color", value: "Black + Grey" },
        ],
      },
      {
        model: "LRDA-814",
        name: "Remote Holder — ABS + PU Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Remote holder made in ABS body with top cover of PU leatherette. Size: W90 × D100 × H90mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Top Cover", value: "PU Leatherette" },
          { label: "Size", value: "W90 × D100 × H90mm" },
          { label: "Color", value: "Black + Grey" },
        ],
      },
      {
        model: "LRDA-811",
        name: "Notepad Holder — Resin",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Resin-made notepad holder. Size: 205 × 12 × 105mm.",
        tier: "Essential",
        specs: [
          { label: "Material", value: "Resin" },
          { label: "Size", value: "205 × 12 × 105mm" },
          { label: "Color", value: "Brown + Cream" },
        ],
      },
      {
        model: "LRDA-817",
        name: "Accessory Tray — ABS + PU Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Accessory tray made in ABS body and covered with PU leatherette material. Size: W310 × D205 × H30mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Cover", value: "PU Leatherette" },
          { label: "Size", value: "W310 × D205 × H30mm" },
          { label: "Color", value: "Black + Grey" },
        ],
      },
      {
        model: "LRDA-824",
        name: "Coaster for Double Glass — Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Coaster for double glass made in leatherette material. Size: 4\" × 12\".",
        tier: "Essential",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Use", value: "Double Glass Coaster" },
          { label: "Size", value: '4" × 12"' },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRDA-812",
        name: "Notepad Holder — Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Notepad holder made in leatherette. Size: W200 × D105 × H10mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Size", value: "W200 × D105 × H10mm" },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      {
        model: "LRDA-812A",
        name: "A3 Compedium — Leatherette, Magnetic Clip",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "A3 size compedium made in leatherette material with magnetic clip for paper and pocket brochure on one side. Size: 297 × 420mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Features", value: "Magnetic Clip, Brochure Pocket" },
          { label: "Size", value: "297 × 420mm (A3)" },
          {
            label: "Color",
            value: "Black / Brown / Off White / Green",
          },
        ],
      },
      {
        model: "LRDA-815",
        name: "Remote Holder — Leatherette",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Remote holder made in leatherette. Size: W120 × D140 × H90mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Size", value: "W120 × D140 × H90mm" },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      {
        model: "LRDA-801",
        name: "Square Leatherette Tissue Box",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Square tissue box made in leatherette material. Size: W130 × D130 × H145mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "W130 × D130 × H145mm" },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      {
        model: "LRDA-804",
        name: "Rectangle Leatherette Tissue Box",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Rectangle tissue box made in leatherette material. Size: W220 × D130 × H55mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Shape", value: "Rectangle" },
          { label: "Size", value: "W220 × D130 × H55mm" },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      {
        model: "LRDA-818",
        name: "Accessory Tray — Leatherette, Large",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Accessory tray made in leatherette material. Size: W305 × D300 × H80mm.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Leatherette" },
          { label: "Size", value: "W305 × D300 × H80mm" },
          { label: "Color", value: "Brown / Black" },
        ],
      },
      {
        model: "LRAT-370",
        name: "Notepad Holder — Resin, Wood Finish",
        category: "Desktop Accessories",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Resin-made notepad holder in wood-like finish. Size: 205 × 12 × 105mm. Premium wooden-look alternative to standard resin holder.",
        tier: "Premium",
        specs: [
          { label: "Material", value: "Resin" },
          { label: "Finish", value: "Wood-Like" },
          { label: "Size", value: "205 × 12 × 105mm" },
          { label: "Color", value: "Wooden Finish" },
        ],
      },
    ],
  },

  /* ── 1.11 Rollaway Bed — 3 models (from SSP) ─────────────────────── */
  {
    slug: "rollaway-bed",
    name: "Rollaway Bed",
    products: [
      {
        model: "LRMR 255",
        name: "Rollaway Bed — 4 inch",
        category: "Rollaway Bed",
        image: "/images/product-catalogue/rollaway-bed/LRMR-255.png",
        description:
          "Foldable rollaway bed with 4 inch mattress. MS powder coated frame with castor wheels for easy mobility.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRMR 255" },
          { label: "Mattress", value: '4 inch' },
          { label: "Frame", value: "MS Powder Coated" },
          { label: "Wheels", value: "Castor" },
        ],
      },
      {
        model: "LRMR 257 ( Bonded Foam )",
        name: "Rollaway Bed — 6 inch, Bonded Foam",
        category: "Rollaway Bed",
        image: "/images/product-catalogue/rollaway-bed/LRMR-257-Bonded-Foam.png",
        description:
          "Foldable rollaway bed with 6 inch bonded foam mattress. MS powder coated frame with castor wheels.",
        tier: "Premium",
        specs: [
          { label: "Model", value: "LRMR 257 (Bonded Foam)" },
          { label: "Mattress", value: '6 inch Bonded Foam' },
          { label: "Frame", value: "MS Powder Coated" },
          { label: "Wheels", value: "Castor" },
        ],
      },
      {
        model: "LRMR 257 ( Pocket Spring )",
        name: "Rollaway Bed — 6 inch, Pocket Spring",
        category: "Rollaway Bed",
        image: "/images/product-catalogue/rollaway-bed/LRMR-257-Pocket-Spring.png",
        description:
          "Foldable rollaway bed with 6 inch pocket spring mattress. MS powder coated frame with castor wheels.",
        tier: "Lux",
        specs: [
          { label: "Model", value: "LRMR 257 (Pocket Spring)" },
          { label: "Mattress", value: '6 inch Pocket Spring' },
          { label: "Frame", value: "MS Powder Coated" },
          { label: "Wheels", value: "Castor" },
        ],
      },
    ],
  },

  /* ── 1.12 Mattress — 12 models (Bonnell & Pocket Spring, 8/10/12 inch) ─ */
  {
    slug: "mattress",
    name: "Mattress",
    products: [
      {
        model: "LRMR 251 ( Bonnel 8\" )",
        name: 'Bonnell Spring Mattress — 8 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-251-Bonnel-8.jpg",
        description: "Bonnell spring mattress, 8 inch thickness. Hotel-grade comfort.",
        tier: "Essential",
        specs: [{ label: "Type", value: "Bonnell Spring" }, { label: "Thickness", value: '8 inch' }],
      },
      {
        model: "LRMR 251 ( Bonnel 10\" )",
        name: 'Bonnell Spring Mattress — 10 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-251-Bonnel-10.jpg",
        description: "Bonnell spring mattress, 10 inch thickness. Hotel-grade comfort.",
        tier: "Essential",
        specs: [{ label: "Type", value: "Bonnell Spring" }, { label: "Thickness", value: '10 inch' }],
      },
      {
        model: "LRMR 251 ( Bonnel 12\" )",
        name: 'Bonnell Spring Mattress — 12 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-251-Bonnel-12.jpg",
        description: "Bonnell spring mattress, 12 inch thickness. Hotel-grade comfort.",
        tier: "Essential",
        specs: [{ label: "Type", value: "Bonnell Spring" }, { label: "Thickness", value: '12 inch' }],
      },
      {
        model: "LRMR 252 ( Eurotop Bonnel 8\" )",
        name: 'Eurotop Bonnell Spring Mattress — 8 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-252-Eurotop-Bonnel-8.jpg",
        description: "Eurotop bonnell spring mattress, 8 inch thickness. Plush eurotop layer.",
        tier: "Premium",
        specs: [{ label: "Type", value: "Eurotop Bonnell" }, { label: "Thickness", value: '8 inch' }],
      },
      {
        model: "LRMR 252 ( Eurotop Bonnel 10\" )",
        name: 'Eurotop Bonnell Spring Mattress — 10 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-252-Eurotop-Bonnel-10.jpg",
        description: "Eurotop bonnell spring mattress, 10 inch thickness. Plush eurotop layer.",
        tier: "Premium",
        specs: [{ label: "Type", value: "Eurotop Bonnell" }, { label: "Thickness", value: '10 inch' }],
      },
      {
        model: "LRMR 252 ( Eurotop Bonnel 12\" )",
        name: 'Eurotop Bonnell Spring Mattress — 12 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-252-Eurotop-Bonnel-12.jpg",
        description: "Eurotop bonnell spring mattress, 12 inch thickness. Plush eurotop layer.",
        tier: "Premium",
        specs: [{ label: "Type", value: "Eurotop Bonnell" }, { label: "Thickness", value: '12 inch' }],
      },
      {
        model: 'LRMR 253 (Pocket 8")',
        name: 'Pocket Spring Mattress — 8 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-253-Pocket-8.jpg",
        description: "Pocket spring mattress, 8 inch thickness. Individually wrapped coils for motion isolation.",
        tier: "Premium",
        specs: [{ label: "Type", value: "Pocket Spring" }, { label: "Thickness", value: '8 inch' }],
      },
      {
        model: 'LRMR 253 ( Pocket 10")',
        name: 'Pocket Spring Mattress — 10 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-253-Pocket-10.jpg",
        description: "Pocket spring mattress, 10 inch thickness. Individually wrapped coils for motion isolation.",
        tier: "Lux",
        specs: [{ label: "Type", value: "Pocket Spring" }, { label: "Thickness", value: '10 inch' }],
      },
      {
        model: 'LRMR 253 ( Pocket 12")',
        name: 'Pocket Spring Mattress — 12 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-253-Pocket-12.jpg",
        description: "Pocket spring mattress, 12 inch thickness. Individually wrapped coils for motion isolation.",
        tier: "Lux",
        specs: [{ label: "Type", value: "Pocket Spring" }, { label: "Thickness", value: '12 inch' }],
      },
      {
        model: 'LRMR 254 ( Eurotop Pocket 8" )',
        name: 'Eurotop Pocket Spring Mattress — 8 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-254-Eurotop-Pocket-8.jpg",
        description: "Eurotop pocket spring mattress, 8 inch thickness. Premium eurotop over pocket springs.",
        tier: "Lux",
        specs: [{ label: "Type", value: "Eurotop Pocket" }, { label: "Thickness", value: '8 inch' }],
      },
      {
        model: 'LRMR 254 ( Eurotop Pocket 10" )',
        name: 'Eurotop Pocket Spring Mattress — 10 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-254-Eurotop-Pocket-10.jpg",
        description: "Eurotop pocket spring mattress, 10 inch thickness. Premium eurotop over pocket springs.",
        tier: "Lux",
        specs: [{ label: "Type", value: "Eurotop Pocket" }, { label: "Thickness", value: '10 inch' }],
      },
      {
        model: 'LRMR 254 ( Eurotop Pocket 12" )',
        name: 'Eurotop Pocket Spring Mattress — 12 inch',
        category: "Mattress",
        image: "/images/product-catalogue/mattress/LRMR-254-Eurotop-Pocket-12.jpg",
        description: "Eurotop pocket spring mattress, 12 inch thickness. Premium eurotop over pocket springs.",
        tier: "Lux",
        specs: [{ label: "Type", value: "Eurotop Pocket" }, { label: "Thickness", value: '12 inch' }],
      },
    ],
  },

  /* ── 1.13 Iron & Iron Board — Coming Soon ────────────────────────── */
  {
    slug: "iron-iron-board",
    name: "Iron & Iron Board",
    products: [comingSoon("Iron & Iron Board")],
  },

  /* ── 1.14 Baby Cot — Coming Soon ─────────────────────────────────── */
  {
    slug: "baby-cot",
    name: "Baby Cot",
    products: [comingSoon("Baby Cot")],
  },

  /* ── 1.15 Coat Stand — 2 models (from SSP) ───────────────────────── */
  {
    slug: "coat-stand",
    name: "Coat Stand",
    products: [
      {
        model: "LRRA 651",
        name: "Coat Stand — LRRA 651",
        category: "Coat Stand",
        image: "/images/product-catalogue/coat-stand/LRRA-651.png",
        description:
          "Freestanding coat stand for guest rooms and lobby areas.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRRA 651" },
        ],
      },
      {
        model: "LRRA 652",
        name: "Coat Stand — LRRA 652",
        category: "Coat Stand",
        image: "/images/product-catalogue/coat-stand/LRRA-652.png",
        description:
          "Premium freestanding coat stand for guest rooms and lobby areas.",
        tier: "Premium",
        specs: [
          { label: "Model", value: "LRRA 652" },
        ],
      },
    ],
  },

  /* ── 1.16 Luggage Rack — Coming Soon ─────────────────────────────── */
  {
    slug: "luggage-rack",
    name: "Luggage Rack",
    products: [comingSoon("Luggage Rack")],
  },

  /* ── 1.17 Emergency Torch — Coming Soon ──────────────────────────── */
  {
    slug: "emergency-torch",
    name: "Emergency Torch",
    products: [comingSoon("Emergency Torch")],
  },

  /* ── 1.18 Hair Dryer — 1 model (existing, kept as-is) ────────────── */
  {
    slug: "hair-dryer",
    name: "Hair Dryer",
    products: [
      {
        model: "LRHD-280",
        name: "Hair Dryer with Foldable Handle + Hang-Up Loop",
        category: "Hair Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Power: 2100W. Safety switch. Power supply: 220-240V, 50Hz. 2 speed blow with 3 mode hot/cold intensity option. Ionised air for softer hair. Magnetic removable air-blast nozzles. Auto off on over-heat. Twisted cord length: 2m. Size: W270 × D140 × H250mm.",
        tier: "Lux",
        specs: [
          { label: "Power", value: "2100W" },
          { label: "Speed", value: "2 Speed, 3 Modes" },
          { label: "Features", value: "Ionised Air, Auto Off" },
          { label: "Nozzle", value: "Magnetic Removable" },
          { label: "Cord", value: "2m Twisted" },
          { label: "Size", value: "W270 × D140 × H250mm" },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ── 1.19 Soap Dispenser — 9 models (NEW from SSP page 12) ───────── */
  {
    slug: "soap-dispenser",
    name: "Soap Dispenser",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRWA-382",
        name: "Manual Soap Dispenser — ABS, 350ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual soap dispenser made in ABS. Capacity: 350ml. Wall-mounted for guest-room washbasins.",
        tier: "Essential",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Body", value: "ABS" },
          { label: "Capacity", value: "350ml" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-383",
        name: "Manual Soap Dispenser — 3 Liquid Types, 400ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual soap dispenser that supports 3 liquid types (soap, shampoo, lotion). Capacity: 400ml. Wall-mounted.",
        tier: "Essential",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Liquid Types", value: "3 (Soap / Shampoo / Lotion)" },
          { label: "Capacity", value: "400ml" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-385",
        name: "Manual Soap Dispenser — Silicone Vacuum, 300ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual soap dispenser with silicone vacuum mechanism for clean, drip-free dispensing. Capacity: 300ml.",
        tier: "Essential",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Mechanism", value: "Silicone Vacuum" },
          { label: "Capacity", value: "300ml" },
          { label: "Color", value: "White" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRWA-362-1pc",
        name: "Manual Pump Soap Dispenser — ABS Bracket, 300ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual pump soap dispenser with ABS bracket. Single bottle. Capacity: 300ml.",
        tier: "Premium",
        specs: [
          { label: "Operation", value: "Manual Pump" },
          { label: "Bracket", value: "ABS" },
          { label: "Bottles", value: "1" },
          { label: "Capacity", value: "300ml" },
          { label: "Color", value: "Brown" },
        ],
      },
      {
        model: "LRWA-362-2pc",
        name: "Manual Pump Soap Dispenser — 2 Bottles, 300ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual pump soap dispenser with ABS bracket and two bottles for soap + shampoo (or shampoo + lotion). Capacity: 300ml each.",
        tier: "Premium",
        specs: [
          { label: "Operation", value: "Manual Pump" },
          { label: "Bracket", value: "ABS" },
          { label: "Bottles", value: "2" },
          { label: "Capacity", value: "300ml each" },
          { label: "Color", value: "Brown" },
        ],
      },
      {
        model: "LRWA-364",
        name: "Soap Dispenser Set of 3 — SS, Anti-Theft, 500ml",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Set of 3 stainless-steel soap dispensers (soap, shampoo, lotion) with anti-theft mechanism. Capacity: 500ml each.",
        tier: "Premium",
        specs: [
          { label: "Set", value: "3 Dispensers" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Security", value: "Anti-Theft" },
          { label: "Capacity", value: "500ml each" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRWA-362-wooden",
        name: "Manual Pump Soap Dispenser — Wooden Finish, 300ml × 2",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual pump soap dispenser with wooden finish bracket and two bottles. Capacity: 300ml each. Warm, premium look for boutique rooms.",
        tier: "Premium",
        specs: [
          { label: "Operation", value: "Manual Pump" },
          { label: "Bracket", value: "Wooden Finish" },
          { label: "Bottles", value: "2" },
          { label: "Capacity", value: "300ml each" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWA-365",
        name: "Manual Soap Dispenser — SS Bracket, PET Bottle, 400ml × 2",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual soap dispenser with stainless-steel bracket and two PET bottles. Capacity: 400ml each. Premium dual-bottle setup.",
        tier: "Lux",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Bracket", value: "Stainless Steel" },
          { label: "Bottle", value: "PET" },
          { label: "Bottles", value: "2" },
          { label: "Capacity", value: "400ml each" },
          { label: "Color", value: "Brown + Black" },
        ],
      },
      {
        model: "LRWA-373",
        name: "Automatic Soap Dispenser — ABS",
        category: "Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Automatic (sensor) soap dispenser made in ABS. Touch-free operation for hygiene. White finish.",
        tier: "Lux",
        specs: [
          { label: "Operation", value: "Automatic (Sensor)" },
          { label: "Body", value: "ABS" },
          { label: "Features", value: "Touch-Free" },
          { label: "Color", value: "White" },
        ],
      },
    ],
  },

  /* ── 1.20 Magnifying Mirror — 6 models (existing, kept as-is) ────── */
  {
    slug: "magnifying-mirror",
    name: "Magnifying Mirror",
    products: [
      {
        model: "LRMM-305S",
        name: "Magnifying Mirror — 8 Inch, SS Finish",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wall mounting mirror, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain mirror, other side 3× magnifying.",
        tier: "Essential",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Base", value: "SS + Brass Body" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRMM-305R",
        name: "Magnifying Mirror — 8 Inch, Rose Gold",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wall mounting mirror, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain mirror, other side 3× magnifying.",
        tier: "Essential",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Base", value: "SS + Brass Body" },
          { label: "Finish", value: "Rose Gold" },
        ],
      },
      {
        model: "LRMM-305B",
        name: "Magnifying Mirror — 8 Inch, Matte Black",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wall mounting mirror, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain mirror, other side 3× magnifying.",
        tier: "Essential",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Base", value: "SS + Brass Body" },
          { label: "Finish", value: "Matte Black" },
        ],
      },
      {
        model: "LRMM-302S",
        name: "LED Magnifying Mirror — 8 Inch, SS",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED light magnifying mirror, wall mounting, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain, other side 3× magnifying. Main power supply: 220V/50Hz. Button switch on base plate.",
        tier: "Premium",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "LED + Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Power", value: "220V/50Hz" },
          { label: "Switch", value: "Button on Base" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRMM-302R",
        name: "LED Magnifying Mirror — 8 Inch, Rose Gold",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED light magnifying mirror, wall mounting, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain, other side 3× magnifying. Main power supply: 220V/50Hz. Button switch on base plate.",
        tier: "Premium",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "LED + Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Power", value: "220V/50Hz" },
          { label: "Switch", value: "Button on Base" },
          { label: "Finish", value: "Rose Gold" },
        ],
      },
      {
        model: "LRMM-302B",
        name: "LED Magnifying Mirror — 8 Inch, Matte Black",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "LED light magnifying mirror, wall mounting, 8 inch. SS base and brass body with foldable arm. Double side mirror — 1 side plain, other side 3× magnifying. Main power supply: 220V/50Hz. Button switch on base plate.",
        tier: "Premium",
        specs: [
          { label: "Size", value: "8 Inch" },
          { label: "Type", value: "LED + Double Side" },
          { label: "Magnification", value: "3×" },
          { label: "Arm", value: "Foldable" },
          { label: "Power", value: "220V/50Hz" },
          { label: "Switch", value: "Button on Base" },
          { label: "Finish", value: "Matte Black" },
        ],
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 2 — WASHROOM AMENITIES  (11 sub-categories)
     ════════════════════════════════════════════════════════════════════ */

  /* ── 2.1 Lobby Soap Dispenser — 4 models (NEW from SSP page 12) ──── */
  {
    slug: "lobby-soap-dispenser",
    name: "Lobby Soap Dispenser",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRWA-358",
        name: "Manual Lobby Soap Dispenser — SS, 800ml",
        category: "Lobby Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual lobby soap dispenser made in stainless steel. Capacity: 800ml. Suitable for lobby and public washrooms.",
        tier: "Essential",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Capacity", value: "800ml" },
          { label: "Use", value: "Lobby / Public Washroom" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRWA-375",
        name: "Manual Lobby Soap Dispenser — 304 SS, 1200ml, Black",
        category: "Lobby Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Manual lobby soap dispenser made in 304 stainless steel. Capacity: 1200ml. Black finish for premium public washrooms.",
        tier: "Premium",
        specs: [
          { label: "Operation", value: "Manual" },
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Capacity", value: "1200ml" },
          { label: "Use", value: "Lobby / Public Washroom" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRWA-384",
        name: "Automatic Lobby Soap Dispenser — 3 Liquid Types, 1200ml",
        category: "Lobby Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Automatic (sensor) lobby soap dispenser supporting 3 liquid types (soap, shampoo, lotion). Capacity: 1200ml. Touch-free operation for high-traffic washrooms.",
        tier: "Premium",
        specs: [
          { label: "Operation", value: "Automatic (Sensor)" },
          { label: "Liquid Types", value: "3 (Soap / Shampoo / Lotion)" },
          { label: "Capacity", value: "1200ml" },
          { label: "Features", value: "Touch-Free" },
          { label: "Color", value: "White" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWA-372",
        name: "Automatic Lobby Soap Dispenser — ABS, Large Capacity",
        category: "Lobby Soap Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Automatic (sensor) lobby soap dispenser made in ABS with large-capacity reservoir for high-traffic public washrooms. Touch-free operation.",
        tier: "Lux",
        specs: [
          { label: "Operation", value: "Automatic (Sensor)" },
          { label: "Body", value: "ABS" },
          { label: "Capacity", value: "Large" },
          { label: "Features", value: "Touch-Free, High-Traffic" },
        ],
      },
    ],
  },

  /* ── 2.2 Weighing Scale — Coming Soon ────────────────────────────── */
  {
    slug: "weighing-scale",
    name: "Weighing Scale",
    products: [comingSoon("Weighing Scale")],
  },

  /* ── 2.3 Paper Dispenser — 7 models (NEW from SSP page 13) ───────── */
  {
    slug: "paper-dispenser",
    name: "Paper Dispenser",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRWA-390",
        name: "N-Fold Paper Dispenser — ABS, 22×25×11.5cm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "N-fold paper (multi-fold) dispenser made in ABS body. Size: 22 × 25 × 11.5cm. Wall-mounted for washrooms.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "N-Fold (Multi-Fold)" },
          { label: "Body", value: "ABS" },
          { label: "Size", value: "22 × 25 × 11.5cm" },
          { label: "Mount", value: "Wall-Mounted" },
        ],
      },
      {
        model: "LRWA-378",
        name: "JTR Paper Dispenser — Jagged Outlet, 270×126×280mm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "JTR paper dispenser with jagged outlet for clean tearing. Size: 270 × 126 × 280mm. Wall-mounted.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "JTR (Roll)" },
          { label: "Outlet", value: "Jagged" },
          { label: "Size", value: "270 × 126 × 280mm" },
          { label: "Mount", value: "Wall-Mounted" },
        ],
      },
      {
        model: "LRWA-391",
        name: "C/Fold N-Fold Paper Dispenser — ABS, 35×20×11.5cm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "C-fold and N-fold compatible paper dispenser made in ABS body. Size: 35 × 20 × 11.5cm. Larger capacity for high-traffic washrooms.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "C/Fold + N-Fold Compatible" },
          { label: "Body", value: "ABS" },
          { label: "Size", value: "35 × 20 × 11.5cm" },
          { label: "Mount", value: "Wall-Mounted" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRWA-389",
        name: "N-Fold Paper Dispenser — SS Body, 22×25×11.5cm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "N-fold paper dispenser made in stainless-steel body. Size: 22 × 25 × 11.5cm. Durable and easy to clean.",
        tier: "Premium",
        specs: [
          { label: "Type", value: "N-Fold (Multi-Fold)" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Size", value: "22 × 25 × 11.5cm" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRWA-405",
        name: "Recessed Tissue Dispenser — 304 SS Mirror, W252×D74×H128mm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Recessed tissue dispenser made in 304 stainless steel with mirror finish. Size: W252 × D74 × H128mm. Wall-recessed for a clean, flush look.",
        tier: "Premium",
        specs: [
          { label: "Type", value: "Recessed Tissue" },
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Finish", value: "Mirror" },
          { label: "Size", value: "W252 × D74 × H128mm" },
          { label: "Mount", value: "Wall-Recessed" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRWA-404",
        name: "Multi-Purpose Paper Dispenser — 304 SS, 325×102×435mm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Multi-purpose paper dispenser made in 304 stainless steel. Size: 325 × 102 × 435mm. Suitable for multiple paper formats in luxury washrooms.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Multi-Purpose" },
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Size", value: "325 × 102 × 435mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRWA-398P",
        name: "Recessed Multi-Purpose Dispenser — 304 SS Satin, 435×108×1420mm",
        category: "Paper Dispenser",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Recessed multi-purpose paper dispenser made in 304 stainless steel with satin finish. Size: 435 × 108 × 1420mm. Tall, premium unit for luxury washrooms.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Recessed Multi-Purpose" },
          { label: "Body", value: "304 Stainless Steel" },
          { label: "Finish", value: "Satin" },
          { label: "Size", value: "435 × 108 × 1420mm" },
          { label: "Mount", value: "Wall-Recessed" },
        ],
      },
    ],
  },

  /* ── 2.4 Hand Dryer — 8 models (existing, kept as-is) ────────────── */
  {
    slug: "hand-dryer",
    name: "Hand Dryer",
    products: [
      {
        model: "LRWA-397",
        name: "Hand Dryer — ABS Body, 850W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Hand dryer made in ABS outer body. Power: 850W. Air speed: 6.8 m/s. 220-240V/50-60Hz.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Power", value: "850W" },
          { label: "Air Speed", value: "6.8 m/s" },
          { label: "Power Supply", value: "220-240V/50-60Hz" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-376",
        name: "Hand Dryer — ABS, 800W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "ABS plastic body. Over-heating protection. Over-time protection. Power: 800W. Dimension: 240×195×235mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS Plastic" },
          { label: "Power", value: "800W" },
          { label: "Features", value: "Over-Heat + Over-Time Protection" },
          { label: "Size", value: "240 × 195 × 235mm" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-398",
        name: "Automatic Hand Dryer — ABS, 1200W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Automatic hand dryer in ABS body with over-time auto cut-off of 60 seconds. Power: 1200W. AC 220V-240V: 50/60Hz. Wind speed: 94 m/sec.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Power", value: "1200W" },
          { label: "Air Speed", value: "94 m/sec" },
          { label: "Features", value: "Auto Cut-Off 60 sec" },
          { label: "Power Supply", value: "220-240V/50-60Hz" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-399",
        name: "Hand Dryer — Aluminium Alloy, 1650W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Hand dryer, 1650W power. Air speed: 10 m/s. Aluminium alloy body. Size: 290W × 165D × 215H mm.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Aluminium Alloy" },
          { label: "Power", value: "1650W" },
          { label: "Air Speed", value: "10 m/s" },
          { label: "Size", value: "290 × 165 × 215mm" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-396",
        name: "Hand Dryer — ABS, 1800W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Hand dryer made in ABS outer body. Power: 1800W. Air speed: 12 m/s. 220-240V, 50/60Hz.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "ABS" },
          { label: "Power", value: "1800W" },
          { label: "Air Speed", value: "12 m/s" },
          { label: "Power Supply", value: "220-240V/50-60Hz" },
          { label: "Color", value: "White" },
        ],
      },
      {
        model: "LRWA-393",
        name: "Hand Dryer — SS 304 Satin, 2300W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Hand dryer made in satin finish SS 304 outer body. Power: 2300W. Sensor distance: 10-15cm. Wind speed: 30 m/s.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "SS 304 Satin Finish" },
          { label: "Power", value: "2300W" },
          { label: "Air Speed", value: "30 m/s" },
          { label: "Sensor", value: "10-15cm Distance" },
          { label: "Color", value: "Silver" },
        ],
      },
      {
        model: "LRWA-394",
        name: "Hand Dryer — SS Body, Heavy Duty",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless steel body. Energy efficient heavy duty motor. Thermal protection and overtime protection system. Advanced infrared technology. Air speed: 40m/s. Waterproofing grade: IP22. Frequency: 4A.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Power", value: "Heavy Duty Motor" },
          { label: "Air Speed", value: "40 m/s" },
          { label: "Sensor", value: "Advanced Infrared" },
          { label: "Waterproof", value: "IP22" },
          { label: "Finish", value: "SS Finish" },
        ],
      },
      {
        model: "LRWA-395",
        name: "Jet Hand Dryer — Brushless, ABS",
        category: "Hand Dryer",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Jet hand dryer, brushless type. Made in ABS body.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Jet, Brushless" },
          { label: "Body", value: "ABS" },
          { label: "Color", value: "White" },
        ],
      },
    ],
  },

  /* ── 2.5 Shower Mat — 1 model (NEW from SSP page 14, basic info) ── */
  {
    slug: "shower-mat",
    name: "Shower Mat",
    products: [
      {
        model: "LRWA-346",
        name: "Anti-Skid Shower Mat — Coming Soon",
        category: "Shower Mat",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Anti-skid shower mat in white. Final specs being finalised — contact us for custom quotes.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Anti-Skid Shower Mat" },
          { label: "Color", value: "White" },
          { label: "Status", value: "Coming Soon" },
        ],
      },
    ],
  },

  /* ── 2.6 Cloth Line — 1 model (NEW from SSP page 14) ─────────────── */
  {
    slug: "cloth-line",
    name: "Cloth Line",
    products: [
      {
        model: "LRWA-350",
        name: "SS Clothesline — Retractable Nylon Rope",
        category: "Cloth Line",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless-steel clothesline with retractable nylon rope. Wall-mounted for bathroom use. Size: 90 × 90 × 55mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Rope", value: "Retractable Nylon" },
          { label: "Size", value: "90 × 90 × 55mm" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Finish", value: "SS" },
        ],
      },
    ],
  },

  /* ── 2.7 Towel Rack — 1 model (NEW from SSP page 14, basic info) ── */
  {
    slug: "towel-rack",
    name: "Towel Rack",
    products: [
      {
        model: "LRWA-347",
        name: "Towel Rack — SS Finish",
        category: "Towel Rack",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Towel rack in stainless-steel finish. Wall-mounted for bathroom and washroom use.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Finish", value: "SS" },
        ],
      },
    ],
  },

  /* ── 2.8 Toilet Paper Dispenser — Coming Soon ────────────────────── */
  {
    slug: "toilet-paper-dispenser",
    name: "Toilet Paper Dispenser",
    products: [comingSoon("Toilet Paper Dispenser")],
  },

  /* ── 2.9 Towel Rod — 1 model (NEW from SSP page 14, basic info) ──── */
  {
    slug: "towel-rod",
    name: "Towel Rod",
    products: [
      {
        model: "LRWA-348",
        name: "Towel Rod — SS Finish",
        category: "Towel Rod",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Towel rod in stainless-steel finish. Wall-mounted for bathroom and washroom use.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Finish", value: "SS" },
        ],
      },
    ],
  },

  /* ── 2.10 Washroom Tray — Coming Soon ────────────────────────────── */
  {
    slug: "washroom-tray",
    name: "Washroom Tray",
    products: [comingSoon("Washroom Tray")],
  },

  /* ── 2.11 Handicap Grab Bar — 1 model (NEW from SSP page 14) ─────── */
  {
    slug: "handicap-grab-bar",
    name: "Handicap Grab Bar",
    products: [
      {
        model: "LRWA-349",
        name: "Handicap Grab Bar — 202 SS Grade",
        category: "Handicap Grab Bar",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Handicap grab bar made in 202 stainless-steel grade. Wall-mounted for accessible washrooms.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "202 Stainless Steel" },
          { label: "Use", value: "Accessible Washroom" },
          { label: "Mount", value: "Wall-Mounted" },
          { label: "Finish", value: "SS" },
        ],
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 3 — LOBBY ITEMS  (7 sub-categories)
     ════════════════════════════════════════════════════════════════════ */

  /* ── 3.1 Luggage Trolley — 3 models (existing, kept as-is) ───────── */
  {
    slug: "luggage-trolley",
    name: "Luggage Trolley",
    products: [
      {
        model: "LRLT-401",
        name: "Luggage Hand Trolley — 4 Wheel",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless steel body. Heavy duty four wheel luggage trolley. Soft carpet luggage platform. Bag hanger bar on top. Heavy duty wheels. Size: L1070 × D620 × H1880mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Wheels", value: "4 Heavy Duty" },
          { label: "Platform", value: "Soft Carpet" },
          { label: "Features", value: "Bag Hanger Bar" },
          { label: "Size", value: "L1070 × D620 × H1880mm" },
          { label: "Color", value: "White / Black" },
        ],
      },
      {
        model: "LRLT-402",
        name: "Luggage Hand Cart — 2 Wheel",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless steel body. Heavy duty two wheel luggage cart. Soft carpet luggage platform. Suitable for smaller passages and lifts. Size: L570 × D730 × H1280mm.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Wheels", value: "2 Heavy Duty" },
          { label: "Platform", value: "Soft Carpet" },
          { label: "Use", value: "Small Passages & Lifts" },
          { label: "Size", value: "L570 × D730 × H1280mm" },
          { label: "Color", value: "Golden" },
        ],
      },
      {
        model: "LRLT-403",
        name: "Luggage Hand Truck — 4 Wheel",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Heavy duty four wheel luggage trolley. Soft carpet luggage platform. Robust wheels suitable for rough pathways and passages. Size: L1150 × D620 × H950mm.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Heavy Duty" },
          { label: "Wheels", value: "4 Robust" },
          { label: "Platform", value: "Soft Carpet" },
          { label: "Use", value: "Rough Pathways" },
          { label: "Size", value: "L1150 × D620 × H950mm" },
          { label: "Color", value: "Golden" },
        ],
      },
    ],
  },

  /* ── 3.2 Housekeeping Trolley — 9 models (from SSP) ──────────────── */
  {
    slug: "housekeeping-trolley",
    name: "Housekeeping Trolley",
    products: [
      {
        model: "LRHT 433",
        name: "Linen Trolley — ABS Body",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT--433.jpg",
        description:
          "Linen trolley made in ABS body. Size: 710 × 660 × 950mm.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRHT 433" },
          { label: "Body", value: "ABS" },
          { label: "Size", value: "710 × 660 × 950mm" },
        ],
      },
      {
        model: "LRHT 426 (ABS Body)",
        name: "Housekeeping Trolley — ABS Body, 3 Shelves",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-426-ABS-Body.jpg",
        description:
          "Housekeeping trolley made in MS powder coated with ABS body. Waterproof fabric. 3 shelves with one soil bag.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRHT 426 (ABS Body)" },
          { label: "Body", value: "MS Powder Coated + ABS" },
          { label: "Shelves", value: "3 + 1 Soil Bag" },
        ],
      },
      {
        model: "LRHT 427",
        name: "Housekeeping Trolley — MS Powder Coated, 3 Shelves",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-427.jpg",
        description:
          "Housekeeping trolley made in MS powder coated. Waterproof fabric. 3 shelves with one soil bag.",
        tier: "Premium",
        specs: [
          { label: "Model", value: "LRHT 427" },
          { label: "Body", value: "MS Powder Coated" },
          { label: "Shelves", value: "3 + 1 Soil Bag" },
        ],
      },
      {
        model: "LRHT 428 (SS Body)",
        name: "Housekeeping Trolley — SS Body, 3 Shelves",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-428-SS-Body.jpg",
        description:
          "Housekeeping trolley made in SS. Waterproof fabric. 3 shelves with one soil bag.",
        tier: "Lux",
        specs: [
          { label: "Model", value: "LRHT 428 (SS Body)" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Shelves", value: "3 + 1 Soil Bag" },
        ],
      },
      {
        model: "LRHT 429",
        name: "Housekeeping Trolley — ABS Body, 3 Shelves",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-429.jpg",
        description:
          "Housekeeping trolley made in ABS. Waterproof fabric. 3 shelves with one soil bag.",
        tier: "Premium",
        specs: [
          { label: "Model", value: "LRHT 429" },
          { label: "Body", value: "ABS" },
          { label: "Shelves", value: "3 + 1 Soil Bag" },
        ],
      },
      {
        model: "LRHT 430 (Linen Trolley)",
        name: "Linen Trolley — SS with Soil Bag",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-430-Linen-Trolley.jpg",
        description:
          "Linen trolley made in SS with soil linen waterproof bag. Size: L900 × D660 × H810mm.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRHT 430 (Linen Trolley)" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Features", value: "Soil Linen Waterproof Bag" },
          { label: "Size", value: "L900 × D660 × H810mm" },
        ],
      },
      {
        model: "LRHT 431 (With Lid And Door)",
        name: "Housekeeping Trolley — MS, Lid & Door",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-431-With-Lid-And-Door.jpg",
        description:
          "Housekeeping trolley made in MS powder coated with two lockable front doors and lid.",
        tier: "Lux",
        specs: [
          { label: "Model", value: "LRHT 431 (With Lid And Door)" },
          { label: "Body", value: "MS Powder Coated" },
          { label: "Features", value: "Two Lockable Front Doors + Lid" },
        ],
      },
      {
        model: "LRHT 432",
        name: "Linen Trolley — SS with Soil Bag",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-432.jpg",
        description:
          "Linen trolley made in SS with soil linen waterproof bag.",
        tier: "Essential",
        specs: [
          { label: "Model", value: "LRHT 432" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Features", value: "Soil Linen Waterproof Bag" },
        ],
      },
      {
        model: "LRHT 434 (SS Body With Lid And Door)",
        name: "Housekeeping Trolley — SS, Lid & Door",
        category: "Housekeeping Trolley",
        image: "/images/product-catalogue/housekeeping-trolley/LRHT-434-SS-Body-With-Lid-And-Door.jpg",
        description:
          "Housekeeping trolley made in SS with front door and lid. Waterproof fabric.",
        tier: "Lux",
        specs: [
          { label: "Model", value: "LRHT 434 (SS Body With Lid And Door)" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Features", value: "Front Door + Lid" },
        ],
      },
    ],
  },

  /* ── 3.3 Lobby Dustbin — 8 models (NEW from SSP pages 15-16) ─────── */
  {
    slug: "lobby-dustbin",
    name: "Lobby Dustbin",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRLI-453",
        name: "Lobby Dustbin — MS Powder Coated, Round, D250×H600mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in MS powder coated body. Round shape. Size: D250 × H600mm. Black finish.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "MS Powder Coated" },
          { label: "Shape", value: "Round" },
          { label: "Size", value: "D250 × H600mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRLI-449",
        name: "Lobby Dustbin — SS Push Lid, 14×28 inches",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in stainless steel with push lid. Size: 14 × 28 inches.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lid", value: "Push" },
          { label: "Size", value: "14 × 28 inches" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRLI-450",
        name: "Lobby Dustbin — SS Swing Lid, 14×28 inches",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in stainless steel with swing lid. Size: 14 × 28 inches.",
        tier: "Essential",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Lid", value: "Swing" },
          { label: "Size", value: "14 × 28 inches" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRLI-452",
        name: "Lobby Dustbin — MS Powder Coated, Rectangle, L310×W250×H600mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in MS powder coated body. Rectangle shape. Size: L310 × W250 × H600mm. Black finish.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "MS Powder Coated" },
          { label: "Shape", value: "Rectangle" },
          { label: "Size", value: "L310 × W250 × H600mm" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRLI-445",
        name: "Lobby Dustbin — SS, L250×W250×H600mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in stainless steel. Square footprint. Size: L250 × W250 × H600mm.",
        tier: "Premium",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "L250 × W250 × H600mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRLI-447",
        name: "Lobby Dustbin — SS + Synthetic Stone, L300×W300×H680mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in SS with synthetic stone top panel. Square footprint. Size: L300 × W300 × H680mm. Luxury finish for premium lobbies.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Top Panel", value: "Synthetic Stone" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "L300 × W300 × H680mm" },
          { label: "Finish", value: "SS + Stone" },
        ],
      },
      {
        model: "LRLI-448",
        name: "Lobby Dustbin — SS + Natural Stone, L300×W300×H680mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in SS with natural stone top panel. Square footprint. Size: L300 × W300 × H680mm. Genuine stone luxury finish.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Top Panel", value: "Natural Stone" },
          { label: "Shape", value: "Square" },
          { label: "Size", value: "L300 × W300 × H680mm" },
          { label: "Finish", value: "SS + Natural Stone" },
        ],
      },
      {
        model: "LRLI-446",
        name: "Lobby Dustbin — SS + Natural Stone, L280×W280×H620mm",
        category: "Lobby Dustbin",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Lobby dustbin made in SS with natural stone top panel. Compact square footprint. Size: L280 × W280 × H620mm. Genuine stone luxury finish.",
        tier: "Lux",
        specs: [
          { label: "Body", value: "Stainless Steel" },
          { label: "Top Panel", value: "Natural Stone" },
          { label: "Shape", value: "Square (Compact)" },
          { label: "Size", value: "L280 × W280 × H620mm" },
          { label: "Finish", value: "SS + Natural Stone" },
        ],
      },
    ],
  },

  /* ── 3.4 Q Manager — 7 models (NEW from SSP page 16) ─────────────── */
  {
    slug: "q-manager",
    name: "Q Manager",
    products: [
      // ── ESSENTIAL TIER ──
      {
        model: "LRLI-457S",
        name: "Q Manager Stanchion — SS, Retractable Belt 2m",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless-steel stanchion with retractable belt (2m). Size: 320 × 51 × 950mm. Crowd-control post for lobbies and queues.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Stanchion" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Belt", value: "Retractable, 2m" },
          { label: "Size", value: "320 × 51 × 950mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRLI-458B",
        name: "Q Manager Stanchion — Ball Top, Black",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Ball-top stanchion in black finish. Size: 320 × 51 × 950mm. Crowd-control post with classic ball-top design.",
        tier: "Essential",
        specs: [
          { label: "Type", value: "Stanchion, Ball Top" },
          { label: "Size", value: "320 × 51 × 950mm" },
          { label: "Color", value: "Black" },
        ],
      },
      // ── PREMIUM TIER ──
      {
        model: "LRLI-457G",
        name: "Q Manager Stanchion — SS Gold",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Stainless-steel stanchion in gold finish. Size: 320 × 51 × 950mm. Premium crowd-control post for upscale lobbies.",
        tier: "Premium",
        specs: [
          { label: "Type", value: "Stanchion" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Size", value: "320 × 51 × 950mm" },
          { label: "Finish", value: "Gold" },
        ],
      },
      {
        model: "LRLI-458S",
        name: "Q Manager Stanchion — Ball Top, SS",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Ball-top stanchion in stainless-steel finish. Size: 320 × 51 × 950mm. Premium ball-top crowd-control post.",
        tier: "Premium",
        specs: [
          { label: "Type", value: "Stanchion, Ball Top" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Size", value: "320 × 51 × 950mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      // ── LUX TIER ──
      {
        model: "LRLI-458G",
        name: "Q Manager Stanchion — Ball Top, Gold",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Ball-top stanchion in gold finish. Size: 320 × 51 × 950mm. Luxury ball-top crowd-control post.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Stanchion, Ball Top" },
          { label: "Size", value: "320 × 51 × 950mm" },
          { label: "Finish", value: "Gold" },
        ],
      },
      {
        model: "LRLI-458-Velvet",
        name: "Q Manager Rope — Velvet, 1.5m, Red",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Velvet rope for Q Manager stanchions. Length: 1.5m. Red colour. Luxury crowd-control rope for premium venues.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Velvet Rope" },
          { label: "Length", value: "1.5m" },
          { label: "Color", value: "Red" },
        ],
      },
      {
        model: "LRLI-458-Twisted",
        name: "Q Manager Rope — Twisted, 1.5m, Red",
        category: "Q Manager",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Twisted rope for Q Manager stanchions. Length: 1.5m. Red colour. Classic twisted-rope look for luxury venues.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Twisted Rope" },
          { label: "Length", value: "1.5m" },
          { label: "Color", value: "Red" },
        ],
      },
    ],
  },

  /* ── 3.5 Sign Board — 6 models (NEW from SSP pages 16-17) ────────── */
  {
    slug: "sign-board",
    name: "Sign Board",
    products: [
      {
        model: "LRLI-459-A4",
        name: "A4 Signage — Gold / SS / Black",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "A4-size signage panel. Available in Gold, SS and Black finishes. Wall-mounted for directional and informational use.",
        tier: "Essential",
        specs: [
          { label: "Size", value: "A4" },
          { label: "Finishes", value: "Gold / SS / Black" },
          { label: "Mount", value: "Wall-Mounted" },
        ],
      },
      {
        model: "LRLI-459-A3",
        name: "A3 Signage — Gold / SS / Black",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "A3-size signage panel. Available in Gold, SS and Black finishes. Larger format for high-visibility directional and informational use.",
        tier: "Essential",
        specs: [
          { label: "Size", value: "A3" },
          { label: "Finishes", value: "Gold / SS / Black" },
          { label: "Mount", value: "Wall-Mounted" },
        ],
      },
      {
        model: "LRLI-460",
        name: "A4 Signage with Pole — SS",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "A4-size signage panel mounted on a pole in stainless-steel finish. Freestanding for lobby and entrance use.",
        tier: "Premium",
        specs: [
          { label: "Size", value: "A4" },
          { label: "Mount", value: "Freestanding Pole" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRLI-463",
        name: "Wet Floor Sign — SS",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Wet floor caution sign in stainless-steel finish. Durable and visible. For washroom entrances and spill zones.",
        tier: "Premium",
        specs: [
          { label: "Type", value: "Wet Floor Caution Sign" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRLI-469",
        name: "Foldable SS Floor Signage — 400×400×580mm",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Foldable floor signage in stainless steel. Size: 400 × 400 × 580mm. Easy to store and deploy for caution / directional messaging.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Foldable Floor Signage" },
          { label: "Body", value: "Stainless Steel" },
          { label: "Size", value: "400 × 400 × 580mm" },
          { label: "Finish", value: "SS" },
        ],
      },
      {
        model: "LRLI-472",
        name: "Foldable Wooden Floor Signage — 590×380×570mm",
        category: "Sign Board",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Foldable floor signage in wooden finish. Size: 590 × 380 × 570mm. Warm wooden look for boutique properties.",
        tier: "Lux",
        specs: [
          { label: "Type", value: "Foldable Floor Signage" },
          { label: "Body", value: "Wooden" },
          { label: "Size", value: "590 × 380 × 570mm" },
          { label: "Finish", value: "Wooden" },
        ],
      },
    ],
  },

  /* ── 3.6 Stand Pole — Coming Soon (same family as Q Manager) ─────── */
  {
    slug: "stand-pole",
    name: "Stand Pole",
    products: [comingSoon("Stand Pole")],
  },

  /* ── 3.7 Digital Signage — 3 totem models (NEW from SSP page 18) ─── */
  {
    slug: "digital-signage",
    name: "Digital Signage",
    products: [
      {
        model: "LRDS-43",
        name: 'Digital Signage Totem — 43" FHD, Android v9.0',
        category: "Digital Signage",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          '43" Full HD digital signage totem. Resolution: 1920 × 1080. Brightness: 350 cd/m². Android v9.0 built-in. Size: 61" × 24". Black finish. Ideal for lobby directories and promotions.',
        tier: "Essential",
        specs: [
          { label: "Screen", value: '43" FHD' },
          { label: "Resolution", value: "1920 × 1080" },
          { label: "Brightness", value: "350 cd/m²" },
          { label: "OS", value: "Android v9.0" },
          { label: "Size", value: '61" × 24"' },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDS-50",
        name: 'Digital Signage Totem — 50" UHD, Android v9.0',
        category: "Digital Signage",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          '50" Ultra HD digital signage totem. Resolution: 3840 × 2160. Brightness: 300 cd/m². Android v9.0 built-in. Size: 72" × 28". Black finish. Premium 4K display for high-impact lobby content.',
        tier: "Premium",
        specs: [
          { label: "Screen", value: '50" UHD' },
          { label: "Resolution", value: "3840 × 2160" },
          { label: "Brightness", value: "300 cd/m²" },
          { label: "OS", value: "Android v9.0" },
          { label: "Size", value: '72" × 28"' },
          { label: "Color", value: "Black" },
        ],
      },
      {
        model: "LRDS-55",
        name: 'Digital Signage Totem — 55" UHD, Android v9.0',
        category: "Digital Signage",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          '55" Ultra HD digital signage totem. Resolution: 3840 × 2160. Brightness: 350 cd/m². Android v9.0 built-in. Size: 72" × 30". Black finish. Largest 4K display for flagship lobby installations.',
        tier: "Lux",
        specs: [
          { label: "Screen", value: '55" UHD' },
          { label: "Resolution", value: "3840 × 2160" },
          { label: "Brightness", value: "350 cd/m²" },
          { label: "OS", value: "Android v9.0" },
          { label: "Size", value: '72" × 30"' },
          { label: "Color", value: "Black" },
        ],
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 4 — FURNITURE  (7 sub-categories, all Coming Soon)
     ════════════════════════════════════════════════════════════════════ */
  {
    slug: "outdoor-furniture",
    name: "Outdoor Furniture",
    products: [comingSoon("Outdoor Furniture")],
  },
  {
    slug: "guest-room-furniture",
    name: "Guest Room Loose Furniture",
    products: [comingSoon("Guest Room Loose Furniture")],
  },
  {
    slug: "restaurant-furniture",
    name: "Restaurant Furniture",
    products: [comingSoon("Restaurant Furniture")],
  },
  {
    slug: "pool-lounger",
    name: "Pool Lounger",
    products: [comingSoon("Pool Lounger")],
  },
  {
    slug: "garden-umbrella",
    name: "Garden Umbrella",
    products: [comingSoon("Garden Umbrella")],
  },
  {
    slug: "frp-flower-pots",
    name: "FRP Flower Pots",
    products: [comingSoon("FRP Flower Pots")],
  },
  {
    slug: "room-furniture",
    name: "Room Furniture",
    products: [comingSoon("Room Furniture")],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 5 — LINEN  (2 sub-categories, all Coming Soon)
     ════════════════════════════════════════════════════════════════════ */
  {
    slug: "room-linen",
    name: "Room Linen",
    products: [
      {
        model: "TBD",
        name: "Coming Soon",
        category: "Room Linen",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Room linen category being finalised — Bed sheet, Pillow, Pillow cover, Mattress protector, Duvet and Duvet cover. Contact us for custom quotes.",
        tier: "Essential",
        specs: [
          { label: "Status", value: "Coming Soon" },
          {
            label: "Items",
            value:
              "Bed sheet, Pillow, Pillow cover, Mattress protector, Duvet, Duvet cover",
          },
        ],
      },
    ],
  },
  {
    slug: "bath-linen",
    name: "Bath Linen",
    products: [
      {
        model: "TBD",
        name: "Coming Soon",
        category: "Bath Linen",
        image: "/images/product-catalogue/coming-soon.jpg",
        description:
          "Bath linen category being finalised — Bath towel, Hand towel, Bath robe and Face towel. Contact us for custom quotes.",
        tier: "Essential",
        specs: [
          { label: "Status", value: "Coming Soon" },
          {
            label: "Items",
            value: "Bath towel, Hand towel, Bath robe, Face towel",
          },
        ],
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 6 — BATH TUB  (1 sub-category, 17 real products)
     ════════════════════════════════════════════════════════════════════ */
  {
    slug: "bath-tub-models",
    name: "Bath Tub Models",
    products: [
      {
        model: "LRBT-6601",
        name: "Freestanding Bath Tub — LRBT-6601",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Premium freestanding bath tub with elegant oval design. Available in multiple sizes. Solid surface construction with smooth matte finish.",
        specs: [
          { label: "Model", value: "LRBT-6601" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580, 1800×750×580mm" },
          { label: "Material", value: "Solid Surface" },
          { label: "Finish", value: "Matte" },
        ],
      },
      {
        model: "LRBT-6601B",
        name: "Freestanding Bath Tub — LRBT-6601B",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Premium freestanding bath tub, variant B. Elegant design with smooth finish. Multiple sizes available.",
        specs: [
          { label: "Model", value: "LRBT-6601B" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580, 1800×750×580mm" },
          { label: "Material", value: "Solid Surface" },
          { label: "Finish", value: "Matte" },
        ],
      },
      {
        model: "LRBT-6602",
        name: "Freestanding Bath Tub — LRBT-6602",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Modern freestanding bath tub with contemporary design. Available in multiple sizes for different bathroom layouts.",
        specs: [
          { label: "Model", value: "LRBT-6602" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
          { label: "Finish", value: "Matte" },
        ],
      },
      {
        model: "LRBT-6602B",
        name: "Freestanding Bath Tub — LRBT-6602B",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub, variant B. Contemporary design with premium finish.",
        specs: [
          { label: "Model", value: "LRBT-6602B" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6603",
        name: "Freestanding Bath Tub — LRBT-6603",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Elegant freestanding bath tub with sleek profile. Solid surface construction.",
        specs: [
          { label: "Model", value: "LRBT-6603" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6605",
        name: "Freestanding Bath Tub — LRBT-6605",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Premium white freestanding bath tub. Multiple size options available.",
        specs: [
          { label: "Model", value: "LRBT-6605" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580, 1700×800×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6606",
        name: "Freestanding Bath Tub — LRBT-6606",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "White freestanding bath tub with clean modern lines.",
        specs: [
          { label: "Model", value: "LRBT-6606" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6608",
        name: "Freestanding Bath Tub — LRBT-6608",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub with taller profile (720mm height). Premium design.",
        specs: [
          { label: "Model", value: "LRBT-6608" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×770×720, 1600×770×720, 1700×770×720mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6609",
        name: "Freestanding Bath Tub — LRBT-6609",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub with wider profile. Multiple size options.",
        specs: [
          { label: "Model", value: "LRBT-6609" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×800×580, 1700×800×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6610",
        name: "Freestanding Bath Tub — LRBT-6610",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Elegant freestanding bath tub. Available in 4 sizes.",
        specs: [
          { label: "Model", value: "LRBT-6610" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580, 1800×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6611",
        name: "Freestanding Bath Tub — LRBT-6611",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub with wider design. Premium solid surface construction.",
        specs: [
          { label: "Model", value: "LRBT-6611" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×800×580, 1600×800×580, 1700×800×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6612",
        name: "Freestanding Bath Tub — LRBT-6612",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Modern freestanding bath tub with sleek design.",
        specs: [
          { label: "Model", value: "LRBT-6612" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6613",
        name: "Freestanding Bath Tub — LRBT-6613",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub with wider profile options. Premium finish.",
        specs: [
          { label: "Model", value: "LRBT-6613" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×800×580, 1700×800×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6613B",
        name: "Freestanding Bath Tub — LRBT-6613B",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub, variant B. Wider profile with premium finish.",
        specs: [
          { label: "Model", value: "LRBT-6613B" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×800×580, 1700×800×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6615",
        name: "Freestanding Bath Tub — LRBT-6615",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Glossy white freestanding bath tub. Premium acrylic/solid surface construction.",
        specs: [
          { label: "Model", value: "LRBT-6615" },
          { label: "Type", value: "Freestanding" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×800×580mm" },
          { label: "Material", value: "Acrylic / Solid Surface" },
          { label: "Finish", value: "Glossy White" },
        ],
      },
      {
        model: "LRBT-6619L",
        name: "Freestanding Bath Tub — LRBT-6619L (Left)",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub, left configuration. Available in multiple sizes.",
        specs: [
          { label: "Model", value: "LRBT-6619L" },
          { label: "Type", value: "Freestanding (Left)" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
      {
        model: "LRBT-6619R",
        name: "Freestanding Bath Tub — LRBT-6619R (Right)",
        category: "Bath Tub",
        image: "/images/product-catalogue/coming-soon.jpg",
        description: "Freestanding bath tub, right configuration. Available in multiple sizes.",
        specs: [
          { label: "Model", value: "LRBT-6619R" },
          { label: "Type", value: "Freestanding (Right)" },
          { label: "Sizes", value: "1500×750×580, 1600×750×580, 1700×750×580mm" },
          { label: "Material", value: "Solid Surface" },
        ],
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 7 — AMENITIES TRAY SET  (1 sub-category, Coming Soon)
     ════════════════════════════════════════════════════════════════════ */
  {
    slug: "amenities-tray-set-models",
    name: "Amenities Tray Sets",
    products: [comingSoon("Amenities Tray Set")],
  },

  /* ════════════════════════════════════════════════════════════════════
     PARENT 8 — DOME & SPACE POD  (1 sub-category, Coming Soon)
     ════════════════════════════════════════════════════════════════════ */
  {
    slug: "dome-models",
    name: "Dome & Space POD Models",
    products: [comingSoon("Dome & Space POD")],
  },

  /* BANQUET FURNITURE (kept for backward compat, not in any parent) */
  {
    slug: "banquet-furniture",
    name: "Banquet Furniture",
    products: [comingSoon("Banquet Furniture")],
  },
];
