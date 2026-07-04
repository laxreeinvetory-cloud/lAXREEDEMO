"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";

import { useEnquiry } from "@/components/providers/enquiry-provider";
import { ENQUIRY_CATEGORIES } from "@/lib/laxree/site-data";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

type EnquiryForm = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
};

const EMPTY_FORM: EnquiryForm = {
  name: "",
  email: "",
  phone: "",
  category: "",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ivory placeholder:text-sand/60 transition-colors duration-200 focus:border-brass focus:outline-none";

const labelClass =
  "data-label mb-1.5 block text-[11px] text-sand";

export function EnquireModal() {
  const { activeModal, closeModal, notify } = useEnquiry();
  const isOpen = activeModal === "enquiry";
  const reduced = usePrefersReducedMotion();

  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Escape-to-close + focus the close button on open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    // Focus close button shortly after mount so keyboard users can dismiss quickly
    const t = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [isOpen, closeModal]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (
    field: keyof EnquiryForm,
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
          ...form,
          source: "enquiry-modal",
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      notify("success", "Enquiry submitted — we'll get back to you within 24 hours.");
      closeModal();
    } catch (err) {
      console.error("[enquire-modal] submit failed", err);
      notify("error", "Something went wrong — please try again or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="enquire-backdrop"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquire-modal-title"
        >
          <motion.div
            key="enquire-panel"
            className="glass-on-charcoal relative w-full max-w-md rounded-[24px] p-8"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label="Close enquiry modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ivory/80 transition-colors hover:border-brass hover:text-brass"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>

            {/* Header */}
            <header className="mb-6 pr-10">
              <h2
                id="enquire-modal-title"
                className="font-display text-2xl font-medium leading-tight text-ivory"
              >
                Enquire Now
              </h2>
              <p className="mt-1.5 font-sans text-[13px] text-sand">
                We&apos;ll get back within 24 hours.
              </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="enq-name" className={labelClass}>
                  Name
                </label>
                <input
                  ref={firstFieldRef}
                  id="enq-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@hotel.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="enq-phone" className={labelClass}>
                    Contact Number
                  </label>
                  <input
                    id="enq-phone"
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
                <label htmlFor="enq-category" className={labelClass}>
                  Category
                </label>
                <select
                  id="enq-category"
                  required
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`${inputClass} appearance-none bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B7AC97' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                  }}
                >
                  <option value="" disabled className="bg-charcoal text-ivory">
                    Select a category
                  </option>
                  {ENQUIRY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-charcoal text-ivory">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="enq-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="enq-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your project, quantities, timeline..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="pill pill-brass mt-2 flex w-full items-center justify-center gap-2 px-6 py-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-charcoal/40 border-t-charcoal" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Enquiry
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EnquireModal;
