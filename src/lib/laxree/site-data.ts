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
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Clients", href: "#clients" },
  { label: "Catalogue", href: "#catalogue" },
  { label: "Dealers", href: "#dealers" },
  { label: "Career", href: "#career" },
  { label: "Contact Us", href: "#contact" },
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
    image: "/images/categories/amenities.png",
    span: "large",
  },
  {
    slug: "furniture",
    name: "Furniture",
    count: 246,
    blurb: "Lobby, room & outdoor furniture engineered for high-traffic hospitality.",
    image: "/images/categories/furniture.png",
    span: "default",
  },
  {
    slug: "linen",
    name: "Linen",
    count: 20,
    blurb: "Bed, bath & F&B linen in long-staple cotton, custom-branded.",
    image: "/images/categories/linen.png",
    span: "default",
  },
  {
    slug: "roofing",
    name: "Roofing",
    count: 12,
    blurb: "Architectural metal roofing & cladding systems for resorts.",
    image: "/images/categories/roofing.png",
    span: "default",
  },
  {
    slug: "dome",
    name: "Dome",
    count: 2,
    blurb: "Geodesic dome structures for glamping & experiential stays.",
    image: "/images/categories/dome.png",
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
  { slug: "mini-bar", name: "Mini Bar", category: "Amenities", image: "/images/products/mini-bar.png" },
  { slug: "kettle-set", name: "Kettle Set", category: "Amenities", image: "/images/products/kettle-set.png" },
  { slug: "safe-box", name: "Safe Box", category: "Amenities", image: "/images/products/safe-box.png" },
  { slug: "door-lock", name: "Door Lock", category: "Amenities", image: "/images/products/door-lock.png" },
  { slug: "luggage-trolley", name: "Luggage Trolley", category: "Lobby", image: "/images/products/luggage-trolley.png" },
  { slug: "bath-tub", name: "Bath Tub", category: "Washroom", image: "/images/products/bath-tub.png" },
  { slug: "hair-dryer", name: "Hair Dryer", category: "Washroom", image: "/images/products/hair-dryer.png" },
  { slug: "magnifying-mirror", name: "Magnifying Mirror", category: "Washroom", image: "/images/products/magnifying-mirror.png" },
  { slug: "hand-dryer", name: "Hand Dryer", category: "Washroom", image: "/images/products/hand-dryer.png" },
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
  { image: "/images/gallery/exhibition-1.png", caption: "Hospitality India Expo, New Delhi", year: "2025" },
  { image: "/images/gallery/exhibition-2.png", caption: "HotelTech Summit, Mumbai", year: "2025" },
  { image: "/images/gallery/exhibition-3.png", caption: "Resort & Spa Showcase, Goa", year: "2024" },
  { image: "/images/gallery/exhibition-4.png", caption: "B2B Procurement Fair, Bengaluru", year: "2024" },
  { image: "/images/gallery/exhibition-5.png", caption: "Heritage Hotels Conclave, Udaipur", year: "2024" },
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
    image: "/images/blog/blog-1.png",
    date: "Jan 2026",
    readTime: "6 min",
  },
  {
    slug: "brass-details-guest-perception",
    title: "Why Brass Detailing Outperforms Chrome in Guest Perception",
    category: "Design",
    excerpt:
      "Eye-tracking studies show warm-metal accents increase perceived room value by 18%. A case for rethinking your hardware palette.",
    image: "/images/blog/blog-2.png",
    date: "Dec 2025",
    readTime: "4 min",
  },
  {
    slug: "amenity-trends-2026",
    title: "Five Amenity Trends Defining 2026 Hotel Renovations",
    category: "Trends",
    excerpt:
      "From in-room smart safes to weighted curtain hooks, the details that quietly move your TripAdvisor score.",
    image: "/images/blog/blog-3.png",
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
