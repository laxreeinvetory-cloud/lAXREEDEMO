"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Phone,
  MessageCircle,
  Mail,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/lib/laxree/site-data";
import { useSiteSettings } from "@/hooks/use-site-settings";

type LinkItem = { label: string; href: string };

const COMPANY_LINKS: LinkItem[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Clients", href: "/clients" },
  { label: "Dealers", href: "/dealers" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact-us" },
  { label: "Blogs", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Experience Center", href: "/experience-center" },
];

const CATEGORY_LINKS: LinkItem[] = [
  { label: "Room Amenities", href: "/products/room-amenities" },
  { label: "Washroom Amenities", href: "/products/washroom-amenities" },
  { label: "Lobby Items", href: "/products/lobby-items" },
  { label: "Furniture", href: "/products/furniture" },
  { label: "Linen", href: "/products/linen" },
  { label: "Bath Tub", href: "/products/bath-tub" },
  { label: "Dome & Space POD", href: "/products/dome-space-pod" },
];

export function SiteFooter() {
  // Live site settings from admin (phone/email/address/logo/socials etc.)
  const { settings } = useSiteSettings();
  const [cmsFooter, setCmsFooter] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/cms?key=footer:config", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.value) {
          setCmsFooter(data.value);
        }
      })
      .catch(() => {});
  }, []);

  // Live values: admin Site Settings > footer:config > static SITE
  const phoneDisplay = settings.phoneDisplay;
  const email = settings.email;
  const address = settings.address;
  const copyright = settings.copyright;
  const tagline = settings.tagline;
  const logoUrl = settings.logo || "/images/laxree-logo.png";
  const socialLinks = {
    facebook: settings.facebook,
    x: settings.x,
    youtube: settings.youtube,
    linkedin: settings.linkedin,
  };
  const SOCIALS: { label: string; href: string; Icon: LucideIcon }[] = [
    { label: "Facebook", href: socialLinks.facebook, Icon: Facebook },
    { label: "X", href: socialLinks.x, Icon: Twitter },
    { label: "YouTube", href: socialLinks.youtube, Icon: Youtube },
    { label: "LinkedIn", href: socialLinks.linkedin, Icon: Linkedin },
  ];
  const companyLinks = cmsFooter?.companyLinks
    ? cmsFooter.companyLinks.filter((l: any) => l.visible).sort((a: any, b: any) => a.order - b.order).map((l: any) => ({ label: l.label, href: l.link }))
    : COMPANY_LINKS;

  return (
    <footer className="section section-charcoal py-16 md:py-20">
      <div className="container-laxree">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="group">
              <img
                src={logoUrl}
                alt="LaxRee Amenities — Hotel Supplies Redefined"
                width={160}
                height={38}
                className="h-auto w-auto transition-opacity duration-300 group-hover:opacity-90"
                style={{ maxWidth: 160 }}
              />
            </Link>
            <p className="font-body text-[13px] leading-relaxed text-sand max-w-xs">
              {address}
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-sand/30 text-sand hover:border-brass hover:text-brass inline-flex items-center justify-center transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <FooterLinkColumn heading="Company" links={companyLinks} />

          {/* Categories */}
          <FooterLinkColumn heading="Categories" links={CATEGORY_LINKS} />

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-brass">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <ContactRow
                href={`tel:${settings.phoneHref}`}
                Icon={Phone}
                label={phoneDisplay}
              />
              <ContactRow
                href={`https://wa.me/${settings.whatsapp}`}
                Icon={MessageCircle}
                label="WhatsApp Us"
              />
              <ContactRow
                href={`mailto:${email}`}
                Icon={Mail}
                label={email}
              />
              <ContactRow
                href={`mailto:${settings.careersEmail}`}
                Icon={Briefcase}
                label={settings.careersEmail}
              />
            </ul>
          </div>
        </div>

        <div className="hairline-brass my-10" />

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-xs text-sand">
            {copyright}
          </p>
          <p className="font-mono text-xs text-sand">{tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: LinkItem[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-brass">
        {heading}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-body text-sm text-sand hover:text-ivory transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: LucideIcon;
  label: string;
}) {
  return (
    <li>
      <a
        href={href}
        className="font-body text-sm text-sand hover:text-ivory transition-colors inline-flex items-center gap-2.5"
      >
        <Icon
          size={14}
          strokeWidth={1.5}
          className="text-brass shrink-0"
        />
        <span className="truncate">{label}</span>
      </a>
    </li>
  );
}

export default SiteFooter;
