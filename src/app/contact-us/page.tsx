"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import {
  SITE,
  ENQUIRY_CATEGORIES,
  WHATSAPP_EXECUTIVES,
} from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Form types & helpers
   ───────────────────────────────────────────────────────────── */
type ContactForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  subject: string;
  message: string;
};

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Quotation Request",
  "After-Sales Support",
  "Dealer Partnership",
  "Career",
] as const;

const INITIAL_FORM: ContactForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  category: ENQUIRY_CATEGORIES[0],
  subject: SUBJECT_OPTIONS[0],
  message: "",
};

// Inputs sit on an ivory section, so they read as ink-on-white.
const inputClass =
  "w-full bg-white/70 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-colors";

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function ContactUsPage() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof ContactForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          category: form.category,
          subject: form.subject,
          message: form.message,
          source: "contact-page",
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      notify(
        "success",
        "Thank you! Our team will reach out within 24 hours."
      );
      setForm(INITIAL_FORM);
    } catch {
      notify(
        "error",
        "Something went wrong. Please call us at 1800 120 7001."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ───────── Section 1 — PageHero ───────── */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
        eyebrow="Contact Us"
        title="We're Just a Call Away"
        subtitle="Reach the LaxRee team — for quotations, product enquiries, after-sales support, or dealer partnerships. We respond within 24 hours."
      />

      {/* ───────── Section 2 — Contact form + info (ivory) ───────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
            {/* Left: form */}
            <FadeIn>
              <div className="glass-on-ivory rounded-[24px] p-8">
                <h2
                  className="font-display text-ink"
                  style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 600 }}
                >
                  Send Us a Message
                </h2>
                <p className="mt-2 font-body text-ink-muted text-sm">
                  Fill in the form below and our team will respond within one
                  business day.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-5"
                  aria-label="Contact LaxRee Amenities"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Name" required>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@hotel.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Contact Number" required>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91-XXXXX-XXXXX"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Hotel / Company Name">
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Optional"
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
                          <option key={c} value={c} className="bg-white text-ink">
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Subject">
                      <select
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className={`${inputClass} appearance-none`}
                      >
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-white text-ink">
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" required>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us what you need — quantities, property location, timeline…"
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="pill pill-brass text-[13px] px-8 py-3.5 inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? (
                        "Sending…"
                      ) : (
                        <>
                          Send Message <Send size={14} strokeWidth={1.5} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>

            {/* Right: contact detail cards (charcoal on ivory for contrast) */}
            <FadeIn delay={0.1} className="flex flex-col gap-4">
              {/* Phone */}
              <GlassCard theme="charcoal" radius="20px" className="p-6">
                <div className="flex items-start gap-4">
                  <Phone
                    size={24}
                    strokeWidth={1.5}
                    className="text-brass shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-sand mb-2">
                      Phone
                    </p>
                    <a
                      href={`tel:${SITE.tollFreeHref}`}
                      className="block font-mono text-brass text-[22px] leading-tight tracking-tight hover:text-brass-light transition-colors"
                    >
                      {SITE.tollFreeDisplay}
                    </a>
                    <a
                      href={`tel:${SITE.phoneHref}`}
                      className="mt-1 block font-mono text-[14px] text-sand hover:text-brass-light transition-colors"
                    >
                      {SITE.phoneDisplay}
                    </a>
                  </div>
                </div>
              </GlassCard>

              {/* WhatsApp */}
              <GlassCard theme="charcoal" radius="20px" className="p-6">
                <div className="flex items-start gap-4">
                  <MessageCircle
                    size={24}
                    strokeWidth={1.5}
                    className="text-brass shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-sand mb-2">
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${SITE.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-body text-ivory text-base hover:text-brass-light transition-colors"
                    >
                      Chat with us
                      <ExternalLink size={14} strokeWidth={1.5} />
                    </a>
                    <p className="mt-1 font-body text-[13px] text-sand/80">
                      Response within 15 minutes during business hours.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Email */}
              <GlassCard theme="charcoal" radius="20px" className="p-6">
                <div className="flex items-start gap-4">
                  <Mail
                    size={24}
                    strokeWidth={1.5}
                    className="text-brass shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-sand mb-2">
                      Email
                    </p>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="block font-mono text-[14px] text-ivory hover:text-brass-light transition-colors break-all"
                    >
                      {SITE.email}
                    </a>
                    <p className="mt-1 font-mono text-[12px] text-sand/80">
                      Careers:{" "}
                      <a
                        href={`mailto:${SITE.careersEmail}`}
                        className="hover:text-brass-light transition-colors"
                      >
                        {SITE.careersEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Address */}
              <GlassCard theme="charcoal" radius="20px" className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin
                    size={24}
                    strokeWidth={1.5}
                    className="text-brass shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-sand mb-2">
                      Address
                    </p>
                    <p className="font-body text-[14px] text-sand leading-relaxed">
                      {SITE.address}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Hours */}
              <GlassCard theme="charcoal" radius="20px" className="p-6">
                <div className="flex items-start gap-4">
                  <Clock
                    size={24}
                    strokeWidth={1.5}
                    className="text-brass shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-sand mb-2">
                      Hours
                    </p>
                    <p className="font-body text-[14px] text-sand leading-relaxed">
                      Mon–Sat, 9:30 AM – 6:30 PM IST
                    </p>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ───────── Section 3 — Map placeholder (charcoal) ───────── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="Visit Us"
            title="Our Ajmer Campus"
            theme="charcoal"
          />

          <FadeIn className="mt-10">
            <div
              className="relative w-full rounded-[24px] overflow-hidden border border-white/10"
              style={{
                aspectRatio: "21 / 9",
                backgroundColor: "#0e0c0a",
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
                  radial-gradient(circle at 50% 50%, rgba(198,161,91,0.10), transparent 55%)
                `,
                backgroundSize: "44px 44px, 44px 44px, 100% 100%",
              }}
              role="img"
              aria-label={`Map placeholder showing the location of LaxRee Amenities at ${SITE.address}`}
            >
              {/* Center pin */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                <div className="relative flex flex-col items-center">
                  <span
                    aria-hidden
                    className="absolute -inset-6 rounded-full bg-brass/20 blur-2xl animate-pulse-glow"
                  />
                  <MapPin
                    size={48}
                    strokeWidth={1.5}
                    className="text-brass relative drop-shadow-[0_4px_12px_rgba(198,161,91,0.6)]"
                  />
                </div>
                <div className="glass-on-charcoal rounded-2xl px-5 py-3 text-center max-w-2xl">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-brass mb-1">
                    LaxRee Amenities
                  </p>
                  <p className="font-mono text-[13px] text-ivory leading-relaxed">
                    {SITE.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href="https://maps.google.com/?q=LaxRee+Amenities+Ajmer"
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-ghost-brass text-[13px] px-7 py-3.5 inline-flex items-center gap-2"
              >
                Get Directions
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Section 4 — Social + WhatsApp executives (ivory) ───────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="Connect"
            title="Reach Us Your Way"
            theme="ivory"
          />

          <div className="mt-10 grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left: social links */}
            <FadeIn>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-5">
                Follow us
              </p>
              <div className="flex flex-wrap gap-4">
                <SocialButton
                  href={SITE.socials.facebook}
                  label="Facebook"
                  Icon={Facebook}
                />
                <SocialButton
                  href={SITE.socials.x}
                  label="X (Twitter)"
                  Icon={Twitter}
                />
                <SocialButton
                  href={SITE.socials.youtube}
                  label="YouTube"
                  Icon={Youtube}
                />
                <SocialButton
                  href={SITE.socials.linkedin}
                  label="LinkedIn"
                  Icon={Linkedin}
                />
              </div>
              <p className="mt-6 font-body text-sm text-ink-muted leading-relaxed max-w-md">
                Stay updated on new product launches, hospitality trends, and
                behind-the-scenes from our Ajmer campus.
              </p>
            </FadeIn>

            {/* Right: WhatsApp executives */}
            <FadeIn delay={0.1}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-5">
                Talk to our executives
              </p>
              <ul className="flex flex-col gap-3">
                {WHATSAPP_EXECUTIVES.map((exec) => (
                  <li
                    key={exec.name}
                    className="flex items-center justify-between gap-4 bg-white/60 border border-ink/10 rounded-2xl px-5 py-3.5"
                  >
                    <span className="font-body text-[14px] text-ink">
                      {exec.name}
                    </span>
                    <a
                      href={`https://wa.me/${exec.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill pill-ghost-brass text-[11px] px-4 py-2 inline-flex items-center gap-1.5"
                    >
                      <MessageCircle size={13} strokeWidth={1.5} />
                      WhatsApp
                    </a>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ───────── Section 5 — Response time promise (charcoal) ───────── */}
      <section className="section section-charcoal py-16 md:py-20">
        <div className="container-laxree">
          <FadeIn>
            <div className="glass-on-charcoal rounded-[24px] px-6 md:px-10 py-10 md:py-12 text-center max-w-4xl mx-auto flex flex-col items-center gap-5">
              <Clock
                size={32}
                strokeWidth={1.5}
                className="text-brass animate-pulse-glow"
              />
              <p
                className="font-display text-ivory leading-snug"
                style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)", fontWeight: 500 }}
              >
                We respond to all enquiries within 24 hours. For urgent matters,
                call{" "}
                <a
                  href={`tel:${SITE.tollFreeHref}`}
                  className="text-brass hover:text-brass-light transition-colors"
                >
                  1800 120 7001
                </a>
                .
              </p>
              <p className="font-mono text-[12px] text-sand tracking-wider uppercase">
                Or call us now:{" "}
                <span className="text-brass">{SITE.tollFreeDisplay}</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Section 6 — PageCTA (emerald) ───────── */}
      <PageCTA
        title="Ready to talk?"
        subtitle="Call 1800 120 7001 or fill the form above."
        primaryLabel="Send an Enquiry"
        secondaryLabel="Call 1800 120 7001"
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────────────────────── */
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
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
        {required && <span className="text-brass ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function SocialButton({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-14 h-14 rounded-full border border-ink/10 grid place-items-center text-ink-muted hover:border-brass hover:text-brass transition-colors"
    >
      <Icon size={24} strokeWidth={1.5} />
    </a>
  );
}
