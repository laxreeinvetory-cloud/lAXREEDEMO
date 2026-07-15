# Task 2-a — Products admin module

## What I did
Built the Products & Categories management admin module for LaxRee Amenities. This lets the non-technical owner add/edit/delete products and categories through a visual UI matching the existing admin pages (Leads, Blog).

## Files created
- `src/app/api/admin/products/route.ts` — Product CRUD (GET/POST/PATCH/DELETE). GET returns both products + categories; supports `?category=` filter; orders by `sortOrder asc, createdAt desc`. `specs` is JSON-stringified on POST/PATCH.
- `src/app/api/admin/products/categories/route.ts` — Category CRUD (GET/POST/PATCH/DELETE).
- `src/app/api/admin/products/seed/route.ts` — POST endpoint that seeds Category table from `CATEGORIES` in `site-data.ts` and Product table by flattening `CATALOGUE_CATEGORIES` in `catalogue-data.ts`. Uses `upsert` by slug/model. Only seeds each table if empty (count === 0). Returns `{ ok, seeded: { products, categories }, skipped }`.
- `src/app/admin/products/page.tsx` — Client admin page with two tabs (Products / Categories). Includes filter bar, search, product table with thumbnails + featured/published badges, category card grid, two editor modals (product editor with dynamic specs rows; category editor with image preview), empty states, and a "Seed from existing data" button that only appears when product count is 0.

## Key decisions
- **Specs**: stored as `JSON.stringify` string per schema; parsed back to array client-side in the editor. Empty rows are filtered before save.
- **Category filter**: GET endpoint supports `?category=Name` (matches by product's `category` string field). The dropdown is populated from the categories list using the category `name` (not slug).
- **Visual style**: charcoal background, ivory text, brass accents, `glass-on-charcoal` cards — matches `/admin/leads` and `/admin/blog` exactly. Inputs use the shared style: `rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none`. Modals use `glass-on-charcoal rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto` over a `bg-black/60` overlay with click-outside-to-close.
- **Seed UX**: a one-click button appears only when `products.length === 0` (plus a small "Note" banner when both tables are empty) — prevents accidental seeding and avoids the button cluttering the toolbar once data exists.
- **Lint**: 0 errors, 33 warnings — all warnings are `<img>` element usage consistent with the rest of the codebase (existing admin pages and site components all use `<img>`).

## Lint result
`bun run lint` → 0 errors, 33 warnings (all pre-existing `<img>` pattern across the codebase).
