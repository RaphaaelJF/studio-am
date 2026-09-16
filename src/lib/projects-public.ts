import { createClient } from '@/lib/supabase/server'
import { portfolioProjects, type PortfolioProject } from '@/data/home-projects'

export interface PublicProjectImage {
  src: string
  alt: string
}

export interface PublicProject {
  slug: string
  title: string
  category: string
  summary: string | null
  description: string | null
  location: string | null
  year: number | null
  area: string | null
  cover: PublicProjectImage
  gallery: PublicProjectImage[]
}

function mockToPublic(m: PortfolioProject): PublicProject {
  return {
    slug: m.slug,
    title: m.title,
    category: m.category,
    summary: null,
    description: null,
    location: null,
    year: null,
    area: null,
    cover: { src: m.cover.src, alt: m.cover.alt },
    gallery: m.gallery.map((g) => ({ src: g.src, alt: g.alt })),
  }
}

type DbImageRow = {
  storage_path: string
  alt: string
  caption: string | null
  display_order: number
  is_cover: boolean
}

type DbProjectRow = {
  slug: string
  title: string
  category: string
  summary: string | null
  description: string | null
  location: string | null
  year: number | null
  area: string | null
  project_images: DbImageRow[]
}

/** URL pública a partir do storage_path. Aceita URL http, caminho local (/images/...) ou path do Storage. */
function publicUrl(supabase: { storage: { from: (b: string) => { getPublicUrl: (p: string) => { data: { publicUrl: string } } } } }, storagePath: string): string {
  if (!storagePath) return ''
  if (storagePath.startsWith('http') || storagePath.startsWith('/')) return storagePath
  // storage_path pode vir como "projectId/arquivo.webp" ou "project-images/projectId/arquivo.webp"
  const clean = storagePath.replace(/^project-images\//, '')
  return supabase.storage.from('project-images').getPublicUrl(clean).data.publicUrl
}

function rowToPublic(
  supabase: Parameters<typeof publicUrl>[0],
  row: DbProjectRow,
): PublicProject | null {
  const images = [...(row.project_images ?? [])].sort((a, b) => a.display_order - b.display_order)
  if (images.length === 0) return null
  const coverRow = images.find((i) => i.is_cover) ?? images[0]
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    description: row.description,
    location: row.location,
    year: row.year,
    area: row.area,
    cover: { src: publicUrl(supabase, coverRow.storage_path), alt: coverRow.alt },
    gallery: images.map((i) => ({ src: publicUrl(supabase, i.storage_path), alt: i.alt })),
  }
}

/**
 * Lista projetos publicados do Supabase.
 * Fallback para o mock local quando o banco está vazio/inacessível,
 * para o site nunca quebrar em produção.
 */
export async function getPublishedProjects(): Promise<PublicProject[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select(
        'slug, title, category, summary, description, location, year, area, project_images(storage_path, alt, caption, display_order, is_cover)',
      )
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) throw error
    const rows = (data ?? []) as unknown as DbProjectRow[]
    const mapped = rows
      .map((r) => rowToPublic(supabase, r))
      .filter((p): p is PublicProject => p !== null)
    if (mapped.length > 0) return mapped
  } catch (err) {
    console.error('[public:getPublishedProjects] fallback para mock:', err)
  }
  return portfolioProjects.map(mockToPublic)
}

export async function getPublishedProjectBySlug(slug: string): Promise<PublicProject | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select(
        'slug, title, category, summary, description, location, year, area, project_images(storage_path, alt, caption, display_order, is_cover)',
      )
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (data) {
      const mapped = rowToPublic(supabase, data as unknown as DbProjectRow)
      if (mapped) return mapped
    }
  } catch (err) {
    console.error('[public:getPublishedProjectBySlug] fallback para mock:', err)
  }
  const mock = portfolioProjects.find((p) => p.slug === slug)
  return mock ? mockToPublic(mock) : null
}
