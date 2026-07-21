"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PageHero,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import { SITE } from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Types & constants
   ───────────────────────────────────────────────────────────── */
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  published: boolean;
};

const CATEGORIES = [
  "All",
  "Products",
  "Ordering",
  "Logistics",
  "Quality",
  "Partnership",
  "Services",
  "General",
] as const;

/* ─────────────────────────────────────────────────────────────
   FAQ accordion item — animated expand/collapse
   ───────────────────────────────────────────────────────────── */
function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`glass-on-charcoal rounded-[20px] border transition-colors ${
        isOpen ? "border-brass/40" : "border-white/8 hover:border-white/15"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="w-full text-left px-6 md:px-8 py-5 md:py-6 flex items-start md:items-center gap-4 md:gap-6"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-charcoal bg-brass px-2.5 py-1 rounded-full">
              {item.category}
            </span>
          </div>
          <h3 className="font-display text-ivory text-[18px] md:text-[20px] font-medium leading-snug">
            {item.question}
          </h3>
        </div>
        <ChevronDown
          size={20}
          strokeWidth={2}
          className={`text-brass shrink-0 mt-1 md:mt-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-7">
              <div className="hairline-brass mb-5" />
              <p className="font-body text-sand text-[14px] md:text-[15px] leading-relaxed max-w-3xl">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/faq?published=true", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.faqs)) {
          setFaqs(data.faqs);
        }
      } catch (err) {
        console.error("[FAQ PAGE] failed to load:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCat = category === "All" || f.category === category;
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [faqs, query, category]);

  // Build JSON-LD FAQ schema for Google rich snippets.
  const faqSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: filtered.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  }, [filtered]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about LaxRee Amenities products and services."
      />

      {/* Search + filter + list */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          {/* Search bar */}
          <FadeIn>
            <div className="relative max-w-2xl mx-auto">
              <Search
                size={20}
                strokeWidth={1.75}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-sand/60 pointer-events-none"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, products, policies…"
                aria-label="Search FAQ"
                className="w-full glass-on-charcoal rounded-full pl-14 pr-12 py-4 font-body text-[15px] text-ivory placeholder:text-sand/50 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sand/60 hover:text-brass transition-colors"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              )}
            </div>
          </FadeIn>

          {/* Category pills */}
          <FadeIn delay={0.05}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`pill text-[11px] px-4 py-2 cursor-pointer transition-all ${
                      active
                        ? "pill-brass"
                        : "pill-ghost-ivory hover:border-brass hover:text-brass"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </FadeIn>

          {/* Results meta */}
          <div className="mt-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-wider text-sand/60">
              {loading
                ? "Loading…"
                : `${filtered.length} question${filtered.length === 1 ? "" : "s"} ${
                    category === "All" ? "" : `in ${category}`
                  }${query ? ` matching "${query}"` : ""}`}
            </p>
          </div>

          {/* FAQ list */}
          <div className="mt-8 max-w-4xl mx-auto flex flex-col gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
              </div>
            ) : filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <HelpCircle className="h-10 w-10 text-sand/40 mx-auto mb-4" />
                <p className="font-display text-ivory text-lg mb-2">
                  No matching questions found
                </p>
                <p className="font-body text-sand text-sm">
                  Try a different keyword or category — or reach out to us
                  directly below.
                </p>
              </GlassCard>
            ) : (
              filtered.map((item, i) => (
                <FadeIn key={item.id} delay={Math.min(i * 0.03, 0.3)}>
                  <FaqAccordionItem
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                  />
                </FadeIn>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still have questions? CTA */}
      <section className="section section-emerald py-20 md:py-28">
        <div className="container-laxree max-w-4xl text-center">
          <FadeIn>
            <span className="eyebrow text-brass-light block mb-4">
              WE'RE HERE TO HELP
            </span>
            <h2
              className="font-display text-ivory leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 500 }}
            >
              Still have questions?
            </h2>
            <p className="mt-5 font-body text-ivory/80 text-lg md:text-xl max-w-2xl mx-auto">
              Our hospitality procurement team is available Mon–Sat, 9:30 AM to
              6:30 PM IST. Reach out and we'll respond within one business day.
            </p>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {/* Phone */}
              <a
                href={`tel:${SITE.phoneHref}`}
                className="glass-on-charcoal rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:border-brass/40 hover:-translate-y-0.5"
              >
                <div className="grid place-items-center h-12 w-12 rounded-full bg-brass/15 text-brass">
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ivory/60">
                  Call Us
                </div>
                <div className="font-body text-ivory text-sm">
                  {SITE.phoneDisplay}
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-on-charcoal rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:border-brass/40 hover:-translate-y-0.5"
              >
                <div className="grid place-items-center h-12 w-12 rounded-full bg-brass/15 text-brass">
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ivory/60">
                  WhatsApp
                </div>
                <div className="font-body text-ivory text-sm">
                  Chat with sales
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SITE.email}`}
                className="glass-on-charcoal rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:border-brass/40 hover:-translate-y-0.5"
              >
                <div className="grid place-items-center h-12 w-12 rounded-full bg-brass/15 text-brass">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ivory/60">
                  Email
                </div>
                <div className="font-body text-ivory text-sm break-all">
                  {SITE.email}
                </div>
              </a>
            </div>

            <div className="mt-10">
              <Link
                href="/contact-us"
                className="pill pill-brass text-[14px] px-8 py-3.5 inline-flex items-center gap-2"
              >
                Visit Contact Page
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
