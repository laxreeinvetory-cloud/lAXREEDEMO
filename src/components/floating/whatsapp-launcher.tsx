"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { WHATSAPP_EXECUTIVES } from "@/lib/laxree/site-data";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

/**
 * WhatsApp brand glyph (filled) — 24x24 viewBox, currentColor fill.
 * More recognizable than lucide's generic MessageCircle.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function WhatsappLauncher() {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.05,
        delayChildren: reduced ? 0 : 0.02,
      },
    },
    exit: {
      transition: {
        staggerChildren: reduced ? 0 : 0.04,
        staggerDirection: -1,
      },
    },
  };

  const chipVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 0.85,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: 12,
      scale: 0.9,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-end gap-3">
      {/* Executive chips stack */}
      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key="exec-stack"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col items-end gap-2.5"
          >
            {WHATSAPP_EXECUTIVES.map((exec) => (
              <motion.a
                key={exec.name}
                href={`https://wa.me/${exec.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={chipVariants}
                className="glass-on-charcoal group flex items-center gap-2.5 rounded-full py-2 pl-4 pr-3 transition-colors duration-300 hover:border-brass/40"
                aria-label={`Chat with ${exec.name} on WhatsApp`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ivory transition-colors group-hover:text-brass-light">
                  {exec.name}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppGlyph className="h-3.5 w-3.5" />
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher button */}
      <div className="relative">
        {/* Pulse-glow ring (behind button) */}
        {!open && (
          <span
            aria-hidden="true"
            className="animate-pulse-glow pointer-events-none absolute inset-0 rounded-full ring-2 ring-brass/50"
          />
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          aria-label={open ? "Close WhatsApp contacts" : "Open WhatsApp contacts"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-brass bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="h-6 w-6" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="wa"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <WhatsAppGlyph className="h-7 w-7" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export default WhatsappLauncher;
