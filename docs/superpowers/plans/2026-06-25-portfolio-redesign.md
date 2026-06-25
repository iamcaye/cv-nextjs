# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild iamcaye.com from scratch as a dark/light mode portfolio that positions Cayetano Biehler as a Backend-focused Software Engineer.

**Architecture:** Single-page Next.js 13 app router site. All content lives in `src/lib/data.ts` as typed constants — no CMS, no API calls. Tailwind CSS with `darkMode: 'class'` and `next-themes` for theme switching. Framer Motion for scroll-triggered animations. NextUI and Swiper removed entirely.

**Tech Stack:** Next.js 13, TypeScript, Tailwind CSS, Framer Motion, next-themes

---

## File Map

**Create:**
- `src/lib/data.ts` — all typed content (projects, experience, skills)
- `src/components/Providers.tsx` — ThemeProvider wrapper (client)
- `src/components/Navbar.tsx` — sticky nav with theme toggle and mobile menu (client)
- `src/components/Hero.tsx` — full-viewport hero with Framer Motion (client)
- `src/components/MotionSection.tsx` — scroll-triggered fade wrapper (client)
- `src/components/SectionHeader.tsx` — reusable label + title header (server)
- `src/components/Projects.tsx` — projects grid section (server)
- `src/components/ProjectCard.tsx` — single project card (server)
- `src/components/Experience.tsx` — experience section (server)
- `src/components/Skills.tsx` — skills 2×2 grid (server)
- `src/components/About.tsx` — about section (server)
- `src/components/Contact.tsx` — contact section (server)
- `src/components/Footer.tsx` — footer with dynamic year (server)

**Modify:**
- `tailwind.config.ts` — add `darkMode: 'class'`
- `src/app/globals.css` — rewrite for new design system
- `src/app/layout.tsx` — add ThemeProvider, metadata, Inter font
- `src/app/page.tsx` — assemble all new sections
- `package.json` — add next-themes, remove NextUI/Swiper/bootstrap-icons
- `.gitignore` — add `.superpowers/`

**Delete (after page assembly works):**
- `src/components/card-component.tsx`
- `src/components/coding-languages.tsx`
- `src/components/footer.tsx`
- `src/components/nav-bar.tsx`
- `src/components/skill-card.tsx`
- `src/components/table-component.tsx`
- `src/models/CodingLanguage.ts`
- `src/models/Skills.ts`
- `src/pages/git-projects.tsx`
- `src/pages/skills.tsx`
- `src/pages/td-info.tsx`
- `src/pages/work-experience.tsx`
- `src/app/providers.tsx`

---

## Task 0: Dependencies & Base Config

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Install next-themes and remove old dependencies**

```bash
npm install next-themes
npm uninstall @nextui-org/react swiper bootstrap-icons
```

Expected: package.json no longer lists `@nextui-org/react`, `swiper`, or `bootstrap-icons`. `next-themes` appears in dependencies.

- [ ] **Step 2: Update tailwind.config.ts**

Replace the entire file with:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Rewrite globals.css**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-[#fafaf8] dark:bg-[#111111] text-[#111111] dark:text-[#fafafa];
    @apply antialiased;
  }
}
```

- [ ] **Step 4: Add .superpowers/ to .gitignore**

Open `.gitignore` and add this line at the bottom:

```
.superpowers/
```

- [ ] **Step 5: Verify build still compiles**

```bash
npm run build
```

Expected: Build completes. There may be TypeScript errors about missing NextUI imports — that's fine; we'll fix them in later tasks. If the error is about next-themes not found, run `npm install` again.

---

## Task 1: Data Layer

**Files:**
- Create: `src/lib/data.ts`

- [ ] **Step 1: Create src/lib/data.ts**

```ts
export interface Project {
  name: string
  description: string
  tags: string[]
  highlights: string[]
  links: {
    demo?: string
    github?: string
    caseStudy?: string
  }
}

export interface ExperienceEntry {
  role: string
  company: string
  companyUrl: string
  period: string
  description: string
  bullets: string[]
  tags: string[]
}

