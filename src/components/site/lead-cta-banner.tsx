"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { SITE, ENQUIRY_CATEGORIES } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
};

const INITIAL: LeadForm = {
  name: "",
  email: "",
  phone: "",
  category: ENQUIRY_CATEGORIES[0],
  message: "",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-colors";

export function LeadCtaBanner() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState<LeadForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof LeadForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      notify(
        "success",
        "Thank you! Our team will reach out within one business day."
      );
      setForm(INITIAL);
    } catch {
      notify("error", "Something went wrong. Please call us at 1800 120 7001.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section section-emerald py-20 md:py-24">
      <div className="container-laxree">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-ivory text-4xl md:text-5xl leading-[1.05]">
            Have a Question or Need a Quote?
          </h2>
          <p className="mt-4 font-body text-ivory/80 text-lg">
            We&apos;re Just a Call Away!
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch max-w-6xl mx-auto">
          {/* Inline glass form */}
          <form
            onSubmit={handleSubmit}
            className="glass-on-charcoal rounded-[24px] p-6 md:p-8 flex flex-col gap-5"
            aria-label="Contact LaxRee Amenities"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Name">
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@hotel.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Contact Number">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91-XXXXX-XXXXX"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {ENQUIRY_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-charcoal text-ivory">
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message">
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us what you need…"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="pill pill-brass px-7 py-3 text-xs disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {submitting ? "Submitting…" : "Submit"}
                {!submitting && <ArrowRight size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </form>

          {/* Phone / WhatsApp panel */}
          <div className="glass-on-charcoal rounded-[24px] p-6 md:p-8 flex flex-col justify-center gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ivory/60 mb-3">
                Call Toll-Free
              </p>
              <a
                href={`tel:${SITE.tollFreeHref}`}
                className="flex items-center gap-3 group"
              >
                <Phone
                  size={28}
                  className="text-brass shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-mono text-2xl md:text-[32px] text-ivory group-hover:text-brass-light transition-colors leading-none tracking-tight">
                  {SITE.tollFreeDisplay}
                </span>
              </a>
            </div>

            <div className="h-px bg-ivory/10" />

            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ivory/60">
                Chat With Us
              </p>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-ghost-ivory border-ivory/40 px-6 py-3 text-xs inline-flex items-center justify-center gap-2 self-start"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                WhatsApp Us
              </a>
              <p className="font-body text-sm text-ivory/70 leading-relaxed">
                Response within 15 minutes during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ivory/60">
        {label}
      </span>
      {children}
    </label>
  );
}

export default LeadCtaBanner;
