"use client";

import { useEffect, useState, useRef } from "react";
import {
  LayoutGrid,
  Users,
  Award,
  Box,
  Info,
  Image as ImageIcon,
  Shield,
  Menu,
  LayoutPanelTop,
  Briefcase,
  Phone,
  Settings,
  Save,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Upload,
} from "lucide-react";

// Image compression utility — compresses before upload to avoid Vercel 413
async function compressImageClient(file: File, maxDim: number, quality: number): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: "image/jpeg" }));
          else resolve(file);
        }, "image/jpeg", quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary = "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors";
const btnSecondary = "rounded-lg bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 border border-white/15 transition-colors";

type CMSData = Record<string, any>;

const SECTIONS = [
  { key: "homepage:categories", label: "1. Product Categories", icon: LayoutGrid, desc: "Manage category cards on homepage" },
  { key: "homepage:brands", label: "2. Trusted Brands", icon: Users, desc: "Hotel brand logos" },
  { key: "homepage:certifications", label: "3. Certifications", icon: Award, desc: "Certificate images" },
  { key: "homepage:hero3d", label: "4. 3D Hero Section", icon: Box, desc: "3D model, heading, buttons" },
  { key: "homepage:whatWeSupply", label: "5. What We Supply", icon: LayoutGrid, desc: "Five categories section" },
  { key: "homepage:aboutUs", label: "6. About Us", icon: Info, desc: "About section content" },
  { key: "homepage:gallery", label: "7. Connecting Hospitality", icon: ImageIcon, desc: "Gallery images" },
  { key: "homepage:quality", label: "8. Commitment to Quality", icon: Shield, desc: "Quality cards" },
  { key: "header:nav", label: "9. Header / Navigation", icon: Menu, desc: "Menus, logo, top bar" },
  { key: "footer:config", label: "10. Footer", icon: LayoutPanelTop, desc: "Links, FAQ, social, contact" },
  { key: "career:page", label: "11. Career Page", icon: Briefcase, desc: "Banner, jobs, apply" },
  { key: "contact:page", label: "12. Contact Page", icon: Phone, desc: "Address, phone, map" },
  { key: "homepage:sections", label: "13. Section Visibility", icon: Settings, desc: "Enable/disable sections" },
];

