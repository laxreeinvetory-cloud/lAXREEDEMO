/**
 * LaxRee Amenities — site content.
 * All copy, products, categories, testimonials, blog posts, etc.
 * live here so the page composition stays clean.
 */

export const SITE = {
  name: "LaxRee Amenities",
  tagline: "Hotel Supplies Redefined",
  phoneDisplay: "+91-92516 83662",
  phoneHref: "+919251683662",
  tollFreeDisplay: "1800 120 7001",
  tollFreeHref: "18001207001",
  whatsapp: "919251683662",
  email: "contactus@laxree.com",
  careersEmail: "hr@laxree.com",
  address:
    "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
  socials: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Products", href: "/products" },
  { label: "Clients", href: "/clients" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Dealers", href: "/dealers" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact-us" },
];

export const HERO_STATS = [
  { value: 1347, suffix: "+", label: "Projects" },
  { value: 11, suffix: "+", label: "Years" },
  { value: 700, suffix: "+", label: "SKUs" },
  { value: 7, suffix: "+", label: "Certifications" },
];

export const CERTIFICATIONS_MARQUEE = [
  "ISO 9001 Certified",
  "ISO 14001 Certified",
  "ISO 45001 Certified",
  "CE Certified",
  "RoHS Compliant",
  "Pan-India Delivery",
  "700+ Product SKUs",
];

export type Category = {
  slug: string;
  name: string;
  count: number;
  blurb: string;
  image: string;
  span?: "large" | "wide" | "tall" | "default";
};

export const CATEGORIES: Category[] = [
  {
    slug: "amenities",
    name: "Amenities",
    count: 226,
    blurb: "Room, washroom & lobby essentials — minibars to magnifying mirrors.",
    image: "/images/categories/amenities.jpg",
    span: "large",
  },
  {
    slug: "furniture",
    name: "Furniture",
    count: 246,
    blurb: "Lobby, room & outdoor furniture engineered for high-traffic hospitality.",
    image: "/images/categories/furniture.jpg",
    span: "default",
  },
  {
    slug: "linen",
    name: "Linen",
    count: 20,
    blurb: "Bed, bath & F&B linen in long-staple cotton, custom-branded.",
    image: "/images/categories/linen.jpg",
    span: "default",
  },
  {
    slug: "roofing",
    name: "Roofing",
    count: 12,
    blurb: "Architectural metal roofing & cladding systems for resorts.",
    image: "/images/categories/roofing.jpg",
    span: "default",
  },
  {
    slug: "dome",
    name: "Dome",
    count: 2,
    blurb: "Geodesic dome structures for glamping & experiential stays.",
    image: "/images/categories/dome.jpg",
    span: "default",
  },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
};

export const SPOTLIGHT_PRODUCTS: Product[] = [
  { slug: "mini-bar", name: "Mini Bar", category: "Amenities", image: "/images/products/mini-bar.jpg" },
  { slug: "kettle-set", name: "Kettle Set", category: "Amenities", image: "/images/products/kettle-set.jpg" },
  { slug: "safe-box", name: "Safe Box", category: "Amenities", image: "/images/products/safe-box.jpg" },
  { slug: "door-lock", name: "Door Lock", category: "Amenities", image: "/images/products/door-lock.jpg" },
  { slug: "luggage-trolley", name: "Luggage Trolley", category: "Lobby", image: "/images/products/luggage-trolley.jpg" },
  { slug: "bath-tub", name: "Bath Tub", category: "Washroom", image: "/images/products/bath-tub.jpg" },
  { slug: "hair-dryer", name: "Hair Dryer", category: "Washroom", image: "/images/products/hair-dryer.jpg" },
  { slug: "magnifying-mirror", name: "Magnifying Mirror", category: "Washroom", image: "/images/products/magnifying-mirror.jpg" },
  { slug: "hand-dryer", name: "Hand Dryer", category: "Washroom", image: "/images/products/hand-dryer.jpg" },
];

export type RoomSolution = {
  slug: string;
  name: string;
  icon: string; // lucide icon name
  oneLine: string;
  items: string[];
};

export const ROOM_SOLUTIONS: RoomSolution[] = [
  {
    slug: "room-amenities",
    name: "Room Amenities",
    icon: "BedDouble",
    oneLine: "Everything inside the guest room, from minibar to mattress.",
    items: [
      "Mini Bar",
      "Kettle Set",
      "Tray Set",
      "Safe Box",
      "Wooden Hanger",
      "Door Lock",
      "Docking Pod & Room Telephone",
      "Iron & Iron Board",
      "Dustbin",
      "Rollaway Bed & Baby Cot",
      "Mattress & Bed Base",
      "Desktop Accessories",
      "Emergency Torch",
    ],
  },
  {
    slug: "washroom-amenities",
    name: "Washroom Amenities",
    icon: "ShowerHead",
    oneLine: "Grooming, comfort and hygiene for the bathroom.",
    items: [
      "Hair Dryer",
      "Magnifying Mirror",
      "Electronic Weighing Scale",
      "Soap Dispenser",
      "Bath Tub",
      "Amenity Tray Set",
      "Hand Dryer",
      "Paper Dispenser",
    ],
  },
  {
    slug: "lobby-amenities",
    name: "Lobby Amenities",
    icon: "ConciergeBell",
    oneLine: "First-imression hardware for arrival and circulation.",
    items: [
      "Luggage Trolley",
      "Housekeeping & Linen Trolley",
      "Lobby Dustbin",
      "Queue Manager",
      "Digital Signage",
    ],
  },
  {
    slug: "furniture",
    name: "Furniture",
    icon: "Armchair",
    oneLine: "Custom-grade casegoods and seating for every room type.",
    items: [
      "Bed & Headboard",
      "Night Stand",
      "Work Desk & Chair",
      "Lounge Chair",
      "Wardrobe",
      "TV Console",
      "Lobby Seating",
      "Outdoor Furniture",
    ],
  },
  {
    slug: "linen",
    name: "Linen",
    icon: "Layers",
    oneLine: "Long-staple cotton bed, bath and F&B textiles.",
    items: [
      "Bed Sheets",
      "Pillow & Pillow Cases",
      "Duvet & Duvet Covers",
      "Bath Towels",
      "Bath Robes",
      "Table Linen",
      "Napkins",
      "Kitchen Linen",
    ],
  },
  {
    slug: "roofing",
    name: "Roofing",
    icon: "Warehouse",
    oneLine: "Standing seam & insulated metal roof systems.",
    items: [
      "Standing Seam Panels",
      "Insulated Roof Panels",
      "Polycarbonate Sheets",
      "Flashings & Trims",
      "Gutter Systems",
    ],
  },
  {
    slug: "dome",
    name: "Dome",
    icon: "Globe",
    oneLine: "Geodesic structures for glamping & experiential stays.",
    items: [
      "Glass Geodesic Dome",
      "PC Geodesic Dome",
      "Dome Accessories",
    ],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  hotel: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "LaxRee's minibars have been on our floors for four years without a single compressor failure. The brass trim detail still gets guest photos.",
    name: "Rajiv Menon",
    role: "Director of Housekeeping",
    hotel: "The Imperial Crest, Jaipur",
  },
  {
    quote:
      "We renovated 142 rooms in 11 weeks. LaxRee delivered every amenity, locker and trolley on schedule, with documentation that satisfied our audit.",
    name: "Anjali Sharma",
    role: "Procurement Head",
    hotel: "Westmark Resorts, Udaipur",
  },
  {
    quote:
      "What sets them apart is the factory. We visited Ajmer, walked the lines, and saw the brass-finishing ourselves. That is rare in this industry.",
    name: "Vikas Rathore",
    role: "VP Operations",
    hotel: "Heritage Hotels Group",
  },
];

export const CLIENT_LOGOS = [
  "The Imperial Crest",
  "Westmark Resorts",
  "Heritage Hotels",
  "Royal Palms",
  "Marina Bay Suites",
  "Citadel Hospitality",
  "Aravali Retreat",
  "Bluewater Resorts",
  "Grand Meridian",
  "Lakeside Manor",
];

export type Exhibition = {
  image: string;
  caption: string;
  year: string;
};

export const EXHIBITIONS: Exhibition[] = [
  { image: "/images/gallery/exhibition-1.jpg", caption: "LaxRee Hotel Supplies Booth, Aahar", year: "2025" },
  { image: "/images/gallery/exhibition-2.jpg", caption: "Aahar Trade Fair, Pragati Maidan", year: "2024" },
  { image: "/images/gallery/exhibition-3.jpg", caption: "India International Hospitality Expo (IHE)", year: "2024" },
];

export type Certification = {
  code: string;
  fullName: string;
};

export const CERTIFICATIONS: Certification[] = [
  { code: "ISO 9001", fullName: "Quality Management System" },
  { code: "ISO 14001", fullName: "Environmental Management" },
  { code: "ISO 45001", fullName: "Occupational Health & Safety" },
  { code: "CE", fullName: "European Conformity Mark" },
  { code: "RoHS", fullName: "Restriction of Hazardous Substances" },
];

export type USP = {
  icon: string;
  title: string;
  blurb: string;
  size: "default" | "wide" | "tall";
};

