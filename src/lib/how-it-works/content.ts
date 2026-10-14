import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { type Chapter, parseFrontmatter, sortByChapter, validateCollection } from './schema'

export const CONTENT_DIR = path.join(process.cwd(), 'content', 'how-it-works')

export interface ContentIssue {
  file?: string
  message: string
}

export interface LoadResult {
  chapters: Chapter[]
  issues: ContentIssue[]
}

export function parseChapterSource(source: string, fileName: string) {
  const { data, content } = matter(source)
  const { value, errors } = parseFrontmatter(data, fileName)
  return {
    chapter: value ? ({ ...value, fileName, body: content } satisfies Chapter) : undefined,
    errors,
  }
}

// Reads every chapter, collecting problems instead of throwing so the CI
// validator can report all of them at once.
export function loadChapters(dir: string = CONTENT_DIR): LoadResult {
  const issues: ContentIssue[] = []
  const chapters: Chapter[] = []

  if (!fs.existsSync(dir)) return { chapters, issues }

  for (const fileName of fs.readdirSync(dir).sort()) {
    if (fileName.startsWith('.')) continue
    const filePath = path.join(dir, fileName)
    if (!fs.statSync(filePath).isFile()) {
      issues.push({ file: fileName, message: 'unexpected directory; put assets in public/how-it-works/<slug>/' })
      continue
    }
    const { chapter, errors } = parseChapterSource(fs.readFileSync(filePath, 'utf8'), fileName)
    errors.forEach((message) => issues.push({ file: fileName, message }))
    if (chapter) {
      if (chapter.body.trim().length === 0) {
        issues.push({ file: fileName, message: 'chapter body is empty' })
      }
      chapters.push(chapter)
    }
  }

  validateCollection(chapters).forEach((message) => issues.push({ message }))
  return { chapters: sortByChapter(chapters), issues }
}

// Drafts are only ever rendered by `next dev` with an explicit opt-in.
const showDrafts =
  process.env.NODE_ENV === 'development' && process.env.HOW_IT_WORKS_SHOW_DRAFTS === 'true'

let cache: Chapter[] | undefined

function allChapters(): Chapter[] {
  if (cache && process.env.NODE_ENV === 'production') return cache
  const { chapters, issues } = loadChapters()
  if (issues.length > 0) {
    // Failing the build keeps the previous deployment live.
    const details = issues.map((i) => `  - ${i.file ? `${i.file}: ` : ''}${i.message}`).join('\n')
    throw new Error(`Invalid How It Works content:\n${details}`)
  }
  cache = chapters
  return chapters
}

export function getPublishedChapters(): Chapter[] {
  return allChapters().filter((c) => c.status === 'published' || showDrafts)
}

export function getChapter(slug: string): Chapter | undefined {
  return getPublishedChapters().find((c) => c.slug === slug)
}

export function getNeighbors(slug: string) {
  const chapters = getPublishedChapters()
  const index = chapters.findIndex((c) => c.slug === slug)
  return {
    previous: index > 0 ? chapters[index - 1] : undefined,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined,
  }
}

export function readingMinutes(body: string): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}
