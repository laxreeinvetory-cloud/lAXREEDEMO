"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Download,
  FileText,
  Clock,
  Settings,
  TrendingUp,
  ArrowRight,
  FileDown,
  Lock,
  type LucideIcon,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import {
  CATEGORIES,
  ENQUIRY_CATEGORIES,
  CATALOGUES,
  type CatalogueFile,
} from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";

const DISCOUNT_CODE = "LAXREE10";

const WHATS_INSIDE = [
  "Full product specifications",
  "Pricing tiers by volume",
  "Lead times & delivery info",
  "Custom manufacturing capabilities",
  "Certification documents",
];

const WHY_REQUEST: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: "Full Specifications",
    body: "Technical drawings, materials, dimensions — every SKU documented to tender-ready detail.",
  },
  {
    icon: TrendingUp,
    title: "Volume Pricing",
    body: "Tiered pricing for 50, 100 and 500+ unit orders. See your per-room cost upfront.",
  },
  {
    icon: Clock,
    title: "Lead Times",
    body: "Factory-direct delivery estimates for every category, indexed by order size.",
  },
  {
    icon: Settings,
    title: "Custom Options",
    body: "OEM customisation capabilities — branding, finish, dimensions and packaging.",
  },
];

/* ─────────────────────────────────────────────────────────────
   CategoryCatalogueCard — one card per catalogue PDF
   Shows the category name, description, file size, and a
   download button. Available PDFs download directly;
   unavailable ones open the enquiry modal.
   ───────────────────────────────────────────────────────────── */
