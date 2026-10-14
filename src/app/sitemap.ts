import type { MetadataRoute } from 'next'
import { getPublishedChapters } from '@/lib/how-it-works/content'
import { HOW_IT_WORKS, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const chapters = getPublishedChapters().filter((c) => c.status === 'published')
  const latest = chapters.reduce<string | undefined>(
    (max, c) => (!max || (c.updatedAt ?? c.publishedAt) > max ? c.updatedAt ?? c.publishedAt : max),
    undefined,
  )

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}${HOW_IT_WORKS.path}`, ...(latest ? { lastModified: latest } : {}) },
    ...chapters.map((c) => ({
      url: `${SITE_URL}${HOW_IT_WORKS.path}/${c.slug}`,
      lastModified: c.updatedAt ?? c.publishedAt,
    })),
  ]
}
