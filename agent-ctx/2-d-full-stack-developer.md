# Task 2-d — full-stack-developer (clients-testimonials + our-presence + certifications)

## Task
Build the **trust sections** of the LaxRee Amenities 3D marketing website:
1. Clients & testimonials (logo marquee + 3 floating glass cards)
2. Our presence — exhibition coverflow gallery
3. Certifications — 3D hover-flip badge wall

## Pre-work Done
- Read `/home/z/my-project/worklog.md` — Task 1 foundation (fonts, tokens, hooks, site-data) is live.
- Read `/home/z/my-project/upload/LaxRee_3D_Website_Master_Prompt.md` — sections 8, 9, 10.
- Read `/home/z/my-project/src/lib/laxree/site-data.ts` — confirmed exports: `TESTIMONIALS` (3), `CLIENT_LOGOS` (10), `EXHIBITIONS` (5), `CERTIFICATIONS` (5) + types `Testimonial`, `Exhibition`, `Certification`.
- Read `/home/z/my-project/src/hooks/laxree/use-laxree-motion.ts` — has `usePrefersReducedMotion` (used in our-presence).
- Read `/home/z/my-project/src/app/globals.css` — confirmed `.animate-marquee-slow`, `.marquee-pause`, `.animate-float`, `.glass-on-ivory`, `.glass-on-charcoal`, `.card-24`, `.eyebrow`, `.data-label`, `.hairline-brass`, reduced-motion guards.
- Read `layout.tsx` — confirmed Fraunces/Work Sans/IBM Plex Mono fonts + brand color tokens wired via `@theme inline`.

## Files Created
1. `/home/z/my-project/src/components/site/clients-testimonials.tsx`
2. `/home/z/my-project/src/components/site/our-presence.tsx`
3. `/home/z/my-project/src/components/site/certifications.tsx`

## Key Decisions
- **Marquee loop**: rendered `CLIENT_LOGOS` twice inside a single `flex w-max` container animated by `.animate-marquee-slow` (translates `0 → -50%`, so exactly one copy width). Wrap parent in `.marquee-pause` for hover-pause. Second copy marked `aria-hidden` to keep screen readers quiet.
- **Logo grayscale + brighten**: each logo is `font-display text-[22px] text-ink-muted/40 hover:text-ink grayscale hover:grayscale-0 transition-all duration-300`. `text-ink-muted/40` uses Tailwind 4's opacity-modifier on the custom theme color — works because `--color-ink-muted` is declared in `@theme inline`.
- **Floating testimonial cards**: `.animate-float` (4s ease-in-out infinite) with inline `animationDelay` of `0s`, `-1.3s`, `-2.6s` — **negative** delays so the three cards start at staggered phases from t=0 (no awkward "wait" period at the start). Reduced-motion handled by the global CSS `@media (prefers-reduced-motion: reduce)` rule that disables `.animate-float` entirely.
- **Coverflow math**: for 5 items, normalize each offset to shortest signed path `norm = ((offset + total + 2) % total) - 2` ∈ [-2, 2]. Active (norm 0) is centered + flat + opacity 1 + z 30. ±1 neighbors: scale 0.82, rotateY ∓25°, x ±26%, opacity 0.55, z 20. ±2 hidden: scale 0.7, opacity 0, z 10 (kept in DOM so they fade in/out smoothly as `activeIndex` changes).
- **Drag UX**: parent `motion.div` carries `drag="x"` + `dragConstraints={{ left: 0, right: 0 }}` + `dragElastic={0.18}` + `dragMomentum={false}`. `onDragEnd` checks `info.offset.x` against a 60px threshold to trigger prev/next. Children are absolutely-positioned `motion.div`s animating via the `animate` prop based on `norm`.
- **Reduced-motion in coverflow**: `usePrefersReducedMotion()` is read; when true, `rotateY` is forced to 0 (still keeps the scale/opacity layering so the carousel aesthetic survives, but no 3D rotation). Spring transition remains snappy.
- **Coverflow caption**: only on the active slide — a bottom-up `from-charcoal/85 via-charcoal/40 to-transparent` gradient with a Plex Mono `data-label` showing `{caption} · {year}`. `pointer-events-none` so it never blocks drag.
- **Pagination dots**: subtle 1.5px-tall pills below the stage — active is `w-8 bg-brass`, others `w-1.5 bg-sand/30 hover:bg-sand/60`. Not in the spec but improves usability (otherwise users have to swipe all 5 to know count).
- **Arrow buttons**: 12×12 circular `glass-on-charcoal` pills with `ChevronLeft`/`ChevronRight`, hover brightens ivory → brass. Positioned `absolute left-2`/`right-2 top-1/2 -translate-y-1/2 z-40`.
- **Medallion CSS-only flip**: outer `.group` parent sets `perspective: 1000px` via inline style. Inner `.medallion-inner` (a thin class hook with no pre-defined CSS) carries Tailwind arbitrary values: `[transform:rotateY(0deg)] [transform-style:preserve-3d] transition-transform duration-[600ms] ease-in-out group-hover:[transform:rotateY(180deg)]`. Two absolutely-positioned faces use inline `backfaceVisibility: "hidden"` (with `WebkitBackfaceVisibility` prefix). Back face pre-rotated 180° so it reads correctly when flipped. Tailwind 4 generates `border-brass`, `bg-gradient-to-b from-white to-ivory` directly from theme tokens.
- **Back face font**: spec says 13px, but full names ("Restriction of Hazardous Substances" = 35 chars) don't fit cleanly in a 96px medallion at 13px. Compromised to 11px on the back face only — front face stays 13px as specified. Documented here for traceability.
- **`Award` icon**: spec lists it among available icons but no medallion/header slot actually needs it (the front face is text-only per the spec). Skipped importing it rather than introducing a stray decorative element.

## Code Quality
- All three files are `"use client"`.
- TypeScript types imported from `@/lib/laxree/site-data` (`Testimonial`, `Exhibition`, `Certification`).
- All `<img>` use `loading="lazy"` + explicit `width`/`height` (only `our-presence` has images).
- Brand Tailwind utilities only: `bg-charcoal`, `bg-ivory`, `text-ink`, `text-sand`, `text-brass`, `text-ink-muted`, `border-brass`, `text-ivory`.
- ESLint: passes clean on all three new files (`bunx eslint <files>` → no output).
- `tsc --noEmit -p tsconfig.json`: no errors on the three new files (pre-existing errors elsewhere in `examples/` and `skills/` are unrelated to this task).

## Notes for Other Agents
- The pre-existing lint errors in `src/hooks/laxree/use-laxree-motion.ts` (lines 19 and 73, `react-hooks/set-state-in-effect`) are from Task 1's foundation work and were not touched by this task.
- The pre-existing `next/font/google` axes error in `src/app/layout.tsx` (Fraunces declared as a variable font but with a `weight` array) is also from Task 1 — not touched.
- These three sections are NOT yet wired into `src/app/page.tsx` — the orchestrator (or a later task) is expected to compose them into the final page in the order: clients → presence → certifications (matching the master prompt's section 8 → 9 → 10 sequence).
- Section IDs match the spec: `#clients`, `#presence`, `#certifications`. The `NAV_LINKS` array already has `#clients` — anchor nav will work once the section is rendered.