export interface SkillGroup {
  label: string
  items: string[]
  primary: boolean
}

export const projects: Project[] = [
  {
    name: 'Kreate',
    description:
      'A platform that helps junior developers gain real-world experience by completing structured software projects.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Clerk'],
    highlights: [
      'Project catalogue and user profiles',
      'Submission and feedback workflows',
      'Authentication and role-based access',
      'Production deployment and analytics',
    ],
    links: {
      demo: '#',
      github: '#',
      caseStudy: '#',
    },
  },
  {
    name: 'Nottes',
    description: 'A local-first note-taking application with CLI and TUI interfaces.',
    tags: ['Rust', 'SQLite', 'Ratatui', 'Clap'],
    highlights: [
      'Tag-based note organization',
      'Interactive terminal interface',
      'CLI subcommands',
      'Local persistence',
    ],
    links: {
      github: '#',
      caseStudy: '#',
    },
  },
]

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Developer',
    company: 'Grupo Topdigital',
    companyUrl: 'https://grupotopdigital.es/',
    period: '2022 — Present',
    description:
      'Developing and maintaining a business-critical sales platform, working independently across frontend, backend and infrastructure.',
    bullets: [
      'Built end-to-end features using Angular, TypeScript, Express and .NET',
      'Designed APIs, database models and asynchronous processes',
      'Automated internal workflows and data extraction processes',
      'Investigated production issues and improved application reliability',
      'Collaborated directly with stakeholders to turn business requirements into technical solutions',
    ],
    tags: ['Angular', 'TypeScript', 'Express', '.NET', 'MariaDB', 'Docker'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Core',
    items: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Next.js'],
    primary: true,
  },
  {
    label: 'Backend & Data',
    items: ['REST APIs', 'PostgreSQL', 'MariaDB', 'Redis', 'tRPC', 'Drizzle'],
    primary: true,
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'Linux', 'CI/CD', 'Traefik', 'Kubernetes'],
    primary: false,
  },
  {
    label: 'Additional Experience',
    items: ['.NET', 'Python', 'Go', 'Rust', 'Embedded Systems'],
    primary: false,
  },
]
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
npx tsc --noEmit
```

Expected: No errors from `src/lib/data.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts tailwind.config.ts src/app/globals.css .gitignore
git commit -m "feat: add data layer and base config for redesign"
```

---

## Task 2: Providers & Layout

**Files:**
- Create: `src/components/Providers.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create src/components/Providers.tsx**

```tsx
'use client'

import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
```

- [ ] **Step 2: Rewrite src/app/layout.tsx**

