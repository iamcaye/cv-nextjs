/**
 * Validates How It Works chapters.
 *
 *   npm run content:validate
 *     Frontmatter, collection rules (unique/consecutive numbers, unique slugs,
 *     chronology), MDX compilation + render, internal links and local assets.
 *
 *   npm run content:validate -- --pr --base origin/main --head-branch how-it-works/chapter-003
 *     Additionally checks the PR against the target branch: no overwriting or
 *     deleting published chapters, no number/slug collisions with chapters that
 *     landed after the PR was opened, and add-only publication branches.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { renderToStaticMarkup } from 'react-dom/server'
import { mdxComponents } from '../src/components/how-it-works/mdx-components'
import { CONTENT_DIR, loadChapters, parseChapterSource } from '../src/lib/how-it-works/content'
import { renderMdx } from '../src/lib/how-it-works/mdx'
import { type ChapterRef, CONTENT_PREFIX, checkPublication } from '../src/lib/how-it-works/publication'
import type { Chapter } from '../src/lib/how-it-works/schema'

const MIN_PUBLISHED_WORDS = 800
const STATIC_ROUTES = new Set(['/', '/how-it-works', '/how-it-works/feed.xml', '/sitemap.xml', '/robots.txt'])

const { values: args } = parseArgs({
  options: {
    pr: { type: 'boolean', default: false },
    base: { type: 'string' },
    'head-branch': { type: 'string', default: '' },
  },
})

const root = process.cwd()
const publicDir = path.join(root, 'public')
const inActions = process.env.GITHUB_ACTIONS === 'true'

interface Problem {
  file?: string
  line?: number
  message: string
}
const problems: Problem[] = []

const relative = (fileName: string) => path.posix.join(CONTENT_PREFIX, fileName)
const decode = (value: string) =>
  value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const collect = (html: string, attribute: string) =>
  Array.from(html.matchAll(new RegExp(`\\s${attribute}="([^"]*)"`, 'g')), (m) => decode(m[1]))

function wordCount(body: string) {
  return body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
}

async function validateContent() {
  const { bundledLanguages, bundledLanguagesAlias } = await import('shiki')
  const knownLanguages = new Set([
    ...Object.keys(bundledLanguages),
    ...Object.keys(bundledLanguagesAlias),
    'text',
    'plaintext',
    'txt',
  ])
  const { chapters, issues } = loadChapters(CONTENT_DIR)
  issues.forEach((i) => problems.push({ file: i.file && relative(i.file), message: i.message }))

  const rendered = new Map<string, { chapter: Chapter; html: string; ids: Set<string> }>()
  for (const chapter of chapters) {
    const file = relative(chapter.fileName)
    // gray-matter strips the frontmatter; offset MDX line numbers back to the file.
    const source = fs.readFileSync(path.join(CONTENT_DIR, chapter.fileName), 'utf8')
    const lineOffset = source.slice(0, source.length - chapter.body.length).split('\n').length - 1
    try {
      const html = renderToStaticMarkup(await renderMdx(chapter.body, mdxComponents))
      rendered.set(chapter.slug, { chapter, html, ids: new Set(collect(html, 'id')) })
    } catch (error) {
      const err = error as { reason?: string; message?: string; line?: number }
      problems.push({
        file,
        line: err.line ? err.line + lineOffset : undefined,
        message: `MDX error: ${err.reason ?? err.message ?? String(error)}`,
      })
    }

    for (const [, lang] of Array.from(chapter.body.matchAll(/^\s*(?:```|~~~)([\w#+.-]+)/gm))) {
      if (!knownLanguages.has(lang.toLowerCase())) {
        problems.push({ file, message: `code block language "${lang}" is not supported by the highlighter; use a close match (e.g. cpp for CUDA) or "text"` })
      }
    }
    if (/^#\s/m.test(chapter.body.replace(/```[\s\S]*?```/g, ''))) {
      problems.push({ file, message: 'do not use "# " headings; the page renders the title as the only h1. Start sections at "##"' })
    }
    if (chapter.status === 'published' && wordCount(chapter.body) < MIN_PUBLISHED_WORDS) {
      problems.push({
        file,
        message: `published chapters need at least ${MIN_PUBLISHED_WORDS} words (found ${wordCount(chapter.body)}); is the content truncated?`,
      })
    }
  }

  const published = new Set(chapters.filter((c) => c.status === 'published').map((c) => c.slug))
  const allSlugs = new Set(chapters.map((c) => c.slug))

  rendered.forEach(({ chapter, html, ids }) => {
    const file = relative(chapter.fileName)
    const reachable = chapter.status === 'published' ? published : allSlugs

    for (const href of collect(html, 'href')) {
      if (/^(https?:|mailto:)/i.test(href) || href.startsWith('//')) continue
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        problems.push({ file, message: `link "${href}" uses a disallowed URL scheme` })
        continue
      }
      const [pathname, hash] = href.split('#') as [string, string | undefined]
      if (pathname === '') {
        if (hash && !ids.has(hash)) problems.push({ file, message: `anchor "#${hash}" does not match any heading in this chapter` })
        continue
      }
      if (!pathname.startsWith('/')) {
        problems.push({ file, message: `link "${href}" must be absolute (start with "/") or a full URL` })
        continue
      }
      const chapterLink = /^\/how-it-works\/([^/]+)\/?$/.exec(pathname)
      if (chapterLink && chapterLink[1] !== 'feed.xml') {
        const target = chapterLink[1]
        if (!reachable.has(target)) {
          problems.push({ file, message: `link "${href}" points to a chapter that is not ${chapter.status === 'published' ? 'published' : 'present'}` })
        } else if (hash && !rendered.get(target)?.ids.has(hash)) {
          problems.push({ file, message: `link "${href}": "#${hash}" does not match any heading in "${target}"` })
        }
        continue
      }
      if (!STATIC_ROUTES.has(pathname.replace(/\/$/, '') || '/') && !fs.existsSync(path.join(publicDir, pathname))) {
        problems.push({ file, message: `link "${href}" does not match a known page or a file in public/` })
      }
    }

    for (const src of collect(html, 'src')) {
      if (/^https:\/\//i.test(src)) continue
      if (!src.startsWith('/') || !fs.existsSync(path.join(publicDir, src.split(/[?#]/)[0]))) {
        problems.push({ file, message: `image "${src}" must be https:// or a file in public/ (e.g. /how-it-works/${chapter.slug}/diagram.svg)` })
      }
    }
  })

  return chapters
}

function git(...gitArgs: string[]) {
  return execFileSync('git', gitArgs, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim()
}

function chaptersAt(ref: string): ChapterRef[] {
  const files = git('ls-tree', '--name-only', ref, '--', CONTENT_PREFIX).split('\n').filter((f) => f.endsWith('.mdx'))
  return files.flatMap((file) => {
    const { chapter } = parseChapterSource(git('show', `${ref}:${file}`), path.posix.basename(file))
    return chapter ? [{ path: file, chapter: chapter.chapter, slug: chapter.slug, status: chapter.status }] : []
  })
}

function validatePullRequest(head: Chapter[]) {
  if (!args.base) {
    problems.push({ message: '--pr requires --base <ref> (e.g. origin/main)' })
    return
  }
  const mergeBase = git('merge-base', args.base, 'HEAD')
  const changes = git('diff', '--name-status', '--no-renames', mergeBase, 'HEAD', '--', CONTENT_PREFIX, 'public/how-it-works/')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, file] = line.split('\t')
      return { status: status[0], path: file }
    })

  const errors = checkPublication({
    headBranch: args['head-branch'] ?? '',
    changes,
    mergeBase: chaptersAt(mergeBase),
    latestBase: chaptersAt(args.base),
    head: head.map((c) => ({ path: relative(c.fileName), chapter: c.chapter, slug: c.slug, status: c.status })),
  })
  problems.push(...errors)
  console.log(`Publication guard: ${changes.length} changed content file(s) compared with ${args.base}`)
}

function escapeAnnotation(value: string) {
  return value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
}

async function main() {
  const chapters = await validateContent()
  if (args.pr) validatePullRequest(chapters)

  if (problems.length === 0) {
    const published = chapters.filter((c) => c.status === 'published').length
    console.log(`✓ How It Works: ${chapters.length} chapter(s) valid (${published} published, ${chapters.length - published} draft)`)
    return
  }

  for (const p of problems) {
    const where = p.file ? `${p.file}${p.line ? `:${p.line}` : ''}: ` : ''
    console.error(`✗ ${where}${p.message}`)
    if (inActions) {
      const props = [p.file && `file=${p.file}`, p.line && `line=${p.line}`, 'title=How It Works'].filter(Boolean).join(',')
      console.log(`::error ${props}::${escapeAnnotation(p.message)}`)
    }
  }
  console.error(`\n${problems.length} problem(s) found.`)
  process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