export const USPS: USP[] = [
  {
    icon: "Leaf",
    title: "Sustainable Products",
    blurb: "Materials and processes chosen for lower lifecycle impact.",
    size: "default",
  },
  {
    icon: "BadgeIndianRupee",
    title: "Affordable",
    blurb: "Competitive pricing without compromising on quality.",
    size: "default",
  },
  {
    icon: "Headset",
    title: "Great After-Sales Service",
    blurb: "Dedicated engineers on-call across 28 states.",
    size: "wide",
  },
  {
    icon: "LayoutGrid",
    title: "Widest Product Range",
    blurb: "700+ SKUs across five categories — one PO, one invoice.",
    size: "default",
  },
  {
    icon: "ShieldCheck",
    title: "Durability",
    blurb: "Factory-tested for 24/7 hospitality duty cycles.",
    size: "default",
  },
  {
    icon: "Sparkles",
    title: "Trend Setters",
    blurb: "First in India to launch brass-rim minibars & smart safes.",
    size: "default",
  },
  {
    icon: "Gem",
    title: "Highly Affordable & Highly Durable",
    blurb: "OEM margins + factory QC = best price-to-life ratio.",
    size: "wide",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sustainable-hospitality-2026",
    title: "Sustainable Hospitality: The 2026 Procurement Playbook",
    category: "Sustainability",
    excerpt:
      "Refillable dispensers, low-VOC finishes and lifecycle costing are no longer optional. Here is what to specify in your next tender.",
    image: "/images/blog/blog-1.jpg",
    date: "Jan 2026",
    readTime: "6 min",
  },
  {
    slug: "brass-details-guest-perception",
    title: "Why Brass Detailing Outperforms Chrome in Guest Perception",
    category: "Design",
    excerpt:
      "Eye-tracking studies show warm-metal accents increase perceived room value by 18%. A case for rethinking your hardware palette.",
    image: "/images/blog/blog-2.jpg",
    date: "Dec 2025",
    readTime: "4 min",
  },
  {
    slug: "amenity-trends-2026",
    title: "Five Amenity Trends Defining 2026 Hotel Renovations",
    category: "Trends",
    excerpt:
      "From in-room smart safes to weighted curtain hooks, the details that quietly move your TripAdvisor score.",
    image: "/images/blog/blog-3.jpg",
    date: "Dec 2025",
    readTime: "5 min",
  },
  {
    slug: "hotel-minibar-buyers-guide-india",
    title: "Hotel Minibar Buyer's Guide: Choosing the Right Model for Your Property",
    category: "Procurement Guide",
    excerpt:
      "Absorption vs compressor, 40L vs 60L, glass door vs solid — everything a hotel procurement manager needs to know before ordering minibars in bulk.",
    image: "/images/blog/blog-4.jpg",
    date: "Jul 2026",
    readTime: "8 min",
  },
  {
    slug: "hotel-safe-locker-buying-guide",
    title: "Hotel Safe Locker Buying Guide: Sizes, Locks & Bulk Pricing in India",
    category: "Procurement Guide",
    excerpt:
      "Digital keypad vs RFID, small vs large, steel thickness ratings — a complete specification checklist for procuring hotel safes at the best price.",
    image: "/images/blog/blog-5.jpg",
    date: "Jul 2026",
    readTime: "7 min",
  },
  {
    slug: "rfid-hotel-door-lock-guide",
    title: "RFID Hotel Door Locks: Complete Guide to Access Control Systems in India",
    category: "Procurement Guide",
    excerpt:
      "Mifare vs NFC, audit trails, PMS integration, battery life — the definitive guide to choosing RFID door locks for hotels and resorts.",
    image: "/images/blog/blog-6.jpg",
    date: "Jul 2026",
    readTime: "9 min",
  },
  {
    slug: "hotel-supplies-procurement-guide-india",
    title: "Hotel Supplies Procurement Guide for India: From Spec to Handover",
    category: "Procurement Guide",
    excerpt:
      "A step-by-step procurement framework for Indian hotels — supplier evaluation, specification writing, quality control, and delivery management.",
    image: "/images/blog/blog-7.jpg",
    date: "Jul 2026",
    readTime: "10 min",
  },
  {
    slug: "top-hotel-amenities-suppliers-india",
    title: "Top Hotel Amenities Suppliers in India: How to Choose the Right Partner",
    category: "Industry Insights",
    excerpt:
      "Not all hotel supplies vendors are equal. Here's how to evaluate manufacturers vs traders, OEM capabilities, and after-sales support across India.",
    image: "/images/blog/blog-8.jpg",
    date: "Jul 2026",
    readTime: "8 min",
  },
  {
    slug: "electric-kettle-hotel-rooms-guide",
    title: "Electric Kettle for Hotel Rooms: Complete Buying Guide with Specs & Pricing",
    category: "Procurement Guide",
    excerpt:
      "SS304 vs SS202, 1.0L vs 1.2L, auto shut-off mechanisms — the definitive guide to choosing electric kettles for hotel rooms in bulk.",
    image: "/images/blog/blog-9.jpg",
    date: "Jul 2026",
    readTime: "7 min",
  },
  {
    slug: "automatic-soap-dispenser-guide",
    title: "Automatic Soap Dispensers for Hotels: Sensor vs Manual, Specs & Bulk Pricing",
    category: "Procurement Guide",
    excerpt:
      "Infrared sensor range, refill capacity, battery life, drip tray design — everything you need to specify when buying soap dispensers for hotels.",
    image: "/images/blog/blog-10.jpg",
    date: "Jul 2026",
    readTime: "6 min",
  },
  {
    slug: "hotel-trolley-complete-guide",
    title: "Complete Guide to Hotel Trolleys: Types, Uses, Specs & Bulk Pricing in India",
    category: "Procurement Guide",
    excerpt:
      "Luggage trolleys, housekeeping trolleys, linen trolleys — load capacity, wheel quality, frame materials, and fair pricing benchmarks for India.",
    image: "/images/blog/blog-11.jpg",
    date: "Jul 2026",
    readTime: "8 min",
  },
  {
    slug: "steam-iron-hotel-rooms-guide",
    title: "Steam Iron for Hotel Rooms: Buying Guide with Specs, Safety & Pricing",
    category: "Procurement Guide",
    excerpt:
      "Wattage, steam output, soleplate material, auto shut-off — the complete specification guide for procuring steam irons for hotel rooms in India.",
    image: "/images/blog/blog-12.jpg",
    date: "Jul 2026",
    readTime: "7 min",
  },
];

export const WHATSAPP_EXECUTIVES = [
  { name: "Sales — North India", phone: "919251683662" },
  { name: "Sales — South India", phone: "919251683662" },
  { name: "Catalogue & Pricing", phone: "919251683662" },
  { name: "After-Sales Support", phone: "919251683662" },
];

export const ENQUIRY_CATEGORIES = [
  "Amenities",
  "Furniture",
  "Roofing",
  "Linen",
  "Dome",
];

/* ─────────────────────────────────────────────────────────────
   Inner-page content
   ───────────────────────────────────────────────────────────── */

/* About Us — timeline milestones */
export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export const TIMELINE: Milestone[] = [
  {
    year: "2015",
    title: "The First Factory",
    description:
      "LaxRee opens its first manufacturing line in Ajmer for absorption minibars — 200 units/month capacity.",
  },
  {
    year: "2017",
    title: "Safe Locker Division",
    description:
      "Electronic safe locker production line launched. First client: a 150-room heritage hotel in Udaipur.",
  },
  {
    year: "2019",
    title: "Exhibition Centre",
    description:
      "Ajmer's largest hospitality exhibition centre inaugurated — 12,000 sq ft of product displays and procurement consultation.",
  },
  {
    year: "2021",
    title: "Pan-India Network",
    description:
      "Dealer network expands to 22 states. ISO 9001 and ISO 14001 certifications achieved.",
  },
  {
    year: "2023",
    title: "700+ SKU Milestone",
    description:
      "Product catalogue crosses 700 SKUs across five categories. CE and RoHS compliance achieved for electronics.",
  },
  {
    year: "2026",
    title: "Smart Hospitality",
    description:
      "Launch of brass-rim smart minibar line and IoT-enabled safes. 1,347+ projects delivered.",
  },
];

/* About Us — leadership team */
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export const LEADERSHIP: TeamMember[] = [
  {
    name: "Ashish Agarwal",
    role: "Founder & Managing Director",
    bio: "25 years in hospitality manufacturing. Started LaxRee with a single minibar line and a commitment to in-house quality control.",
    initials: "RS",
  },
  {
    name: "Priya Sharma",
    role: "Director, Operations",
    bio: "Leads the Ajmer factory and exhibition centre. Architects the 700+ SKU catalogue and custom-order workflow.",
    initials: "PS",
  },
  {
    name: "Amit Verma",
    role: "Head of Sales (Pan-India)",
    bio: "Manages the 22-state dealer network and direct procurement contracts with national hotel chains.",
    initials: "AV",
  },
  {
    name: "Sunita Jain",
    role: "Head of Quality & Compliance",
    bio: "Oversees ISO 9001/14001/45001, CE and RoHS testing. 15 years in industrial QC.",
    initials: "SJ",
  },
];

/* About Us — values */
export type Value = {
  icon: string;
  title: string;
  description: string;
};

export const COMPANY_VALUES: Value[] = [
  {
    icon: "ShieldCheck",
    title: "Quality Without Compromise",
    description:
      "Every product passes 14 quality checkpoints before it leaves the factory. ISO 9001-certified processes.",
  },
  {
    icon: "Factory",
    title: "OEM Manufacturing",
    description:
      "We own our factory lines — minibars, safes, furniture. No outsourcing means consistent quality and competitive pricing.",
  },
  {
    icon: "Leaf",
    title: "Sustainable by Design",
    description:
      "Low-VOC finishes, recyclable packaging, energy-efficient minibar compressors. ISO 14001 environmental management.",
  },
  {
    icon: "Clock",
    title: "On-Time Delivery",
    description:
      "11 years of delivering 97.4% of orders on or before the committed date. Project tracking from PO to handover.",
  },
  {
    icon: "Headset",
    title: "After-Sales First",
    description:
      "Dedicated service engineers in 14 cities. Average response time: 4 hours in metros, 24 hours in Tier-2/3.",
  },
  {
    icon: "Handshake",
    title: "Partnership, Not Transaction",
    description:
      "We work with procurement teams from spec to handover. Many clients have been with us 5+ years.",
  },
];

/* Products page — all products with details */
export type ProductDetail = {
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const ALL_PRODUCTS: ProductDetail[] = [
  {
    slug: "mini-bar",
    name: "Mini Bar",
    category: "Amenities",
    image: "/images/products/mini-bar.jpg",
    description:
      "Absorption and compressor minibars with brass-trimmed glass doors. Silent operation, energy-efficient, available in 40L/60L/80L.",
    specs: [
      { label: "Capacity", value: "40L / 60L / 80L" },
      { label: "Cooling", value: "Absorption / Compressor" },
      { label: "Noise", value: "< 26 dB" },
      { label: "Power", value: "70W" },
    ],
  },
  {
    slug: "kettle-set",
    name: "Kettle Set",
    category: "Amenities",
    image: "/images/products/kettle-set.jpg",
    description:
      "Stainless steel electric kettle sets with matching cups and tray. Food-grade SS304, 1.2L capacity, auto shut-off.",
    specs: [
      { label: "Capacity", value: "1.2L" },
      { label: "Material", value: "SS304" },
      { label: "Power", value: "1500W" },
      { label: "Set includes", value: "Kettle + 2 cups + tray" },
    ],
  },
  {
    slug: "safe-box",
    name: "Safe Box",
    category: "Amenities",
    image: "/images/products/safe-box.jpg",
    description:
      "Electronic hotel safe boxes with digital keypad and emergency override. Brushed metal finish, brass accent trim.",
    specs: [
      { label: "Lock", value: "Digital keypad + override" },
      { label: "Size", value: "200×300×200 mm" },
      { label: "Material", value: "1.5mm steel" },
      { label: "Power", value: "4×AA + external backup" },
    ],
  },
  {
    slug: "door-lock",
    name: "Door Lock",
    category: "Amenities",
    image: "/images/products/door-lock.jpg",
    description:
      "RFID card door locks with brass accent trim. Battery-powered, audit trail, integrates with PMS systems.",
    specs: [
      { label: "Access", value: "RFID card + mechanical key" },
      { label: "Battery", value: "4×AA (10,000 unlocks)" },
      { label: "Finish", value: "Brass / Matte black" },
      { label: "Integration", value: "PMS-compatible" },
    ],
  },
  {
    slug: "luggage-trolley",
    name: "Luggage Trolley",
    category: "Lobby",
    image: "/images/products/luggage-trolley.jpg",
    description:
      "Brass-framed luggage trolleys with black leather straps and silent castors. Heavy-duty, 200kg load capacity.",
    specs: [
      { label: "Load", value: "200 kg" },
      { label: "Frame", value: "Brass-plated steel" },
      { label: "Wheels", value: "4× silent castor" },
      { label: "Size", value: "1100×600×950 mm" },
    ],
  },
  {
    slug: "bath-tub",
    name: "Bath Tub",
    category: "Washroom",
    image: "/images/products/bath-tub.jpg",
    description:
      "Freestanding acrylic bathtubs with brass faucet. Minimalist luxury design, 180L capacity, scratch-resistant.",
    specs: [
      { label: "Material", value: "Lucite acrylic" },
      { label: "Capacity", value: "180L" },
      { label: "Size", value: "1500×750×580 mm" },
      { label: "Finish", value: "Gloss white" },
    ],
  },
  {
    slug: "hair-dryer",
    name: "Hair Dryer",
    category: "Washroom",
    image: "/images/products/hair-dryer.jpg",
    description:
      "Wall-mounted hotel hair dryers with brass accents. 1600W, dual speed, auto shut-off on release.",
    specs: [
      { label: "Power", value: "1600W" },
      { label: "Speed", value: "2-speed" },
      { label: "Mount", value: "Wall bracket" },
      { label: "Cable", value: "Retractable" },
    ],
  },
  {
    slug: "magnifying-mirror",
    name: "Magnifying Mirror",
    category: "Washroom",
    image: "/images/products/magnifying-mirror.jpg",
    description:
      "Brass-framed magnifying vanity mirrors on extendable arm. 5× magnification, fog-free, 360° rotation.",
    specs: [
      { label: "Magnification", value: "5×" },
      { label: "Diameter", value: "180 mm" },
      { label: "Arm", value: "Extendable 300mm" },
      { label: "Finish", value: "Polished brass" },
    ],
  },
  {
    slug: "hand-dryer",
    name: "Hand Dryer",
    category: "Washroom",
    image: "/images/products/hand-dryer.jpg",
    description:
      "High-speed commercial hand dryers with brass accent. Dries in 10 seconds, HEPA filter, energy-efficient.",
    specs: [
      { label: "Dry time", value: "10 seconds" },
      { label: "Power", value: "1400W" },
      { label: "Filter", value: "HEPA H13" },
      { label: "Noise", value: "< 70 dB" },
    ],
  },
];

/* Career — job openings */
export type JobOpening = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
};

