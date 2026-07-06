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
  type LucideIcon,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import { CATEGORIES, ENQUIRY_CATEGORIES } from "@/lib/laxree/site-data";
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
   CatalogueForm — controlled client form, POSTs to /api/lead
   ───────────────────────────────────────────────────────────── */
function CatalogueForm() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    category: ENQUIRY_CATEGORIES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 text-ink placeholder:text-ink-muted/60 transition-colors duration-200 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass";
  const labelClass =
    "data-label mb-1.5 block text-[11px] text-ink-muted";

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.company
            ? `Hotel/Company: ${form.company} · Category: ${form.category}`
            : `Category: ${form.category}`,
          category: form.category,
          source: "catalogue-page",
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "Request failed");
      }
      notify(
        "success",
        "Catalogue request received — check your WhatsApp shortly."
      );
      setSubmitted(true);
    } catch (err) {
      notify(
        "error",
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
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
        className="flex flex-col gap-6 p-8 md:p-10"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
            <Check className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="data-label text-[11px] text-ink-muted">
            CATALOGUE UNLOCKED
          </span>
        </div>

        <h3 className="font-display text-[24px] font-medium leading-tight text-ink">
          Your catalogue is ready, {form.name.split(" ")[0] || "there"}.
        </h3>
        <p className="font-body text-[14px] leading-relaxed text-ink-muted">
          We&apos;ve sent the 2026 LaxRee Catalogue PDF to your WhatsApp. Your
          10% discount code is below — apply it at checkout for any order placed
          in the next 30 days.
        </p>

        {/* Discount code reveal */}
        <div className="rounded-2xl border border-brass/40 bg-brass/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-brass">
            <Check className="h-4 w-4" strokeWidth={2.2} />
            <span className="data-label text-[10px]">
              YOUR 10% OFF CODE
            </span>
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
            Valid for 30 days from today.
          </p>
        </div>

        <a
          href="#"
          onClick={(e) => {
            // Placeholder — no real PDF yet
            e.preventDefault();
            notify("info", "Download will start once the PDF is published.");
          }}
          className="pill pill-brass flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[13px]"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              phone: "",
              email: "",
              company: "",
              category: ENQUIRY_CATEGORIES[0],
            });
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
          Get Instant Access + 10% Off Code
        </h3>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
          Enter your details below. We&apos;ll WhatsApp the catalogue PDF and a
          discount code valid for 30 days.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cat-name" className={labelClass}>
              Name *
            </label>
            <input
              id="cat-name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="cat-phone" className={labelClass}>
              Phone Number *
            </label>
            <input
              id="cat-phone"
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 ..."
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cat-email" className={labelClass}>
            Email
          </label>
          <input
            id="cat-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@hotel.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cat-company" className={labelClass}>
            Hotel / Company Name
          </label>
          <input
            id="cat-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Hotel or company"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cat-category" className={labelClass}>
            Category of Interest
          </label>
          <select
            id="cat-category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className={inputClass}
          >
            {ENQUIRY_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ivory text-ink">
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || !form.name.trim() || !form.phone.trim()}
          className="pill pill-brass mt-2 flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            "Submitting…"
          ) : (
            <>
              Download Catalogue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-ink-muted">
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Catalogue page
   ───────────────────────────────────────────────────────────── */
export default function CataloguePage() {
  return (
    <>
      {/* ─────────────────────────────────────────────
          Section 1 — PageHero (charcoal)
          ───────────────────────────────────────────── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Catalogue" }]}
        eyebrow="PRODUCT CATALOGUE"
        title="Download the 2026 LaxRee Catalogue"
        subtitle="700+ SKUs across Amenities, Furniture, Linen, Roofing and Dome. Full specifications, pricing tiers, and lead times."
      />

      {/* ─────────────────────────────────────────────
          Section 2 — Catalogue preview + download form (ivory)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            {/* Left — catalogue preview */}
            <FadeIn>
              <div className="flex flex-col gap-8">
                {/* Stylised catalogue cover */}
                <div
                  className="relative overflow-hidden rounded-[24px] border border-ink/10 p-10 md:p-14"
                  style={{
                    background:
                      "linear-gradient(160deg, #12100d 0%, #1a1712 60%, #2a241c 100%)",
                  }}
                >
                  {/* Brass accent corners */}
                  <span
                    aria-hidden
                    className="absolute left-6 top-6 h-6 w-6 border-l-2 border-t-2 border-brass"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-6 right-6 h-6 w-6 border-b-2 border-r-2 border-brass"
                  />

                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-brass text-[18px]">◆</span>
                      <span className="data-label text-[10px] text-sand">
                        LAXREE AMENITIES
                      </span>
                    </div>
                    <h3
                      className="font-display text-ivory"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 600,
                        lineHeight: 1.05,
                      }}
                    >
                      2026
                      <br />
                      <span className="text-brass-gradient">Catalogue</span>
                    </h3>
                    <div className="hairline-brass w-32" />
                    <div className="flex flex-col gap-1">
                      <span
                        className="font-mono font-medium text-ivory"
                        style={{ fontSize: "18px" }}
                      >
                        700+ SKUs
                      </span>
                      <span className="data-label text-[10px] text-sand">
                        Amenities · Furniture · Linen · Roofing · Dome
                      </span>
                    </div>
                  </div>

                  {/* Floating shadow card */}
                  <span
                    aria-hidden
                    className="absolute -bottom-4 -right-4 h-24 w-24 rounded-br-[24px] bg-brass/10 blur-2xl"
                  />
                </div>

                {/* What's inside list */}
                <div className="rounded-[24px] border border-ink/10 bg-white/60 p-6 md:p-8">
                  <span className="data-label mb-4 block text-[11px] text-ink-muted">
                    WHAT&apos;S INSIDE
                  </span>
                  <ul className="flex flex-col gap-3">
                    {WHATS_INSIDE.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 font-body text-[14px] text-ink"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brass/15 text-brass">
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Right — download form */}
            <FadeIn delay={0.1}>
              <CatalogueForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 3 — Categories covered (charcoal)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="INSIDE THE CATALOGUE"
            title="Five Categories, Fully Documented"
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.slug} delay={i * 0.06}>
                <GlassCard
                  theme="charcoal"
                  radius="20px"
                  className="flex h-full flex-col gap-4 p-6"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[12px] border border-white/10">
                    <img
                      src={cat.image}
                      alt={`${cat.name} category`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-[18px] font-medium text-ivory">
                      {cat.name}
                    </h3>
                    <span className="data-label text-[13px] text-brass">
                      {cat.count} SKU{cat.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="font-body text-[13px] leading-relaxed text-sand">
                    {cat.blurb}
                  </p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 4 — Why request (ivory)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="WHY REQUEST OUR CATALOGUE"
            title="More Than a Price List"
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_REQUEST.map((b, i) => {
              const Icon = b.icon;
              return (
                <FadeIn key={b.title} delay={i * 0.06}>
                  <GlassCard
                    theme="ivory"
                    radius="20px"
                    className="flex h-full flex-col gap-4 p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brass/15 text-brass">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="font-display text-[18px] font-medium text-ink">
                      {b.title}
                    </h3>
                    <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                      {b.body}
                    </p>
                  </GlassCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 5 — PageCTA (emerald)
          ───────────────────────────────────────────── */}
      <PageCTA
        title="Prefer a physical catalogue?"
        subtitle="We'll courier one to your hotel. Just ask."
      />
    </>
  );
}
