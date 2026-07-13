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