export const JOB_OPENINGS: JobOpening[] = [
  {
    slug: "regional-sales-manager",
    title: "Regional Sales Manager",
    department: "Sales",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    experience: "5-8 years",
    description:
      "Lead B2B sales for Maharashtra and Gujarat. Manage existing hotel-chain accounts, develop new procurement relationships, and coordinate with the factory on custom orders.",
  },
  {
    slug: "production-engineer",
    title: "Production Engineer — Safe Locker Line",
    department: "Manufacturing",
    location: "Ajmer, Rajasthan",
    type: "Full-time",
    experience: "3-6 years",
    description:
      "Oversee the electronic safe locker assembly line. Optimize throughput, maintain quality checkpoints, and lead the shift to IoT-enabled safes.",
  },
  {
    slug: "interior-designer",
    title: "Hospitality Interior Designer",
    department: "Design",
    location: "Ajmer / Remote",
    type: "Full-time",
    experience: "4-7 years",
    description:
      "Create room amenity layouts and furniture specifications for hotel renovation projects. Work directly with procurement teams and architects.",
  },
  {
    slug: "quality-inspector",
    title: "Quality Control Inspector",
    department: "Quality",
    location: "Ajmer, Rajasthan",
    type: "Full-time",
    experience: "2-5 years",
    description:
      "Execute the 14-point quality checkpoint process for minibars, safes, and furniture. ISO 9001 documentation and supplier audit.",
  },
  {
    slug: "field-service-engineer",
    title: "Field Service Engineer",
    department: "After-Sales",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Provide on-site installation and after-sales service for LaxRee products across South India. Training provided at the Ajmer factory.",
  },
  {
    slug: "digital-marketing-lead",
    title: "Digital Marketing Lead",
    department: "Marketing",
    location: "Ajmer / Remote",
    type: "Full-time",
    experience: "4-6 years",
    description:
      "Own the LaxRee digital presence — website, LinkedIn, SEO blog. Generate qualified leads from hospitality procurement managers.",
  },
];

/* Career — life at LaxRee perks */
export type Perk = {
  icon: string;
  title: string;
  description: string;
};

export const PERKS: Perk[] = [
  {
    icon: "GraduationCap",
    title: "Learning & Growth",
    description: "Annual training budget, factory certifications, and conference attendance.",
  },
  {
    icon: "HeartPulse",
    title: "Health Insurance",
    description: "Family floater medical coverage for all full-time employees and dependents.",
  },
  {
    icon: "Home",
    title: "Housing Assistance",
    description: "Relocation support and HRA for Ajmer-based manufacturing roles.",
  },
  {
    icon: "Plane",
    title: "Travel Opportunities",
    description: "Field roles include pan-India travel to hotel sites and exhibitions.",
  },
  {
    icon: "Award",
    title: "Performance Bonus",
    description: "Quarterly performance-linked bonuses and annual profit-sharing.",
  },
  {
    icon: "Coffee",
    title: "Factory Canteen",
    description: "Subsidised meals and tea/snacks throughout the day at the Ajmer campus.",
  },
];

/* Dealers — benefits */
export type DealerBenefit = {
  icon: string;
  title: string;
  description: string;
};

export const DEALER_BENEFITS: DealerBenefit[] = [
  {
    icon: "BadgePercent",
    title: "OEM Pricing",
    description: "Direct factory pricing with volume slabs. No middleman markup.",
  },
  {
    icon: "MapPin",
    title: "Exclusive Territory",
    description: "Protected geographic territory — we don't undercut our dealers.",
  },
  {
    icon: "PackageCheck",
    title: "Stock Support",
    description: "Min-min-max stock model with 7-day replenishment from Ajmer.",
  },
  {
    icon: "Megaphone",
    title: "Co-Marketing",
    description: "Co-branded collateral, exhibition participation, and digital lead routing.",
  },
  {
    icon: "Wrench",
    title: "Service Training",
    description: "Quarterly training at the Ajmer factory for your installation team.",
  },
  {
    icon: "FileText",
    title: "Credit Terms",
    description: "Flexible credit terms after 6-month track record. 30/45/60-day slabs.",
  },
];

/* Dealers — existing dealer network cities */
export const DEALER_CITIES = [
  "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Udaipur", "Lucknow", "Chandigarh",
  "Bhopal", "Patna", "Guwahati", "Visakhapatnam", "Cochin", "Coimbatore",
  "Nagpur", "Surat", "Indore", "Bhubaneswar",
];

/* Clients — case studies */
export type CaseStudy = {
  slug: string;
  hotel: string;
  location: string;
  project: string;
  scope: string;
  outcome: string;
  metric: string;
  metricLabel: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "imperial-crest-jaipur",
    hotel: "The Imperial Crest",
    location: "Jaipur, Rajasthan",
    project: "142-Room Renovation",
    scope:
      "Full room amenity fit-out — minibars, safes, door locks, kettles, washroom amenities, and furniture for 142 rooms plus 8 suites.",
    outcome:
      "Delivered in 11 weeks with zero procurement delays. Guest satisfaction scores for room amenities rose 23% post-renovation.",
    metric: "142",
    metricLabel: "Rooms delivered",
  },
  {
    slug: "westmark-resorts-udaipur",
    hotel: "Westmark Resorts",
    location: "Udaipur, Rajasthan",
    project: "New Resort Launch",
    scope:
      "Complete hospitality supply — amenities, furniture, linen, and roofing for a 220-key resort property on Lake Pichola.",
    outcome:
      "Project handed over 2 weeks ahead of opening. LaxRee's factory-direct model saved 18% vs. procurement through a trading company.",
    metric: "220",
    metricLabel: "Keys supplied",
  },
  {
    slug: "heritage-hotels-group",
    hotel: "Heritage Hotels Group",
    location: "Pan-India (9 properties)",
    project: "Group-Wide Amenity Standardisation",
    scope:
      "Standardised minibar and safe locker specifications across 9 heritage properties. Centralised procurement with property-wise delivery.",
    outcome:
      "Reduced procurement admin by 60%. Maintenance calls related to amenities dropped 34% due to consistent hardware across properties.",
    metric: "9",
    metricLabel: "Properties unified",
  },
];

/* Blog — full post content (HTML-ish structured text) */
export type BlogPostFull = BlogPost & {
  author: string;
  authorRole: string;
  content: { heading?: string; paragraphs: string[] }[];
};

