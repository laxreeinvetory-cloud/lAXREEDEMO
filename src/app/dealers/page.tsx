"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  BadgePercent,
  MapPin,
  PackageCheck,
  Megaphone,
  Wrench,
  FileText,
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
import { DEALER_BENEFITS, DEALER_CITIES } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";

/* ─────────────────────────────────────────────────────────────
   Icon map — string from site-data → lucide component
   ───────────────────────────────────────────────────────────── */
const DEALER_ICONS: Record<string, LucideIcon> = {
  BadgePercent,
  MapPin,
  PackageCheck,
  Megaphone,
  Wrench,
  FileText,
};

/* ─────────────────────────────────────────────────────────────
   Process steps (Section 4)
   ───────────────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  {
    number: "01",
    title: "Application",
    description:
      "Submit the form below. Tell us about your business and territory of interest.",
  },
  {
    number: "02",
    title: "Discussion",
    description:
      "Our sales team calls you within 48 hours to understand your market and goals.",
  },
  {
    number: "03",
    title: "Factory Visit",
    description:
      "Visit our Ajmer campus for a factory tour — or schedule a virtual walkthrough.",
  },
  {
    number: "04",
    title: "Onboarding",
    description:
      "Sign the territory agreement, place your first stock order, and start selling.",
  },
];

/* ─────────────────────────────────────────────────────────────
   Network stats (Section 3)
   ───────────────────────────────────────────────────────────── */
const NETWORK_STATS = [
  { value: "22", label: "Dealer Partners" },
  { value: "28", label: "States Covered" },
  { value: "7-Day", label: "Replenishment" },
];

/* ─────────────────────────────────────────────────────────────
   Dealer application form
   ───────────────────────────────────────────────────────────── */
type DealerForm = {
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  currentBusiness: string;
  years: string;
};

const INITIAL_FORM: DealerForm = {
  company: "",
  contactPerson: "",
  phone: "",
  email: "",
  city: "",
  currentBusiness: "",
  years: "<2",
};

const YEARS_OPTIONS = ["<2", "2-5", "5-10", "10+"];

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ivory/60">
        {label}
        {required && <span className="text-brass"> *</span>}
      </span>
      {children}
    </label>
  );
}

