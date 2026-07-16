"use client";

import Link from "next/link";
import {
  Settings,
  Image as ImageIcon,
  Type,
  Palette,
  FileText,
  Package,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

type SectionCard = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: string[];
  href: string;
  available: true;
};

const sections: SectionCard[] = [
  {
    title: "Homepage Hero",
    desc: "Edit hero headline, subheadline, CTAs, and stats",
    icon: Type,
    items: ["Eyebrow text", "Hero title", "Subtitle", "CTA buttons", "Hero stats"],
    href: "/admin/appearance",
    available: true,
  },
  {
    title: "Products & Categories",
    desc: "Add, edit, and delete products with specs, prices, and images",
    icon: Package,
    items: ["All products", "Categories", "Specifications", "Prices", "Featured items"],
    href: "/admin/products",
    available: true,
  },
  {
    title: "Blog Posts",
    desc: "Create, edit, and publish blog articles",
    icon: FileText,
    items: ["Blog posts", "Categories", "Authors", "Featured images"],
    href: "/admin/blog",
    available: true,
  },
  {
    title: "Site Theme",
    desc: "Customize brand colors, fonts, and corner radii with live preview",
    icon: Palette,
    items: ["Brand colors", "Font families", "Border radii", "Live preview"],
    href: "/admin/appearance",
    available: true,
  },
  {
    title: "SEO Settings",
    desc: "Manage meta tags, keywords, and per-page SEO",
    icon: Search,
    items: ["Site title", "Meta description", "Keywords", "Per-page SEO", "OpenGraph"],
    href: "/admin/seo",
    available: true,
  },
  {
    title: "Company Info",
    desc: "Update address, phone numbers, email, and social media links",
    icon: Settings,
    items: ["Address", "Phone numbers", "Email addresses", "Social media links", "WhatsApp"],
    href: "/admin/seo",
    available: true,
  },
];

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-2">Content Management</h1>
      <p className="font-body text-sm text-sand mb-8">
        Manage all editable content on your website. Click any section to start editing.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              href={section.href}
              className="glass-on-charcoal rounded-2xl p-6 transition-all hover:border-brass/40 hover:translate-y-[-2px] group"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass/10">
                <Icon className="h-5 w-5 text-brass" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg text-ivory mb-1">{section.title}</h3>
              <p className="font-body text-[13px] text-sand mb-4">{section.desc}</p>
              <ul className="flex flex-col gap-1.5 mb-4">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-body text-[12px] text-sand"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-400/70" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-brass group-hover:gap-2.5 transition-all">
                Open Editor
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 glass-on-charcoal rounded-2xl p-6">
        <h2 className="font-display text-lg text-ivory mb-1">Content Hub Overview</h2>
        <p className="font-body text-[13px] text-sand mb-4">
          Everything above is now editable. Your changes are saved to the database and persist
          across deployments.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/blog"
            className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="font-mono text-2xl text-brass font-bold">Blog</p>
            <p className="font-body text-[12px] text-sand">Posts &amp; articles</p>
          </a>
          <a
            href="/admin/products"
            className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="font-mono text-2xl text-brass font-bold">Products</p>
            <p className="font-body text-[12px] text-sand">Catalog &amp; specs</p>
          </a>
          <a
            href="/admin/appearance"
            className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="font-mono text-2xl text-brass font-bold">Theme</p>
            <p className="font-body text-[12px] text-sand">Colors &amp; fonts</p>
          </a>
          <a
            href="/admin/seo"
            className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="font-mono text-2xl text-brass font-bold">SEO</p>
            <p className="font-body text-[12px] text-sand">Meta &amp; company</p>
          </a>
        </div>
      </div>
    </div>
  );
}