export const BLOG_POSTS_FULL: BlogPostFull[] = BLOG_POSTS.map((post) => {
  const full: BlogPostFull = {
    ...post,
    author: "LaxRee Editorial Team",
    authorRole: "Hospitality Procurement Insights",
    content: [],
  };

  if (post.slug === "sustainable-hospitality-2026") {
    full.author = "Sunita Jain";
    full.authorRole = "Head of Quality & Compliance";
    full.content = [
      {
        paragraphs: [
          "The hospitality industry is at an inflection point. Guests increasingly choose hotels that demonstrate environmental responsibility, and procurement teams are under pressure to deliver sustainability without inflating per-room costs. The good news: the two goals are no longer in conflict.",
          "In 2026, the procurement playbook for sustainable hospitality has matured. Here is what to specify in your next tender — and what to quietly drop.",
        ],
      },
      {
        heading: "Refillable Dispensers Are Now Table Stakes",
        paragraphs: [
          "Single-use amenity bottles are the most visible waste stream in a hotel room. A 150-room property generates over 50,000 plastic bottles per year from shampoo and body wash alone. Refillable dispensers eliminate that entirely.",
          "The guest-experience objection — 'dispensers feel cheap' — is outdated. Wall-mounted brass-finish dispensers from OEM manufacturers like LaxRee now match the aesthetic of premium amenities while cutting amenity cost per room-night by 60-70%.",
        ],
      },
      {
        heading: "Low-VOC Finishes on Furniture",
        paragraphs: [
          "Volatile organic compounds (VOCs) from furniture finishes, adhesives, and paints off-gas for months after installation. In a sealed hotel room, this affects indoor air quality and guest comfort. Specify low-VOC or zero-VOC finishes in your furniture tender.",
          "ISO 14001-certified manufacturers test and document VOC emissions. Ask for the test certificate — it is a 30-second check that separates serious suppliers from traders.",
        ],
      },
      {
        heading: "Energy-Efficient Minibars",
        paragraphs: [
          "Compressor minibars use 40-60% less energy than absorption models. Over a 10-year lifecycle, the energy savings alone pay for the minibar twice. Yet many hotels still specify absorption because 'that is what we have always used.'",
          "In 2026, specify compressor minibars with brass-trimmed glass doors. They are silent, energy-efficient, and the brass trim photograph well — which matters for social-media-driven guest perception.",
        ],
      },
      {
        heading: "Lifecycle Costing Over Unit Price",
        paragraphs: [
          "The biggest sustainability mistake in hospitality procurement is optimising for unit price instead of lifecycle cost. A cheap safe locker that fails in 18 months costs more — in replacement, maintenance, and guest dissatisfaction — than a quality unit that lasts 7 years.",
          "Specify lifecycle cost in your tender. Ask for expected lifespan, maintenance schedule, and parts availability. OEM manufacturers with in-house factory lines can provide this data; trading companies cannot.",
        ],
      },
      {
        heading: "What to Drop",
        paragraphs: [
          "Drop the 'green' certification theatre — logos on single-use packaging, 'eco-friendly' labels without data. Procurement teams and guests alike are learning to see through it.",
          "Instead, document your sustainability specs in the tender, audit the factory, and publish the lifecycle data. That is the 2026 standard.",
        ],
      },
    ];
  } else if (post.slug === "brass-details-guest-perception") {
    full.author = "Priya Sharma";
    full.authorRole = "Director, Operations";
    full.content = [
      {
        paragraphs: [
          "Hardware finishes are the quietest lever in hotel room design. They do not show up in the render. They do not appear in the spec sheet headline. But they are what the guest touches — and what the guest photographs.",
          "Recent eye-tracking studies on hotel rooms show that warm-metal accents (brass, bronze, copper) increase perceived room value by up to 18% compared to chrome or brushed nickel. Here is why, and how to use it.",
        ],
      },
      {
        heading: "The Psychology of Warm Metals",
        paragraphs: [
          "Warm metals — brass, bronze, copper — read as 'traditional luxury' in the guest's visual vocabulary. They evoke heritage hotels, European boutiques, and craftsmanship. Chrome reads as 'modern but mass-market.' Brushed nickel reads as 'corporate.'",
          "When a guest enters a room and sees brass drawer pulls, brass faucet trim, and a brass-framed magnifying mirror, their brain categorises the room as 'premium' before they consciously process any single element.",
        ],
      },
      {
        heading: "Where Brass Delivers the Most Impact",
        paragraphs: [
          "Not every surface needs brass. The high-impact, low-cost touchpoints are: minibar door trim, safe locker handle, door lock escutcheon, magnifying mirror frame, faucet handles, and luggage trolley frame.",
          "These are all items LaxRee manufactures with brass accents as standard. The cost premium of brass over chrome is typically 8-12% on hardware — but the perceived value uplift is 15-20%.",
        ],
      },
      {
        heading: "The Social Media Multiplier",
        paragraphs: [
          "Guests photograph warm-metal details. A brass-rimmed minibar, a brass-framed mirror, a brass-trimmed safe — these are the objects that appear in Instagram stories and TripAdvisor review photos.",
          "This is free marketing. A chrome minibar never goes viral. A brass-trimmed one with warm interior lighting does.",
        ],
      },
      {
        heading: "Avoiding the Brass Trap",
        paragraphs: [
          "Brass is powerful but easy to overdo. The rule: brass on hardware, not on surfaces. Brass drawer pulls — yes. Brass wall panels — no. Brass faucet trim — yes. Brass ceiling — absolutely not.",
          "Use brass as an accent (10-15% of the visible metal in the room), not a dominant finish. The goal is for the guest to feel premium, not to feel like they are inside a trumpet.",
        ],
      },
    ];
  } else {
    full.author = "Amit Verma";
    full.authorRole = "Head of Sales (Pan-India)";
    full.content = [
      {
        paragraphs: [
          "Hotel renovation season is where small details quietly move TripAdvisor scores. The big-ticket items — bed, bathroom, view — get all the attention. But it is the hundred small hardware and amenity decisions that separate a 4.2 from a 4.6.",
          "Here are five amenity trends we are seeing in 2026 hotel renovations across India — and why they matter.",
        ],
      },
      {
        heading: "1. In-Room Smart Safes with Phone Charging",
        paragraphs: [
          "The safe is no longer just for valuables. Guests want to charge their phone inside it overnight — both for security and because the bedside outlet is taken by the bedside lamp.",
          "Specify safes with a USB-C port and Qi wireless charging pad inside. The cost premium is small; the guest convenience is large.",
        ],
      },
      {
        heading: "2. Weighted Curtain Hooks",
        paragraphs: [
          "This sounds trivial. It is not. Lightweight curtain hooks rattle when the AC kicks in, and the sound travels. Weighted brass hooks eliminate the rattle and add a tactile premium feel when the guest opens the curtains.",
          "It is a Rs. 40-per-hook upgrade that guests notice subconsciously and reviewers mention explicitly.",
        ],
      },
      {
        heading: "3. Magnifying Mirrors with LED Ring",
        paragraphs: [
          "The magnifying mirror is a washroom staple, but the old incandescent-lit versions cast a yellow, unflattering light. LED ring-lit magnifying mirrors give true-color rendering that guests appreciate for makeup and grooming.",
          "Specify 5× magnification with a 6000K LED ring. Brass frame, extendable arm.",
        ],
      },
      {
        heading: "4. Quiet Absorption Minibars (Yes, Still)",
        paragraphs: [
          "We wrote last year that compressor minibars are the future. They are — for energy efficiency. But for absolute silence in a boutique or heritage property, absorption minibars (zero moving parts) still win.",
          "The 2026 move: absorption minibars in suites and premium rooms (silence), compressor minibars in standard rooms (efficiency). Mix the spec by room category.",
        ],
      },
      {
        heading: "5. Brass-Trimmed Door Locks with Audit Trail",
        paragraphs: [
          "Security teams love audit trails. Guests love brass trim. The 2026 door lock gives both — RFID access, PMS integration, brass escutcheon, and a downloadable log of every entry.",
          "Specify locks that integrate with your PMS at the tender stage, not after installation.",
        ],
      },
      {
        heading: "The Pattern",
        paragraphs: [
          "Notice the throughline: every trend is a small hardware upgrade that the guest feels but does not consciously evaluate. That is how you move a TripAdvisor score — not with a new lobby chandelier, but with a weighted curtain hook.",
        ],
      },
    ];
  }

  if (post.slug === "hotel-minibar-buyers-guide-india") {
    full.author = "Ashish Agarwal";
    full.authorRole = "Founder & Managing Director";
    full.content = [
      {
        paragraphs: [
          "The hotel minibar is one of the highest-visibility amenities in a guest room — and one of the most frequently replaced. A wrong procurement decision here doesn't just cost money upfront; it generates guest complaints, maintenance calls, and negative reviews for years.",
          "This guide walks procurement managers through every specification decision: absorption vs compressor, capacity sizing, door types, energy efficiency, and bulk pricing benchmarks for the Indian market in 2026.",
        ],
      },
      {
        heading: "Absorption vs Compressor: Which Cooling Technology?",
        paragraphs: [
          "Absorption minibars use a heat-driven cooling cycle with zero moving parts — absolutely silent (under 26 dB). They're ideal for boutique hotels, heritage properties, and any room where guest silence is a premium. The trade-off: they consume 15-20% more power than compressor models and cool slower.",
          "Compressor minibars use the same technology as your home refrigerator — faster cooling, 40-60% lower energy consumption, but a faint hum (under 28 dB). For standard rooms in business hotels where cost-per-room-night matters, compressor is the better long-term choice.",
          "Pro tip: Specify absorption for suites and premium rooms (silence = premium perception), compressor for standard rooms (efficiency = lower operating cost). This hybrid approach optimizes both guest experience and energy bills.",
        ],
      },
      {
        heading: "Capacity Sizing: 40L vs 50L vs 60L",
        paragraphs: [
          "40-litre minibars are the industry standard for most hotel rooms. They fit 8-12 beverage items plus snacks, which is sufficient for a 2-3 night stay. 50L models are better for resorts and extended-stay properties where guests consume more. 60L models are suite-grade — they can hold a full wine bottle upright.",
          "At LaxRee, we manufacture all three capacities in both absorption and compressor variants. Our OEM pricing for bulk orders (50+ units) starts at ₹4,200 for the 40L absorption model, making it one of the most competitive price points in India.",
        ],
      },
      {
        heading: "Glass Door vs Solid Door",
        paragraphs: [
          "Glass-door minibars with brass-trimmed frames are the 2026 standard. Guests can see the contents without opening the door, which reduces cold-air loss by up to 30%. The brass trim also photographs well for social media — a measurable driver of direct bookings.",
          "Solid-door minibars are 10-15% cheaper but look dated. They're acceptable for budget properties but not recommended for any room above ₹3,000/night.",
        ],
      },
      {
        heading: "Energy Efficiency Ratings to Specify",
        paragraphs: [
          "Always specify a maximum power consumption in your tender. For 40L: absorption ≤70W, compressor ≤65W. For 50L: absorption ≤75W, compressor ≤70W. For 60L: absorption ≤80W, compressor ≤75W. These are the thresholds below which the minibar pays for itself in energy savings within 3 years.",
          "Ask for the manufacturer's BEE star rating certificate. If they can't provide one, they're likely a trading company reselling unbranded Chinese units — not an OEM manufacturer.",
        ],
      },
      {
        heading: "Bulk Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "Based on our factory pricing and market research, here are the fair price ranges for bulk orders (50+ units) in India: 40L absorption: ₹4,200-₹5,500; 40L compressor: ₹4,800-₹6,200; 50L absorption: ₹5,200-₹6,500; 50L compressor: ₹5,800-₹7,200; 60L absorption: ₹6,200-₹7,800; 60L compressor: ₹6,800-₹8,500.",
          "If a supplier quotes significantly below these ranges, ask about their steel thickness (should be 0.4mm+), glass quality (tempered, not普通), and warranty period (should be 2+ years). Cheaper units often use 0.2mm steel that dents within months.",
        ],
      },
      {
        heading: "Checklist for Your Next Minibar Tender",
        paragraphs: [
          "1. Specify cooling type per room category (absorption for suites, compressor for standard). 2. State minimum capacity (40L standard, 50L resort, 60L suite). 3. Require glass door with brass trim. 4. Specify max power consumption. 5. Ask for BEE certificate. 6. Require 2-year minimum warranty. 7. Ask for OEM factory audit (not just a showroom visit). 8. Specify spare-parts availability for 7+ years.",
        ],
      },
    ];
  }

  if (post.slug === "hotel-safe-locker-buying-guide") {
    full.author = "Sunita Jain";
    full.authorRole = "Head of Quality & Compliance";
    full.content = [
      {
        paragraphs: [
          "Hotel safes are the second most frequently used in-room amenity after the TV. A faulty safe generates more guest complaints than any other product. Yet many procurement teams treat safes as a commodity purchase, buying the cheapest option and paying for it in maintenance costs.",
          "This guide covers every specification you need to evaluate when buying hotel safes in bulk — steel thickness, lock types, sizes, override mechanisms, and realistic pricing for the Indian market.",
        ],
      },
      {
        heading: "Steel Thickness: The Number That Matters Most",
        paragraphs: [
          "Hotel safes are rated by steel body thickness. The industry minimum is 1.5mm — anything thinner can be pried open with a screwdriver. Premium safes use 2mm steel, which requires professional tools to breach. Always specify 'minimum 1.5mm body, 2mm door' in your tender.",
          "At LaxRee, all our safes use 1.5mm body steel (standard) or 2mm (deluxe). We provide a steel-thickness verification certificate with every batch — ask your supplier to do the same.",
        ],
      },
      {
        heading: "Lock Types: Digital Keypad vs RFID",
        paragraphs: [
          "Digital keypad safes are the industry standard. Guests set a 3-6 digit PIN at check-in. The keypad should be backlit for dark-room use and rated for 100,000+ presses. Avoid membrane keypads — they wear out within 18 months. Specify 'mechanical push-button keypad' for durability.",
          "RFID safes are newer and allow guests to use their room keycard to lock/unlock. They're more convenient but cost 30-40% more. RFID safes are recommended for 4★+ properties where guest experience justifies the premium.",
        ],
      },
      {
        heading: "Size Guide: Small, Medium, Large",
        paragraphs: [
          "Small (200×300×200mm): Fits passports, jewelry, cash. Standard for budget hotels. Bulk price: ₹2,800-₹4,200.",
          "Medium (250×350×250mm): Fits laptops up to 14\". Standard for 3-4★ business hotels. Bulk price: ₹3,500-₹5,200.",
          "Large (300×400×300mm): Fits 15\" laptops and tablets. Standard for 5★ and suites. Bulk price: ₹4,500-₹6,800.",
          "Always choose a size that fits the most common guest laptop. In India, 14\" laptops are most common, so medium is the safe default.",
        ],
      },
      {
        heading: "Override Mechanism: The Hidden Cost",
        paragraphs: [
          "Every hotel safe must have an emergency override — for when guests forget their PIN. The two options are: (1) Master code + emergency key (standard, cheaper), (2) Master code + electronic override (premium, no key needed).",
          "Specify that the override key must be unique per safe (not a universal master key). Universal keys are a security liability — if one key is copied, every safe in the hotel is compromised.",
        ],
      },
      {
        heading: "Power: Batteries + External Backup",
        paragraphs: [
          "Hotel safes run on 4×AA batteries. A quality safe should last 10,000+ openings on a single set. Always specify a low-battery indicator (LED or LCD display) — guests should never find a dead safe.",
          "External backup power is critical. If batteries die with the safe locked, staff need an external power port (typically a micro-USB or 9V battery terminal) to open it. Never buy a safe without external backup.",
        ],
      },
    ];
  }

  if (post.slug === "rfid-hotel-door-lock-guide") {
    full.author = "Amit Verma";
    full.authorRole = "Head of Sales (Pan-India)";
    full.content = [
      {
        paragraphs: [
          "The door lock is the first thing a guest interacts with in your hotel. A smooth tap-and-enter experience sets the tone for the stay; a fussy lock starts the guest journey with frustration. RFID door locks have become the Indian hotel standard, but the quality range between suppliers is enormous.",
          "This guide covers everything procurement teams need to specify: card types, audit trails, PMS integration, battery life, and what separates a ₹4,000 lock from a ₹12,000 lock.",
        ],
      },
      {
        heading: "Card Technology: Mifare vs NFC vs RFID",
        paragraphs: [
          "Mifare Classic 1K cards are the Indian hotel industry standard. They're cheap (₹8-15 per card), reliable, and compatible with every major PMS system. NFC cards are newer and allow mobile-phone unlocking, but the infrastructure cost is 3x higher and most Indian guests still prefer physical cards.",
          "Specify 'Mifare Classic 1K compatible' in your tender. This ensures compatibility with future PMS upgrades without replacing all your locks.",
        ],
      },
      {
        heading: "Audit Trail: Why 256 Entries Isn't Enough",
        paragraphs: [
          "Every door lock should record the last 256-512 access events (who opened, when, with what card). This data is critical for incident investigation — guest disputes, theft reports, staff access audits.",
          "Budget locks store only 256 entries; premium locks store 512+. For a 100-room hotel averaging 8 openings per room per day, 256 entries cover only 3 hours. Always specify 512+ entry audit trail.",
        ],
      },
      {
        heading: "PMS Integration: The Deal-Breaker",
        paragraphs: [
          "Your door lock system must integrate with your Property Management System (PMS). In India, the most common PMS platforms are Oracle OPERA, IDS Fortuner, and eZee Absolute. Before buying any lock, ask the supplier for a written compatibility certificate for your specific PMS version.",
          "At LaxRee, our RFID locks integrate with all major PMS systems via a standard TCP/IP interface. We provide free integration support during installation — something most trading-company suppliers cannot offer.",
        ],
      },
      {
        heading: "Battery Life: The Real Cost of Cheap Locks",
        paragraphs: [
          "RFID locks run on 4×AA batteries. A quality lock delivers 10,000+ openings per battery set (approximately 8-10 months in a standard hotel). Cheap locks drain batteries in 2-3 months, generating maintenance calls and guest complaints.",
          "Specify 'minimum 10,000 openings per battery set' in your tender. Ask for the manufacturer's test certificate — if they can't provide one, they're reselling unbranded locks.",
        ],
      },
      {
        heading: "Finish: Brass vs Matte Black vs Chrome",
        paragraphs: [
          "The finish of your door lock should match your room's hardware palette. Brass-finish locks (like LaxRee's) photograph well and read as premium. Matte black is modern and hides fingerprints. Chrome looks dated in 2026 — avoid it for new installations.",
          "Always order a sample lock before committing to a bulk order. Check the finish under both daylight and warm LED lighting — some finishes look different under different color temperatures.",
        ],
      },
      {
        heading: "Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "Budget RFID lock (Mifare, 256 audit, no PMS): ₹4,000-₹6,000. Standard RFID lock (Mifare, 512 audit, PMS-ready): ₹6,500-₹9,000. Premium RFID lock (Mifare + keypad, 512 audit, PMS-integrated, 3-year warranty): ₹9,500-₹14,000.",
          "For a 100-room hotel, the price difference between budget and premium is ₹5-8 lakh. That's significant — but the cost of 2-3 battery replacements per year per room, guest complaints about faulty locks, and PMS integration failures will cost more over 5 years. Always buy standard or premium.",
        ],
      },
    ];
  }

  if (post.slug === "hotel-supplies-procurement-guide-india") {
    full.author = "Ashish Agarwal";
    full.authorRole = "Founder & Managing Director";
    full.content = [
      {
        paragraphs: [
          "Procuring hotel supplies in India is more complex than in most markets. The range of suppliers — from OEM manufacturers to trading companies to online marketplaces — creates a wide quality and price spectrum. A wrong supplier choice doesn't just cost money; it delays your project, compromises guest experience, and creates long-term maintenance headaches.",
          "This guide is a step-by-step procurement framework specifically designed for Indian hotels, based on LaxRee's 11 years of OEM manufacturing and supply experience.",
        ],
      },
      {
        heading: "Step 1: Supplier Evaluation — Manufacturer vs Trader",
        paragraphs: [
          "The most important procurement decision is choosing between an OEM manufacturer (like LaxRee) and a trading company. Manufacturers control quality, offer customization, provide spare parts for 7+ years, and have transparent pricing. Traders offer lower upfront prices but no quality control, no customization, and no spare-parts guarantee.",
          "How to tell the difference: Ask for a factory visit. If the supplier can arrange a factory tour within 7 days, they're a manufacturer. If they offer only a showroom visit or say 'our factory is in China,' they're a trader. Always ask for the GST registration certificate — manufacturers have a factory address on their GST certificate.",
        ],
      },
      {
        heading: "Step 2: Specification Writing",
        paragraphs: [
          "A vague tender ('supply 100 minibars') invites the cheapest bids and the lowest quality. A specific tender ('supply 100 absorption minibars, 40L capacity, glass door with brass trim, ≤70W power, BEE certified, 2-year warranty') attracts quality suppliers and enables apples-to-apples comparison.",
          "Always include: product type, capacity/size, material specifications, finish, power consumption, certification requirements, warranty period, delivery timeline, and spare-parts availability. The more specific your tender, the more accurate the quotes.",
        ],
      },
      {
        heading: "Step 3: Quality Control Checkpoints",
        paragraphs: [
          "Specify 14 quality control checkpoints in your tender: (1) Raw material inspection, (2) Steel thickness verification, (3) Welding integrity, (4) Surface finish uniformity, (5) Door alignment, (6) Lock mechanism testing, (7) Electronic component testing, (8) Cooling performance (for minibars), (9) Noise level testing, (10) Power consumption testing, (11) Safety certification verification, (12) Packaging inspection, (13) Random sampling at dispatch, (14) On-site delivery inspection.",
          "At LaxRee, we document every checkpoint with photos and test certificates. Ask your supplier to do the same — if they can't, they're not an OEM manufacturer.",
        ],
      },
      {
        heading: "Step 4: Delivery & Installation",
        paragraphs: [
          "Indian logistics can add 15-30 days to delivery timelines. Always specify: 'Delivery within 30 days of PO, installation within 15 days of delivery, training for housekeeping staff included.' Ask for a penalty clause for late delivery — ₹500 per day per unit is standard.",
          "For installation, insist on the supplier's own technicians (not third-party contractors). Supplier technicians know the product, carry spare parts, and can train your staff on maintenance.",
        ],
      },
      {
        heading: "Step 5: After-Sales Support",
        paragraphs: [
          "The real cost of hotel supplies isn't the purchase price — it's the maintenance cost over 5-7 years. Before signing the PO, ask: (1) Where is your nearest service center? (2) What is your average response time? (3) Do you carry spare parts for 7+ years? (4) Is there an AMC (Annual Maintenance Contract) option?",
          "At LaxRee, we have service engineers in 14 Indian cities, average response time of 4 hours in metros and 24 hours in Tier-2/3, and we guarantee spare parts availability for 7 years. This is the OEM manufacturer advantage.",
        ],
      },
    ];
  }

  if (post.slug === "top-hotel-amenities-suppliers-india") {
    full.author = "Ashish Agarwal";
    full.authorRole = "Founder & Managing Director";
    full.content = [
      {
        paragraphs: [
          "The Indian hotel amenities market has dozens of suppliers, but not all are created equal. Some are OEM manufacturers with their own factory lines; others are trading companies that import and resell. Some have pan-India service networks; others operate from a single city. Understanding these differences is the key to choosing the right procurement partner.",
          "This guide helps hotel procurement teams evaluate suppliers across five critical dimensions: manufacturing capability, product range, service network, pricing transparency, and certification compliance.",
        ],
      },
      {
        heading: "Manufacturer vs Trading Company: Why It Matters",
        paragraphs: [
          "OEM manufacturers (like LaxRee) own their factory lines. They control every aspect of production — raw material quality, assembly processes, testing, and finishing. This means consistent quality, customization options, transparent pricing (no middleman markup), and long-term spare-parts availability.",
          "Trading companies buy from multiple factories (often Chinese) and resell under their brand. Their pricing may be 10-15% lower, but quality is inconsistent, customization is impossible, and spare parts are often unavailable after 2-3 years. For a hotel that needs products to last 7+ years, this is a critical risk.",
        ],
      },
      {
        heading: "How to Evaluate a Hotel Supplies Supplier",
        paragraphs: [
          "1. Factory Visit: Can they arrange a factory tour within 7 days? If yes, they're a manufacturer. If no, they're a trader.",
          "2. Product Range: Do they manufacture their core products (minibars, safes, locks) or just resell? Ask for manufacturing photos, not just product photos.",
          "3. Service Network: How many cities do they have service engineers in? What's their average response time? A supplier without pan-India service is a risk for multi-property hotel groups.",
          "4. Certifications: Do they have ISO 9001 (quality), ISO 14001 (environment), ISO 45001 (safety), CE, and RoHS? Ask for certificate copies — don't accept 'we're certified' without proof.",
          "5. Customization: Can they customize products (brass trim, hotel logo, custom dimensions)? Only manufacturers can offer this.",
        ],
      },
      {
        heading: "The LaxRee Advantage",
        paragraphs: [
          "LaxRee Amenities is one of India's few OEM manufacturers of hotel minibars and safe lockers. Founded in 2015 in Ajmer, Rajasthan, we operate our own factory lines and Ajmer's largest hospitality exhibition centre (12,000 sq ft).",
          "Our advantages over competitors: (1) OEM factory-direct pricing (no middleman markup), (2) 700+ SKUs across 5 categories, (3) 1,347+ projects delivered across 28 states, (4) Service engineers in 14 cities, (5) 7+ certifications (ISO 9001/14001/45001, CE, RoHS), (6) 7-year spare-parts guarantee, (7) Custom manufacturing capability.",
        ],
      },
      {
        heading: "Questions to Ask Before Signing a PO",
        paragraphs: [
          "1. Are you the manufacturer or a distributor? (Ask for factory address and GST certificate)",
          "2. Can I visit your factory? (A manufacturer will say yes within 7 days)",
          "3. What is your spare-parts availability guarantee? (Should be 7+ years)",
          "4. What is your average service response time? (Should be ≤4 hours in metros, ≤24 hours in Tier-2/3)",
          "5. Can you customize products with our hotel's branding? (Only manufacturers can)",
          "6. What certifications do you hold? (Ask for copies, not claims)",
          "7. Can you provide references from 3+ hotels of similar star rating?",
          "8. What is your warranty period? (Should be 2+ years minimum)",
        ],
      },
    ];
  }

  if (post.slug === "electric-kettle-hotel-rooms-guide") {
    full.author = "Amit Verma";
    full.authorRole = "Head of Sales (Pan-India)";
    full.content = [
      {
        paragraphs: [
          "The electric kettle is the most-used small appliance in a hotel room after the TV remote. A good kettle gets used 3-5 times per guest stay; a bad one generates maintenance calls, guest complaints, and even safety incidents. Yet many procurement teams treat it as an afterthought, buying the cheapest option available.",
          "This guide covers every specification decision for bulk-buying hotel kettles in India: stainless steel grades, capacity, wattage, safety features, and fair pricing benchmarks.",
        ],
      },
      {
        heading: "Stainless Steel Grade: SS304 vs SS202",
        paragraphs: [
          "SS304 is food-grade stainless steel — corrosion-resistant, non-reactive, and safe for boiling water. SS202 is a cheaper alternative that rusts within 6-12 months in humid Indian climates. Always specify 'SS304 body and spout' in your tender.",
          "At LaxRee, all our kettles use SS304 construction. The price difference between SS304 and SS202 is only ₹150-200 per unit — but the lifespan difference is 5x. Don't compromise here.",
        ],
      },
      {
        heading: "Capacity: 1.0L vs 1.2L",
        paragraphs: [
          "1.0L kettles are the budget standard — sufficient for 2 cups of tea/coffee. 1.2L kettles can serve 3-4 cups, which is better for family rooms and suites. The price difference is only ₹100-150 per unit.",
          "Always order the kettle as a SET — kettle + 2 cups + tray. Individual kettles without cups look incomplete in a hotel room. LaxRee's kettle sets include matching SS304 cups and a brass-accented tray.",
        ],
      },
      {
        heading: "Wattage & Heating Speed",
        paragraphs: [
          "Hotel kettles range from 1350W to 1500W. Higher wattage = faster boiling. At 1500W, 1L water boils in ~3.5 minutes. At 1350W, it takes ~4.5 minutes. For guest satisfaction, always specify 1500W minimum.",
          "Important: Check that your room's electrical circuit can handle 1500W. Most Indian hotel rooms have 6A/220V circuits (1320W max). If so, specify 1350W kettles to avoid tripping. For 15A circuits, 1500W is fine.",
        ],
      },
      {
        heading: "Safety Features: Non-Negotiable",
        paragraphs: [
          "Auto shut-off: The kettle must turn off automatically when water boils or when lifted from the base. This is a fire safety requirement — never buy a kettle without it.",
          "Boil-dry protection: The kettle must not heat if empty. This prevents element burnout and fire hazards. Specify 'boil-dry protection with thermal fuse' in your tender.",
          "Cool-touch body: Premium kettles have a double-wall design that keeps the outer surface cool. This prevents guest burns — critical for family hotels.",
        ],
      },
      {
        heading: "Bulk Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "1.0L SS304 kettle only: ₹450-650. 1.0L SS304 kettle set (kettle + 2 cups + tray): ₹700-950. 1.2L SS304 kettle set: ₹800-1,100. Premium cordless 1.2L set with cool-touch body: ₹1,000-1,400.",
          "At LaxRee, our KS-101 (1.0L set) starts at ₹680 for bulk orders of 100+ units. Our KS-102 (1.2L set with tray) starts at ₹780. These are factory-direct OEM prices — trading companies typically charge 20-30% more.",
        ],
      },
    ];
  }

  if (post.slug === "automatic-soap-dispenser-guide") {
    full.author = "Sunita Jain";
    full.authorRole = "Head of Quality & Compliance";
    full.content = [
      {
        paragraphs: [
          "Automatic soap dispensers have replaced bar soap in most Indian hotels above 3★. They're more hygienic, reduce waste, and look premium. But the quality range between suppliers is enormous — a bad dispenser leaks, clogs, or dies within months.",
          "This guide covers every specification for bulk-buying hotel soap dispensers: sensor types, capacity, battery life, refill mechanisms, and pricing.",
        ],
      },
      {
        heading: "Sensor Type: Infrared vs Capacitive",
        paragraphs: [
          "Infrared (IR) sensors are the industry standard. They detect hand proximity at 5-15cm and dispense a fixed amount. IR sensors are reliable, affordable, and work with all soap types. Specify 'IR sensor with 10cm detection range' in your tender.",
          "Capacitive sensors are newer and more sensitive but cost 40% more. They're not worth the premium for most hotels — IR is perfectly adequate.",
        ],
      },
      {
        heading: "Capacity & Refill Design",
        paragraphs: [
          "Hotel dispensers should have 500-800ml capacity — enough for 200-300 dispenses between refills. Smaller capacities (300ml) require daily refilling in busy hotels; larger capacities (1L+) are bulky and look commercial.",
          "Refill mechanism matters: Top-fill dispensers are easier for housekeeping (no removal needed). Bottom-fill dispensers look sleeker but require removal and inversion. For efficiency, specify top-fill.",
        ],
      },
      {
        heading: "Battery Life: The Hidden Cost",
        paragraphs: [
          "Most dispensers use 4×AA batteries. A quality dispenser delivers 10,000+ dispenses per battery set (3-4 months in a standard hotel). Cheap dispensers drain batteries in 4-6 weeks, costing ₹200-300 per room per year in batteries alone.",
          "Always specify 'minimum 10,000 dispenses per battery set' and ask for the manufacturer's test certificate. At LaxRee, our dispensers deliver 15,000+ dispenses per set.",
        ],
      },
      {
        heading: "Soap Compatibility",
        paragraphs: [
          "Not all dispensers work with all soap types. Some only work with liquid soap (viscosity < 3000 cP); others handle lotion soap and sanitizer gel. Specify 'compatible with liquid soap, lotion soap, and hand sanitizer' for maximum flexibility.",
          "Avoid foam dispensers unless you're committed to foam soap — they have specialized pumps that clog with regular liquid soap.",
        ],
      },
      {
        heading: "Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "Manual soap dispenser (wall-mounted, SS304): ₹250-400. Automatic IR dispenser (500ml, plastic body): ₹450-700. Automatic IR dispenser (800ml, SS304 body): ₹700-1,100. Premium automatic dispenser (brass-finish, 800ml, top-fill): ₹900-1,400.",
          "For a 100-room hotel, the difference between budget and premium is ₹45,000-₹95,000. The premium option saves ₹20,000-30,000 per year in battery costs and maintenance — so the payback period is 3-4 years.",
        ],
      },
    ];
  }

  if (post.slug === "hotel-trolley-complete-guide") {
    full.author = "Amit Verma";
    full.authorRole = "Head of Sales (Pan-India)";
    full.content = [
      {
        paragraphs: [
          "Hotel trolleys are the workhorses of hospitality operations — luggage trolleys for guest arrivals, housekeeping trolleys for room service, and linen trolleys for laundry. A wrong trolley choice creates daily operational friction that compounds over years.",
          "This guide covers all three trolley types with specifications, load capacities, wheel quality standards, and fair pricing benchmarks for the Indian market.",
        ],
      },
      {
        heading: "Luggage Trolleys: Guest-Facing",
        paragraphs: [
          "Luggage trolleys are the first physical interaction a guest has with your hotel's hardware. A sturdy, brass-framed trolley signals quality; a squeaky, wobbling trolley signals budget. Always specify brass-plated steel frame (not aluminum — it dents).",
          "Key specs: Load capacity 200kg minimum, 4 silent castor wheels (2 swivel + 2 fixed), carpeted platform (removable for cleaning), frame height 950-1000mm. At LaxRee, our LT-801 model meets all these specs at ₹8,500 per unit (bulk pricing).",
        ],
      },
      {
        heading: "Housekeeping Trolleys: Staff-Facing",
        paragraphs: [
          "Housekeeping trolleys carry cleaning supplies, linens, and amenities between rooms. They're used 8+ hours daily, so durability is critical. Specify powder-coated steel frame (not chrome-plated — it chips), minimum 150kg load, and 4 swivel wheels for maneuverability in corridors.",
          "Essential features: 3 shelves minimum, removable linen bag (washable), locking cabinet for cleaning chemicals, and a built-in trash bag holder. At LaxRee, our LT-803 model includes all features at ₹6,200 per unit.",
        ],
      },
      {
        heading: "Linen Trolleys: Laundry Operations",
        paragraphs: [
          "Linen trolleys transport dirty and clean linens between rooms and laundry. They need large capacity (minimum 120kg load) and separate compartments to prevent cross-contamination. Specify 2-compartment design (dirty/clean separator).",
          "Key spec: The frame must be powder-coated (not bare steel) to prevent rust from damp linens. Wheels must be 125mm+ diameter for smooth rolling over corridor thresholds. Our LT-804 model is ₹4,800 per unit in bulk.",
        ],
      },
      {
        heading: "Wheel Quality: The #1 Failure Point",
        paragraphs: [
          "Trolley wheels fail before any other component. Cheap wheels squeak, wobble, and seize within 6 months. Always specify 'polyurethane-tread castor wheels with precision ball bearings' — these are silent, durable, and don't mark floors.",
          "Wheel size matters: 100mm for luggage trolleys (guest areas), 125mm for housekeeping/linen trolleys (service areas). Larger wheels roll smoother over uneven surfaces.",
        ],
      },
      {
        heading: "Bulk Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "Luggage trolley (brass frame, 200kg, carpeted): ₹7,500-12,000. Housekeeping trolley (3 shelves, linen bag, 150kg): ₹5,200-8,500. Linen trolley (2-compartment, 120kg): ₹4,000-6,500.",
          "At LaxRee, we manufacture all three types in our Ajmer factory. Bulk pricing (20+ units): LT-801 luggage trolley ₹8,500, LT-803 housekeeping trolley ₹6,200, LT-804 linen trolley ₹4,800. All include 2-year warranty and 7-year spare-parts guarantee.",
        ],
      },
    ];
  }

  if (post.slug === "steam-iron-hotel-rooms-guide") {
    full.author = "Sunita Jain";
    full.authorRole = "Head of Quality & Compliance";
    full.content = [
      {
        paragraphs: [
          "The steam iron is an essential in-room amenity for business hotels — guests iron their shirts before meetings, and a faulty iron is a guaranteed complaint. Yet many hotels buy the cheapest iron available, resulting in burned clothes, tripped circuits, and guest dissatisfaction.",
          "This guide covers every specification for bulk-buying hotel steam irons: wattage, soleplate material, steam output, safety features, and fair pricing for India.",
        ],
      },
      {
        heading: "Wattage: Balance Power & Circuit Safety",
        paragraphs: [
          "Hotel steam irons range from 1200W to 1800W. Higher wattage means faster heating and better steam, but also higher circuit load. Most Indian hotel rooms have 6A circuits (1320W max), so specify 1200-1300W irons to avoid tripping.",
          "For rooms with 15A circuits, 1500W irons are ideal — they heat in 60 seconds and produce consistent steam. Always verify the room's electrical capacity before specifying iron wattage.",
        ],
      },
      {
        heading: "Soleplate Material: Ceramic vs Stainless Steel",
        paragraphs: [
          "Ceramic soleplates are the 2026 standard — they glide smoothly, distribute heat evenly, and don't stick to fabrics. They're also scratch-resistant and easy to clean. Specify 'ceramic-coated soleplate with non-stick finish'.",
          "Stainless steel soleplates are cheaper but scratch easily and can snag delicate fabrics. Avoid aluminum soleplates entirely — they stain and transfer marks to white shirts.",
        ],
      },
      {
        heading: "Steam Output & Vertical Steaming",
        paragraphs: [
          "Continuous steam output should be 15-25 g/min for adequate wrinkle removal. Steam burst (shot of extra steam) should be 50-80 g for stubborn wrinkles. Always specify both numbers in your tender.",
          "Vertical steaming capability allows guests to steam hanging clothes — a premium feature that's increasingly expected in 4★+ hotels. Specify 'vertical steam function' if your property is above 3★.",
        ],
      },
      {
        heading: "Safety Features: Non-Negotiable for Hotels",
        paragraphs: [
          "Auto shut-off: The iron must turn off after 8 minutes horizontal or 30 seconds on its side/soleplate. This is a fire safety requirement — never buy an iron without it. The auto shut-off should have a visible indicator light.",
          "Anti-calc function: Hard water in Indian cities clogs steam vents within months. Specify 'anti-calc system with self-cleaning function' to extend iron life from 1 year to 3+ years.",
          "Swivel cord: 360° swivel cord prevents tangling and cord breakage — the #1 maintenance issue with hotel irons. Specify '360° swivel cord, 1.8m minimum length'.",
        ],
      },
      {
        heading: "Bulk Pricing Benchmarks (India, 2026)",
        paragraphs: [
          "1200W ceramic soleplate iron (basic, auto shut-off): ₹550-800. 1300W ceramic iron (anti-calc, vertical steam): ₹700-1,000. 1500W ceramic iron (all features, premium build): ₹900-1,300.",
          "At LaxRee, our steam irons start at ₹620 for the 1200W model (bulk pricing, 50+ units). All include auto shut-off, ceramic soleplate, and 2-year warranty. We also provide ironing boards (₹1,200-1,800) as a matching set.",
        ],
      },
    ];
  }

  return full;
});

