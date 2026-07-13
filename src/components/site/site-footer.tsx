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

type LinkItem = { label: string; href: string };

const COMPANY_LINKS: LinkItem[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Clients", href: "/clients" },
  { label: "Dealers", href: "/dealers" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact-us" },
  { label: "Blogs", href: "/blog" },
  { label: "Privacy Policy", href: "/" },
];

const CATEGORY_LINKS: LinkItem[] = [
  { label: "Amenities", href: "/products/amenities" },
  { label: "Furniture", href: "/products/furniture" },
  { label: "Linen", href: "/products/linen" },
  { label: "Roofing", href: "/products/roofing" },
  { label: "Dome", href: "/products/dome" },
];

const SOCIALS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Facebook", href: SITE.socials.facebook, Icon: Facebook },
  { label: "X", href: SITE.socials.x, Icon: Twitter },
  { label: "YouTube", href: SITE.socials.youtube, Icon: Youtube },
  { label: "LinkedIn", href: SITE.socials.linkedin, Icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer className="section section-charcoal py-16 md:py-20">
      <div className="container-laxree">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="group">
              <img
                src="/images/laxree-logo.png"
                alt="LaxRee Amenities — Hotel Supplies Redefined"
                width={160}
                height={38}
                className="h-auto w-auto transition-opacity duration-300 group-hover:opacity-90"
                style={{ maxWidth: 160 }}
              />
            </Link>
            <p className="font-body text-[13px] leading-relaxed text-sand max-w-xs">
              {SITE.address}
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
          <FooterLinkColumn heading="Company" links={COMPANY_LINKS} />

          {/* Categories */}
          <FooterLinkColumn heading="Categories" links={CATEGORY_LINKS} />

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-brass">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <ContactRow
                href={`tel:${SITE.phoneHref}`}
                Icon={Phone}
                label={SITE.phoneDisplay}
              />
              <ContactRow
                href={`https://wa.me/${SITE.whatsapp}`}
                Icon={MessageCircle}
                label="WhatsApp Us"
              />
              <ContactRow
                href={`mailto:${SITE.email}`}
                Icon={Mail}
                label={SITE.email}
              />
              <ContactRow
                href={`mailto:${SITE.careersEmail}`}
                Icon={Briefcase}
                label={SITE.careersEmail}
              />
            </ul>
          </div>
        </div>

        <div className="hairline-brass my-10" />

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-xs text-sand">
            LaxRee Amenities © 2026 — All Rights Reserved
          </p>
          <p className="font-mono text-xs text-sand">{SITE.tagline}</p>
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
