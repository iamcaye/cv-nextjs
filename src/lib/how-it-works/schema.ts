// Pure validation for How It Works chapters. No filesystem access here so the
// same rules run in Next.js, in the CI validator and in unit tests.

export const CHAPTER_STATUSES = ['draft', 'published'] as const
export type ChapterStatus = (typeof CHAPTER_STATUSES)[number]

export interface ChapterFrontmatter {
  title: string
  slug: string
  chapter: number
  description: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  status: ChapterStatus
  nextChapterSuggestion: string
}

export interface Chapter extends ChapterFrontmatter {
  fileName: string
  body: string
}

// 001-from-perceptrons-to-llms.mdx
export const FILE_NAME_PATTERN = /^(\d{3})-([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const REQUIRED_KEYS = [
  'title',
  'slug',
  'chapter',
  'description',
  'publishedAt',
  'category',
  'tags',
  'status',
  'nextChapterSuggestion',
] as const
const OPTIONAL_KEYS = ['updatedAt'] as const
const KNOWN_KEYS = new Set<string>([...REQUIRED_KEYS, ...OPTIONAL_KEYS])

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

// YAML parses unquoted dates (2026-10-14) into Date objects. Accept both.
function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return undefined
  const parsed = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    return undefined
  }
  return value
}

function checkLength(
  errors: string[],
  key: string,
  value: string,
  min: number,
  max: number,
) {
  const length = value.trim().length
  if (length < min || length > max) {
    errors.push(`"${key}" must be between ${min} and ${max} characters (got ${length})`)
  }
}

export interface FrontmatterResult {
  value?: ChapterFrontmatter
  errors: string[]
}

export function parseFrontmatter(
  data: Record<string, unknown>,
  fileName: string,
): FrontmatterResult {
  const errors: string[] = []

  for (const key of REQUIRED_KEYS) {
    if (data[key] === undefined || data[key] === null) {
      errors.push(`missing required field "${key}"`)
    }
  }
  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.has(key)) errors.push(`unknown field "${key}"`)
  }

  const { title, slug, chapter, description, category, tags, status, nextChapterSuggestion } =
    data

  if (title !== undefined) {
    if (!isNonEmptyString(title)) errors.push('"title" must be a non-empty string')
    else checkLength(errors, 'title', title, 3, 120)
  }
  if (description !== undefined) {
    if (!isNonEmptyString(description)) errors.push('"description" must be a non-empty string')
    else checkLength(errors, 'description', description, 20, 300)
  }
  if (category !== undefined) {
    if (!isNonEmptyString(category)) errors.push('"category" must be a non-empty string')
    else checkLength(errors, 'category', category, 2, 40)
  }
  if (nextChapterSuggestion !== undefined) {
    if (!isNonEmptyString(nextChapterSuggestion)) {
      errors.push('"nextChapterSuggestion" must be a non-empty string')
    } else checkLength(errors, 'nextChapterSuggestion', nextChapterSuggestion, 3, 120)
  }

  if (slug !== undefined && (typeof slug !== 'string' || !SLUG_PATTERN.test(slug))) {
    errors.push('"slug" must be lowercase kebab-case (e.g. "how-gpus-work")')
  }

  if (chapter !== undefined && (!Number.isInteger(chapter) || (chapter as number) < 1 || (chapter as number) > 999)) {
    errors.push('"chapter" must be an integer between 1 and 999')
  }

  const publishedAt = data.publishedAt === undefined ? undefined : normalizeDate(data.publishedAt)
  if (data.publishedAt !== undefined && !publishedAt) {
    errors.push('"publishedAt" must be a valid date in YYYY-MM-DD format')
  }
  const updatedAt = data.updatedAt === undefined ? undefined : normalizeDate(data.updatedAt)
  if (data.updatedAt !== undefined && !updatedAt) {
    errors.push('"updatedAt" must be a valid date in YYYY-MM-DD format')
  }
  if (publishedAt && updatedAt && updatedAt < publishedAt) {
    errors.push('"updatedAt" cannot be earlier than "publishedAt"')
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags) || tags.length < 1 || tags.length > 10) {
      errors.push('"tags" must be a list with 1 to 10 entries')
    } else if (!tags.every(isNonEmptyString)) {
      errors.push('every entry in "tags" must be a non-empty string')
    } else if (new Set(tags.map((t) => t.toLowerCase())).size !== tags.length) {
      errors.push('"tags" contains duplicates')
    }
  }

  if (status !== undefined && !CHAPTER_STATUSES.includes(status as ChapterStatus)) {
    errors.push(`"status" must be one of: ${CHAPTER_STATUSES.join(', ')}`)
  }

  const match = FILE_NAME_PATTERN.exec(fileName)
  if (!match) {
    errors.push('file name must look like "NNN-slug.mdx" (e.g. "002-how-gpus-work.mdx")')
  } else {
    if (Number.isInteger(chapter) && Number(match[1]) !== chapter) {
      errors.push(`file name prefix ${match[1]} does not match "chapter: ${chapter}"`)
    }
    if (typeof slug === 'string' && match[2] !== slug) {
      errors.push(`file name slug "${match[2]}" does not match "slug: ${slug}"`)
    }
  }

  if (errors.length > 0) return { errors }

  return {
    errors,
    value: {
      title: (title as string).trim(),
      slug: slug as string,
      chapter: chapter as number,
      description: (description as string).trim(),
      publishedAt: publishedAt as string,
      ...(updatedAt ? { updatedAt } : {}),
      category: (category as string).trim(),
      tags: (tags as string[]).map((t) => t.trim()),
      status: status as ChapterStatus,
      nextChapterSuggestion: (nextChapterSuggestion as string).trim(),
    },
  }
}

