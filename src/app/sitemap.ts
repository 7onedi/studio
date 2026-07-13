import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ROUTE_PREFIX_BY_CATEGORY_SLUG: Record<string, string> = {
  Countrysidestudio: 'Mfk',
  Youthinsight: 'Festival',
  // Mozaika: '???',
  // Imagemapping: '???',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://studio.pangeya.org.ua'

  const staticRoutes = ['/public', '/public/AboutNetwork', '/public/Methodology'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/public/Article/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/public/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const projects = await prisma.studioProject.findMany({
    where: { parentId: { not: null }, published: true },
    select: {
      id: true,
      updatedAt: true,
      subcategory: { select: { slug: true } },
      category: { select: { slug: true } },
    },
  })
  const projectRoutes = projects
    .filter((p) => ROUTE_PREFIX_BY_CATEGORY_SLUG[p.category.slug])
    .map((p) => ({
      url: `${baseUrl}/public/${ROUTE_PREFIX_BY_CATEGORY_SLUG[p.category.slug]}/${p.subcategory?.slug ?? p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...projectRoutes]
}