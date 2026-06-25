# Portfolio Redesign — Design Spec

**Date:** 2026-06-25
**Status:** Approved

---

## Goal

Redesign iamcaye.com to position Cayetano Biehler as a **Backend-focused Software Engineer** with full-stack capability and a product-oriented mindset. The portfolio must read quickly for recruiters and hiring managers, avoid junior-developer signals, and transmit real professional experience.

---

## Tech Stack

- **Framework:** Next.js 13 (existing, keep)
- **Styling:** Tailwind CSS — pure, no component library. Remove NextUI and Swiper.
- **Animations:** Framer Motion (already installed)
- **Language:** TypeScript
- **Theme:** dark/light mode via Tailwind `dark:` classes + `next-themes`

---

## Visual Design System

### Color Palette

| Token | Dark mode | Light mode |
|---|---|---|
| Background | `#111111` (Carbon) | `#fafaf8` (Warm White) |
| Surface | `#161616` | `#ffffff` |
| Border | `#222222` | `#e8e6e0` |
| Text primary | `#fafafa` | `#111111` |
| Text secondary | `#a3a3a3` | `#555555` |
| Text muted | `#737373` | `#999999` |
| Accent | `#f97316` (Orange 500) | `#f97316` |
| Accent text on | `#111111` | `#ffffff` |

### Typography

- **Font:** Inter (system-ui fallback)
- **Monospace:** JetBrains Mono or Fira Code (stack/tags only)
- **Scale:** Tailwind defaults — no custom scale needed
- **Headings:** font-weight 700–800, letter-spacing negative on large sizes

### Principles

- Generous whitespace between sections (100px vertical gap)
- Section labels: 10px, 3px letter-spacing, uppercase, muted color
- No skill progress bars, no carousels, no heavy icon grids
- Smooth Framer Motion fade+slide on scroll (subtle, not distracting)
- Responsive: single column on mobile, two columns on md+

---

## Page Structure

Single-page app (`/`). All sections are on one scrollable page with anchor links in the navbar.

### 1. Navbar

**Behavior:** Sticky, `backdrop-filter: blur(12px)`, slight background opacity, 1px bottom border.

**Logo:** `caye.` — plain text, bold, links to `#hero`.

**Links:** About · Experience · Projects · Skills · Contact

> **Note:** Navbar link order differs from page scroll order intentionally. Page order is: Hero → Projects → Experience → Skills → About → Contact. The navbar puts About first as a quick "who is this" anchor, which is conventional in portfolios.

**CTA:** "Download CV ↓" — orange filled button, visually distinct from nav links. Points to `/cv.pdf` (file to be added by user).

**Mobile:** Hamburger menu, links stacked vertically.

---

### 2. Hero (`#hero`)

Full-viewport-height section, vertically centered, left-aligned. Max-width 900px.

**Content:**
```
[label]  Software Engineer

Hi, I'm
Cayetano.

Backend-focused Software Engineer building
web products from idea to production.

TypeScript · Node.js · PostgreSQL · Angular · Next.js

[bio block]
Software Engineer based in Málaga with more than 4 years of
experience building and maintaining production applications.
I work across the full stack, with a strong focus on backend
architecture, APIs, databases and infrastructure.

[CTAs]
[View my work →]  [Download CV ↓]  Contact me
```

**Bio styling:** Left 2px orange border, `padding-left: 20px`, muted text color.

**Stack:** Monospace font, muted color, separated by `·` dots.

**CTAs:**
- "View my work" → primary (orange filled), scrolls to `#projects`
- "Download CV" → secondary (border, white text), `/cv.pdf`
- "Contact me" → ghost (no border, muted text), scrolls to `#contact`

**Scroll hint:** Fixed bottom-left: `—— Scroll` in very muted color.

---

### 3. Selected Projects (`#projects`)

**Section label:** `01 · Selected Projects`
**Title:** `Things I've built`

Two-column card grid (stacks to single column on mobile).

#### Project Card Structure

```
┌─────────────────────────────┐
│   [screenshot placeholder]  │  ← 200px tall, dark bg, centered text
├─────────────────────────────┤
│ Project Name                │  ← 16px, bold
│ Description text…           │  ← 13px, muted
│                             │
│ [tag] [tag] [tag]           │  ← monospace, small
│                             │
│ Live demo ↗  GitHub  Case study │ ← orange primary, muted secondary
└─────────────────────────────┘
```

#### Kreate

- **Description:** A platform that helps junior developers gain real-world experience by completing structured software projects.
- **Tags:** Next.js · TypeScript · PostgreSQL · Drizzle · Clerk
- **Highlights (in expandable or below tags):**
  - Project catalogue and user profiles
  - Submission and feedback workflows
  - Authentication and role-based access
  - Production deployment and analytics
- **Links:** Live demo · GitHub · Case study (all placeholder `href="#"` until user fills them)

#### Nottes

- **Description:** A local-first note-taking application with CLI and TUI interfaces.
- **Tags:** Rust · SQLite · Ratatui · Clap
- **Highlights:**
  - Tag-based note organization
  - Interactive terminal interface
  - CLI subcommands
  - Local persistence
