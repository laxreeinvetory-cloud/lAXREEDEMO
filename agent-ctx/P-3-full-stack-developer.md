# Task P-3 — Clients page + Catalogue page

**Agent:** full-stack-developer (clients + catalogue pages)
**Task ID:** P-3

## Files Created
- `src/app/clients/page.tsx` — Server component (RSC, no `"use client"`). Six sections: PageHero (charcoal) → Client logo grid (ivory, 10 cards) → Case studies (charcoal, 3 full-width cards) → Testimonials (ivory, 3-card grid) → Trust stats strip (charcoal, 4-stat glass card) → PageCTA (emerald).
- `src/app/catalogue/page.tsx` — Single `"use client"` file containing `CatalogueForm` (defined above page) + `CataloguePage`. Five sections: PageHero (charcoal) → Catalogue preview + download form (ivory, 2-col) → Categories covered (charcoal, 5-card row) → Why request (ivory, 4-card row) → PageCTA (emerald).

## Key Decisions

### Clients page
- **RSC, not client.** No interactivity is required on the Clients page — only `FadeIn` (which is internally a client component via framer-motion) and `PageCTA` (client via `useEnquiry`) are imported. Marking the page itself as a server component keeps the page shell off the client bundle.
- **Logo cards** use a brass `◆` glyph (no real logos available) + Fraunces 18px ink-muted hotel name. Hover state brightens text to ink and tightens the border to `border-brass/60` (using `hover:border-brass/60` on the GlassCard className) — the diamond also scales 1.1×.
- **Case studies** are full-width vertical stack with a `md:grid-cols-[220px_1fr]` layout (metric column + detail column). Metric is Plex Mono 56px brass; details are Fraunces 24px ivory for hotel name, Plex Mono 12px brass for location, Work Sans 16px ivory medium for project title, Work Sans 14px sand for scope, Work Sans 14px sand italic for outcome. SCOPE/OUTCOME inline labels use `data-label` class with `not-italic` to keep the label upright while body stays italic.
- **Testimonials** use lucide `Quote` 32px brass (`strokeWidth={1.5}`) at top, italic Work Sans 15px ink body, `hairline-brass` divider before attribution (name 16px Fraunces, role Plex Mono 11px ink-muted, hotel Plex Mono 11px brass).
- **Trust stats strip** is a single `GlassCard` with `grid grid-cols-2 md:grid-cols-4`. Numbers in Plex Mono brass with `clamp(1.75rem, 4vw, 2.75rem)`; labels Plex Mono 11px sand.
- **Metadata export** included (title + description + keywords) — RSC allows this.

### Catalogue page
- **Whole page is `"use client"`** because the form needs `useState` + `useEnquiry`. Per task note this is acceptable. Trade-off: no `metadata` export (Next.js doesn't allow metadata in client components). The site-level metadata in `layout.tsx` still applies.
- **`CatalogueForm` component** lives in the same file above `CataloguePage`. Owns `form` / `submitting` / `submitted` state.
- **Form fields:** Name (required), Phone (required), Email, Hotel/Company, Category (select from `ENQUIRY_CATEGORIES`, defaults to first). On submit: `fetch('/api/lead', { method: 'POST', body: JSON.stringify({ name, phone, email, message, category, source: 'catalogue-page' }) })`. The hotel/company name is folded into the `message` field so it round-trips through the existing `LeadBody` schema (`/api/lead` accepts `name/email/phone/category/message/source`).
- **Success state** replaces the form card with: green check badge, personalised heading ("Your catalogue is ready, {firstName}."), explainer copy, a `LAXREE10` discount code box (brass border, Plex Mono 28px brass, copy-to-clipboard button), and a "Download PDF" anchor (`href="#"` with a `notify("info", ...)` onClick to gracefully handle the missing real PDF). A "Submit another request" link resets state.
- **Toast feedback** via `useEnquiry().notify()` — success toast on submit, info toast on copy, error toast on fetch failure, info toast on PDF click.
- **Catalogue preview** is a stylised cover: dark charcoal gradient background with brass L-shaped corner accents, `◆` glyph + "LAXREE AMENITIES" data label, "2026 / Catalogue" headline (Fraunces 600, "Catalogue" in `text-brass-gradient`), `hairline-brass` divider, "700+ SKUs" in Plex Mono 18px ivory with a sub-label listing categories. Below the cover is a separate "What's inside" card with 5 brass checkmark pills + Work Sans 14px ink items.
- **Category cards** use a 4/3 aspect image (`aspect-[4/3]`) with `object-cover` + subtle `hover:scale-105` zoom. Plex Mono 13px brass SKU count next to Fraunces 18px ivory name.
- **Why request cards** use lucide icons `FileText`, `TrendingUp`, `Clock`, `Settings` in a brass pill circle. 4-card row on `lg:`, 2-col on `sm:`, 1-col mobile.

## Verification
- `bun run lint` — **0 errors** in either file.
- `GET /clients` — **200 OK** (after fixing an accidental duplicate `export default`).
- `GET /catalogue` — **200 OK**.
- `POST /api/lead` with `source: "catalogue-page"` payload — **200 OK** with `{"ok":true,"id":"lead_..."}`.

## Notes for Orchestrator
- Both pages render entirely under the existing `Navbar` + `SiteFooter` + `FloatingRoot` shell from `layout.tsx`. No layout changes were made.
- The `LAXREE10` discount code is hardcoded as `DISCOUNT_CODE` constant at the top of `catalogue/page.tsx` — mirrors the same constant in `floating/catalogue-modal.tsx`.
- The catalogue PDF link is `href="#"` with a graceful info toast — replace with a real PDF URL when available.
- The Clients page is fully static (RSC), so it could be statically rendered at build time.
