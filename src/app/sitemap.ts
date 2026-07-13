import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma' 

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://studio.pangeya.org.ua'

  // статичні сторінки
  const staticRoutes = [
    '',
    '/about',
    '/methodology',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // динамічні сторінки з БД (приклад для articles)
  const articles = await prisma.article.findMany({
    select: { slug: true, updatedAt: true },
  })
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes]
}