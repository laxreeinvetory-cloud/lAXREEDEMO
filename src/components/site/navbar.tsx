"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { useCart } from "@/components/providers/cart-provider";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";

// CMS types — allows override from admin panel
type CMSNavItem = { id: string; label: string; link: string; order: number; visible: boolean; dropdown: any[] };
type CMSNavConfig = {
  logo: string;
  topBar: string;
  menus: CMSNavItem[];
  ctaButton: { text: string; visible: boolean };
};

/**
 * LaxRee logo — uses the official LaxRee logo image.
 * Horizontal logo with gold "LAXREE" text + "Hotel Supplies Redefined" tagline.
 */
function LaxReeLogo({ compact = false, logoSrc }: { compact?: boolean; logoSrc?: string }) {
  return (
    <Link
      href="/"
      aria-label="LaxRee Amenities — home"
      className="group flex items-center select-none"
    >
      <img
        src={logoSrc || "/images/laxree-logo.png"}
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
  const [cmsNav, setCmsNav] = useState<CMSNavConfig | null>(null);
  const { openModal } = useEnquiry();
  const { totalItems } = useCart();
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Fetch CMS nav config on mount
  useEffect(() => {
    fetch("/api/admin/cms?key=header:nav")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.value) {
          setCmsNav(data.value);
        }
      })
      .catch(() => {});
  }, []);

  // Use CMS menus if available, otherwise static NAV_LINKS
  const navLinks = cmsNav?.menus
    ? cmsNav.menus.filter((m) => m.visible).sort((a, b) => a.order - b.order)
    : NAV_LINKS;
  // Logo: admin Site Settings > CMS nav > static default
  const logoUrl = settings.logo || cmsNav?.logo || "/images/laxree-logo.png";
  const ctaText = cmsNav?.ctaButton?.text || "Enquire Now";
  const ctaVisible = cmsNav?.ctaButton?.visible ?? true;
  const whatsapp = settings.whatsapp || SITE.whatsapp;

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
          <LaxReeLogo logoSrc={logoUrl} />

          {/* Center — nav links (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-5 group"
          >
            {navLinks.map((link: any) => (
              <Link
                key={link.link || link.href}
                href={link.link || link.href}
                className={`font-body text-[14px] font-medium transition-colors duration-200 hover:text-brass group-hover:text-sand/60 hover:!text-brass ${
                  isActive(link.link || link.href) ? "text-brass" : "text-ivory"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — Cart + WhatsApp + CTA (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cart icon with badge */}
            <Link
              href="/cart"
              aria-label={`Cart — ${totalItems} items`}
              className="relative grid place-items-center w-8 h-8 rounded-full border border-brass/60 text-brass transition-all duration-300 hover:bg-brass hover:text-charcoal hover:border-brass"
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={1.75} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brass text-[9px] font-bold text-charcoal" style={{ minWidth: 18, height: 18 }}>
                  {totalItems}
                </span>
              )}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
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
              {ctaText}
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
                <LaxReeLogo compact logoSrc={logoUrl} />
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
                {navLinks.map((link: any, i: number) => (
                  <motion.div
                    key={link.link || link.href}
                    custom={i}
                    variants={drawerItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.link || link.href}
                      onClick={() => setOpen(false)}
                      className={`block font-display text-3xl sm:text-4xl py-2 border-b border-white/5 transition-colors ${
                        isActive(link.link || link.href) ? "text-brass" : "text-ivory hover:text-brass"
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
                transition={{ delay: 0.08 + navLinks.length * 0.05, duration: 0.4 }}
                className="py-8 flex items-center gap-3"
              >
                {/* Cart link */}
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="relative grid place-items-center w-11 h-11 rounded-full border border-brass/60 text-brass transition-all duration-300 hover:bg-brass hover:text-charcoal"
                  aria-label={`Cart — ${totalItems} items`}
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-brass text-[10px] font-bold text-charcoal" style={{ minWidth: 20, height: 20 }}>
                      {totalItems}
                    </span>
                  )}
                </Link>
                <a
                  href={`https://wa.me/${whatsapp}`}
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
                  {ctaText}
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
