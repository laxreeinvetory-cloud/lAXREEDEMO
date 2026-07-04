# Task 2-f — Floating Elements & Modals

**Agent:** full-stack-developer (floating elements + modals)
**Task:** Build WhatsApp launcher, Enquire modal, Catalogue modal with 10-min countdown, mobile sticky bottom bar, and floating-root aggregator.

## Context Read
- `/home/z/my-project/worklog.md` — foundation (Task 1) installed fonts, tokens in globals.css, smooth-scroll provider, enquiry context, motion hooks, full site-data.ts
- `/home/z/my-project/upload/LaxRee_3D_Website_Master_Prompt.md` §15 — floating elements spec
- `/home/z/my-project/src/lib/laxree/site-data.ts` — used `SITE` (phoneHref, whatsapp), `WHATSAPP_EXECUTIVES` (4), `ENQUIRY_CATEGORIES` (5)
- `/home/z/my-project/src/components/providers/enquiry-provider.tsx` — used `useEnquiry()` exposing `{ openModal, closeModal, activeModal }` where activeModal is `"enquiry" | "catalogue" | null`
- `/home/z/my-project/src/app/globals.css` — tokens: charcoal/ivory/brass/brass-light/emerald/sand; utility classes `.glass-on-charcoal`, `.pill-brass`, `.data-label`, `.eyebrow`, `.animate-pulse-glow`
- `/home/z/my-project/src/hooks/laxree/use-laxree-motion.ts` — `usePrefersReducedMotion()` hook (existing)

## Files Created (5)
All under `/home/z/my-project/src/components/floating/`:

1. **whatsapp-launcher.tsx** — Fixed bottom-right (hidden below `md`) launcher. 56px brass-ringed WhatsApp-green circle. Brand-glyph SVG (28px white) swaps with lucide `X` via AnimatePresence. `.animate-pulse-glow` ring on closed state. Expands to 4 named executive chips staggered 0.05s (containerVariants/chipVariants with `staggerChildren`); each chip is a glass-on-charcoal pill, Plex Mono 11px ivory + small WhatsApp glyph, opens `https://wa.me/{phone}` in new tab. Reduced-motion zeros the stagger.

2. **enquire-modal.tsx** — Renders when `activeModal === "enquiry"` via AnimatePresence. Backdrop `bg-charcoal/70 backdrop-blur-md`, click-closes. Panel = `.glass-on-charcoal rounded-[24px] p-8 max-w-md`. Enter `{opacity:0, scale:0.92, y:20}` → `{opacity:1, scale:1, y:0}` → exit `{opacity:0, scale:0.95, y:10}`, transition `{duration:0.3, ease:[0.22,1,0.36,1]}`. Header "Enquire Now" Fraunces 24px + "We'll get back within 24 hours" Work Sans 13px sand + close X. Form: Name, Email, Contact, Category (select from ENQUIRY_CATEGORIES), Message (textarea). Brass pill submit POSTs JSON to `/api/lead`, success → sonner `toast.success`, close modal, reset form. Escape-to-close. Reduced-motion = opacity-only.

3. **catalogue-modal.tsx** — Same backdrop/panel/animation. Header "Download Our Catalogue" + "Enter your number for instant access + 10% off code". 600-second countdown in Plex Mono tabular-nums brass (MM:SS); on 0 → "Code expired — refresh for a new offer" + submit disabled. Phone input → submit reveals `LAXREE10` in styled box (with Copy button) + "Download Catalogue (PDF)" placeholder link (`#`). Used inner-component pattern (`CatalogueModalInner`) so fresh `useState` initializers give clean form + fresh countdown on every open WITHOUT calling setState synchronously in an effect (avoids `react-hooks/set-state-in-effect` lint rule).

4. **mobile-sticky-bar.tsx** — `fixed bottom-0 inset-x-0 z-30 md:hidden`. Two `flex-1 py-4` buttons split by 1px hairline: left "Call Now" (emerald, `Phone` icon, `tel:${SITE.phoneHref}`), right "WhatsApp" (`#25D366` with hover `#1fb855`, `MessageCircle` icon, `https://wa.me/${SITE.whatsapp}`, `_blank`). Plex Mono 13px uppercase tracking-[0.12em]. Bar gets `pb-[env(safe-area-inset-bottom)]` via inline style + `backdrop-blur-md` + `border-t border-white/10`.

5. **floating-root.tsx** — Single client aggregator. Imports all 4 above, renders them in a `<>` fragment. Ready to drop into `page.tsx` once (orchestrator's job, not mine per "Do NOT modify any other files").

## Key Decisions
- WhatsApp **brand SVG path** (not lucide `MessageCircle`) inside the launcher + executive chips for instant brand recognition; kept `MessageCircle` on the mobile sticky bar per spec wording
- Inner-component pattern for catalogue-modal so countdown + form state reset cleanly between opens without triggering `react-hooks/set-state-in-effect` lint rule
- All modals: Escape-to-close + backdrop click-to-close + `stopPropagation` on panel + AnimatePresence graceful exit
- Catalogue countdown self-halts at zero via the `[secondsLeft]` effect dependency
- Reduced-motion handling across the board: whatsapp stagger zeroed, modal scale/y skipped (opacity-only) — driven by existing `usePrefersReducedMotion()` hook
- Enquire modal POSTs to `/api/lead` with `source: "enquiry-modal"` tag so orchestrator's lead route can attribute leads
- Catalogue download link is `href="#"` with `preventDefault` placeholder, ready to wire to real PDF later

## Lint Status
- All 5 new floating files pass ESLint **cleanly**
- Remaining lint errors are pre-existing in `src/hooks/laxree/use-laxree-motion.ts` (lines 19, 73) and `src/components/three/hero-stage.tsx` (line 368) — created by other agents, NOT mine to modify per instructions
- Dev log shows successful compiles (`✓ Compiled in X ms`, `GET / 200`)

## Pending (Orchestrator's Job)
- Mount `<FloatingRoot />` in `src/app/page.tsx` (or layout.tsx) so the floating elements appear site-wide
- Create `/api/lead` POST route — the enquire modal posts `{ name, email, phone, category, message, source }` to it
- Wire the catalogue download link to the real PDF when available (currently `href="#"` placeholder)
