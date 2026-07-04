# Task 2-b — Category Bento + About Us

**Agent:** full-stack-developer
**Scope:** Build the 5-card category bento grid (tilt hover) and the About Us split parallax section for the LaxRee Amenities site.

## Files Created (and ONLY these)

1. `src/components/site/category-bento.tsx` — `CategoryBento` (named + default export)
2. `src/components/site/about-us.tsx` — `AboutUs` (named + default export)

## What Was Built

### category-bento.tsx
- Ivory section `#categories`, `py-24 md:py-32`.
- Header: `.eyebrow` "WHAT WE SUPPLY" (ink-muted) + Fraunces heading "Five Categories. One Standard." at `clamp(2rem, 4vw, 3.25rem)` (ink).
- Bento grid responsive:
  - mobile: `grid-cols-1`
  - md: `md:grid-cols-2` with Amenities `md:col-span-2`
  - lg: `lg:grid-cols-12 lg:grid-rows-2 lg:gap-5` — Amenities `lg:col-span-6 lg:row-span-2`, the four small cards `lg:col-span-3` each (Furniture/Linen top row, Roofing/Dome bottom row).
- Each card (`motion.a` → `#products`):
  - `rounded-24px overflow-hidden relative group`, min-h 480px (Amenities) / 280px (others).
  - Plain `<img>` with explicit width/height, `loading="lazy"`, `object-cover`, `group-hover:scale-[1.04] transition-transform duration-700`.
  - Charcoal→transparent gradient overlay `from-charcoal/90 via-charcoal/40 to-transparent`.
  - Bottom-left: Fraunces 28px ivory name + Plex Mono 13px brass "{count} Products" (+ blurb in Work Sans 13px sand on the large Amenities card only).
  - `useTilt(6)` from `@/hooks/laxree/use-laxree-motion` — spring-based rotateX/rotateY with `transformPerspective: 1000`.
  - Brass border fades `border-brass/0 → hover:border-brass/40` over 500ms.
  - Reduced-motion path: tilt style + handlers removed (CSS hover scale only).

### about-us.tsx
- Charcoal section `#about`, `py-28 md:py-36`. 12-col split: `lg:col-span-5` left / `lg:col-span-7` right.
- Left column:
  - `.eyebrow` "WHO WE ARE" (brass).
  - Fraunces `text-5xl md:text-6xl` "About Us" (ivory).
  - Work Sans 17px sand body copy (max-w 520px) — exact spec text.
  - Three `.glass-on-charcoal` Plex Mono chips: "OEM Manufacturer — Minibar & Safe Locker", "Ajmer's Largest Hospitality Exhibition Centre", "Pan-India Delivery".
  - `.pill .pill-ghost-brass` "Know More" + `ArrowRight` lucide icon → `#about`.
- Right column:
  - Tall image (h-[480px]→640px responsive) in `rounded-24px overflow-hidden` mask.
  - Parallax: `useScroll({ target: ref, offset: ["start end", "end start"] })` → `useTransform([0,1], ["-8%","8%"])` → `useSpring(stiffness:120, damping:30)` applied as `motion.img` `style.y`. Image is `scale-110` so the ±8% translate never reveals edges.
  - Floating `.glass-on-charcoal` card `absolute bottom-6 left-6 rounded-2xl p-5`: "11+" Plex Mono 32px brass + "Years Industry Experience" Plex Mono 11px sand uppercase.
  - Reduced-motion path: parallax `y` omitted (static image).
- All entrance animations use `whileInView` with `viewport={{ once: true }}` and staggered delays.

## Key Decisions
- `motion.a` (not `motion.div` + inner `<a>`) so the whole tilt surface is the link — cleaner a11y, one less DOM node.
- Conditional `style={reduced ? undefined : tilt.style}` — when reduced motion is on, the tilt MotionValues are not bound at all (no spring computation, preference respected at React level not just CSS).
- `useSpring` on a percentage-string MotionValue — framer-motion v12 handles unit interpolation; no GSAP ScrollTrigger needed.
- Plain `<img>` with explicit width/height + `loading="lazy"` + `decoding="async"` per spec (avoids next/image domain config overhead, no layout shift).
- `group` lives on the `<a>`; border uses `hover:border-brass/40` directly on the link; image scale uses `group-hover:scale-[1.04]`.

## Verification
- `bun run lint`: 0 errors in the two new files (3 pre-existing errors in `use-laxree-motion.ts` / `enquiry-provider.tsx` are out of scope — Task 1 files, not touched).
- Dev server compiles cleanly (no errors in `dev.log` from these components).
- Image paths used: `/images/categories/{amenities,furniture,linen,roofing,dome}.png` (from `site-data.ts`) and `/images/about/factory.png` (matches foundation's image-generation manifest). Components degrade gracefully (alt text + gradient overlay) if any image is still missing.

## Out of Scope (per task constraints)
- Did NOT modify: `page.tsx`, `globals.css`, `layout.tsx`, `site-data.ts`, `use-laxree-motion.ts`, or any other pre-existing file.
- Both components are ready to drop into `page.tsx` as `<CategoryBento />` and `<AboutUs />`. Section IDs `#categories` and `#about` are already wired into `NAV_LINKS`.
