# Raushan Kumar — Immersive 3D Portfolio

**From Intelligence to Machines** — a single, continuously evolving 3D system that
travels across scroll from an AI/neural world through electronics, robotics and
mechanics into a builder's studio of real work.

Built with Next.js 14 (App Router), React Three Fiber, GSAP + Lenis and Framer Motion.
All personal data is centralized and **verified** — nothing is fabricated.

---

## Quick start (Windows)

The project ships with four helper scripts. Double-click or run from a terminal:

| Script         | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `INSTALL.bat`  | Installs dependencies (`npm install`)                     |
| `START.bat`    | Runs the dev server (`npm run dev` → http://localhost:3000) |
| `BUILD.bat`    | Production build (`npm run build`)                        |
| `DIAGNOSE.bat` | Runs `typecheck` + `lint` + `build` and reports errors    |

Manual equivalents:

```bash
npm install
npm run dev        # development
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm run build      # production build
```

Requires Node.js 18.17+ (Node 20/22 recommended).

---

## Architecture

One fixed WebGL canvas renders **six 3D worlds** over one continuous, evolving
environment. An `EnvField` backdrop (a receding engineering grid + drifting depth
dust) sits behind every world and morphs its palette with global scroll progress —
cool signal-cyan through the AI stretch, warming to ember/copper through the
electronics → mechanical → robotics stretch. A `WorldDirector` measures every
DOM section each frame and cross-fades the worlds by visibility, driving the camera,
palette, fog and lights. At the AI → electronics seam a `SignalBridge` sends a
luminous packet travelling from the neural core down into the circuit board — the
decision literally becoming a signal. Per-frame data is kept off the React render
path via module-level scratch objects (`sceneState`, `worldProgress`) so scrolling
triggers **zero re-renders**.

```
src/
├─ app/
│  ├─ layout.tsx           # fonts, metadata/OG, Providers, Background, Nav, Intro
│  ├─ page.tsx             # assembles Hero → stories → studio sections
│  ├─ globals.css          # design tokens + utilities + reduced-motion
│  ├─ sitemap.ts / robots.ts
│  └─ api/github/route.ts  # server-only GitHub proxy (token never leaves server)
├─ components/
│  ├─ three/               # SceneCanvas, WorldDirector, Background, worlds/*
│  │                       #   worlds: EnvField (evolving scroll-driven backdrop),
│  │                       #   Hero, AI, SignalBridge (AI→electronics handoff),
│  │                       #   Electronics, Robotics, Mechanical (gear train +
│  │                       #   crank-slider piston), Builder
│  ├─ sections/            # Hero, StorySection, FeedbackLoop, Projects, ProjectCase,
│  │                       #   About, Skills, GitHubSection, Contact, Footer
│  ├─ intro/               # Intro + StartButton (cinematic wake-up)
│  └─ ui/                  # Nav, Cursor, ScrollProgress, MagneticButton, SkipLink
├─ content/
│  ├─ profile.ts           # SINGLE SOURCE OF TRUTH — verified data only
│  └─ stories.ts           # narrative copy for the 3D worlds
├─ lib/                    # store (zustand), site map, theme, utils, sceneState…
├─ hooks/                  # reduced-motion, device tier, active section
└─ providers/              # Providers + SmoothScrollProvider (Lenis + GSAP)
```

### The experience flow
`intro` → **START** unlocks scroll → cinematic camera dolly (`entering`) → `live`.
Scroll then drives the camera through each world. `prefers-reduced-motion` gets a
static, instant path with no smooth-scroll hijacking.

The scroll narrative is a single continuous story — **From AI to Action**: the Hero
core wakes, then Intelligence → Electronics → Robotics → Mechanics → Builder, and
lands on the **Feedback Loop** signature section (See → Think → Decide → Act → Sense
→ Feedback → Adapt) before the real project case studies.

### Performance
Device tiering (low / mid / high) sets a quality multiplier, clamps DPR, and reduces
particle counts. The canvas is dynamically imported (`ssr: false`) and skipped on
extremely weak devices, which fall back to the layered content + scrims.

---

## Editing your data

Everything personal lives in **`src/content/profile.ts`**. Update values there; the
whole site follows. Fields left as `null` (e.g. `phone`, `linkedin`, project `repo`)
render gracefully — links simply don't appear. **Do not invent values.**

- Résumé: replace `public/Raushan_Kumar_CV.pdf` with your real CV (a placeholder PDF
  is included so the link resolves).
- Skills map: `skillGroups` in `profile.ts`.
- Narrative copy: `src/content/stories.ts`.
- Projects: the `projects` array in `profile.ts` (WisdomLens, LifeLens AI, VisionDetect).

---

## GitHub integration

`GET /api/github` runs **only on the server** and fetches live public repositories for
the verified username (`anurohan`). If a `GITHUB_TOKEN` environment variable is set it
raises the rate limit; the token is never sent to the client. On any failure the UI
degrades to a "View on GitHub" link. No repositories are hard-coded or fabricated.

Optional — create `.env.local`:

```
GITHUB_TOKEN=ghp_your_personal_access_token   # read-only public scope is enough
```

---

## SEO & assets

Metadata, Open Graph and Twitter cards are configured in `layout.tsx`; `sitemap.ts`
and `robots.ts` generate `/sitemap.xml` and `/robots.txt`. `public/favicon.svg` and
`public/og.svg` are included. Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to your
deployed domain — every canonical/OG/sitemap URL derives from it.

---

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel (framework auto-detected as Next.js).
3. Add environment variables in Project → Settings → Environment Variables:
   `NEXT_PUBLIC_SITE_URL` (your assigned domain) and, optionally, `GITHUB_TOKEN`.
4. Deploy.

---

## Tech stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · React Three Fiber (three r160) ·
@react-three/drei · GSAP + ScrollTrigger · Lenis · Framer Motion · Zustand.

## Honesty note

Robotics, electronics and mechanics appear as **genuine interests**, presented as
narrative worlds — not as claimed hardware builds. The only listed recognition is the
verified **Rank 1 — IoT Project Competition**. Software projects reflect real work.