- **Links:** GitHub · Case study (no live demo — CLI app)

---

### 4. Experience (`#experience`)

**Section label:** `02 · Experience`
**Title:** `Where I've worked`

Two-column layout: left column (200px) = meta, right column = content.

#### Grupo Topdigital

- **Period:** `2022 — Present` (orange, monospace)
- **Company link:** grupotopdigital.es (opens in new tab)
- **Role:** Software Developer
- **Description:** Developing and maintaining a business-critical sales platform, working independently across frontend, backend and infrastructure.
- **Bullets (→ prefix in orange):**
  - Built end-to-end features using Angular, TypeScript, Express and .NET
  - Designed APIs, database models and asynchronous processes
  - Automated internal workflows and data extraction processes
  - Investigated production issues and improved application reliability
  - Collaborated directly with stakeholders to turn business requirements into technical solutions
- **Metrics block:** Dashed border placeholder `← space reserved for metrics`. User fills later.
- **Tech tags:** Angular · TypeScript · Express · .NET · MariaDB · Docker

---

### 5. Skills (`#skills`)

**Section label:** `03 · Skills`
**Title:** `What I work with`

2×2 grid with internal dividers (border-right on odd, border-bottom on non-last row). No cards, no icons, no progress bars.

| Group | Items |
|---|---|
| **Core** (primary weight) | TypeScript · Node.js · Express · Angular · Next.js |
| **Backend & Data** (primary weight) | REST APIs · PostgreSQL · MariaDB · Redis · tRPC · Drizzle |
| **Infrastructure** | Docker · Linux · CI/CD · Traefik · Kubernetes |
| **Additional Experience** (muted) | .NET · Python · Go · Rust · Embedded Systems |

Core + Backend & Data items: `color: #fafafa / #111`, `font-weight: 500`.
Infrastructure items: `color: #a3a3a3 / #555`.
Additional Experience: inline dotted list, very muted — signals breadth without false equivalence.

---

### 6. About (`#about`)

**Section label:** `04 · About`
**Title:** `A bit about me`

Two-column layout:
- **Left:** text paragraphs
- **Right:** sidebar facts with orange left-border

**Text:**
> I enjoy taking ownership of features from the initial idea to production.
>
> Understanding the problem, designing the data model, building the API, implementing the interface and deploying the final solution — that's the kind of work I find most satisfying.
>
> I care about maintainable code, pragmatic architecture and building products that solve real problems.
>
> When I'm not working on production systems, I build personal projects that let me explore new tools and ideas — usually involving a terminal.

**Sidebar facts:**
- Location: Málaga, Spain
- Focus: Backend · APIs · Infrastructure
- Experience: 4+ years in production
- Currently building: Kreate · Nottes

---

### 7. Contact (`#contact`)

**Section label:** `05 · Contact`

Two-column layout:
- **Left:** headline + sub + CTAs
- **Right:** contact link cards

**Headline:** `Let's build something useful.` — "useful" in orange.

**Sub:** Open to interesting projects, collaborations or just a good conversation about software.

**CTAs:**
- "Send me an email" → primary button → `mailto:cayetano.biehler@gmail.com`
- "Download CV ↓" → secondary button → `/cv.pdf`

**Contact cards (hover: orange border):**
- Email: cayetano.biehler@gmail.com
- LinkedIn: linkedin.com/in/cayetanobiehler
- GitHub: github.com/iamcaye

---

### 8. Footer

Single line, full width, border-top `#1a1a1a`.
- Left: `Cayetano Biehler · {currentYear}` — year computed dynamically with `new Date().getFullYear()`
- Right: `Built with Next.js · Designed with intent` (very muted)

---

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx          ← metadata, ThemeProvider, font loading
│   ├── page.tsx            ← assembles all sections
│   └── globals.css         ← Tailwind directives + minimal base styles
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Projects.tsx
│   ├── ProjectCard.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
└── lib/
    └── data.ts             ← project/experience/skills data (typed)
```

Data is co-located in `lib/data.ts` as typed constants — no API calls, no CMS. Easy to update.

---

## Dependencies to Add

- `next-themes` — dark/light mode toggle

## Dependencies to Remove

- `@nextui-org/react`
- `swiper`
- `bootstrap-icons` (replace with inline SVG or simple unicode where needed)

---

## Animations (Framer Motion)

- **Hero:** fade + slide-up on mount (staggered: label → name → title → stack → bio → CTAs)
- **Sections:** fade + slide-up when entering viewport (`whileInView`, `once: true`)
- **Project cards:** subtle scale on hover (`whileHover: { scale: 1.01 }`)
- **Contact cards:** border color transition on hover (CSS, not Framer)
- All durations: 0.4–0.6s, easing: `easeOut`. Nothing flashy.

---

## SEO / Metadata

```ts
// app/layout.tsx
export const metadata = {
  title: 'Cayetano Biehler — Backend-focused Software Engineer',
  description: 'Software Engineer based in Málaga. Backend, APIs, databases, full-stack.',
  openGraph: { ... }
}
```

---

## Out of Scope

- Blog
- CMS integration
- Contact form (email link is sufficient)
- i18n
- Analytics changes (already in place)
