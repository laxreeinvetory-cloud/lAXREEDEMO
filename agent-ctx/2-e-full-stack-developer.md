# Task 2-e — Closing Sections (why-choose + hospitality-trends + lead-cta-banner + site-footer)

**Agent:** full-stack-developer
**Scope:** Build the four closing sections of the LaxRee Amenities marketing site.

## Files Created
- `src/components/site/why-choose.tsx` — Charcoal section with 7-item bento USP grid (Framer Motion staggered fade-up on scroll-into-view).
- `src/components/site/hospitality-trends.tsx` — Ivory section with 3-blog-card grid + centered "View All Articles" ghost CTA.
- `src/components/site/lead-cta-banner.tsx` — Emerald section with inline glass lead-capture form (controlled via useState, POSTs to /api/lead, sonner toasts) + side panel with toll-free number and WhatsApp pill.
- `src/components/site/site-footer.tsx` — Charcoal 4-column server component (Brand, Company, Categories, Contact) with hairline brass divider + final copyright/tagline row.

## Key Decisions
- **Motion budget:** Per master prompt, only the Why-Choose cards get a single gentle fade-up (`initial={{opacity:0,y:20}}` → `whileInView={{opacity:1,y:0}}`, `viewport={{once:true, margin:"-50px"}}`, `transition.delay = index * 0.06`). No tilt, no parallax, no float — the hero/carousels already spent the budget.
- **Bento layout:** `grid sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr]`. Two USP items with `size: "wide"` (Great After-Sales Service, Highly Affordable & Highly Durable) get `sm:col-span-2`, producing an intentionally asymmetric bento. Sparse grid flow keeps things organic.
- **Icon mapping:** `ICON_MAP` lookup from `USP[i].icon` string → lucide-react component (`Leaf`, `BadgeIndianRupee`, `Headset`, `LayoutGrid`, `ShieldCheck`, `Sparkles`, `Gem`). 24px brass, `strokeWidth={1.5}` for the line-icon feel.
- **Lead form:** Glass-on-charcoal panel sits on emerald (intentional bookend with the trust marquee — same emerald accent, per master prompt §13). Inline controlled form with 3-col row (name/email/phone) + 2-col row (category select/message) + centered brass submit pill. Uses `fetch` to POST JSON to `/api/lead`, `submitting` boolean disables button + swaps label to "Submitting…", success/error via `sonner` toast. Form is reset on success.
- **Phone/WhatsApp side panel:** Toll-free number rendered in Plex Mono at 32px ivory (per spec) with a `Phone` icon (brass). WhatsApp pill uses `.pill-ghost-ivory` with `border-ivory/40` linking to `https://wa.me/${SITE.whatsapp}`. Layout `grid lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch` — form on left/top, phone on right/below.
- **Footer as RSC:** No `"use client"` directive — all icons render fine in React Server Components (lucide-react is RSC-compatible). Saves a client bundle. The orchestrator's page wrapper handles sticky-bottom; this footer is a plain `<footer>` element with `section section-charcoal py-16 md:py-20`.
- **Footer brand mark:** "LaxRee" in Fraunces ivory + brass `◆` diamond glyph + "AMENITIES" in Plex Mono sand `tracking-[0.3em]`. Mirrors the navbar logo style described in the master prompt.
- **Footer divider:** Uses the existing `.hairline-brass` utility class from globals.css (1px gradient line, brass at ~40% center). No need to invent a new class.
- **Rounded corners:** Used `rounded-[24px]` / `rounded-[20px]` arbitrary values to be explicit (Tailwind v4 + the `--radius-lg: 1.5rem` token in `@theme inline` would also resolve to 24px via `rounded-lg`, but arbitrary values remove ambiguity for the next reader).
- **Inputs:** Custom input class string `bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass` — semi-transparent on the glass panel, brass focus ring matches the global focus-visible style. `<select>` option backgrounds use `bg-charcoal` so dropdown text stays legible.
- **No `/api/lead` route created** — per instructions, the orchestrator will create it. The form just `fetch`es it and handles non-OK responses with an error toast.

## Lint Status
`bun run lint` — **0 errors in my 4 files.** The 3 errors reported are pre-existing in `src/components/floating/catalogue-modal.tsx` and `src/hooks/laxree/use-laxree-motion.ts` (the `react-hooks/set-state-in-effect` rule firing on `useCountUp` / `usePrefersReducedMotion`), both files I did not create or modify.

## Notes for Orchestrator
- `LeadCtaBanner` posts to `POST /api/lead` with JSON `{ name, email, phone, category, message }`. Returns 200/2xx on success — non-2xx triggers error toast. No auth required.
- All four components are exported as named exports AND default exports so the orchestrator can import either way: `import { WhyChoose } from "@/components/site/why-choose"` or `import WhyChoose from "@/components/site/why-choose"`.
- Section IDs: `#why-us`, `#blog`, `#contact`. The footer is a `<footer>` element (no id needed; if the orchestrator wants an anchor for "back to top" or similar, they can add one).
- Mobile responsiveness verified: all grids collapse to 1 col on small screens, form rows stack, footer collapses to 2 col on `sm:` then 4 col on `lg:`.
