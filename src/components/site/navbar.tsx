"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

/**
 * LaxRee logo — uses the official LaxRee logo image.
 * Horizontal logo with gold "LAXREE" text + "Hotel Supplies Redefined" tagline.
 */
function LaxReeLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="LaxRee Amenities — home"
      className="group flex items-center select-none"
    >
      <img
        src="/images/laxree-logo.png"
        alt="LaxRee Amenities — Hotel Supplies Redefined"
        width={compact ? 120 : 150}
        height={compact ? 29 : 36}
        className="h-auto w-auto transition-opacity duration-300 group-hover:opacity-90"
        style={{ maxWidth: compact ? 120 : 150 }}
      />
    </Link>
  );
}

const drawerItemVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { openModal } = useEnquiry();
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const { scrollY } = useScroll();
  // 88px → 64px after 40px of scroll
  const height = useTransform(scrollY, [0, 40], [88, 64]);
  const padY = useTransform(scrollY, [0, 40], [22, 14]);

  const handleEnquire = () => {
    setOpen(false);
    openModal("enquiry");
  };

  return (
    <>
      <motion.header
        style={{
          height: reduced ? 64 : height,
          paddingTop: reduced ? 14 : padY,
          paddingBottom: reduced ? 14 : padY,
        }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: "rgba(18,16,13,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid transparent",
            borderImage:
              "linear-gradient(90deg, transparent, rgba(198,161,91,0.5), transparent) 1",
          }}
        />

        <div className="container-laxree h-full flex items-center justify-between gap-4">
          {/* Left — logo */}
          <LaxReeLogo />

          {/* Center — nav links (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-7 group"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-[15px] font-medium transition-colors duration-200 hover:text-brass group-hover:text-sand/60 hover:!text-brass ${
                  isActive(link.href) ? "text-brass" : "text-ivory"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — CTA + WhatsApp (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid place-items-center w-8 h-8 rounded-full border border-brass/60 text-brass transition-all duration-300 hover:bg-brass hover:text-charcoal hover:border-brass"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
            </a>
            <button
              type="button"
              onClick={handleEnquire}
              className="pill pill-brass text-[14px] px-6 py-2.5 cursor-pointer"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile — hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="lg:hidden grid place-items-center w-10 h-10 -mr-2 text-ivory hover:text-brass transition-colors"
          >
            <Menu className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-charcoal/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-laxree h-full flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between h-[64px]">
                <LaxReeLogo compact />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid place-items-center w-10 h-10 -mr-2 text-ivory hover:text-brass transition-colors"
                >
                  <X className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </div>

              {/* Stacked links */}
              <nav
                aria-label="Mobile"
                className="flex-1 flex flex-col justify-center gap-1"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={drawerItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block font-display text-3xl sm:text-4xl py-2 border-b border-white/5 transition-colors ${
                        isActive(link.href) ? "text-brass" : "text-ivory hover:text-brass"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + NAV_LINKS.length * 0.05, duration: 0.4 }}
                className="py-8 flex items-center gap-3"
              >
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="grid place-items-center w-11 h-11 rounded-full border border-brass/60 text-brass transition-all duration-300 hover:bg-brass hover:text-charcoal"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                </a>
                <button
                  type="button"
                  onClick={handleEnquire}
                  className="pill pill-brass text-[14px] px-6 py-3 flex-1 cursor-pointer"
                >
                  Enquire Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