function CategoryCatalogueCard({
  catalogue,
  index,
}: {
  catalogue: CatalogueFile;
  index: number;
}) {
  const { openModal } = useEnquiry();
  const isMaster = catalogue.category === "master";

  const handleDownload = () => {
    if (catalogue.available) {
      // Direct download — creates a temporary anchor and clicks it
      const link = document.createElement("a");
      link.href = `/catalogues/${catalogue.fileName}`;
      link.download = catalogue.fileName;
      link.click();
    } else {
      // Open enquiry modal for unavailable catalogues
      openModal("enquiry");
    }
  };

  // Find the matching category image (master uses the amenities image as a cover)
  const categoryData = CATEGORIES.find((c) => c.slug === catalogue.category);
  const image = isMaster
    ? "/images/about/factory.jpg"
    : categoryData?.image ?? "/images/about/factory.jpg";

  return (
    <FadeIn delay={index * 0.06}>
      <GlassCard
        theme={isMaster ? "charcoal" : "charcoal"}
        radius="24px"
        className={`flex h-full flex-col overflow-hidden ${isMaster ? "lg:col-span-2 ring-1 ring-brass/40" : ""}`}
      >
        {/* Cover image */}
        <div className="relative aspect-[16/8] overflow-hidden border-b border-white/10">
          <img
            src={image}
            alt={catalogue.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-60 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
          {/* Master badge */}
          {isMaster && (
            <span className="absolute left-5 top-5 rounded-full bg-brass px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-charcoal">
              ★ Complete Catalogue
            </span>
          )}
          {/* Availability badge */}
          <span
            className={`absolute right-5 top-5 rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider ${
              catalogue.available
                ? "bg-emerald/20 text-emerald-300 border border-emerald/40"
                : "bg-white/10 text-sand border border-white/15"
            }`}
          >
            {catalogue.available ? "Available" : "Coming Soon"}
          </span>
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3
              className={`font-display text-ivory leading-tight ${isMaster ? "text-2xl md:text-3xl" : "text-xl"}`}
            >
              {catalogue.name}
            </h3>
            <div className="mt-2 flex items-center gap-4">
              <span className="data-label text-[11px] text-brass">
                {catalogue.fileSize}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-sand">
                <FileDown className="h-3 w-3" />
                PDF Download
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <p className="font-body text-[14px] leading-relaxed text-sand">
            {catalogue.description}
          </p>

          <button
            type="button"
            onClick={handleDownload}
            className={`mt-auto flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium uppercase tracking-wider transition-all duration-300 ${
              catalogue.available
                ? "pill pill-brass cursor-pointer"
                : "pill pill-ghost-brass cursor-pointer"
            }`}
          >
            {catalogue.available ? (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Request Catalogue
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────
   QuickLeadForm — compact lead capture for discount code
   ───────────────────────────────────────────────────────────── */
function QuickLeadForm() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    category: ENQUIRY_CATEGORIES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 text-ink placeholder:text-ink-muted/60 transition-colors duration-200 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass";
  const labelClass = "data-label mb-1.5 block text-[11px] text-ink-muted";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: `Catalogue discount code request · Category: ${form.category}`,
          category: form.category,
          source: "catalogue-discount",
        }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      notify("success", "Code unlocked — check your WhatsApp shortly.");
      setSubmitted(true);
    } catch {
      notify("error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(DISCOUNT_CODE).then(
        () => notify("info", "Code copied to clipboard"),
        () => {}
      );
    }
  };

  if (submitted) {
    return (
      <GlassCard
        theme="ivory"
        radius="24px"
        className="flex flex-col gap-5 p-8 md:p-10"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
            <Check className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="data-label text-[11px] text-ink-muted">
            DISCOUNT UNLOCKED
          </span>
        </div>
        <h3 className="font-display text-[24px] font-medium leading-tight text-ink">
          Your 10% code is ready, {form.name.split(" ")[0] || "there"}.
        </h3>
        <div className="rounded-2xl border border-brass/40 bg-brass/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-brass">
            <Check className="h-4 w-4" strokeWidth={2.2} />
            <span className="data-label text-[10px]">YOUR 10% OFF CODE</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span
              className="font-mono font-medium tracking-[0.15em] text-brass"
              style={{ fontSize: "28px" }}
            >
              {DISCOUNT_CODE}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="data-label rounded-full border border-brass/50 px-4 py-2 text-[10px] text-brass transition-colors hover:bg-brass hover:text-charcoal"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-[11px] text-ink-muted">
            Valid for 30 days. Apply at checkout for any catalogue order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", phone: "", email: "", category: ENQUIRY_CATEGORIES[0] });
          }}
          className="data-label text-center text-[11px] text-ink-muted transition-colors hover:text-brass"
        >
          Submit another request
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      theme="ivory"
      radius="24px"
      className="flex flex-col gap-5 p-8 md:p-10"
    >
      <div>
        <h3 className="font-display text-[26px] font-medium leading-tight text-ink">
          Unlock 10% Off Your First Order
        </h3>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
          Enter your details to receive a discount code valid for 30 days. We&apos;ll also WhatsApp you the latest pricing.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cat-name" className={labelClass}>Name *</label>
            <input
              id="cat-name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="cat-phone" className={labelClass}>Phone Number *</label>
            <input
              id="cat-phone"
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+91 ..."
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="cat-email" className={labelClass}>Email</label>
          <input
            id="cat-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@hotel.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cat-category" className={labelClass}>Category of Interest</label>
          <select
            id="cat-category"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputClass}
          >
            {ENQUIRY_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ivory text-ink">{c}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting || !form.name.trim() || !form.phone.trim()}
          className="pill pill-brass mt-2 flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting…" : (<>Unlock Discount <ArrowRight className="h-4 w-4" /></>)}
        </button>
        <p className="text-center text-[11px] text-ink-muted">
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Catalogue page — category-wise downloads
   ───────────────────────────────────────────────────────────── */
export default function CataloguePage() {
  const masterCatalogue = CATALOGUES.find((c) => c.category === "master")!;
  const categoryCatalogues = CATALOGUES.filter((c) => c.category !== "master");

  return (
    <>
      {/* ─────────────────────────────────────────────
          Section 1 — PageHero (charcoal)
          ───────────────────────────────────────────── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Catalogue" }]}
        eyebrow="PRODUCT CATALOGUE"
        title="Download Catalogues by Category"
        subtitle="Pick the category you need — or grab the complete master catalogue. Real PDFs, ready to download instantly. No waiting, no email gate."
      >
        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">700+ SKUs</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">2 PDFs Available Now</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">No Email Required</span>
          </div>
        </div>
      </PageHero>

      {/* ─────────────────────────────────────────────
          Section 2 — Master Catalogue (charcoal, continues from hero)
          Featured large card for the complete catalogue
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal pb-12 md:pb-16">
        <div className="container-laxree">
          <FadeIn>
            <div className="mb-8">
              <span className="eyebrow text-brass block mb-3">★ COMPLETE CATALOGUE</span>
              <h2
                className="font-display text-ivory leading-[1.1]"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 500 }}
              >
                The Full Master Catalogue
              </h2>
              <p className="mt-3 max-w-2xl font-body text-sand text-base">
                Everything in one PDF — all five categories, 700+ SKUs, full specs and pricing. Download it now.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <CategoryCatalogueCard catalogue={masterCatalogue} index={0} />
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 3 — Category-wise catalogues (ivory)
          Grid of 5 category-specific catalogues
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="CATEGORY-WISE DOWNLOADS"
            title="Download by Category"
            body="Only need one product line? Grab the specific catalogue for your project. Available PDFs download instantly — coming-soon categories open an enquiry so we can send it directly."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCatalogues.map((cat, i) => (
              <CategoryCatalogueCard
                key={cat.slug}
                catalogue={cat}
                index={i + 1}
              />
            ))}
          </div>

          {/* Note about availability */}
          <FadeIn delay={0.3}>
            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/60 p-5 max-w-2xl mx-auto">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brass/15 text-brass">
                <FileText className="h-3.5 w-3.5" />
              </span>
              <p className="font-body text-[13px] leading-relaxed text-ink-muted">
                <strong className="text-ink">Available now:</strong> Master Catalogue and Roofing Catalogue are ready to download. Amenities, Furniture, Linen and Dome catalogues are being finalised — click &ldquo;Request Catalogue&rdquo; and we&apos;ll send the PDF directly to your WhatsApp.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 4 — What's inside + Discount form (charcoal)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            {/* Left — what's inside */}
            <FadeIn>
              <div>
                <SectionHeading
                  theme="charcoal"
                  eyebrow="WHAT'S INSIDE"
                  title="More Than a Price List"
                />
                <ul className="mt-8 flex flex-col gap-4">
                  {WHATS_INSIDE.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-body text-[15px] text-sand"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brass/15 text-brass">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Why request grid */}
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {WHY_REQUEST.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div
                        key={b.title}
                        className="glass-on-charcoal rounded-2xl p-5"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/15 text-brass">
                          <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                        </span>
                        <h4 className="mt-3 font-display text-[16px] font-medium text-ivory">
                          {b.title}
                        </h4>
                        <p className="mt-1.5 font-body text-[13px] leading-relaxed text-sand">
                          {b.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {/* Right — discount form */}
            <FadeIn delay={0.1}>
              <QuickLeadForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 5 — PageCTA (emerald)
          ───────────────────────────────────────────── */}
      <PageCTA
        title="Need a printed catalogue couriered?"
        subtitle="We'll send a physical copy to your hotel address. Just ask."
      />
    </>
  );
}