// Default data for each section
const DEFAULTS: Record<string, any> = {
  "homepage:categories": {
    items: [
      { id: "cat-1", title: "Room Amenities", image: "", description: "Mini bars, kettles, safes, locks, hangers", link: "/products/room-amenities", order: 1, visible: true },
      { id: "cat-2", title: "Washroom Amenities", image: "", description: "Hair dryers, dispensers, mirrors, dryers", link: "/products/washroom-amenities", order: 2, visible: true },
      { id: "cat-3", title: "Lobby Items", image: "", description: "Trolleys, dustbins, Q managers, signage", link: "/products/lobby-items", order: 3, visible: true },
      { id: "cat-4", title: "Furniture", image: "", description: "Outdoor, guest room, restaurant furniture", link: "/products/furniture", order: 4, visible: true },
      { id: "cat-5", title: "Linen", image: "", description: "Room linen and bath linen", link: "/products/linen", order: 5, visible: true },
      { id: "cat-6", title: "Bath Tub", image: "", description: "Freestanding bath tubs", link: "/products/bath-tub", order: 6, visible: true },
      { id: "cat-7", title: "Amenities Tray Set", image: "", description: "Premium tray sets", link: "/products/amenities-tray-set", order: 7, visible: true },
      { id: "cat-8", title: "Space Pod", image: "", description: "Space pod structures", link: "/products/dome-space-pod", order: 8, visible: true },
      { id: "cat-9", title: "Dome", image: "", description: "Geodesic domes", link: "/products/dome-space-pod", order: 9, visible: true },
    ],
  },
  "homepage:brands": {
    items: [
      { id: "b1", name: "Radisson", logo: "", order: 1, visible: true },
      { id: "b2", name: "Holiday Inn", logo: "", order: 2, visible: true },
      { id: "b3", name: "Fairmont", logo: "", order: 3, visible: true },
      { id: "b4", name: "Sayaji Hotels", logo: "", order: 4, visible: true },
      { id: "b5", name: "Ramada Group", logo: "", order: 5, visible: true },
      { id: "b6", name: "Sunday Hotels", logo: "", order: 6, visible: true },
      { id: "b7", name: "7 Apple Hotels", logo: "", order: 7, visible: true },
      { id: "b8", name: "Club Mahindra", logo: "", order: 8, visible: true },
      { id: "b9", name: "Taj", logo: "", order: 9, visible: true },
      { id: "b10", name: "Ananta Hotels", logo: "", order: 10, visible: true },
      { id: "b11", name: "The Lords Inn", logo: "", order: 11, visible: true },
      { id: "b12", name: "The Derns Hotels & Resorts", logo: "", order: 12, visible: true },
      { id: "b13", name: "Swosti Group", logo: "", order: 13, visible: true },
    ],
  },
  "homepage:certifications": { items: [] },
  "homepage:hero3d": {
    heading: "LaxRee Amenities",
    subtitle: "India's most comprehensive hospitality procurement partner",
    primaryButtonText: "Request Quotation",
    primaryButtonLink: "/contact-us",
    secondaryButtonText: "Download Catalogue",
    secondaryButtonLink: "/catalogue",
    modelUrl: "",
    background: "",
    visible: true,
  },
  "homepage:whatWeSupply": {
    heading: "What We Supply",
    subtitle: "Five Categories. One Standard.",
    items: [
      { id: "w1", title: "Room Amenities", image: "", description: "", order: 1, visible: true },
      { id: "w2", title: "Washroom Amenities", image: "", description: "", order: 2, visible: true },
      { id: "w3", title: "Lobby Items", image: "", description: "", order: 3, visible: true },
      { id: "w4", title: "Furniture", image: "", description: "", order: 4, visible: true },
      { id: "w5", title: "Linen", image: "", description: "", order: 5, visible: true },
    ],
  },
  "homepage:aboutUs": {
    heading: "About LaxRee",
    subHeading: "11 years of hospitality craftsmanship",
    description: "Founded in Ajmer, Rajasthan, LaxRee Amenities has grown into India's most comprehensive hospitality procurement partner.",
    ownerImage: "",
    ownerName: "",
    ownerDesignation: "",
    ownerMessage: "",
    backgroundImage: "",
    buttonText: "Learn More",
    buttonLink: "/about-us",
    visible: true,
  },
  "homepage:gallery": {
    heading: "Connecting with Hospitality",
    description: "Our presence across India's hospitality landscape",
    images: [],
  },
  "homepage:quality": {
    heading: "Commitment to Quality",
    description: "Seven certifications. Zero compromises.",
    cards: [],
  },
  "header:nav": {
    logo: "/images/laxree-logo.png",
    topBar: "Hotel Supplies Redefined",
    menus: [
      { id: "m1", label: "Home", link: "/", order: 1, visible: true, dropdown: [] },
      { id: "m2", label: "About Us", link: "/about-us", order: 2, visible: true, dropdown: [] },
      { id: "m3", label: "Products", link: "/products", order: 3, visible: true, dropdown: [] },
      { id: "m4", label: "Catalogue", link: "/catalogue", order: 4, visible: true, dropdown: [] },
      { id: "m5", label: "Career", link: "/career", order: 5, visible: true, dropdown: [] },
      { id: "m6", label: "Contact Us", link: "/contact-us", order: 6, visible: true, dropdown: [] },
    ],
    ctaButton: { text: "Enquire Now", visible: true },
  },
  "footer:config": {
    companyLinks: [
      { id: "fl1", label: "About Us", link: "/about-us", order: 1, visible: true },
      { id: "fl2", label: "Clients", link: "/clients", order: 2, visible: true },
      { id: "fl3", label: "Dealers", link: "/dealers", order: 3, visible: true },
      { id: "fl4", label: "Catalogue", link: "/catalogue", order: 4, visible: true },
      { id: "fl5", label: "Career", link: "/career", order: 5, visible: true },
      { id: "fl6", label: "Contact", link: "/contact-us", order: 6, visible: true },
    ],
    quickLinks: [
      { id: "ql1", label: "FAQ", link: "/faq", order: 1, visible: true },
      { id: "ql2", label: "Privacy Policy", link: "/privacy", order: 2, visible: true },
    ],
    faqs: [],
    social: {
      facebook: "https://facebook.com",
      x: "https://x.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
    contact: {
      phone: "+91-92516 83662",
      email: "contactus@laxree.com",
      address: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    },
    copyright: "© 2026 LaxRee Amenities. All rights reserved.",
    newsletter: { enabled: true, title: "Subscribe to our newsletter" },
  },
  "career:page": {
    banner: "",
    heading: "Build Your Career in Hospitality Procurement",
    description: "Join LaxRee Amenities — where craftsmanship meets scale.",
    jobs: [],
    applyButtonText: "Apply Now",
    seo: { title: "Career — LaxRee Amenities", description: "Join our team" },
  },
  "contact:page": {
    banner: "",
    heading: "Get in Touch",
    description: "Have a question? We're here to help.",
    address: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    phone: "+91-92516 83662",
    email: "contactus@laxree.com",
    mapEmbed: "",
    workingHours: "Mon-Sat: 9:30 AM - 6:30 PM",
    formText: "Fill out the form below and our team will reach out within 24 hours.",
    social: { facebook: "", x: "", youtube: "", linkedin: "" },
  },
  "homepage:sections": {
    sections: [
      { id: "hero", name: "3D Hero", order: 1, visible: true },
      { id: "trustMarquee", name: "Trust Marquee", order: 2, visible: true },
      { id: "categoryBento", name: "Categories", order: 3, visible: true },
      { id: "aboutUs", name: "About Us", order: 4, visible: true },
      { id: "ownerMessage", name: "Owner Message", order: 5, visible: true },
      { id: "productSpotlight", name: "Product Spotlight", order: 6, visible: true },
      { id: "categoryExplorer", name: "Category Explorer", order: 7, visible: true },
      { id: "clientsTestimonials", name: "Clients & Testimonials", order: 8, visible: true },
      { id: "ourPresence", name: "Our Presence", order: 9, visible: true },
      { id: "certifications", name: "Certifications", order: 10, visible: true },
      { id: "whyChoose", name: "Why Choose LaxRee", order: 11, visible: true },
      { id: "hospitalityTrends", name: "Hospitality Trends", order: 12, visible: true },
      { id: "leadCta", name: "Lead CTA", order: 13, visible: true },
    ],
  },
};

export default function CMSPage() {
  const [cmsData, setCmsData] = useState<CMSData>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.content) {
          // Merge with defaults
          const merged = { ...DEFAULTS };
          for (const key of Object.keys(DEFAULTS)) {
            if (data.content[key]) {
              merged[key] = data.content[key];
            }
          }
          setCmsData(merged);
        } else {
          setCmsData(DEFAULTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setCmsData(DEFAULTS);
        setLoading(false);
      });
  }, []);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const saveSection = async (key: string) => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: cmsData[key] }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast("ok", `${SECTIONS.find((s) => s.key === key)?.label} saved successfully!`);
      } else {
        showToast("err", "Failed to save");
      }
    } catch {
      showToast("err", "Network error");
    }
  };

  const updateSection = (key: string, value: any) => {
    setCmsData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-600/30 border-t-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-1">Website CMS</h1>
      <p className="text-sm text-gray-400 mb-6">
        Manage all website content — sections, brands, certifications, navigation, footer, and more.
      </p>

      {/* Section grid */}
      {!activeSection && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const hasData = cmsData[section.key] !== undefined;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/40 rounded-xl p-5 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-5 w-5 text-yellow-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{section.label}</h3>
                </div>
                <p className="text-xs text-gray-400">{section.desc}</p>
                {hasData && (
                  <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                    Configured
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Section editor */}
      {activeSection && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveSection(null)} className={btnSecondary}>
                ← Back
              </button>
              <h2 className="text-lg font-semibold text-white">
                {SECTIONS.find((s) => s.key === activeSection)?.label}
              </h2>
            </div>
            <button onClick={() => saveSection(activeSection)} className={btnPrimary}>
              <Save className="inline h-4 w-4 mr-1" /> Save Changes
            </button>
          </div>

          <SectionEditor
            sectionKey={activeSection}
            data={cmsData[activeSection]}
            onChange={(value) => updateSection(activeSection, value)}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg px-5 py-3 shadow-2xl border"
          style={{
            backgroundColor: toast.kind === "ok" ? "#1a4d3a" : "#5c1d1d",
            borderColor: toast.kind === "ok" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.kind === "ok" ? <Check className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-red-400" />}
          <span className="text-sm text-white font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Editor — renders the appropriate editor for each section
// ─────────────────────────────────────────────────────────────
function SectionEditor({ sectionKey, data, onChange }: { sectionKey: string; data: any; onChange: (value: any) => void }) {
  // Items list editor (for categories, brands, certifications, etc.)
  if (data?.items !== undefined) {
    return <ItemsEditor data={data} onChange={onChange} itemFields={getItemFields(sectionKey)} />;
  }

  // Key-value editor (for hero3d, aboutUs, career, contact, etc.)
  return <KeyValueEditor data={data} onChange={onChange} fields={getKeyValueFields(sectionKey)} />;
}

function getItemFields(key: string): { name: string; label: string; type: string }[] {
  const fieldMap: Record<string, { name: string; label: string; type: string }[]> = {
    "homepage:categories": [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image URL", type: "image" },
      { name: "link", label: "Link", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "visible", label: "Visible", type: "toggle" },
    ],
    "homepage:brands": [
      { name: "name", label: "Brand Name", type: "text" },
      { name: "logo", label: "Logo URL", type: "image" },
      { name: "order", label: "Order", type: "number" },
      { name: "visible", label: "Visible", type: "toggle" },
    ],
    "homepage:certifications": [
      { name: "title", label: "Certificate Name", type: "text" },
      { name: "image", label: "Certificate Image", type: "image" },
      { name: "order", label: "Order", type: "number" },
      { name: "visible", label: "Visible", type: "toggle" },
    ],
  };
  return fieldMap[key] || [
    { name: "title", label: "Title", type: "text" },
    { name: "image", label: "Image", type: "image" },
    { name: "order", label: "Order", type: "number" },
    { name: "visible", label: "Visible", type: "toggle" },
  ];
}

function getKeyValueFields(key: string): { name: string; label: string; type: string }[] {
  const fieldMap: Record<string, { name: string; label: string; type: string }[]> = {
    "homepage:hero3d": [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "primaryButtonText", label: "Primary Button Text", type: "text" },
      { name: "primaryButtonLink", label: "Primary Button Link", type: "text" },
      { name: "secondaryButtonText", label: "Secondary Button Text", type: "text" },
      { name: "secondaryButtonLink", label: "Secondary Button Link", type: "text" },
      { name: "modelUrl", label: "3D Model URL", type: "text" },
      { name: "background", label: "Background Image", type: "image" },
      { name: "visible", label: "Section Visible", type: "toggle" },
    ],
    "homepage:aboutUs": [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subHeading", label: "Sub Heading", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "ownerImage", label: "Owner Image", type: "image" },
      { name: "ownerName", label: "Owner Name", type: "text" },
      { name: "ownerDesignation", label: "Owner Designation", type: "text" },
      { name: "ownerMessage", label: "Owner Message", type: "textarea" },
      { name: "backgroundImage", label: "Background Image", type: "image" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "buttonLink", label: "Button Link", type: "text" },
      { name: "visible", label: "Section Visible", type: "toggle" },
    ],
    "career:page": [
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "banner", label: "Banner Image", type: "image" },
      { name: "applyButtonText", label: "Apply Button Text", type: "text" },
    ],
    "contact:page": [
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "workingHours", label: "Working Hours", type: "text" },
      { name: "formText", label: "Form Text", type: "textarea" },
      { name: "mapEmbed", label: "Google Map Embed URL", type: "text" },
    ],
  };
  return fieldMap[key] || [];
}

// ─────────────────────────────────────────────────────────────
// Items Editor — for list-based sections (categories, brands, etc.)
// ─────────────────────────────────────────────────────────────
function ItemsEditor({ data, onChange, itemFields }: { data: any; onChange: (v: any) => void; itemFields: any[] }) {
  const items: any[] = data.items || [];

  const addItem = () => {
    const newItem: any = { id: `item-${Date.now()}`, order: items.length + 1, visible: true };
    itemFields.forEach((f) => {
      if (f.name !== "id" && f.name !== "order" && f.name !== "visible") {
        newItem[f.name] = "";
      }
    });
    onChange({ ...data, items: [...items, newItem] });
  };

  const updateItem = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      items: items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: items.filter((item) => item.id !== id) });
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    // Update order
    newItems.forEach((item, i) => (item.order = i + 1));
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Item {idx + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => moveItem(item.id, "up")} className="p-1 text-gray-400 hover:text-white">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button onClick={() => moveItem(item.id, "down")} className="p-1 text-gray-400 hover:text-white">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {itemFields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "col-span-2" : ""}>
                <label className={labelClass}>{field.label}</label>
                {field.type === "text" && (
                  <input
                    type="text"
                    value={item[field.name] || ""}
                    onChange={(e) => updateItem(item.id, field.name, e.target.value)}
                    className={inputClass}
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    value={item[field.name] || 0}
                    onChange={(e) => updateItem(item.id, field.name, Number(e.target.value))}
                    className={inputClass}
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    value={item[field.name] || ""}
                    onChange={(e) => updateItem(item.id, field.name, e.target.value)}
                    rows={2}
                    className={inputClass + " resize-none"}
                  />
                )}
                {field.type === "image" && (
                  <ImageUpload
                    value={item[field.name] || ""}
                    onChange={(val) => updateItem(item.id, field.name, val)}
                    model={item.id}
                  />
                )}
                {field.type === "toggle" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item[field.name] ?? true}
                      onChange={(e) => updateItem(item.id, field.name, e.target.checked)}
                      className="h-4 w-4 accent-yellow-500"
                    />
                    <span className="text-sm text-white">{item[field.name] ? "Visible" : "Hidden"}</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} className={btnSecondary}>
        <Plus className="inline h-4 w-4 mr-1" /> Add New Item
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Key-Value Editor — for object-based sections (hero, about, etc.)
// ─────────────────────────────────────────────────────────────
function KeyValueEditor({ data, onChange, fields }: { data: any; onChange: (v: any) => void; fields: any[] }) {
  const update = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      {fields.map((field) => (
        <div key={field.name} className={field.type === "textarea" ? "col-span-2" : ""}>
          <label className={labelClass}>{field.label}</label>
          {field.type === "text" && (
            <input
              type="text"
              value={data?.[field.name] || ""}
              onChange={(e) => update(field.name, e.target.value)}
              className={inputClass}
            />
          )}
          {field.type === "textarea" && (
            <textarea
              value={data?.[field.name] || ""}
              onChange={(e) => update(field.name, e.target.value)}
              rows={3}
              className={inputClass + " resize-none"}
            />
          )}
          {field.type === "image" && (
            <ImageUpload
              value={data?.[field.name] || ""}
              onChange={(val) => update(field.name, val)}
              model={field.name}
            />
          )}
          {field.type === "toggle" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data?.[field.name] ?? true}
                onChange={(e) => update(field.name, e.target.checked)}
                className="h-4 w-4 accent-yellow-500"
              />
              <span className="text-sm text-white">{data?.[field.name] ? "Enabled" : "Disabled"}</span>
            </label>
          )}
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-sm text-gray-400">This section uses a complex structure. Edit via JSON below:</p>
      )}
      {fields.length === 0 && (
        <textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              // ignore parse errors
            }
          }}
          rows={15}
          className={inputClass + " font-mono text-xs resize-none"}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Image Upload Component
// ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, model }: { value: string; onChange: (v: string) => void; model: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Compress image if over 1MB
      let uploadFile = file;
      if (file.size > 1 * 1024 * 1024) {
        uploadFile = await compressImageClient(file, 1024, 0.85);
      }
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("model", model || "cms");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        if (res.status === 413) {
          alert("Image too large. Please use a smaller image (max 4MB).");
        } else {
          alert(`Upload failed (${res.status})`);
        }
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        onChange(data.imageUrl);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      alert("Upload error: " + (err instanceof Error ? err.message : "unknown"));
    }
    setUploading(false);
  };

  return (
    <div className="flex items-start gap-3">
      <div className="h-16 w-16 shrink-0 rounded-lg border border-white/15 bg-gray-800 overflow-hidden flex items-center justify-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <ImageIcon className="h-5 w-5 text-gray-600" />
        )}
      </div>
      <div className="flex-1">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1 rounded-lg bg-white/10 text-white px-3 py-1.5 text-xs hover:bg-white/20 border border-white/15 disabled:opacity-50">
          {uploading ? "Uploading..." : <><Upload className="h-3 w-3" /> Upload</>}
        </button>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" className={inputClass + " mt-1 text-xs"} />
      </div>
    </div>
  );
}
