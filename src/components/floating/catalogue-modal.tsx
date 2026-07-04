"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, Clock, Check } from "lucide-react";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

const COUNTDOWN_SECONDS = 600; // 10 minutes
const DISCOUNT_CODE = "LAXREE10";

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ivory placeholder:text-sand/60 transition-colors duration-200 focus:border-brass focus:outline-none";

const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

export function CatalogueModal() {
  const { activeModal, closeModal } = useEnquiry();
  const isOpen = activeModal === "catalogue";

  // The inner component is mounted fresh each time the modal opens,
  // so its useState initializers give a clean form + a fresh countdown
  // without needing to call setState synchronously inside an effect.
  return (
    <AnimatePresence>
      {isOpen && <CatalogueModalInner key="catalogue-inner" onClose={closeModal} />}
    </AnimatePresence>
  );
}

function CatalogueModalInner({ onClose }: { onClose: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const phoneFieldRef = useRef<HTMLInputElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  void closeButtonRef;

  // Initial focus on mount
  useEffect(() => {
    const t = window.setTimeout(() => {
      phoneFieldRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  // Countdown tick — recreated each second so it self-halts at zero.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  // Escape-to-close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const expired = secondsLeft <= 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.trim() || expired) return;
    setSubmitted(true);
  };

  return (
    <motion.div
      key="catalogue-backdrop"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/70 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-modal-title"
    >
      <motion.div
        key="catalogue-panel"
        className="glass-on-charcoal relative w-full max-w-md rounded-[24px] p-8"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close catalogue modal"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ivory/80 transition-colors hover:border-brass hover:text-brass"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        {/* Header */}
        <header className="mb-6 pr-10">
          <h2
            id="catalogue-modal-title"
            className="font-display text-2xl font-medium leading-tight text-ivory"
          >
            Download Our Catalogue
          </h2>
          <p className="mt-1.5 font-sans text-[13px] text-sand">
            Enter your number for instant access + 10% off code.
          </p>
        </header>

        {/* Countdown timer (always visible while not yet submitted) */}
        {!submitted && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-brass/25 bg-brass/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sand">
              <Clock className="h-4 w-4 text-brass" />
              <span className="data-label text-[10px]">
                {expired ? "Offer Status" : "Offer Expires In"}
              </span>
            </div>
            {expired ? (
              <span className="font-mono text-[13px] uppercase tracking-wider text-red-300">
                Expired
              </span>
            ) : (
              <span className="font-mono text-2xl font-medium tabular-nums text-brass">
                {formatTime(secondsLeft)}
              </span>
            )}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="cat-phone" className={labelClass}>
                Phone Number
              </label>
              <input
                ref={phoneFieldRef}
                id="cat-phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={expired || !phone.trim()}
              className="pill pill-brass mt-2 flex w-full items-center justify-center gap-2 px-6 py-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Reveal Discount Code
            </button>

            {expired && (
              <p className="text-center text-[12px] text-red-300/80">
                Code expired — refresh for a new offer.
              </p>
            )}
          </form>
        ) : (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {/* Success + discount code reveal */}
            <div className="rounded-xl border border-brass/30 bg-brass/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-brass-light">
                <Check className="h-4 w-4" />
                <span className="data-label text-[10px]">Your 10% Off Code</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-medium tracking-[0.15em] text-brass">
                  {DISCOUNT_CODE}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      typeof navigator !== "undefined" &&
                      navigator.clipboard
                    ) {
                      navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
                    }
                  }}
                  className="data-label rounded-full border border-brass/40 px-3 py-1.5 text-[10px] text-brass transition-colors hover:bg-brass hover:text-charcoal"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-[11px] text-sand/80">
                Apply at checkout. Valid for 7 days.
              </p>
            </div>

            <a
              href="#"
              onClick={(e) => {
                // Placeholder — no real file yet
                e.preventDefault();
              }}
              className="pill pill-brass flex w-full items-center justify-center gap-2 px-6 py-3 text-[13px]"
            >
              <Download className="h-3.5 w-3.5" />
              Download Catalogue (PDF)
            </a>

            <button
              type="button"
              onClick={onClose}
              className="data-label w-full text-center text-[11px] text-sand transition-colors hover:text-brass"
            >
              Close
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default CatalogueModal;
