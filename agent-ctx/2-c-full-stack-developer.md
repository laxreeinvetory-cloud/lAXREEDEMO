# Task 2-c — SEO + Company Info Admin Module

**Agent:** full-stack-developer
**Task ID:** 2-c
**Scope:** Build the SEO & Company Info admin module — API + admin page. Backed by the existing `SiteContent` table (`{ id, key, value, updatedAt }`). Stores JSON, one row per top-level key.

## Files Created (and ONLY these)

1. `src/app/api/admin/settings/route.ts` — `runtime = "nodejs"` GET + PUT.
2. `src/app/admin/seo/page.tsx` — `"use client"` editor page.

## What Was Built

### `src/app/api/admin/settings/route.ts`

- `export const runtime = "nodejs"`, `import { db } from "@/lib/db"`.
- `DEFAULTS` is the full superset specified in the task — `theme` + `homepage` (Task 2-b's keys) + `seo` + `company` (mine). This way Task 2-b and I do not collide: whichever finishes first writes a file that already contains the other agent's defaults.
- `mergeSetting(key, storedValue)` — shallow top-level merge of parsed DB JSON over the DEFAULTS entry; arrays (heroStats, pages, defaultKeywords) are replaced wholesale; falls back to DEFAULTS on missing/null/invalid JSON.
- `GET` — `db.siteContent.findMany()`, builds `{ [key]: mergeSetting(key, value) }` for every known default key (always emits theme/homepage/seo/company even on a fresh DB), plus any extra stored keys. Returns `{ ok: true, settings: merged }`.
- `PUT` — body `{ key, value }`. Validates `key` (string, required), `JSON.stringify(value ?? null)`, `db.siteContent.upsert({ where: { key }, update: { value }, create: { key, value } })`. Returns `{ ok: true }`, 400 if key missing.
- try/catch on both verbs logs `console.error("[ADMIN SETTINGS ERROR]", err)` and returns 500.

### `src/app/admin/seo/page.tsx`

- `"use client"`. Visual style matches `/admin/blog` and `/admin/leads`: charcoal bg, ivory text, brass accents, `glass-on-charcoal` cards, Fraunces display headings, Plex Mono labels, brass spinner while loading.
- Loads on mount via `GET /api/admin/settings`, merges response over hard-coded `SEO_DEFAULTS` / `COMPANY_DEFAULTS` (duplicated on client so Reset works offline and the form renders before GET resolves).
- **Header**: "SEO & Company Info" with `Search` icon + subtitle. Right-aligned controls: pulsing amber "Unsaved changes" badge (only when dirty), "Reset to defaults" secondary button, "Save changes" brass button (disabled when not dirty or saving; shows spinner + "Saving…" while in flight).
- **Section A — "Search Engine Optimization" card** (Search icon):
  - `siteTitle` (text)
  - `siteDescription` (textarea, `n/160` counter — amber if >160, emerald if 140-160, sand if <140)
  - `defaultKeywords` — chip list (`bg-brass/10 border-brass/20 text-brass`) with X-to-remove; add input + "Add" button + Enter-to-add; dedupes.
  - `ogImage` — text URL + live `<img>` preview in 1200:630 aspect box; image hides on `onError`.
  - `twitterHandle` (text) + `robots` (`<select>` with the 4 spec options: "index, follow" / "noindex, nofollow" / "index, nofollow" / "noindex, follow")
  - `googleVerification` (text) with helper note: "Paste the content attribute from Google Search Console verification meta tag."
  - **Per-Page SEO** sub-card (`bg-black/20`): lists each page in `seo.pages` with editable path / title / description (each description has its own char counter), Add-page button, X-to-remove per row. List is `max-h-[28rem] overflow-y-auto`.
- **Section B — "Company Contact Details" card** (Building2 icon):
  - `name` + `tagline` (2-col)
  - `phoneDisplay` + `phoneHref` (2-col, with helper notes — Display = shown to users, href = used in `tel:` links)
  - `tollFreeDisplay` + `tollFreeHref` (2-col)
  - `whatsapp` (text, with spec note "Include country code, no + or spaces. e.g. 919251683662")
  - `email` + `careersEmail` (2-col, each label prefixed with Mail icon)
  - `address` (textarea, label prefixed with MapPin)
  - `socials` — 4 inputs (facebook/x/youtube/linkedin) in `sm:grid-cols-2`, each label prefixed with the matching Lucide brand icon (Facebook, Twitter, Youtube, Linkedin).
- **Save**: PUTs `seo` and `company` keys **separately** to `/api/admin/settings` (only sends the dirty one to avoid needless writes), `Promise.all`-ed. On success: updates `loaded*` snapshot, shows green Check toast "Settings saved successfully." On error: red X toast. Toast auto-dismisses after 3.2s.
- **Reset to defaults**: deep-clones `SEO_DEFAULTS` + `COMPANY_DEFAULTS` into the form state WITHOUT saving; shows a success toast noting "not yet saved".
- Dirty detection via `JSON.stringify(current) !== JSON.stringify(loaded)` (handles nested objects/arrays in seo + company).

## Input / Button / Chip Styling (per spec)

- Input: `w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none transition-colors`
- Label: `data-label mb-1.5 block text-[11px] text-sand` (Plex Mono uppercase tracking — from `globals.css` `.data-label`)
- Primary button: `rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed`
- Secondary button: `rounded-full bg-white/5 text-ivory px-5 py-2.5 text-sm hover:bg-white/10 transition-colors`
- Keyword chip: `inline-flex items-center gap-2 rounded-full bg-brass/10 border border-brass/20 px-3 py-1.5 text-xs text-brass`
- Char counter: `font-mono text-[10px] ml-auto` — amber (>160) / emerald (140-160) / sand (<140)

## Lucide Icons Used (exact set from spec)

Search, Globe, Phone, Mail, MapPin, Share2, Save, RotateCcw, Plus, X, Building2, Check, Twitter, Youtube, Linkedin, Facebook.

## Verification

- `bun run lint` — **0 errors**, 33 pre-existing `<img>` warnings (none in my files; the OG preview `<img>` carries an inline `eslint-disable-next-line @next/next/no-img-element`).
- `curl GET /api/admin/settings` → 200, returns merged settings with all four default keys (`theme`, `homepage`, `seo`, `company`) present even when DB has no rows.
- `curl PUT /api/admin/settings -d '{"key":"seo","value":{...}}'` → `{ ok: true }`; subsequent GET returns the saved `seo` value (shallow-merged over DEFAULTS).
- `curl GET /admin/seo` → 200 (Next.js compiles the page client-side).
- Dev server log shows no errors from these files.

## Out of Scope (per task constraints)

- Did NOT modify `prisma/schema.prisma`, `src/lib/admin/admin-shell.tsx`, `src/app/admin/content/page.tsx`, or any other existing file.
- Did NOT wire SEO settings into the live site's `<head>` / metadata — that's a follow-up task. This PR only persists to the DB.
- Did NOT add a nav link to `/admin/seo` in `admin-shell.tsx` (forbidden by constraints). The owner can reach it directly via the URL; a future task can add it to the nav.

## Coordinator Note (for Task 2-b)

If Task 2-b has not yet written `/api/admin/settings/route.ts`, my file is already a compatible superset — `theme` and `homepage` defaults are included verbatim from the spec, so 2-b's UI will work without 2-b needing to touch the route. If 2-b has already written the file, then I followed the spec's "READ it first and only ADD `seo` and `company`" rule — but in this run the file did not exist when I started, so I created the full superset.
