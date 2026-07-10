# Task ENHANCE-3D — 3D Hero Stage Enhancement

**Agent:** full-stack-developer (3D hero enhancement)
**Date:** 2024 (session)
**Task ID:** ENHANCE-3D
**File modified:** `src/components/three/hero-stage.tsx`

---

## Goal
Transform the LaxRee Amenities 3D hero from a simple rotating minibar into an
immersive, award-winning (Awwwards/Dribbble-level) 3D experience.

## Pre-work performed
1. Read `/home/z/my-project/worklog.md` — confirmed the broader site rebuild context (Task 1 foundation, plus Tasks 2-a..2-g, P-0..P-6, CAT-1).
2. Read the existing `src/components/three/hero-stage.tsx` — a R3F scene with a procedural minibar (RoundedBox body + glass door + brass trim), auto-rotate at 1 rev / 6 s, mouse-tilt springs, `ContactShadows`, and a mobile/reduced-motion image fallback.
3. Read `src/components/site/hero.tsx` — confirmed the parent imports `HeroStage` via `dynamic(() => ..., { ssr:false })` and wraps it in a CSS-based `TiltStage`. The named export `HeroStage` with **no props** must be preserved.
4. Read `src/app/globals.css` — captured brand tokens: `--color-charcoal #12100d`, `--color-ink #1a1712`, `--color-brass #c6a15b`, `--color-brass-light #e4c989`, `--color-emerald #1e4638`, `--color-ivory #f7f3ea`, `--color-sand #b7ac97`.
5. Read `package.json` — confirmed `@react-three/postprocessing` is **NOT** installed → bloom was skipped per the task constraints. `@react-three/drei` v10.7.7, `@react-three/fiber` v9.6.1, `three` v0.185.1, `framer-motion` v12.23.2 are present.

## Enhancements delivered

### 1. Ambient floating particles (`<Particles/>`)
- `PARTICLE_COUNT = 110` brass-coloured points
- `useMemo`-cached `Float32Array` of positions (x/z random in 4-unit disc, y in -2..3)
- `useFrame` updates Y by `delta * 0.3`; resets to y=-2 (with re-randomised x/z) when y>3
- `<pointsMaterial>` with `size=0.035`, `opacity=0.45`, `sizeAttenuation`, `depthWrite=false`, `AdditiveBlending` — subtle brass glow that doesn't fight z-ordering
- Delta clamped to 0.1 s so a tab-switch can't teleport particles
- `frustumCulled={false}` so the points don't disappear when the bounding sphere leaves view

### 2. Scroll-based camera movement (`<CameraRig/>`)
- `scrollProgress` is a `useMotionValue(0)` updated by a passive `scroll` listener (`window.scrollY / window.innerHeight` clamped to 0..1). No per-tick React re-renders.
- Position lerps between `[3, 2, 4]` (scroll=0, close-up) and `[5, 3.5, 6]` (scroll=1, pulled back) via `THREE.MathUtils.lerp`
- `camera.position.lerp(desired, 0.08)` for critically-damped smoothing
- `camera.lookAt(0,0,0)` each frame so the rig always re-centres the minibar
- `enabled` prop is `false` when `reduced` is set — camera stays at Canvas default
- **Auto-rotation slows with scroll**: `g.rotation.y += delta * RAD_PER_SEC * (1 - scroll * 0.7)` — at scroll=1 the rotation is at 30 % speed

### 3. Environment lighting & fog
- `<Environment preset="apartment" />` from drei for realistic reflections on glass/brass. Wrapped in `<Suspense>` **and** a custom `<SafeBoundary>` class component so a CDN failure degrades gracefully (the scene keeps its manual lights) instead of crashing the whole Canvas.
- `<fog attach="fog" args={["#12100d", 5, 15]} />` — depth & atmosphere; charcoal colour matches the hero section background so fogged objects fade seamlessly into the page.

### 4. Enhanced minibar
- **Brass nameplate** above the door (was already there) — now `emissive={BRASS}` with `emissiveIntensity={0.18}` so it glows slightly.
- **Three bottles** on the shelf (was two): amber (`#a8642a`), green (`#1e4638`, semi-transparent), clear (`meshPhysicalMaterial` with `transmission=0.8`), each with a brass or brass-light cap. Re-positioned so they sit cleanly on the shelf (bottle bottom = shelf top at y=-0.085).
- **Flickering interior light** — `pointLight.intensity = 1.4 + sin(t*4)*0.1 + sin(t*11.3)*0.05`. Subtle, never strobing.
- **Reflection plane** — `<MeshReflectorMaterial>` plane at y=-1.18 (just below `ContactShadows` at y=-1.15) with `resolution=256`, `blur=[400,150]`, `mirror=0.35`, `color="#0a0907"` — gives a "polished dark floor" look without killing perf. Heavy blur + low resolution keeps the render cheap.

### 5. Mouse parallax (camera-level)
- The existing group-tilt (mouseX/mouseY springs → `rotation.x/z` ±10°) is **kept**.
- Added camera-level parallax in `CameraRig`: `desired.set(px + mx*0.3, py - my*0.3, pz - mx*0.15)`. Because the minibar and particles are at different depths, the camera shift produces a real parallax between foreground and background.

### 6. Performance
- `dpr={[1, 2]}` preserved
- `frameloop="always"` explicit (needed for continuous particle / camera / flicker animation)
- Particle positions `useMemo`-cached, mutated in place in `useFrame` (no per-frame allocation)
- `CameraRig` uses reusable `THREE.Vector3` (`desired`, `target`) via `useMemo` — no GC churn
- `MeshReflectorMaterial` resolution clamped to 256
- Environment wrapped in `Suspense` + `SafeBoundary`

## Constraints honoured
- ✅ `"use client"` directive kept
- ✅ Named export `HeroStage` (no default-export-only) — parent still does `.then((m) => m.HeroStage)`
- ✅ No props — the prop interface is unchanged
- ✅ Mobile/reduced-motion fallback (`HeroStageFallback`) preserved verbatim
- ✅ Only uses `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`
- ✅ Bloom skipped (postprocessing not installed)
- ✅ `bun run lint` — clean (0 errors, 0 warnings)
- ✅ `bunx tsc --noEmit` — no errors in `src/components/three/hero-stage.tsx`

## Verification
- `bun run lint` → clean
- `bunx tsc --noEmit` → no errors in the modified file (pre-existing unrelated errors in `examples/` and `skills/` directories only)
- `dev.log` shows successful compiles (`✓ Compiled in 199ms`) and `GET / 200` responses after the edit — no runtime errors

## Stage Summary
The 3D hero now has six layered dynamics — particle drift, scroll-driven camera dolly, environment reflections, scene fog, minibar interior flicker, and a reflection plane — that compound into a much richer "premium product showcase" feel while preserving the existing public API (`HeroStage`, no props) and the mobile/reduced-motion fallback. The Environment HDR is wrapped in an error boundary so a CDN outage degrades gracefully, and all per-frame work uses cached geometries/vectors to keep the frame budget cheap.