Note: The existing `layout.tsx` has a Umami analytics `<Script>` tag — preserve it verbatim. Also preserve the `/caye-pc.png` favicon.

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cayetano Biehler — Backend-focused Software Engineer',
  description:
    'Software Engineer based in Málaga. Backend, APIs, databases, full-stack. 4+ years building production applications.',
  icons: {
    icon: '/caye-pc.png',
  },
  openGraph: {
    title: 'Cayetano Biehler — Backend-focused Software Engineer',
    description:
      'Software Engineer based in Málaga. Backend, APIs, databases, full-stack.',
    url: 'https://iamcaye.com',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://umami.iamcaye.com/script.js"
        data-website-id="05fc82e0-3b27-4b80-a434-84abbd183131"
      />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

Note: `suppressHydrationWarning` on `<html>` is required by next-themes to prevent the hydration mismatch caused by the class being set client-side. The Umami script and favicon are preserved from the original layout.

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Open http://localhost:3000. The page will be broken (old components still imported) but the server should start without crashing. If you see "Module not found: @nextui-org/react", that's expected — fix in next task.

---

## Task 3: Shared Components

**Files:**
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/MotionSection.tsx`

- [ ] **Step 1: Create src/components/SectionHeader.tsx**

```tsx
interface Props {
  label: string
  title: string
}

export default function SectionHeader({ label, title }: Props) {
  return (
    <div className="mb-12">
      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#444]">
        {label}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111] dark:text-[#fafafa]">
        {title}
      </h2>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/MotionSection.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export default function MotionSection({ children, className = '', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

---

## Task 4: Navbar

**Files:**
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Create src/components/Navbar.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf8]/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-[#e8e6e0] dark:border-[#222]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <Link
          href="#hero"
          className="font-bold text-sm tracking-wide text-[#111] dark:text-[#fafafa]"
        >
          caye.
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
            >
              {label}
            </a>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors text-base leading-none"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
            </button>
          )}
          <a
            href="/cv.pdf"
            className="bg-[#f97316] text-[#111] font-semibold text-sm px-4 py-1.5 rounded hover:bg-[#ea6c0a] transition-colors"
          >
            Download CV ↓
          </a>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-[#737373] text-base"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
            </button>
          )}
          <button
            className="text-[#737373] dark:text-[#737373] text-lg leading-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e8e6e0] dark:border-[#222] bg-[#fafaf8] dark:bg-[#111111] px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            className="bg-[#f97316] text-[#111] font-semibold text-sm px-4 py-2.5 rounded text-center mt-1"
          >
            Download CV ↓
          </a>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Verify types**

```bash
npx tsc --noEmit 2>&1 | grep "Navbar"
```

Expected: No errors mentioning Navbar.

---

## Task 5: Hero

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Create src/components/Hero.tsx**

```tsx
'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

const stack = ['TypeScript', 'Node.js', 'PostgreSQL', 'Angular', 'Next.js']

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-56px)] flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto py-20 relative"
    >
      <motion.span
        {...fadeUp(0)}
        className="text-[#f97316] text-[10px] font-semibold tracking-[0.25em] uppercase mb-5 block"
      >
        Software Engineer
      </motion.span>

      <motion.h1
        {...fadeUp(0.1)}
        className="text-5xl md:text-[68px] font-extrabold tracking-[-1.5px] text-[#111] dark:text-[#fafafa] leading-[1.05] mb-5"
      >
        Hi, I&apos;m<br />Cayetano.
      </motion.h1>

      <motion.p
        {...fadeUp(0.2)}
        className="text-lg md:text-xl text-[#555] dark:text-[#a3a3a3] mb-7 max-w-xl leading-relaxed"
      >
        Backend-focused Software Engineer building
        <br className="hidden md:block" /> web products from idea to production.
      </motion.p>

      <motion.div {...fadeUp(0.3)} className="flex items-center flex-wrap mb-8">
        {stack.map((tech, i) => (
          <Fragment key={tech}>
            <span className="font-mono text-xs text-[#737373]">{tech}</span>
            {i < stack.length - 1 && (
              <span className="mx-2 font-mono text-xs text-[#ccc] dark:text-[#2a2a2a]">·</span>
            )}
          </Fragment>
        ))}
      </motion.div>

      <motion.p
        {...fadeUp(0.4)}
        className="text-sm leading-[1.8] text-[#737373] border-l-2 border-[#f97316] pl-5 mb-10 max-w-lg"
      >
        Software Engineer based in Málaga with more than 4 years of experience building and
        maintaining production applications. I work across the full stack, with a strong focus on
        backend architecture, APIs, databases and infrastructure.
      </motion.p>

      <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3">
        <a
          href="#projects"
          className="bg-[#f97316] text-[#111] font-semibold text-sm px-6 py-3 rounded hover:bg-[#ea6c0a] transition-colors"
        >
          View my work →
        </a>
        <a
          href="/cv.pdf"
          className="border border-[#d4d0c8] dark:border-[#2a2a2a] text-[#111] dark:text-[#fafafa] font-medium text-sm px-6 py-3 rounded hover:border-[#999] dark:hover:border-[#555] transition-colors"
        >
          Download CV ↓
        </a>
        <a
          href="#contact"
          className="text-[#737373] font-normal text-sm px-6 py-3 hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
        >
          Contact me
        </a>
      </motion.div>

      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3 text-[#ccc] dark:text-[#333] text-[10px] tracking-[0.15em] uppercase select-none">
        <div className="w-10 h-px bg-[#ccc] dark:bg-[#333]" />
        Scroll
      </div>
    </section>
  )
}
```

---

## Task 6: Projects

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/Projects.tsx`

- [ ] **Step 1: Create src/components/ProjectCard.tsx**

```tsx
import { Project } from '@/lib/data'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="flex flex-col bg-white dark:bg-[#161616] border border-[#e8e6e0] dark:border-[#222] rounded-lg overflow-hidden hover:border-[#f97316] dark:hover:border-[#f97316] transition-colors h-full">
      {/* Screenshot placeholder */}
      <div className="h-48 bg-[#f0efeb] dark:bg-[#1c1c1c] flex items-center justify-center border-b border-[#e8e6e0] dark:border-[#222] shrink-0">
        <span className="font-mono text-[10px] text-[#ccc] dark:text-[#2a2a2a] tracking-widest uppercase">
          screenshot
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#111] dark:text-[#fafafa] mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-[#737373] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-[#555] dark:text-[#555] bg-[#f5f5f0] dark:bg-[#1c1c1c] border border-[#e8e6e0] dark:border-[#2a2a2a] px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          {project.links.demo && (
            <a
              href={project.links.demo}
              className="text-xs text-[#f97316] hover:underline"
            >
              Live demo ↗
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              className="text-xs text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
            >
              GitHub
            </a>
          )}
          {project.links.caseStudy && (
            <a
              href={project.links.caseStudy}
              className="text-xs text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
            >
              Case study
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/Projects.tsx**

```tsx
import { projects } from '@/lib/data'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="01 · Selected Projects" title="Things I've built" />
      </MotionSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <MotionSection key={project.name} delay={i * 0.1}>
            <ProjectCard project={project} />
          </MotionSection>
        ))}
      </div>
    </section>
  )
}
```

---

## Task 7: Experience

**Files:**
- Create: `src/components/Experience.tsx`

- [ ] **Step 1: Create src/components/Experience.tsx**

```tsx
import { experience } from '@/lib/data'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="02 · Experience" title="Where I've worked" />
      </MotionSection>

      <div className="flex flex-col gap-16">
        {experience.map((entry, i) => (
          <MotionSection key={entry.company} delay={i * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12">
              {/* Meta column */}
              <div className="pt-1">
                <p className="font-mono text-xs text-[#f97316] font-semibold tracking-wide mb-2">
                  {entry.period}
                </p>
                <a
                  href={entry.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#555] dark:text-[#555] border-b border-[#d4d0c8] dark:border-[#333] pb-px hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
                >
                  {entry.company}
                </a>
              </div>

              {/* Content column */}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#111] dark:text-[#fafafa] mb-3">
                  {entry.role}
                </h3>
                <p className="text-sm text-[#737373] leading-relaxed mb-5">
                  {entry.description}
                </p>
                <ul className="flex flex-col gap-2.5 mb-5">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm text-[#555] dark:text-[#a3a3a3] leading-relaxed"
                    >
                      <span className="text-[#f97316] mt-px shrink-0 text-xs">→</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Metrics placeholder — remove when real data available */}
                <div className="border border-dashed border-[#d4d0c8] dark:border-[#2a2a2a] rounded-md px-4 py-3 mb-5">
                  <p className="text-xs text-[#bbb] dark:text-[#444] italic">
                    Space reserved for metrics (e.g. &ldquo;Reduced report generation time by X%&rdquo;)
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#e8e6e0] dark:border-[#1a1a1a]">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-[#555] dark:text-[#555] bg-[#f5f5f0] dark:bg-[#1c1c1c] border border-[#e8e6e0] dark:border-[#2a2a2a] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </MotionSection>
        ))}
      </div>
    </section>
  )
}
```

---

## Task 8: Skills

**Files:**
- Create: `src/components/Skills.tsx`

- [ ] **Step 1: Create src/components/Skills.tsx**

```tsx
import { skillGroups } from '@/lib/data'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'
import { Fragment } from 'react'

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="03 · Skills" title="What I work with" />
      </MotionSection>

      <MotionSection delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {skillGroups.map((group, i) => {
            const isOdd = i % 2 === 0
            const isLastRow = i >= skillGroups.length - 2
            return (
              <div
                key={group.label}
                className={[
                  'py-7',
                  isOdd
                    ? 'md:pr-10 md:border-r border-[#e8e6e0] dark:border-[#1a1a1a]'
                    : 'md:pl-10',
                  !isLastRow ? 'border-b border-[#e8e6e0] dark:border-[#1a1a1a]' : '',
                ].join(' ')}
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999] dark:text-[#444] mb-4">
                  {group.label}
                </p>

                {group.label === 'Additional Experience' ? (
                  <div className="flex flex-wrap gap-x-0 gap-y-1">
                    {group.items.map((item, j) => (
                      <Fragment key={item}>
                        <span className="text-sm text-[#bbb] dark:text-[#444]">{item}</span>
                        {j < group.items.length - 1 && (
                          <span className="text-sm text-[#ddd] dark:text-[#333] mx-2">·</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={`text-sm ${
                          group.primary
                            ? 'text-[#111] dark:text-[#fafafa] font-medium'
                            : 'text-[#555] dark:text-[#a3a3a3]'
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </MotionSection>
    </section>
  )
}
```

---

## Task 9: About

**Files:**
- Create: `src/components/About.tsx`

- [ ] **Step 1: Create src/components/About.tsx**

```tsx
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

const facts = [
  { label: 'Location', value: 'Málaga, Spain' },
  { label: 'Focus', value: 'Backend · APIs · Infrastructure' },
  { label: 'Experience', value: '4+ years in production' },
  { label: 'Currently building', value: 'Kreate · Nottes' },
]

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="04 · About" title="A bit about me" />
      </MotionSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <MotionSection delay={0.1}>
          <div className="flex flex-col gap-5">
            <p className="text-lg text-[#555] dark:text-[#a3a3a3] leading-relaxed">
              I enjoy taking ownership of features from the initial idea to production.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              Understanding the problem, designing the data model, building the API, implementing
              the interface and deploying the final solution — that&apos;s the kind of work I find
              most satisfying.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              I care about{' '}
              <span className="text-[#555] dark:text-[#a3a3a3] font-medium">
                maintainable code
              </span>
              ,{' '}
              <span className="text-[#555] dark:text-[#a3a3a3] font-medium">
                pragmatic architecture
              </span>{' '}
              and building products that solve real problems.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              When I&apos;m not working on production systems, I build personal projects that let
              me explore new tools and ideas — usually involving a terminal.
            </p>
          </div>
        </MotionSection>

        <MotionSection delay={0.2}>
          <div className="flex flex-col gap-6">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-[#f97316] pl-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999] dark:text-[#444] mb-1">
                  {fact.label}
                </p>
                <p className="text-sm text-[#555] dark:text-[#a3a3a3]">{fact.value}</p>
              </div>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>
  )
}
```

---

## Task 10: Contact & Footer

**Files:**
- Create: `src/components/Contact.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create src/components/Contact.tsx**

```tsx
import MotionSection from './MotionSection'

const contactLinks = [
  {
    label: 'Email',
    display: 'cayetano.biehler@gmail.com',
    href: 'mailto:cayetano.biehler@gmail.com',
    external: false,
  },
  {
    label: 'LinkedIn',
    display: '/in/cayetanobiehler',
    href: 'https://www.linkedin.com/in/cayetanobiehler/',
    external: true,
  },
  {
    label: 'GitHub',
    display: 'github.com/iamcaye',
    href: 'https://github.com/iamcaye',
    external: true,
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#444] mb-10">
          05 · Contact
        </p>
      </MotionSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <MotionSection delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111] dark:text-[#fafafa] leading-[1.1] mb-4">
            Let&apos;s build<br />something{' '}
            <span className="text-[#f97316]">useful.</span>
          </h2>
          <p className="text-sm text-[#737373] leading-relaxed mb-8 max-w-sm">
            Open to interesting projects, collaborations or just a good conversation about software.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:cayetano.biehler@gmail.com"
              className="bg-[#f97316] text-[#111] font-semibold text-sm px-6 py-3 rounded hover:bg-[#ea6c0a] transition-colors"
            >
              Send me an email
            </a>
            <a
              href="/cv.pdf"
              className="border border-[#d4d0c8] dark:border-[#2a2a2a] text-[#111] dark:text-[#fafafa] font-medium text-sm px-6 py-3 rounded hover:border-[#999] dark:hover:border-[#555] transition-colors"
            >
              Download CV ↓
            </a>
          </div>
        </MotionSection>

        <MotionSection delay={0.2}>
          <div className="flex flex-col gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-[#161616] border border-[#e8e6e0] dark:border-[#222] rounded-lg hover:border-[#f97316] dark:hover:border-[#f97316] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#111] dark:text-[#fafafa]">
                    {link.label}
                  </p>
                  <p className="text-xs text-[#999] dark:text-[#555] mt-0.5">{link.display}</p>
                </div>
              </a>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create src/components/Footer.tsx**

```tsx
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e8e6e0] dark:border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-xs text-[#999] dark:text-[#444] font-mono">
          Cayetano Biehler · {year}
        </span>
        <span className="text-xs text-[#ccc] dark:text-[#2a2a2a]">
          Built with Next.js · Designed with intent
        </span>
      </div>
    </footer>
  )
}
```

---

## Task 11: Page Assembly & Cleanup

**Files:**
- Modify: `src/app/page.tsx`
- Delete: all old components, pages, and models

- [ ] **Step 1: Rewrite src/app/page.tsx**

```tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#111111]">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and verify the new page loads**

