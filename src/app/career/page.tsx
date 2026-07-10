"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  Award,
  Coffee,
  Briefcase,
  Send,
  ChevronDown,
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
import { JOB_OPENINGS, PERKS, SITE } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";

/* ─────────────────────────────────────────────────────────────
   Icon maps — string from site-data → lucide component
   ───────────────────────────────────────────────────────────── */
const PERK_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  Award,
  Coffee,
};

/* ─────────────────────────────────────────────────────────────
   JobList — client component with native <details>/<summary>
   ───────────────────────────────────────────────────────────── */
function JobList() {
  const { openModal } = useEnquiry();

  return (
    <div className="mt-12 flex flex-col gap-4">
      {JOB_OPENINGS.map((job, i) => (
        <FadeIn key={job.slug} delay={i * 0.05}>
          <details className="group glass-on-charcoal rounded-[20px] border border-white/8 open:border-brass/40 transition-colors">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer px-6 md:px-8 py-5 md:py-6 flex items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-ivory text-[20px] font-medium leading-snug">
                  {job.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[job.department, job.location, job.type, job.experience].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] uppercase tracking-[0.1em] text-sand px-2.5 py-1 rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
              <ChevronDown
                size={20}
                strokeWidth={2}
                className="text-brass shrink-0 mt-1 md:mt-0 transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-7 pt-1 flex flex-col gap-5">
              <p className="font-body text-sand text-[14px] leading-relaxed max-w-3xl">
                {job.description}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => openModal("enquiry")}
                  className="pill pill-ghost-brass px-6 py-2.5 text-[12px] inline-flex items-center gap-2 cursor-pointer"
                >
                  Apply for this role
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </details>
        </FadeIn>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Career application form (ivory section)
   ───────────────────────────────────────────────────────────── */
type CareerForm = {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
  resumeLink: string;
};

const INITIAL_FORM: CareerForm = {
  name: "",
  email: "",
  phone: "",
  position: JOB_OPENINGS[0]?.title ?? "",
  experience: "",
  message: "",
  resumeLink: "",
};

const inputClassIvory =
  "w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-colors";

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
        {required && <span className="text-brass"> *</span>}
      </span>
      {children}
    </label>
  );
}

function CareerApplicationForm() {
  const { notify } = useEnquiry();
  const [form, setForm] = useState<CareerForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof CareerForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        category: "Career",
        source: "career-application",
        message: [
          `Position of Interest: ${form.position}`,
          `Years of Experience: ${form.experience || "—"}`,
          `Resume Link: ${form.resumeLink || "—"}`,
          `Cover Note: ${form.message || "—"}`,
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
        "Resume received. Our HR team will be in touch if your profile matches an open role."
      );
      setForm(INITIAL_FORM);
    } catch {
      notify("error", "Something went wrong. Please email hr@laxree.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Career application form"
      className="glass-on-ivory rounded-[24px] p-6 md:p-10 grid sm:grid-cols-2 gap-5"
    >
      <Field label="Name" required>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Full name"
          className={inputClassIvory}
        />
      </Field>
      <Field label="Email" required>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@email.com"
          className={inputClassIvory}
        />
      </Field>
      <Field label="Phone" required>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91-XXXXX-XXXXX"
          className={inputClassIvory}
        />
      </Field>
      <Field label="Years of Experience">
        <input
          type="number"
          min={0}
          max={50}
          value={form.experience}
          onChange={(e) => update("experience", e.target.value)}
          placeholder="e.g. 5"
          className={inputClassIvory}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Position of Interest">
          <select
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
            className={`${inputClassIvory} appearance-none`}
          >
            {JOB_OPENINGS.map((job) => (
              <option key={job.slug} value={job.title}>
                {job.title}
              </option>
            ))}
            <option value="Other / General Application">
              Other / General Application
            </option>
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Resume Link — paste a link to your resume (Google Drive, Dropbox, etc.)">
          <input
            type="url"
            value={form.resumeLink}
            onChange={(e) => update("resumeLink", e.target.value)}
            placeholder="https://drive.google.com/…"
            className={inputClassIvory}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Message / Cover Note">
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us why you'd be a great fit for LaxRee…"
            className={`${inputClassIvory} resize-none`}
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="pill pill-brass px-8 py-3.5 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer"
        >
          {submitting ? "Sending…" : "Send Resume"}
          {!submitting && <Send size={14} strokeWidth={1.5} />}
        </button>
        <p className="font-body text-[13px] text-ink-muted">
          Or email your resume directly to{" "}
          <a
            href={`mailto:${SITE.careersEmail}`}
            className="text-brass underline-offset-4 hover:underline"
          >
            {SITE.careersEmail}
          </a>
        </p>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function CareerPage() {
  return (
    <>
      {/* Section 1 — PageHero */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]}
        eyebrow="CAREERS"
        title="Build Your Career at LaxRee"
        subtitle="Join an 11-year-old OEM manufacturer that's scaling across India. We hire for attitude, train for skill, and promote from within."
      />

      {/* Section 2 — Life at LaxRee (ivory) */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="LIFE AT LAXREE"
            title="More Than a Job"
            theme="ivory"
          />

          {/* Two-column: copy + image card */}
          <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn>
              <div className="flex flex-col gap-5">
                <p className="font-body text-ink text-base md:text-[17px] leading-relaxed">
                  LaxRee is a factory-first, family-owned hospitality
                  manufacturer headquartered in Ajmer, Rajasthan. For over a
                  decade we've built our reputation on the factory floor — every
                  minibar, safe locker, and amenity that ships under our name is
                  assembled, tested, and packed by people who take ownership of
                  the final seal.
                </p>
                <p className="font-body text-ink-muted text-[15px] leading-relaxed">
                  Our culture is growth-oriented and promotion-from-within. Half
                  of our current production leads started on the line; our
                  national sales head began as a field service engineer. Field
                  roles span pan-India hotel sites, while engineering, design,
                  and quality roles anchor out of the Ajmer campus.
                </p>
                <p className="font-body text-ink-muted text-[15px] leading-relaxed">
                  If you want to build a career where your work is visible —
                  where the minibar you specified ends up in a five-star suite —
                  LaxRee is the right place.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] md:aspect-[5/4]">
                <img
                  src="/images/about/factory.jpg"
                  alt="The LaxRee manufacturing campus in Ajmer, Rajasthan"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Floating glass stat card */}
                <div className="absolute bottom-5 left-5 glass-on-charcoal rounded-2xl px-5 py-4 flex flex-col gap-1">
                  <span className="font-mono text-brass text-[32px] leading-none">
                    11+ Years
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand">
                    Ajmer HQ
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Perks grid */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map((perk, i) => {
              const Icon = PERK_ICONS[perk.icon] ?? Briefcase;
              return (
                <FadeIn key={perk.title} delay={i * 0.05}>
                  <GlassCard theme="ivory" radius="20px" className="p-6 h-full">
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      className="text-brass mb-4"
                    />
                    <h3 className="font-body text-ink text-[16px] font-medium mb-1.5">
                      {perk.title}
                    </h3>
                    <p className="font-body text-ink-muted text-[13px] leading-relaxed">
                      {perk.description}
                    </p>
                  </GlassCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Open positions (charcoal) */}
      <section className="section section-charcoal py-20 md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(198,161,91,0.08), transparent 55%)",
          }}
        />
        <div className="container-laxree">
          <SectionHeading
            eyebrow="OPEN POSITIONS"
            title="Current Job Openings"
            theme="charcoal"
          />
          <JobList />
        </div>
      </section>

      {/* Section 4 — Application form (ivory) */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            eyebrow="APPLY"
            title="Send Us Your Resume"
            theme="ivory"
          />
          <div className="mt-12 max-w-4xl">
            <CareerApplicationForm />
          </div>
        </div>
      </section>

      {/* Section 5 — PageCTA (emerald) */}
      <PageCTA
        title="Don't see your role?"
        subtitle="Send us your resume anyway. We're always looking for talent."
        primaryLabel="Send Resume"
        secondaryLabel={`Email ${SITE.careersEmail}`}
      />
    </>
  );
}