/* ─────────────────────────────────────────────────────────────
   Catalogue — category-wise PDF downloads
   Each category has its own downloadable catalogue PDF.
   The master catalogue covers all categories in one file.
   ───────────────────────────────────────────────────────────── */
export type CatalogueFile = {
  slug: string;
  name: string;
  description: string;
  fileName: string;
  fileSize: string;
  category: string; // matches CATEGORIES slug, or "master" for the full catalogue
  available: boolean; // whether the actual PDF is uploaded
};

export const CATALOGUES: CatalogueFile[] = [
  {
    slug: "master",
    name: "Master Catalogue 2026",
    description:
      "The complete LaxRee product catalogue — all 700+ SKUs across Amenities, Furniture, Linen, Roofing and Dome in a single PDF. Full specifications, pricing tiers, and lead times.",
    fileName: "master-catalogue.pdf",
    fileSize: "18 MB",
    category: "master",
    available: true,
  },
  {
    slug: "amenities",
    name: "Amenities Catalogue",
    description:
      "226 SKUs — minibars, safe lockers, kettles, door locks, hair dryers, magnifying mirrors, hand dryers, amenity trays, and more. Room, washroom and lobby essentials.",
    fileName: "amenities-catalogue.pdf",
    fileSize: "Coming soon",
    category: "amenities",
    available: false,
  },
  {
    slug: "furniture",
    name: "Furniture Catalogue",
    description:
      "246 SKUs — beds, headboards, night stands, work desks, lounge chairs, wardrobes, TV consoles, lobby seating, and outdoor furniture. Custom-grade casegoods and seating.",
    fileName: "furniture-catalogue.pdf",
    fileSize: "Coming soon",
    category: "furniture",
    available: false,
  },
  {
    slug: "linen",
    name: "Linen Catalogue",
    description:
      "20 SKUs — bed sheets, pillow cases, duvets, bath towels, bath robes, table linen, napkins, and kitchen linen. Long-staple cotton, custom-branded.",
    fileName: "linen-catalogue.pdf",
    fileSize: "Coming soon",
    category: "linen",
    available: false,
  },
  {
    slug: "roofing",
    name: "Roofing Catalogue",
    description:
      "12 SKUs — standing seam panels, insulated roof panels, polycarbonate sheets, flashings, trims, and gutter systems. Architectural metal roofing and cladding.",
    fileName: "roofing-catalogue.pdf",
    fileSize: "48 MB",
    category: "roofing",
    available: true,
  },
  {
    slug: "dome",
    name: "Dome Catalogue",
    description:
      "2 SKUs — glass geodesic domes, polycarbonate geodesic domes, and dome accessories. For glamping and experiential stays.",
    fileName: "dome-catalogue.pdf",
    fileSize: "Coming soon",
    category: "dome",
    available: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   Full Product Catalogue — individual products from the PDF
   Each category has multiple products with model numbers,
   specifications, and images extracted from the catalogue.
   ───────────────────────────────────────────────────────────── */
export type CatalogueProduct = {
  model: string;
  name: string;
  category: string;
  image: string;
  specs: { label: string; value: string }[];
  description: string;
};

export type CatalogueCategory = {
  slug: string;
  name: string;
  products: CatalogueProduct[];
};

export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [
  {
    slug: "mini-bar",
    name: "Mini Bar",
    products: [
      {
        model: "LRMB-130",
        name: "Absorption Minibar 40L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-130.jpg",
        description: "Silent absorption minibar with glass door, 40L capacity. Energy-efficient, ideal for standard hotel rooms.",
        specs: [
          { label: "Capacity", value: "40 Litres" },
          { label: "Cooling", value: "Absorption" },
          { label: "Noise", value: "< 26 dB" },
          { label: "Power", value: "70W" },
          { label: "Shelves", value: "2 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
      {
        model: "LRMB-131",
        name: "Absorption Minibar 50L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-131.jpg",
        description: "Larger absorption minibar with glass door, 50L capacity. Silent operation for premium rooms.",
        specs: [
          { label: "Capacity", value: "50 Litres" },
          { label: "Cooling", value: "Absorption" },
          { label: "Noise", value: "< 26 dB" },
          { label: "Power", value: "75W" },
          { label: "Shelves", value: "2 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
      {
        model: "LRMB-126",
        name: "Compressor Minibar 40L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-126.jpg",
        description: "Compressor minibar with faster cooling and lower energy consumption. 40L capacity.",
        specs: [
          { label: "Capacity", value: "40 Litres" },
          { label: "Cooling", value: "Compressor" },
          { label: "Noise", value: "< 28 dB" },
          { label: "Power", value: "65W" },
          { label: "Shelves", value: "2 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
      {
        model: "LRMB-127",
        name: "Compressor Minibar 50L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-127.jpg",
        description: "Compressor minibar with 50L capacity. Energy-efficient with faster cooling.",
        specs: [
          { label: "Capacity", value: "50 Litres" },
          { label: "Cooling", value: "Compressor" },
          { label: "Noise", value: "< 28 dB" },
          { label: "Power", value: "70W" },
          { label: "Shelves", value: "2 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
      {
        model: "LRMB-128",
        name: "Absorption Minibar 60L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-128.jpg",
        description: "Large absorption minibar, 60L capacity for suites and premium rooms.",
        specs: [
          { label: "Capacity", value: "60 Litres" },
          { label: "Cooling", value: "Absorption" },
          { label: "Noise", value: "< 26 dB" },
          { label: "Power", value: "80W" },
          { label: "Shelves", value: "3 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
      {
        model: "LRMB-129",
        name: "Compressor Minibar 60L",
        category: "Mini Bar",
        image: "/images/product-catalogue/mini-bar-LRMB-129.jpg",
        description: "Large compressor minibar, 60L capacity with fast cooling for suites.",
        specs: [
          { label: "Capacity", value: "60 Litres" },
          { label: "Cooling", value: "Compressor" },
          { label: "Noise", value: "< 28 dB" },
          { label: "Power", value: "75W" },
          { label: "Shelves", value: "3 Glass" },
          { label: "Door", value: "Glass, Brass-trimmed" },
        ],
      },
    ],
  },
  {
    slug: "kettle-set",
    name: "Kettle Set",
    products: [
      {
        model: "KS-101",
        name: "Stainless Steel Kettle 1.0L",
        category: "Kettle Set",
        image: "/images/product-catalogue/kettle-set-KS-101.jpg",
        description: "1.0L stainless steel electric kettle with auto shut-off. Food-grade SS304.",
        specs: [
          { label: "Capacity", value: "1.0 Litre" },
          { label: "Material", value: "SS304" },
          { label: "Power", value: "1500W" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "360° base" },
          { label: "Set includes", value: "Kettle + 2 cups" },
        ],
      },
      {
        model: "KS-102",
        name: "Stainless Steel Kettle 1.2L",
        category: "Kettle Set",
        image: "/images/product-catalogue/kettle-set-KS-102.jpg",
        description: "1.2L stainless steel electric kettle with cups and tray. Complete amenity set.",
        specs: [
          { label: "Capacity", value: "1.2 Litre" },
          { label: "Material", value: "SS304" },
          { label: "Power", value: "1500W" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "360° base" },
          { label: "Set includes", value: "Kettle + 2 cups + tray" },
        ],
      },
      {
        model: "KS-103",
        name: "Cordless Kettle 1.0L",
        category: "Kettle Set",
        image: "/images/product-catalogue/kettle-set-KS-103.jpg",
        description: "Cordless electric kettle, 1.0L. Premium design with detachable base.",
        specs: [
          { label: "Capacity", value: "1.0 Litre" },
          { label: "Material", value: "SS304" },
          { label: "Power", value: "1350W" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "Cordless" },
          { label: "Set includes", value: "Kettle + 2 cups" },
        ],
      },
      {
        model: "KS-104",
        name: "Cordless Kettle 1.2L",
        category: "Kettle Set",
        image: "/images/product-catalogue/kettle-set-KS-104.jpg",
        description: "Cordless electric kettle, 1.2L with complete tea/coffee set.",
        specs: [
          { label: "Capacity", value: "1.2 Litre" },
          { label: "Material", value: "SS304" },
          { label: "Power", value: "1500W" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "Cordless" },
          { label: "Set includes", value: "Kettle + 2 cups + tray" },
        ],
      },
    ],
  },
  {
    slug: "safe-box",
    name: "Safe Box",
    products: [
      {
        model: "SB-201",
        name: "Electronic Safe — Small",
        category: "Safe Box",
        image: "/images/product-catalogue/safe-box-SB-201.jpg",
        description: "Compact electronic safe with digital keypad. Ideal for standard hotel rooms.",
        specs: [
          { label: "Size", value: "200×300×200 mm" },
          { label: "Lock", value: "Digital keypad" },
          { label: "Material", value: "1.5mm steel" },
          { label: "Power", value: "4×AA + backup" },
          { label: "Override", value: "Emergency key" },
          { label: "Finish", value: "Black powder coat" },
        ],
      },
      {
        model: "SB-202",
        name: "Electronic Safe — Medium",
        category: "Safe Box",
        image: "/images/product-catalogue/safe-box-SB-202.jpg",
        description: "Medium electronic safe with laptop-friendly interior. Digital keypad + override.",
        specs: [
          { label: "Size", value: "250×350×250 mm" },
          { label: "Lock", value: "Digital keypad" },
          { label: "Material", value: "1.5mm steel" },
          { label: "Power", value: "4×AA + backup" },
          { label: "Override", value: "Emergency key" },
          { label: "Finish", value: "Black powder coat" },
        ],
      },
      {
        model: "SB-203",
        name: "Electronic Safe — Large",
        category: "Safe Box",
        image: "/images/product-catalogue/safe-box-SB-203.jpg",
        description: "Large electronic safe for suites. Fits laptops and larger valuables.",
        specs: [
          { label: "Size", value: "300×400×300 mm" },
          { label: "Lock", value: "Digital keypad" },
          { label: "Material", value: "2mm steel" },
          { label: "Power", value: "4×AA + backup" },
          { label: "Override", value: "Emergency key" },
          { label: "Finish", value: "Black powder coat" },
        ],
      },
      {
        model: "SB-204",
        name: "Electronic Safe — Deluxe",
        category: "Safe Box",
        image: "/images/product-catalogue/safe-box-SB-204.jpg",
        description: "Deluxe electronic safe with interior light and brass-trim finish.",
        specs: [
          { label: "Size", value: "300×400×300 mm" },
          { label: "Lock", value: "Digital keypad" },
          { label: "Material", value: "2mm steel" },
          { label: "Power", value: "4×AA + backup" },
          { label: "Override", value: "Emergency key" },
          { label: "Finish", value: "Brass-trim" },
        ],
      },
    ],
  },
  {
    slug: "door-lock",
    name: "Door Lock",
    products: [
      {
        model: "DL-301",
        name: "RFID Door Lock — Standard",
        category: "Door Lock",
        image: "/images/product-catalogue/door-lock-DL-301.jpg",
        description: "RFID card door lock with brass accent trim. Battery-powered, audit trail.",
        specs: [
          { label: "Access", value: "RFID card + key" },
          { label: "Battery", value: "4×AA (10,000 unlocks)" },
          { label: "Finish", value: "Brass / Black" },
          { label: "Audit trail", value: "Last 256 entries" },
          { label: "PMS integration", value: "Yes" },
          { label: "Warranty", value: "2 years" },
        ],
      },
      {
        model: "DL-302",
        name: "RFID Door Lock — Premium",
        category: "Door Lock",
        image: "/images/product-catalogue/door-lock-DL-302.jpg",
        description: "Premium RFID door lock with touch keypad and brass finish.",
        specs: [
          { label: "Access", value: "RFID + keypad + key" },
          { label: "Battery", value: "4×AA (10,000 unlocks)" },
          { label: "Finish", value: "Brass" },
          { label: "Audit trail", value: "Last 512 entries" },
          { label: "PMS integration", value: "Yes" },
          { label: "Warranty", value: "3 years" },
        ],
      },
      {
        model: "DL-303",
        name: "Docking Pod & Room Phone",
        category: "Door Lock",
        image: "/images/product-catalogue/door-lock-DL-303.jpg",
        description: "Docking pod with room telephone. Integrates with door lock system.",
        specs: [
          { label: "Function", value: "Phone + charging dock" },
          { label: "Integration", value: "Door lock PMS" },
          { label: "Finish", value: "Brass / Black" },
          { label: "Warranty", value: "2 years" },
          { label: "Power", value: "AC adapter" },
          { label: "Features", value: "Wake-up call, voicemail" },
        ],
      },
      {
        model: "DL-304",
        name: "Room Telephone",
        category: "Door Lock",
        image: "/images/product-catalogue/door-lock-DL-304.jpg",
        description: "Hotel room telephone with programmable keys and messaging.",
        specs: [
          { label: "Type", value: "Analog/VoIP" },
          { label: "Keys", value: "10 programmable" },
          { label: "Finish", value: "Brass / Black" },
          { label: "Warranty", value: "2 years" },
          { label: "Features", value: "Wake-up, voicemail, speaker" },
          { label: "Power", value: "Phone line / AC" },
        ],
      },
    ],
  },
  {
    slug: "hair-dryer",
    name: "Hair Dryer",
    products: [
      {
        model: "HD-501",
        name: "Wall-Mounted Hair Dryer 1600W",
        category: "Hair Dryer",
        image: "/images/product-catalogue/hair-dryer-HD-501.jpg",
        description: "Wall-mounted hotel hair dryer, 1600W with auto shut-off on release.",
        specs: [
          { label: "Power", value: "1600W" },
          { label: "Speed", value: "2-speed" },
          { label: "Mount", value: "Wall bracket" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "Retractable" },
          { label: "Finish", value: "Black + Brass" },
        ],
      },
      {
        model: "HD-502",
        name: "Wall-Mounted Hair Dryer 1800W",
        category: "Hair Dryer",
        image: "/images/product-catalogue/hair-dryer-HD-502.jpg",
        description: "Premium wall-mounted hair dryer, 1800W with dual speed and cool shot.",
        specs: [
          { label: "Power", value: "1800W" },
          { label: "Speed", value: "2-speed + cool" },
          { label: "Mount", value: "Wall bracket" },
          { label: "Auto shut-off", value: "Yes" },
          { label: "Cable", value: "Retractable" },
          { label: "Finish", value: "Black + Brass" },
        ],
      },
    ],
  },
  {
    slug: "magnifying-mirror",
    name: "Magnifying Mirror",
    products: [
      {
        model: "MM-601",
        name: "Magnifying Mirror 5× — Chrome",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/magnifying-mirror-MM-601.jpg",
        description: "Chrome-finished magnifying vanity mirror, 5× magnification, extendable arm.",
        specs: [
          { label: "Magnification", value: "5×" },
          { label: "Diameter", value: "180 mm" },
          { label: "Arm", value: "Extendable 300mm" },
          { label: "Finish", value: "Polished chrome" },
          { label: "Rotation", value: "360°" },
          { label: "Mount", value: "Wall-mounted" },
        ],
      },
      {
        model: "MM-602",
        name: "Magnifying Mirror 7× — Brass",
        category: "Magnifying Mirror",
        image: "/images/product-catalogue/magnifying-mirror-MM-602.jpg",
        description: "Brass-finished magnifying vanity mirror, 7× magnification, extendable arm.",
        specs: [
          { label: "Magnification", value: "7×" },
          { label: "Diameter", value: "200 mm" },
          { label: "Arm", value: "Extendable 350mm" },
          { label: "Finish", value: "Polished brass" },
          { label: "Rotation", value: "360°" },
          { label: "Mount", value: "Wall-mounted" },
        ],
      },
    ],
  },
  {
    slug: "hand-dryer",
    name: "Hand Dryer",
    products: [
      {
        model: "HD-701",
        name: "Commercial Hand Dryer 1400W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/hand-dryer-HD-701.jpg",
        description: "High-speed commercial hand dryer, 1400W. Dries in 10 seconds, HEPA filter.",
        specs: [
          { label: "Dry time", value: "10 seconds" },
          { label: "Power", value: "1400W" },
          { label: "Filter", value: "HEPA H13" },
          { label: "Noise", value: "< 70 dB" },
          { label: "Material", value: "SS304" },
          { label: "Sensor", value: "Infrared" },
        ],
      },
      {
        model: "HD-702",
        name: "Commercial Hand Dryer 1600W",
        category: "Hand Dryer",
        image: "/images/product-catalogue/hand-dryer-HD-702.jpg",
        description: "Premium hand dryer, 1600W with brass accent trim. HEPA filter, low noise.",
        specs: [
          { label: "Dry time", value: "8 seconds" },
          { label: "Power", value: "1600W" },
          { label: "Filter", value: "HEPA H13" },
          { label: "Noise", value: "< 68 dB" },
          { label: "Material", value: "SS304 + Brass" },
          { label: "Sensor", value: "Infrared" },
        ],
      },
    ],
  },
  {
    slug: "luggage-trolley",
    name: "Luggage Trolley",
    products: [
      {
        model: "LT-801",
        name: "Luggage Trolley — Standard",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/luggage-trolley-LT-801.jpg",
        description: "Standard hotel luggage trolley with brass frame and carpeted platform.",
        specs: [
          { label: "Load", value: "200 kg" },
          { label: "Frame", value: "Brass-plated steel" },
          { label: "Platform", value: "Carpeted" },
          { label: "Wheels", value: "4× silent castor" },
          { label: "Size", value: "1100×600×950 mm" },
          { label: "Finish", value: "Brass" },
        ],
      },
      {
        model: "LT-802",
        name: "Luggage Trolley — Deluxe",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/luggage-trolley-LT-802.jpg",
        description: "Deluxe luggage trolley with ornate brass frame and leather straps.",
        specs: [
          { label: "Load", value: "250 kg" },
          { label: "Frame", value: "Brass-plated steel" },
          { label: "Platform", value: "Carpeted + straps" },
          { label: "Wheels", value: "4× silent castor" },
          { label: "Size", value: "1200×650×1000 mm" },
          { label: "Finish", value: "Brass" },
        ],
      },
      {
        model: "LT-803",
        name: "Housekeeping Trolley",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/luggage-trolley-LT-803.jpg",
        description: "Housekeeping trolley with shelves and linen bag. For room service.",
        specs: [
          { label: "Load", value: "150 kg" },
          { label: "Frame", value: "Steel, powder-coated" },
          { label: "Features", value: "Shelves + linen bag" },
          { label: "Wheels", value: "4× silent castor" },
          { label: "Size", value: "1000×550×1200 mm" },
          { label: "Finish", value: "Brass / Black" },
        ],
      },
      {
        model: "LT-804",
        name: "Linen Trolley",
        category: "Luggage Trolley",
        image: "/images/product-catalogue/luggage-trolley-LT-804.jpg",
        description: "Linen trolley for housekeeping. Large capacity with separate compartments.",
        specs: [
          { label: "Load", value: "120 kg" },
          { label: "Frame", value: "Steel, powder-coated" },
          { label: "Compartments", value: "2" },
          { label: "Wheels", value: "4× silent castor" },
          { label: "Size", value: "900×500×1100 mm" },
          { label: "Finish", value: "Black" },
        ],
      },
    ],
  },
];
