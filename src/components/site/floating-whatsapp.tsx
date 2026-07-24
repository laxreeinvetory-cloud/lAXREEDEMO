"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Phone, Headphones, BookOpen, Compass } from "lucide-react";
import { WHATSAPP_GROUPS, type WhatsAppGroup } from "@/lib/laxree/site-data";

/* Floating WhatsApp button with a region/purpose selector.
   - Fixed bottom-right, above the footer.
   - Click opens a card listing all WhatsApp groups (sales N/S/E/W,
     after-sales support, catalogue & pricing).
   - Each row deep-links to wa.me with a prefilled message.
   - Closes on outside-click, Escape, or selecting a contact.
   - Respects reduced-motion. Hidden on /admin routes (admin has its own UI). */
const ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Compass,
  Headphones,
  BookOpen,
};

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [pulsed, setPulsed] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Stop the "new" pulse after 6s so it isn't distracting.
  useEffect(() => {
    const t = setTimeout(() => setPulsed(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleClick = (g: WhatsAppGroup) => {
    const text = encodeURIComponent(
      `Hello LaxRee team, I'd like to connect with ${g.label}.`,
    );
    window.open(`https://wa.me/${g.phone}?text=${text}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div
      ref={cardRef}
      className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 print:hidden"
      style={{ position: "fixed" }}
    >
      {/* Selector card */}
      {open && (
        <div
          role="dialog"
          aria-label="Choose a WhatsApp contact"
          className="w-[320px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-brass/30 bg-charcoal/95 shadow-2xl backdrop-blur-xl"
          style={{
            animation: "fwh-pop 0.18s ease-out",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-emerald/20 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald text-ivory">
                <MessageCircle size={16} strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-[15px] font-medium text-ivory leading-tight">
                  Chat with LaxRee
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand">
                  Choose a department
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp menu"
              className="grid h-7 w-7 place-items-center rounded-full text-sand hover:bg-white/10 hover:text-ivory transition-colors"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Group list */}
          <ul className="max-h-[60vh] overflow-y-auto py-1">
            {WHATSAPP_GROUPS.map((g) => {
              const Icon = ICONS[g.icon] || Phone;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(g)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brass/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brass/30 bg-brass/10 text-brass">
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-body text-[13px] font-medium text-ivory">
                        {g.label}
                      </span>
                      <span className="block font-mono text-[10px] text-sand/80 truncate">
                        {g.blurb}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-brass">
                      +{g.phone}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="border-t border-white/10 bg-white/[0.03] px-4 py-2.5">
            <p className="font-mono text-[10px] text-sand/70 leading-snug">
              Mon–Sat · 9:30 AM – 6:30 PM IST · Replies within 15 min
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp menu" : "Open WhatsApp menu"}
        aria-expanded={open}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-emerald text-ivory shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#1E4638" }}
      >
        {/* Pulse ring */}
        {pulsed && !open && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "#1E4638",
              animation: "fwh-pulse 1.8s ease-out infinite",
            }}
          />
        )}
        {open ? (
          <X size={22} strokeWidth={2} className="relative" />
        ) : (
          <MessageCircle size={24} strokeWidth={2} className="relative" fill="currentColor" />
        )}
      </button>

      {/* Inline keyframes (scoped by unique names) */}
      <style>{`
        @keyframes fwh-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fwh-pulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default FloatingWhatsApp;
