"use client";

import { Settings, Image as ImageIcon, Type, Palette, FileText } from "lucide-react";

export default function AdminContentPage() {
  const sections = [
    {
      title: "Homepage Hero",
      desc: "Edit hero headline, subheadline, CTAs, and 3D model",
      icon: Type,
      items: ["Headline text", "Subheadline", "CTA buttons", "3D model URL"],
      available: false,
    },
    {
      title: "Product Images",
      desc: "Replace product photos for minibars, safes, kettles, etc.",
      icon: ImageIcon,
      items: ["All 9 product images", "Category images", "Gallery images"],
      available: false,
    },
    {
      title: "Site Theme",
      desc: "Customize colors, fonts, and visual style",
      icon: Palette,
      items: ["Charcoal color", "Ivory color", "Brass accent", "Font families"],
      available: false,
    },
    {
      title: "SEO Settings",
      desc: "Manage meta tags, keywords, and structured data",
      icon: FileText,
      items: ["Page titles", "Meta descriptions", "Keywords", "OpenGraph images"],
      available: false,
    },
    {
      title: "Company Info",
      desc: "Update address, phone, email, social links",
      icon: Settings,
      items: ["Address", "Phone numbers", "Email addresses", "Social media links"],
      available: false,
    },
    {
      title: "Blog Posts",
      desc: "Create, edit, and publish blog articles",
      icon: FileText,
      items: ["12 blog posts", "Categories", "Authors", "Featured images"],
      available: true,
      href: "/admin/blog",
    },
  ];

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
            <div
              key={section.title}
              className={`glass-on-charcoal rounded-2xl p-6 transition-all ${
                section.available ? "cursor-pointer hover:border-brass/40" : "opacity-60"
              }`}
              onClick={() => section.available && section.href && (window.location.href = section.href)}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass/10">
                <Icon className="h-5 w-5 text-brass" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg text-ivory mb-1">{section.title}</h3>
              <p className="font-body text-[13px] text-sand mb-4">{section.desc}</p>
              <ul className="flex flex-col gap-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-body text-[12px] text-sand">
                    <span className="h-1 w-1 rounded-full bg-brass/50" />
                    {item}
                  </li>
                ))}
              </ul>
              {!section.available && (
                <p className="mt-4 font-mono text-[10px] text-sand/50 uppercase tracking-wider">
                  Coming Soon
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 glass-on-charcoal rounded-2xl p-6">
        <h2 className="font-display text-lg text-ivory mb-3">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-mono text-2xl text-brass font-bold">12</p>
            <p className="font-body text-[12px] text-sand">Blog Posts</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-brass font-bold">28</p>
            <p className="font-body text-[12px] text-sand">Products</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-brass font-bold">5</p>
            <p className="font-body text-[12px] text-sand">Categories</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-brass font-bold">17</p>
            <p className="font-body text-[12px] text-sand">Pages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