function DealerApplicationForm() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState<DealerForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof DealerForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.contactPerson,
        phone: form.phone,
        email: form.email,
        category: "Dealers",
        source: "dealer-application",
        message: [
          `Company: ${form.company}`,
          `City/Region: ${form.city}`,
          `Years in Hospitality Business: ${form.years}`,
          `Current Business: ${form.currentBusiness || "—"}`,
        ].join("\n"),
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      notify(
        "success",
        "Application received. Our sales team will call you within 48 hours."
      );
      setForm(INITIAL_FORM);
    } catch {
      notify("error", "Something went wrong. Please call +91-92516 83662.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Dealer application form"
      className="glass-on-charcoal rounded-[24px] p-6 md:p-10 grid sm:grid-cols-2 gap-5"
    >
      <Field label="Company Name" required>
        <input
          required
          type="text"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Your company / firm"
          className={inputClass}
        />
      </Field>
      <Field label="Contact Person" required>
        <input
          required
          type="text"
          value={form.contactPerson}
          onChange={(e) => update("contactPerson", e.target.value)}
          placeholder="Full name"
          className={inputClass}
        />
      </Field>
      <Field label="Phone" required>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91-XXXXX-XXXXX"
          className={inputClass}
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@company.com"
          className={inputClass}
        />
      </Field>
      <Field label="City / Region" required>
        <input
          required
          type="text"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="e.g. Pune, Maharashtra"
          className={inputClass}
        />
      </Field>
      <Field label="Years in Hospitality Business">
        <select
          value={form.years}
          onChange={(e) => update("years", e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          {YEARS_OPTIONS.map((y) => (
            <option key={y} value={y} className="bg-charcoal text-ivory">
              {y} years
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Current Business — what do you currently sell?">
          <textarea
            rows={4}
            value={form.currentBusiness}
            onChange={(e) => update("currentBusiness", e.target.value)}
            placeholder="Briefly describe the product lines you currently distribute or sell to the hospitality market…"
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex justify-center sm:justify-start">
        <button
          type="submit"
          disabled={submitting}
          className="pill pill-brass px-8 py-3.5 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer"
        >
          {submitting ? "Submitting…" : "Submit Application"}
          {!submitting && <ArrowRight size={15} strokeWidth={1.5} />}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function DealersPage() {
  return (
    <>
      {/* Section 1 — PageHero */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dealers" }]}
        eyebrow="DEALER NETWORK"
        title="Become a LaxRee Dealer"
        subtitle="Partner with an 11-year OEM manufacturer. Protected territory, factory-direct pricing, and 700+ SKUs to offer your hospitality market."
      />

      {/* Section 2 — Why become a dealer (ivory) */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="DEALER BENEFITS"
            title="Why Partner With LaxRee?"
            theme="ivory"
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEALER_BENEFITS.map((benefit, i) => {
              const Icon = DEALER_ICONS[benefit.icon] ?? BadgePercent;
              return (
                <FadeIn key={benefit.title} delay={i * 0.06}>
                  <GlassCard theme="ivory" radius="24px" className="p-8 h-full">
                    <Icon
                      size={28}
                      strokeWidth={1.5}
                      className="text-brass mb-5"
                    />
                    <h3 className="font-body text-ink text-[18px] font-medium mb-2.5">
                      {benefit.title}
                    </h3>
                    <p className="font-body text-ink-muted text-[14px] leading-relaxed">
                      {benefit.description}
                    </p>
                  </GlassCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Dealer network (charcoal) */}
      <section className="section section-charcoal py-20 md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(198,161,91,0.08), transparent 55%)",
          }}
        />
        <div className="container-laxree">
          <SectionHeading
            eyebrow="OUR REACH"
            title="22 Dealers Across India"
            theme="charcoal"
          />

          {/* City pills */}
          <FadeIn className="mt-12">
            <div className="flex flex-wrap gap-3">
              {DEALER_CITIES.map((city) => (
                <span
                  key={city}
                  className="glass-on-charcoal rounded-full px-5 py-2.5 inline-flex items-center gap-2 border border-transparent hover:border-brass transition-colors"
                >
                  <MapPin
                    size={13}
                    strokeWidth={2}
                    className="text-brass shrink-0"
                  />
                  <span className="font-mono text-[13px] text-ivory">
                    {city}
                  </span>
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Stat row */}
          <FadeIn delay={0.1} className="mt-14">
            <div className="hairline-brass mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              {NETWORK_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center flex flex-col gap-2"
                >
                  <span className="font-mono text-brass text-[clamp(2.5rem,5vw,3.5rem)] leading-none">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 4 — How it works (ivory) */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="THE PROCESS"
            title="How to Become a Dealer"
            theme="ivory"
          />
          <div className="relative mt-14">
            {/* Brass connecting line on desktop */}
            <div
              aria-hidden
              className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent"
            />
            <div className="grid md:grid-cols-4 gap-10 md:gap-8 relative">
              {PROCESS_STEPS.map((step, i) => (
                <FadeIn key={step.number} delay={i * 0.08} className="relative">
                  <div className="bg-ivory inline-block pr-2">
                    <span className="font-mono text-brass text-[64px] md:text-[72px] leading-none block">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-ink text-[20px] font-medium mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-ink-muted text-[14px] leading-relaxed">
                    {step.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Dealer application form (charcoal) */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="APPLY NOW"
            title="Start Your Dealer Application"
            theme="charcoal"
          />
          <div className="mt-12 max-w-4xl">
            <DealerApplicationForm />
          </div>
        </div>
      </section>

      {/* Section 6 — PageCTA (emerald) */}
      <PageCTA
        title="Questions about dealership?"
        subtitle="Call Amit Verma, Head of Sales, at +91-92516 83662."
        primaryLabel="Get a Quotation"
        secondaryLabel="Call +91-92516 83662"
      />
    </>
  );
}
