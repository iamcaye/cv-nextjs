import type { Metadata } from 'next'
import Link from 'next/link'
import { formatDate } from '@/components/how-it-works/format'
import { getPublishedChapters } from '@/lib/how-it-works/content'
import { formatChapterNumber } from '@/lib/how-it-works/schema'
import { HOW_IT_WORKS, SITE_AUTHOR } from '@/lib/site'

const title = `${HOW_IT_WORKS.title} — ${SITE_AUTHOR}`

export const metadata: Metadata = {
  title,
  description: HOW_IT_WORKS.description,
  alternates: {
    canonical: HOW_IT_WORKS.path,
    types: { 'application/rss+xml': `${HOW_IT_WORKS.path}/feed.xml` },
  },
  openGraph: {
    title,
    description: HOW_IT_WORKS.description,
    url: HOW_IT_WORKS.path,
    type: 'website',
  },
}

const label = 'text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#555]'

export default function HowItWorksIndex() {
  const chapters = [...getPublishedChapters()].sort(
    (a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.chapter - b.chapter,
  )
  const latest = chapters[chapters.length - 1]

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12">
      <header className="pt-20 pb-16 md:pt-28 md:pb-20">
        <p className={label}>A daily series</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl font-medium tracking-tight text-[#111] dark:text-[#fafafa]">
          How It Works
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl md:text-2xl italic leading-snug text-[#555] dark:text-[#a3a3a3]">
          {HOW_IT_WORKS.description}
        </p>
        <p className="mt-8 font-mono text-xs text-[#999] dark:text-[#666]">
          {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
          {latest && <> · Latest {formatDate(latest.publishedAt, 'short')}</>}
          {' · '}
          <a
            href={`${HOW_IT_WORKS.path}/feed.xml`}
            className="underline decoration-[#d0cec8] dark:decoration-[#333] underline-offset-4 hover:text-[#f97316] hover:decoration-[#f97316] transition-colors"
          >
            RSS
          </a>
        </p>
      </header>

      {latest && (
        <section
          aria-labelledby="latest-heading"
          className="border-t border-[#111] dark:border-[#fafafa] py-12 md:py-16"
        >
          <Link
            href={`${HOW_IT_WORKS.path}/${latest.slug}`}
            className="group grid gap-6 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-12 items-start"
          >
            <span
              aria-hidden
              className="font-serif text-7xl md:text-[8.5rem] leading-none font-light tabular-nums text-[#f97316]"
            >
              {formatChapterNumber(latest.chapter)}
            </span>
            <div>
              <p className={label}>
                <span id="latest-heading">Latest chapter</span> · {latest.category}
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight text-[#111] dark:text-[#fafafa] group-hover:underline decoration-[#f97316] decoration-2 underline-offset-[6px]">
                {latest.title}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#555] dark:text-[#a3a3a3]">
                {latest.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-[#111] dark:text-[#fafafa]">
                Read chapter {formatChapterNumber(latest.chapter)}{' '}
                <span className="inline-block text-[#f97316] transition-transform group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>
        </section>
      )}

      <section aria-labelledby="contents-heading" className="pb-24">
        <h2 id="contents-heading" className={`${label} border-t border-[#e8e6e0] dark:border-[#222] pt-6 pb-2`}>
          Contents
        </h2>
        {chapters.length === 0 ? (
          <p className="py-10 font-serif text-xl italic text-[#737373]">
            The first chapter is on its way.
          </p>
        ) : (
          <ol>
            {chapters.map((c) => (
              <li key={c.slug} className="border-b border-[#e8e6e0] dark:border-[#222] last:border-b-0">
                <Link
                  href={`${HOW_IT_WORKS.path}/${c.slug}`}
                  className="group grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr_10rem] gap-x-4 md:gap-x-8 gap-y-2 py-7"
                >
                  <span className="font-serif text-2xl leading-tight tabular-nums text-[#bbb] dark:text-[#444] group-hover:text-[#f97316] transition-colors">
                    <span className="sr-only">Chapter </span>
                    {formatChapterNumber(c.chapter)}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl leading-tight font-medium text-[#111] dark:text-[#fafafa] group-hover:underline decoration-[#f97316] underline-offset-4">
                      {c.title}
                      {c.status === 'draft' && (
                        <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-widest text-[#f97316]">
                          draft
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#737373]">{c.description}</p>
                  </div>
                  <div className="col-start-2 md:col-start-auto md:text-right font-mono text-[11px] leading-relaxed text-[#999] dark:text-[#666]">
                    <span className="block uppercase tracking-wider">{c.category}</span>
                    <time dateTime={c.publishedAt}>{formatDate(c.publishedAt, 'short')}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
