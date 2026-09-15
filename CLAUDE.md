# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal portfolio for Ari Wijaya Putra showcasing web projects. Meant to be a magnum opus, heavily inspired by Awwwards-winning sites. The repo is currently the fresh `create-next-app` scaffold. Replace the boilerplate (Geist fonts, the placeholder `app/page.tsx`, the dark-mode `prefers-color-scheme` block in `globals.css`) as you build.

## Stack & commands

Next.js 16 (App Router, `app/`), React 19, TypeScript strict, Tailwind CSS v4 (CSS-first config via `@theme` in `app/globals.css`, no `tailwind.config.js`), ESLint 9 flat config. Package manager is **pnpm**. Path alias `@/*` points to the repo root.

- `pnpm dev`: dev server at http://localhost:3000
- `pnpm build`: production build (also type-checks)
- `pnpm lint`: ESLint
- No test framework is set up.

**Animation:** use **GSAP** (`gsap`) for any animation that needs JavaScript. CSS transitions and keyframes are fine for simple state changes.

Next 16 differs from older versions (for example, the typed global `LayoutProps<"/">` in `app/layout.tsx`). Check `node_modules/next/dist/docs/` before using any Next API (see AGENTS.md).

## Design references

Mockups live in `refference/` (spelled that way). They are 2x exports of a **1440px desktop frame**:
- `splash.png`, then `splash-finished-circle-grow.png`: a white loader showing "LOADING..." and a percentage. When it finishes, a black circle grows from the center into the dark site.
- `design-home.png`: the hero headline, an intro paragraph bottom-left, and the copyright. The white arrow circle and its glow are **the custom mouse cursor** (`components/cursor.tsx`, mounted in the root layout), not a button.
- `design-home-mobile.png`: the mobile home screen, a 2x export of a **360px frame**. The headline has four lines, there is no cursor on touch devices, the copyright is hidden, and a static glow sits on the right edge.
- `design-work-mobile-{1,2,3}.png`: the mobile work slider (360 frame). Title, panel and description stack; projects slide on the y axis, with the neighbours peeking blurred from under the navbar and the bottom bar. Also shows the **mobile bottom bar** (Home / Work / Contact), whose line and dot only mark the active section, it is not a slider.
- `design-work.png`: a horizontal project carousel. The centered card shows the year and a screenshot; neighbouring cards are blurred. The project title and description sit below.
- `design-contact.png`: the "MARI KOLABORASI" headline, contact links, a message form, and footer nav (HOME / PROYEK / KONTAK).
- `*-grid.png`: the same screens with the 12-column grid overlaid. Use these to read column spans.

Copy is primarily Indonesian, and the header has an ID/language toggle.

## Design system rules (mandatory)

- **Style:** editorial and monochrome. The dark ground is around `#111`, with off-white text and gray secondary text. There are no accent colors; project screenshots are the only color.
- **Typefaces:** **Bellefair** for display and headings (uppercase serif), **DM Sans** for body and UI. Load both with `next/font/google` and expose them as Tailwind font tokens.
- **Horizontal grid (desktop):** 12 columns, 24px gutter, 24px outer margin, defined against the 1440 frame. Express these in `vw` so the grid scales across all desktop widths (24/1440 ≈ `1.667vw`). Every component must sit on or span grid columns. CSS Grid isn't required everywhere, but placement must follow the columns.
- **Max width:** every section is capped at **1920px** and centered.
- **Lock at 1920px:** above a 1920px viewport, nothing grows further. Don't use raw `vw` for this. Scale from one capped unit, `--vw: min(1vw, 1.2rem)` (1.2rem = 19.2px = 1vw at 1920), with values like `calc(var(--vw) * 1.667)`. Use it for margins, gutters, and font sizes alike, so the layout above 1920px looks exactly like it does at 1920px, and 1920 is the 1440 frame scaled by 4/3.
- **Mobile grid (below 1024px, Tailwind `lg`):** 6 columns, 8px gutter, 16px margin, defined against a 360 frame (16/360 ≈ `4.444vw`, 8/360 ≈ `2.222vw`). Values are capped with `min()`/`clamp()` in rem so tablets don't balloon. Breakpoint-dependent values (`--cols`, `--margin`, `--gutter`, `--fs-*`) live as tokens in `:root` in `globals.css` and switch at `lg`. Markup is mobile-first, with `lg:` for desktop.
- **Section height:** every section is `min-height: var(--section-h)`, which is `100svh - var(--nav-h) - var(--bar-h)` (the top navbar, plus the mobile bottom bar; `--bar-h` is 0 on desktop). Keep those heights in their tokens so everything else stays correct. A section's content must fit inside that height, so the whole section is visible without scrolling inside it.
- **Scroll paging:** mark every section (and every step of a pinned slider) with `data-snap`. On desktop `components/snap-scroll.tsx` moves one point per wheel gesture or key press; on mobile, CSS scroll snap does it natively.
- **Vertical spacing:** always a multiple of **4px** (at the 1440 frame). Tailwind v4's spacing unit is 4px; on desktop `--spacing` grows with `--vw` above 1440 (never below 4px), so spacing scales with the text. Stick to the default scale (`mt-5`, `py-8`, ...) and avoid arbitrary values that break it. Gaps between elements are usually multiples of **20px** (`gap-5`, `gap-10`, ...).
- **Typography sizing:** **no `px` for text.** Font sizes (and text-related measures like line length) use `vw`, `ch`, or `clamp()` built from relative units.
