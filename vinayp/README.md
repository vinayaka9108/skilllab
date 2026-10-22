# Vinay — Interactive 3D Portfolio

React + Vite + TypeScript + Tailwind CSS v4 + Three.js (React Three Fiber / Drei) + Framer Motion.

> **Status: written but not yet built or browser-tested.** The environment this was authored in
> could not reach the npm registry, so `npm install`, `npm run build` and visual testing have not
> been run. The source passes a syntax parse of every file, but type errors or runtime issues may
> still surface on first run. See "First run checklist" below.

## Run it

Requires Node.js 20+.

```bash
npm install
cp .env.example .env     # then fill in your real details (see below)
npm run dev              # http://localhost:5173
```

Production build / preview:

```bash
npm run build            # type-checks, then builds to dist/
npm run preview
```

If a dependency version in `package.json` fails to resolve, install the latest instead, e.g.
`npm install three@latest @types/three@latest @react-three/fiber@latest @react-three/drei@latest`.
(React Three Fiber v9 + Drei v10 require React 19.)

## Things only you can supply

Nothing below is invented; it is hidden or disabled until you provide it.

| What | Where | Effect while empty |
| --- | --- | --- |
| Public email | `VITE_CONTACT_EMAIL` in `.env` | Email card + copy button hidden; form can't fall back to `mailto:` |
| GitHub / LinkedIn URLs | `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL` | Cards hidden |
| Form delivery service | `VITE_CONTACT_ENDPOINT` (e.g. a Formspree form URL) | Form validates but reports honestly that it can't send (or opens the visitor's mail app if an email is set) |
| Project links | `projects[].links.demo / .source` in `src/config/site.ts` | "View Project" / "View Source Code" buttons hidden |
| Tech stack, features, contribution per project | `src/config/site.ts` | Sections hidden (a yellow DEV NOTE shows in `npm run dev` only) |
| Cryptography used in Vaultix | `projects[0].verifiedAlgorithms` | Not shown. Add `'AES-256-GCM'`, `'RSA-2048'`, `'SHA-256'` only after confirming them in the code |
| Unverified skills (React, Git/GitHub, Node.js/Express, SQLite) | `verified: false` → `true` in `src/config/site.ts` | Hidden from the skills table |
| DCET Rank Predictor details & deployment status | `projects[2]` in `src/config/site.ts` | Shows only the description you supplied |
| Social preview image | add `public/og.jpg` and an `og:image` tag in `index.html` | No image in link previews |

All text, education figures and skills live in **`src/config/site.ts`** — edit there, not in the components.

## Structure

```
src/
  config/site.ts        content, skills, projects, education (single source of truth)
  scene/                R3F scenes (lazy-loaded) + SceneHost (WebGL detection, error boundary, fallbacks)
  sections/             Hero, About, Skills, Projects, Journey, Beyond, UniverseSection, Contact, Footer
  projects/             Vaultix architecture flow, GapBridge preview, DCET layout illustration
  components/           Nav, Cursor, shared UI
  lib/                  hooks (reduced motion, media queries, WebGL detection) + scroll helper
public/images/          optimized portrait (webp + jpg, 480w / 800w), favicon.svg
```

## Behaviour notes

- **Performance:** the three.js code is code-split and loads only when a scene is near the viewport;
  offscreen scenes stop rendering; mobile gets no shadows/environment map, fewer particles, lower DPR.
- **Fallbacks:** no WebGL or a render error → static animated SVG instead of the canvas. The Digital
  Universe is replaced by its fallback on phones; its quick-link buttons are always rendered.
- **Accessibility:** skip link, semantic landmarks, visible focus states, ARIA tabs for projects and
  timeline, keyboard-operable architecture diagram, `prefers-reduced-motion` honoured (no autonomous
  3D motion, no cursor lag, simplified transitions).
- **Cursor:** custom cursor only on mouse/trackpad devices; native cursor is kept inside form fields.

## First run checklist

1. `npm install && npm run typecheck` — fix any type errors (most likely spots: Drei/Framer prop types).
2. `npm run dev` — open the browser console; check the hero scene renders and hover labels appear.
3. Resize to ~375px and ~768px; confirm no horizontal scroll and the Digital Universe shows its fallback on phones.
4. Test with "Reduce motion" enabled in your OS settings.
5. Fill in `.env` and `src/config/site.ts`, then rebuild.
