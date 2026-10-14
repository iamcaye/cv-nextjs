import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/components/how-it-works/format'
import { mdxComponents } from '@/components/how-it-works/mdx-components'
import {
  getChapter,
  getNeighbors,
  getPublishedChapters,
  readingMinutes,
} from '@/lib/how-it-works/content'
import { renderMdx } from '@/lib/how-it-works/mdx'
import { formatChapterNumber } from '@/lib/how-it-works/schema'
import { HOW_IT_WORKS, SITE_AUTHOR, SITE_URL } from '@/lib/site'

interface Props {
  params: { slug: string }
}

// Only published chapters are generated; everything else (drafts included) 404s.
export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedChapters().map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const chapter = getChapter(params.slug)
  if (!chapter) return {}
  const path = `${HOW_IT_WORKS.path}/${chapter.slug}`
  const title = `${chapter.title} — ${HOW_IT_WORKS.title}`
  return {
    title,
    description: chapter.description,
    keywords: chapter.tags,
    authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
    alternates: { canonical: path },
    robots: chapter.status === 'published' ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description: chapter.description,
      url: path,
      type: 'article',
      publishedTime: chapter.publishedAt,
      modifiedTime: chapter.updatedAt ?? chapter.publishedAt,
      authors: [SITE_AUTHOR],
      section: chapter.category,
      tags: chapter.tags,
    },
    twitter: { card: 'summary', title, description: chapter.description },
  }
}

const label = 'text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#555]'

export default async function ChapterPage({ params }: Props) {
  const chapter = getChapter(params.slug)
  if (!chapter) notFound()

  const { previous, next } = getNeighbors(chapter.slug)
  const content = await renderMdx(chapter.body, mdxComponents)
  const number = formatChapterNumber(chapter.chapter)
  const url = `${SITE_URL}${HOW_IT_WORKS.path}/${chapter.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: chapter.title,
    description: chapter.description,
    datePublished: chapter.publishedAt,
    dateModified: chapter.updatedAt ?? chapter.publishedAt,
    articleSection: chapter.category,
    keywords: chapter.tags.join(', '),
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: SITE_AUTHOR, url: SITE_URL },
    isPartOf: { '@type': 'CreativeWorkSeries', name: HOW_IT_WORKS.title, url: `${SITE_URL}${HOW_IT_WORKS.path}` },
    position: chapter.chapter,
  }

  return (
    <article className="max-w-5xl mx-auto px-6 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <header className="hiw-measure mx-auto pt-16 pb-12 md:pt-24 md:pb-16">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-[#999] dark:text-[#666]">
          <Link href={HOW_IT_WORKS.path} className="hover:text-[#f97316] transition-colors">
            How It Works
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span aria-current="page">Chapter {number}</span>
        </nav>

        <p className={`${label} mt-10`}>
          <span className="text-[#f97316]">Chapter {number}</span> · {chapter.category}
          {chapter.status === 'draft' && <span className="text-[#f97316]"> · Draft preview</span>}
        </p>
        <h1 className="mt-5 font-serif text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-[#111] dark:text-[#fafafa]">
          {chapter.title}
        </h1>
        <p className="mt-6 font-serif text-xl md:text-2xl italic leading-snug text-[#555] dark:text-[#a3a3a3]">
          {chapter.description}
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[#999] dark:text-[#666]">
          <div>
            <dt className="sr-only">Published</dt>
            <dd>
              <time dateTime={chapter.publishedAt}>{formatDate(chapter.publishedAt)}</time>
            </dd>
          </div>
          {chapter.updatedAt && (
            <div>
              <dt className="inline">Updated </dt>
              <dd className="inline">
                <time dateTime={chapter.updatedAt}>{formatDate(chapter.updatedAt)}</time>
              </dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Reading time</dt>
            <dd>{readingMinutes(chapter.body)} min read</dd>
          </div>
        </dl>
      </header>

      <div className="border-t border-[#111] dark:border-[#fafafa] pt-12 md:pt-16">
        <div className="hiw-prose mx-auto">{content}</div>

        <ul aria-label="Tags" className="hiw-measure mx-auto mt-14 flex flex-wrap gap-1.5">
          {chapter.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-[10px] text-[#555] bg-[#f5f5f0] dark:bg-[#1c1c1c] border border-[#e8e6e0] dark:border-[#2a2a2a] px-2 py-0.5 rounded"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <aside
        aria-labelledby="up-next"
        className="hiw-measure mx-auto mt-16 border-l-2 border-[#f97316] pl-6 py-1"
      >
        <p id="up-next" className={label}>
          Up next
        </p>
        {next ? (
          <Link
            href={`${HOW_IT_WORKS.path}/${next.slug}`}
            className="mt-3 block font-serif text-2xl leading-snug text-[#111] dark:text-[#fafafa] hover:underline decoration-[#f97316] underline-offset-4"
          >
            {next.title}
          </Link>
        ) : (
          <>
            <p className="mt-3 font-serif text-2xl leading-snug text-[#111] dark:text-[#fafafa]">
              {chapter.nextChapterSuggestion}
            </p>
            <p className="mt-2 text-sm text-[#737373]">
              Proposed topic for chapter {formatChapterNumber(chapter.chapter + 1)}. Not published yet,{' '}
              <a
                href={`${HOW_IT_WORKS.path}/feed.xml`}
                className="underline decoration-[#d0cec8] dark:decoration-[#333] underline-offset-4 hover:text-[#f97316]"
              >
                follow the RSS feed
              </a>{' '}
              to catch it.
            </p>
          </>
        )}
      </aside>

      <nav
        aria-label="Chapters"
        className="mt-20 mb-24 grid grid-cols-1 sm:grid-cols-2 border-t border-[#e8e6e0] dark:border-[#222]"
      >
        {previous ? (
          <Link
            href={`${HOW_IT_WORKS.path}/${previous.slug}`}
            className="group py-8 sm:pr-8 border-b sm:border-b-0 border-[#e8e6e0] dark:border-[#222]"
          >
            <span className={label}>← Chapter {formatChapterNumber(previous.chapter)}</span>
            <span className="mt-2 block font-serif text-xl leading-snug text-[#111] dark:text-[#fafafa] group-hover:text-[#f97316] transition-colors">
              {previous.title}
            </span>
          </Link>
        ) : (
          <Link href={HOW_IT_WORKS.path} className="group py-8 sm:pr-8">
            <span className={label}>← All chapters</span>
            <span className="mt-2 block font-serif text-xl text-[#111] dark:text-[#fafafa] group-hover:text-[#f97316] transition-colors">
              How It Works
            </span>
          </Link>
        )}
        {next && (
          <Link
            href={`${HOW_IT_WORKS.path}/${next.slug}`}
            className="group py-8 sm:pl-8 sm:text-right sm:border-l border-[#e8e6e0] dark:border-[#222]"
          >
            <span className={label}>Chapter {formatChapterNumber(next.chapter)} →</span>
            <span className="mt-2 block font-serif text-xl leading-snug text-[#111] dark:text-[#fafafa] group-hover:text-[#f97316] transition-colors">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  )
}
