import { getPublishedChapters } from '@/lib/how-it-works/content'
import { formatChapterNumber } from '@/lib/how-it-works/schema'
import { HOW_IT_WORKS, SITE_AUTHOR, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString()

export function GET() {
  const chapters = getPublishedChapters()
    .filter((c) => c.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.chapter - a.chapter)
  const indexUrl = `${SITE_URL}${HOW_IT_WORKS.path}`

  const items = chapters
    .map((c) => {
      const url = `${indexUrl}/${c.slug}`
      return `    <item>
      <title>${escapeXml(`${formatChapterNumber(c.chapter)} · ${c.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(c.description)}</description>
      <category>${escapeXml(c.category)}</category>
      <pubDate>${rfc822(c.publishedAt)}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${HOW_IT_WORKS.title} — ${SITE_AUTHOR}`)}</title>
    <link>${indexUrl}</link>
    <description>${escapeXml(HOW_IT_WORKS.description)}</description>
    <language>en</language>
    <atom:link href="${indexUrl}/feed.xml" rel="self" type="application/rss+xml" />
${chapters[0] ? `    <lastBuildDate>${rfc822(chapters[0].publishedAt)}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
