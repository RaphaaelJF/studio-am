import { createClient as createPublicClient } from '@/lib/supabase/client'
import { portfolioProjects, type PortfolioProject } from '@/data/home-projects'

/** Cliente Supabase anônimo sem cookies, seguro para Server Components estáticos / sitemap / SSG */
function getPublicSupabase() {
  return createPublicClient()
}

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
    // Galeria sem repetir a imagem de capa (mesmo src)
    gallery: m.gallery
      .filter((g) => g.src !== m.cover.src)
      .map((g) => ({ src: g.src, alt: g.alt })),
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
  // Galeria filtrada: remove a imagem definida como capa para evitar repetição visual
  const galleryImages = images.filter((i) => i !== coverRow && !i.is_cover)

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
    gallery: (galleryImages.length > 0 ? galleryImages : images).map((i) => ({
      src: publicUrl(supabase, i.storage_path),
      alt: i.alt,
    })),
  }
}

const isDev = process.env.NODE_ENV !== 'production'

/**
 * Lista projetos publicados do Supabase.
 * Em produção: consulta estritamente o Supabase; se não houver projetos publicados, retorna [].
 * Em desenvolvimento: permite fallback para o mock local se o Supabase não estiver configurado/acessível.
 */
export async function getPublishedProjects(): Promise<PublicProject[]> {
  try {
    const supabase = getPublicSupabase()
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

    // Em produção, se o banco retornou 0 projetos publicados, retorna lista vazia
    if (!isDev) {
      return []
    }
  } catch (err) {
    console.error('[public:getPublishedProjects] Erro ao consultar projetos publicados:', err)
    if (!isDev) {
      return []
    }
  }

  // Fallback local restrito a ambiente de desenvolvimento
  return portfolioProjects.map(mockToPublic)
}

/**
 * Busca projeto publicado por slug no Supabase.
 * Em produção: se não encontrar no banco com status=published, retorna null (404).
 * Em desenvolvimento: permite fallback para o mock local se o banco não possuir o slug.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<PublicProject | null> {
  try {
    const supabase = getPublicSupabase()
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

    // Em produção, se não encontrou no Supabase, encerra com null
    if (!isDev) {
      return null
    }
  } catch (err) {
    console.error('[public:getPublishedProjectBySlug] Erro ao consultar projeto por slug:', err)
    if (!isDev) {
      return null
    }
  }

  // Fallback local restrito a ambiente de desenvolvimento
  const mock = portfolioProjects.find((p) => p.slug === slug)
  return mock ? mockToPublic(mock) : null
}
