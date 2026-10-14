// Pull request rules that depend on the target branch, not just the files in
// the PR. Pure so it can be unit tested; scripts/validate-how-it-works.ts
// gathers the git data.
import { type ChapterStatus, formatChapterNumber } from './schema'

export const CONTENT_PREFIX = 'content/how-it-works/'
export const ASSET_PREFIX = 'public/how-it-works/'
export const CHAPTER_BRANCH_PATTERN = /^how-it-works\/chapter-(\d{3})$/

export interface ChapterRef {
  path: string
  chapter: number
  slug: string
  status: ChapterStatus
}

export interface FileChange {
  // git diff --name-status letter: A, M, D, T...
  status: string
  path: string
}

export interface PublicationInput {
  headBranch: string
  changes: FileChange[]
  // Chapters at the commit the PR branched from (what the PR is changing).
  mergeBase: ChapterRef[]
  // Chapters at the current tip of the target branch (may be newer).
  latestBase: ChapterRef[]
  // Chapters in the proposed tree.
  head: ChapterRef[]
}

const isChapterFile = (path: string) => path.startsWith(CONTENT_PREFIX) && path.endsWith('.mdx')

export interface PublicationIssue {
  file?: string
  message: string
}

export function checkPublication(input: PublicationInput): PublicationIssue[] {
  const errors: PublicationIssue[] = []
  const byPath = (refs: ChapterRef[]) => new Map(refs.map((r) => [r.path, r]))
  const before = byPath(input.mergeBase)
  const after = byPath(input.head)

  // Published chapters are public URLs: never delete, renumber, re-slug or unpublish them.
  for (const change of input.changes) {
    const old = before.get(change.path)
    if (!old || old.status !== 'published') continue
    const label = `published chapter ${formatChapterNumber(old.chapter)} (${old.slug})`
    if (change.status === 'D') {
      errors.push({ file: change.path, message: `deletes ${label}; published chapters cannot be removed` })
      continue
    }
    const now = after.get(change.path)
    if (!now) continue
    if (now.slug !== old.slug) errors.push({ file: change.path, message: `changes the slug of ${label}; this would break its URL` })
    if (now.chapter !== old.chapter) errors.push({ file: change.path, message: `renumbers ${label}` })
    if (now.status !== 'published') errors.push({ file: change.path, message: `unpublishes ${label}` })
  }

  // New chapters must not collide with anything on the *current* target branch,
  // which may have moved since this PR was opened (concurrent publications).
  const addedFiles = input.changes.filter((c) => c.status === 'A' && isChapterFile(c.path))
  // Files whose frontmatter failed to parse are reported by the content checks.
  const added = addedFiles
    .map((c) => after.get(c.path))
    .filter((r): r is ChapterRef => Boolean(r))
  for (const chapter of added) {
    for (const existing of input.latestBase) {
      if (existing.path === chapter.path) continue
      if (existing.chapter === chapter.chapter) {
        errors.push({ file: chapter.path, message: `chapter number ${formatChapterNumber(chapter.chapter)} is already used on the target branch by ${existing.path}` })
      }
      if (existing.slug === chapter.slug) {
        errors.push({ file: chapter.path, message: `slug "${chapter.slug}" is already used on the target branch by ${existing.path}` })
      }
    }
  }

  const branch = CHAPTER_BRANCH_PATTERN.exec(input.headBranch)
  if (!branch) return errors

  // Publication branches are add-only: exactly one new chapter plus its assets.
  const expected = Number(branch[1])
  const disallowed = input.changes.filter(
    (c) => !(c.status === 'A' && (isChapterFile(c.path) || c.path.startsWith(ASSET_PREFIX))),
  )
  for (const change of disallowed) {
    errors.push({ file: change.path, message: `publication branches may only add one chapter file and its assets (found change type "${change.status}")` })
  }

  if (addedFiles.length !== 1) {
    errors.push({ message: `publication branch must add exactly one chapter under ${CONTENT_PREFIX} (found ${addedFiles.length})` })
    return errors
  }

  const [chapter] = added
  if (!chapter) return errors
  if (chapter.chapter !== expected) {
    errors.push({ file: chapter.path, message: `branch ${input.headBranch} expects chapter ${formatChapterNumber(expected)} but the file declares ${formatChapterNumber(chapter.chapter)}` })
  }
  const nextFree = Math.max(0, ...input.latestBase.map((c) => c.chapter)) + 1
  if (chapter.chapter !== nextFree) {
    errors.push({ file: chapter.path, message: `the next free chapter number on the target branch is ${formatChapterNumber(nextFree)}, not ${formatChapterNumber(chapter.chapter)}` })
  }
  for (const change of input.changes) {
    if (change.path.startsWith(ASSET_PREFIX) && !change.path.startsWith(`${ASSET_PREFIX}${chapter.slug}/`)) {
      errors.push({ file: change.path, message: `assets must live in ${ASSET_PREFIX}${chapter.slug}/` })
    }
  }

  return errors
}
