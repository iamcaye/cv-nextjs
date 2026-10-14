# How It Works — Implementation Plan

**Goal:** Add a Git-based, statically generated long-form section at `/how-it-works` that an external agent (a ChatGPT scheduled task, if its GitHub integration allows writes) can publish to through pull requests, with CI enforcing content rules and Dokploy deploying on merge.

**Architecture:** Chapters are MDX files in `content/how-it-works/NNN-slug.mdx` with YAML frontmatter. A typed loader (`src/lib/how-it-works/`) reads and validates them at build time; any invalid chapter fails `next build`, so a bad merge can never replace the running deployment. Pages are statically generated (`generateStaticParams` + `dynamicParams = false`); drafts are excluded from params, sitemap and RSS, so they 404. MDX is compiled with `@mdx-js/mdx` directly (no `next-mdx-remote`), restricted by a custom remark plugin to Markdown + allow-listed literal JSX, because MDX would otherwise run arbitrary JS from agent-authored content at build time.

**Tech Stack:** Next.js 13.4 app router, TypeScript, Tailwind, `@mdx-js/mdx`, `gray-matter`, `remark-gfm`, `remark-math` + `rehype-katex`, `rehype-slug`, `rehype-pretty-code` + `shiki` (build-time highlighting, dual light/dark themes), `tsx` (dev, runs the validator).

---

## Decisions

| Topic | Decision | Why |
|---|---|---|
| MDX runtime | `@mdx-js/mdx` `evaluate` in a server component | Fewer deps; same compiler used by the CI validator |
| Validation library | Hand-written, in `schema.ts` | No new runtime dep; rules are small |
| Code highlighting | `rehype-pretty-code` + shiki, CSS-variable dual theme | Zero client JS, follows the site's `.dark` class |
| Diagrams | SVG/PNG in `public/how-it-works/<slug>/` via `<Figure>`, or ```text blocks | Mermaid needs client JS or a headless browser at build |
| Typography | Newsreader (serif) for reading, existing Inter/mono for UI | Editorial reading without diverging from the portfolio |
| Draft privacy | Excluded at build; optional local preview with `HOW_IT_WORKS_SHOW_DRAFTS=true` in `next dev` only | Static output can't leak what isn't generated. Note: the repo is public, so draft *source* is visible on GitHub |
| Overwrite protection | CI "publication guard": agent branches `how-it-works/chapter-NNN` may only **add** one chapter (+ assets); other PRs may edit but not delete/unpublish/renumber/re-slug a published chapter | Prevents accidental overwrites while still allowing human edits |
| Concurrency | Branch name is a lock (`how-it-works/chapter-NNN` can only exist once); guard compares against the **latest** base tip, not only the merge ref; branch protection should require up-to-date branches | Two agents can't silently land the same number |
| CI shape | One `CI` workflow on every PR to `main` and every push to `main` (no path filters) | Safe to mark as required; path-filtered required checks hang forever |
| Auto-merge | Separate `workflow_run` workflow, off unless repo variable `HOW_IT_WORKS_AUTO_MERGE=true`; uses `gh pr merge --auto` (respects branch protection) | Write permissions isolated to one job; workflow code comes from `main`, not the PR |
| Deploy | Unchanged: Dokploy builds the existing `Dockerfile` on push to `main` | Requirement: don't replace deployment |

## File Map

**Create**
- `content/how-it-works/001-from-perceptrons-to-llms.mdx`, `002-how-gpus-work.mdx` — seed chapters
- `src/lib/how-it-works/schema.ts` — types, frontmatter + collection rules (pure)
- `src/lib/how-it-works/schema.test.ts` — unit tests (`node:test` via `tsx`)
- `src/lib/how-it-works/content.ts` — filesystem loader, public queries
- `src/lib/how-it-works/mdx.tsx` — MDX options, safe-MDX plugin, `renderMdx`
- `src/lib/site.ts` — site URL/name constants
- `src/components/how-it-works/mdx-components.tsx` — `Callout`, `Figure`, element overrides
- `src/app/how-it-works/layout.tsx`, `page.tsx`, `[slug]/page.tsx`, `feed.xml/route.ts`
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `scripts/validate-how-it-works.ts` — CI validator + publication guard
- `.github/workflows/ci.yml`, `.github/workflows/how-it-works-auto-merge.yml`
- `.github/PULL_REQUEST_TEMPLATE/how-it-works.md`
- `docs/how-it-works-publishing.md`, `docs/how-it-works-chatgpt-prompt.md`, `docs/how-it-works-editorial-guide.md`

**Modify**
- `src/components/Navbar.tsx` — `/#section` links so they work off the home page; add "How It Works"
- `src/app/layout.tsx` — `metadataBase`
- `src/app/globals.css` — `.hiw-prose` long-form styles, code theme switching
- `tailwind.config.ts` — `serif` font family
- `package.json` — deps and `typecheck`, `test`, `content:validate` scripts

## Tasks

- [x] Content schema + loader + unit tests
- [x] MDX pipeline with safe-MDX restrictions
- [x] Index and chapter pages, components, prose styles
- [x] SEO: metadata, canonical, OG, JSON-LD, sitemap, robots, RSS
- [x] Validator script + publication guard
- [x] CI + opt-in auto-merge workflows, PR template
- [x] Seed chapters
- [x] Docs: publishing contract, ChatGPT prompt, editorial guide
- [x] Verify: tests, validator negative cases, typecheck, lint, build, visual check of pages
