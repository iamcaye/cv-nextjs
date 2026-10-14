import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { type ChapterRef, checkPublication } from './publication'
import { parseFrontmatter, validateCollection } from './schema'

const valid = {
  title: 'How GPUs Work',
  slug: 'how-gpus-work',
  chapter: 2,
  description: 'Understanding GPU architecture and parallel computing.',
  publishedAt: '2026-10-14',
  category: 'Computing',
  tags: ['GPU', 'Hardware'],
  status: 'published',
  nextChapterSuggestion: 'How the Internet Works',
}

describe('parseFrontmatter', () => {
  it('accepts valid frontmatter', () => {
    const { value, errors } = parseFrontmatter(valid, '002-how-gpus-work.mdx')
    assert.deepEqual(errors, [])
    assert.equal(value?.slug, 'how-gpus-work')
  })

  it('normalizes YAML dates', () => {
    const { value } = parseFrontmatter({ ...valid, publishedAt: new Date('2026-10-14T00:00:00Z') }, '002-how-gpus-work.mdx')
    assert.equal(value?.publishedAt, '2026-10-14')
  })

  it('reports missing, unknown and malformed fields', () => {
    const { value, errors } = parseFrontmatter(
      { ...valid, title: undefined, extra: true, status: 'live', publishedAt: '2026-02-30', slug: 'Bad Slug' },
      '002-how-gpus-work.mdx',
    )
    assert.equal(value, undefined)
    assert.ok(errors.some((e) => e.includes('"title"')))
    assert.ok(errors.some((e) => e.includes('unknown field "extra"')))
    assert.ok(errors.some((e) => e.includes('"status"')))
    assert.ok(errors.some((e) => e.includes('"publishedAt"')))
    assert.ok(errors.some((e) => e.includes('"slug"')))
  })

  it('requires the file name to match chapter and slug', () => {
    assert.ok(parseFrontmatter(valid, '003-how-gpus-work.mdx').errors.some((e) => e.includes('prefix 003')))
    assert.ok(parseFrontmatter(valid, '002-gpus.mdx').errors.some((e) => e.includes('slug "gpus"')))
    assert.ok(parseFrontmatter(valid, 'how-gpus-work.mdx').errors.some((e) => e.includes('NNN-slug.mdx')))
  })
})

describe('validateCollection', () => {
  const c = (chapter: number, slug: string, publishedAt = '2026-10-14', status: 'draft' | 'published' = 'published') => ({
    fileName: `${String(chapter).padStart(3, '0')}-${slug}.mdx`,
    chapter,
    slug,
    status,
    publishedAt,
  })

  it('accepts a consistent collection', () => {
    assert.deepEqual(validateCollection([c(1, 'a', '2026-10-13'), c(2, 'b'), c(3, 'c', '2026-01-01', 'draft')]), [])
  })

  it('rejects duplicate numbers and slugs, including drafts', () => {
    const errors = validateCollection([c(1, 'a'), c(1, 'b', undefined, 'draft'), c(2, 'a')])
    assert.ok(errors.some((e) => e.includes('duplicate chapter number 001')))
    assert.ok(errors.some((e) => e.includes('duplicate slug "a"')))
  })

  it('rejects gaps and out-of-order dates', () => {
    assert.ok(validateCollection([c(1, 'a'), c(3, 'c')]).some((e) => e.includes('consecutive')))
    assert.ok(validateCollection([c(1, 'a', '2026-10-14'), c(2, 'b', '2026-10-13')]).some((e) => e.includes('chronological')))
  })
})

describe('checkPublication', () => {
  const ref = (chapter: number, slug: string, status: ChapterRef['status'] = 'published'): ChapterRef => ({
    path: `content/how-it-works/${String(chapter).padStart(3, '0')}-${slug}.mdx`,
    chapter,
    slug,
    status,
  })
  const base = [ref(1, 'perceptrons'), ref(2, 'gpus')]
  const added = ref(3, 'internet')

  it('accepts a clean publication branch', () => {
    assert.deepEqual(
      checkPublication({
        headBranch: 'how-it-works/chapter-003',
        changes: [{ status: 'A', path: added.path }, { status: 'A', path: 'public/how-it-works/internet/map.svg' }],
        mergeBase: base,
        latestBase: base,
        head: [...base, added],
      }),
      [],
    )
  })

  it('rejects a chapter number taken on the target branch after the PR was opened', () => {
    const competitor = ref(3, 'dns')
    const issues = checkPublication({
      headBranch: 'how-it-works/chapter-003',
      changes: [{ status: 'A', path: added.path }],
      mergeBase: base,
      latestBase: [...base, competitor],
      head: [...base, competitor, added],
    })
    assert.ok(issues.some((i) => i.message.includes('already used on the target branch')))
    assert.ok(issues.some((i) => i.message.includes('next free chapter number on the target branch is 004')))
  })

  it('makes publication branches add-only', () => {
    const issues = checkPublication({
      headBranch: 'how-it-works/chapter-003',
      changes: [{ status: 'A', path: added.path }, { status: 'M', path: base[0].path }],
      mergeBase: base,
      latestBase: base,
      head: [...base, added],
    })
    assert.ok(issues.some((i) => i.file === base[0].path && i.message.includes('may only add')))
  })

  it('rejects a branch/chapter mismatch and missing chapter', () => {
    assert.ok(
      checkPublication({
        headBranch: 'how-it-works/chapter-004',
        changes: [{ status: 'A', path: added.path }],
        mergeBase: base,
        latestBase: base,
        head: [...base, added],
      }).some((i) => i.message.includes('expects chapter 004')),
    )
    assert.ok(
      checkPublication({ headBranch: 'how-it-works/chapter-003', changes: [], mergeBase: base, latestBase: base, head: base }).some((i) =>
        i.message.includes('exactly one chapter'),
      ),
    )
  })

  it('protects published chapters on any branch but allows content edits', () => {
    const renamed = { ...base[1], slug: 'gpu' }
    const issues = checkPublication({
      headBranch: 'fix/typos',
      changes: [{ status: 'D', path: base[0].path }, { status: 'M', path: base[1].path }],
      mergeBase: base,
      latestBase: base,
      head: [renamed],
    })
    assert.ok(issues.some((i) => i.message.includes('cannot be removed')))
    assert.ok(issues.some((i) => i.message.includes('changes the slug')))

    assert.deepEqual(
      checkPublication({ headBranch: 'fix/typos', changes: [{ status: 'M', path: base[1].path }], mergeBase: base, latestBase: base, head: base }),
      [],
    )
  })
})