export function formatChapterNumber(chapter: number): string {
  return String(chapter).padStart(3, '0')
}

export function sortByChapter<T extends Pick<ChapterFrontmatter, 'chapter'>>(items: T[]): T[] {
  return [...items].sort((a, b) => a.chapter - b.chapter)
}

// Rules that span the whole collection. `chapters` must include drafts so a
// draft cannot reserve a number or slug that a published chapter also uses.
export function validateCollection(
  chapters: Array<Pick<Chapter, 'fileName' | 'chapter' | 'slug' | 'status' | 'publishedAt'>>,
): string[] {
  const errors: string[] = []

  const bySlug = new Map<string, string[]>()
  const byNumber = new Map<number, string[]>()
  for (const c of chapters) {
    bySlug.set(c.slug, [...(bySlug.get(c.slug) ?? []), c.fileName])
    byNumber.set(c.chapter, [...(byNumber.get(c.chapter) ?? []), c.fileName])
  }
  bySlug.forEach((files, slug) => {
    if (files.length > 1) errors.push(`duplicate slug "${slug}" in ${files.join(', ')}`)
  })
  byNumber.forEach((files, number) => {
    if (files.length > 1) {
      errors.push(`duplicate chapter number ${formatChapterNumber(number)} in ${files.join(', ')}`)
    }
  })

  const numbers = Array.from(byNumber.keys()).sort((a, b) => a - b)
  const gapAt = numbers.findIndex((n, i) => n !== i + 1)
  if (gapAt !== -1) {
    errors.push(
      `chapter numbers must be consecutive starting at 001; expected ${formatChapterNumber(gapAt + 1)} but found ${formatChapterNumber(numbers[gapAt])}`,
    )
  }

  const published = sortByChapter(chapters.filter((c) => c.status === 'published'))
  for (let i = 1; i < published.length; i++) {
    const prev = published[i - 1]
    const curr = published[i]
    if (curr.publishedAt < prev.publishedAt) {
      errors.push(
        `chapter ${formatChapterNumber(curr.chapter)} (${curr.publishedAt}) is dated before chapter ${formatChapterNumber(prev.chapter)} (${prev.publishedAt}); published chapters must be chronological`,
      )
    }
  }

  return Array.from(new Set(errors))
}
