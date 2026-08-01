import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

  const categoryRoutes = [
    'Countrysidestudio',
    'Youthinsight',
    'Mozaika',
    'Imagemapping',
  ].map((route) => ({
    url: `${baseUrl}/public/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const PARENT_CATEGORY_ROUTES: { categoryName: string; routePrefix: string }[] = [
    { categoryName: '#CountrysideStudio', routePrefix: 'Mfk' },
    { categoryName: 'Youthinsight', routePrefix: 'Festival' },
  ]

  const projectRoutesNested = await Promise.all(
    PARENT_CATEGORY_ROUTES.map(async ({ categoryName, routePrefix }) => {
      const category = await prisma.category.findFirst({
        where: { name: categoryName },
        select: { id: true },
      })
      console.log('DEBUG category', { categoryName, category })
      if (!category) return []

      const allInCategory = await prisma.studioProject.findMany({
        where: { categoryId: category.id },
        select: { id: true, parentId: true, published: true, subcategory: { select: { slug: true } } },
      })
      console.log('DEBUG allInCategory', { categoryName, count: allInCategory.length, allInCategory })

      const children = await prisma.studioProject.findMany({
        where: { categoryId: category.id, parentId: { not: null }, published: true },
        select: {
          id: true,
          updatedAt: true,
          subcategory: { select: { slug: true } },
        },
      })
      console.log('DEBUG children', { categoryName, count: children.length, children })

      return children.map((p) => ({
        url: `${baseUrl}/public/${routePrefix}/${p.subcategory?.slug ?? p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    })
  )
  const projectRoutes = projectRoutesNested.flat()

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...projectRoutes]
}