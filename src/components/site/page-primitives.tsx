"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────
   PageHero — reusable hero for inner pages
   Charcoal background, eyebrow + headline + subheadline,
   optional breadcrumb, subtle brass glow.
   ───────────────────────────────────────────────────────────── */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="section section-charcoal relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Radial brass glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(198,161,91,0.10), transparent 55%)",
        }}
      />
      <div className="container-laxree">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-sand/60">
              {breadcrumbs.map((bc, i) => (
                <li key={i} className="flex items-center gap-2">
                  {bc.href ? (
                    <Link
                      href={bc.href}
                      className="transition-colors hover:text-brass"
                    >
                      {bc.label}
                    </Link>
                  ) : (
                    <span className="text-brass">{bc.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-sand/40" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow text-brass block mb-5">{eyebrow}</span>
          <h1
            className="font-display text-ivory leading-[1.05]"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 600,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 font-body text-sand text-lg md:text-xl max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SectionHeading — eyebrow + heading + optional body
   ───────────────────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  body,
  theme = "charcoal",
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  theme?: "charcoal" | "ivory" | "emerald";
  align?: "left" | "center";
}) {
  const eyebrowColor =
    theme === "ivory" ? "text-ink-muted" : theme === "emerald" ? "text-brass-light" : "text-brass";
  const titleColor = theme === "ivory" ? "text-ink" : "text-ivory";
  const bodyColor = theme === "ivory" ? "text-ink-muted" : "text-sand";

  return (
    <div className={align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      <span className={`eyebrow ${eyebrowColor} block mb-4`}>{eyebrow}</span>
      <h2
        className={`font-display ${titleColor} leading-[1.1]`}
        style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 500 }}
      >
        {title}
      </h2>
      {body && (
        <p className={`mt-5 font-body ${bodyColor} text-base md:text-lg leading-relaxed`}>
          {body}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PageCTA — reusable bottom CTA band for inner pages
   Emerald background, heading + subline + buttons.
   ───────────────────────────────────────────────────────────── */
export function PageCTA({
  title = "Ready to elevate your hospitality?",
  subtitle = "Get a custom quotation within 24 hours. No obligation.",
  primaryLabel = "Get a Quotation",
  secondaryLabel = "Call 1800 120 7001",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const { openModal } = useEnquiry();
  const reduced = usePrefersReducedMotion();

  return (
    <section className="section section-emerald py-20 md:py-28">
      <div className="container-laxree text-center max-w-3xl mx-auto">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-display text-ivory leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 500 }}
          >
            {title}
          </h2>
          <p className="mt-5 font-body text-ivory/80 text-lg md:text-xl">{subtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openModal("enquiry")}
              className="pill pill-brass text-[14px] px-8 py-3.5 cursor-pointer"
            >
              {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="tel:18001207001"
              className="pill pill-ghost-ivory text-[14px] px-8 py-3.5"
            >
              {secondaryLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FadeIn — scroll-triggered fade-up wrapper
   ───────────────────────────────────────────────────────────── */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GlassCard — reusable glass card on charcoal or ivory
   ───────────────────────────────────────────────────────────── */
export function GlassCard({
  children,
  theme = "charcoal",
  className = "",
  radius = "24px",
}: {
  children: ReactNode;
  theme?: "charcoal" | "ivory";
  className?: string;
  radius?: string;
}) {
  return (
    <div
      className={`${theme === "charcoal" ? "glass-on-charcoal" : "glass-on-ivory"} ${className}`}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}
