import type { MetadataRoute } from 'next'
import { getPublishedProjects } from '@/lib/projects-public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://studioam.com.br'
  const projects = await getPublishedProjects()
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/projetos`, changeFrequency: 'weekly', priority: 0.9 },
    ...projects.map((p) => ({
      url: `${base}/projetos/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