```bash
npm run dev
```

Open http://localhost:3000. You should see the new portfolio with dark mode active. Check:
- Navbar is sticky and shows all links + orange CV button
- Hero fills viewport with the name, title, stack, bio and CTAs
- All sections scroll smoothly with anchor links

- [ ] **Step 3: Delete old files**

```bash
rm src/components/card-component.tsx
rm src/components/coding-languages.tsx
rm src/components/footer.tsx
rm src/components/nav-bar.tsx
rm src/components/skill-card.tsx
rm src/components/table-component.tsx
rm src/models/CodingLanguage.ts
rm src/models/Skills.ts
rm src/pages/git-projects.tsx
rm src/pages/skills.tsx
rm src/pages/td-info.tsx
rm src/pages/work-experience.tsx
rm src/app/providers.tsx
```

- [ ] **Step 4: Verify the build is clean**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors and no missing import warnings. If there are lint errors about unused imports, check that no old file still imports deleted components.

- [ ] **Step 5: Check dark/light mode toggle**

With dev server running, click the ○/● button in the navbar. Verify:
- Dark → light: background becomes `#fafaf8` (warm white), text becomes dark
- Light → dark: background becomes `#111111`, text becomes light
- Orange accent remains the same in both modes
- Navbar becomes translucent on scroll

- [ ] **Step 6: Check mobile layout**

Resize browser to 375px width. Verify:
- Navbar shows hamburger menu
- Menu opens and closes correctly
- Hero text wraps without overflow
- Project cards stack vertically
- Experience two-column becomes single column
- Skills grid stacks to single column

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign with dark/light mode"
```

---

## Post-Launch Checklist (manual, not automated)

These require assets you'll add later:

- [ ] Add `public/cv.pdf` — CV file for the Download CV button
- [ ] Replace screenshot placeholders in `ProjectCard.tsx` with real images in `public/screenshots/`
- [ ] Update `project.links` in `src/lib/data.ts` with real URLs (demo, GitHub repos)
- [ ] Add real Open Graph image to `src/app/layout.tsx` metadata
