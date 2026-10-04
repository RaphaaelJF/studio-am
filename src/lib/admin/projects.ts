import { createClient } from '@/lib/supabase/server'
import type { DbProject } from '@/types/project'

export type AdminProjectListItem = Pick<
  DbProject,
  | 'id'
  | 'title'
  | 'slug'
  | 'category'
  | 'status'
  | 'featured'
  | 'display_order'
  | 'updated_at'
> & {
  deleted_at?: string | null
  archived_at?: string | null
  cover_url?: string | null
}

export type GetAdminProjectsResult =
  | { success: true; data: AdminProjectListItem[] }
  | { success: false; error: string }

function resolveImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storagePath: string | null | undefined
): string | null {
  if (!storagePath) return null
  if (storagePath.startsWith('http') || storagePath.startsWith('/')) return storagePath
  const clean = storagePath.replace(/^project-images\//, '')
  return supabase.storage.from('project-images').getPublicUrl(clean).data.publicUrl
}

/**
 * Consulta a lista de projetos do painel administrativo respeitando as policies RLS do Supabase.
 * Ordena por display_order ASC e secundariamente por updated_at DESC.
 * Inclui a imagem de capa (ou primeira imagem) de cada projeto para exibição de miniaturas.
 */
export async function getAdminProjects(): Promise<GetAdminProjectsResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        slug,
        category,
        status,
        featured,
        display_order,
        updated_at,
        deleted_at,
        archived_at,
        project_images(storage_path, is_cover, display_order)
      `)
      .order('display_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[admin:getAdminProjects] Database query error:', error.message)
      return { success: false, error: 'Não foi possível carregar os projetos' }
    }

    type RawRow = AdminProjectListItem & {
      project_images?: Array<{
        storage_path: string
        is_cover: boolean
        display_order: number
      }> | null
    }

    const projects: AdminProjectListItem[] = ((data ?? []) as unknown as RawRow[]).map(row => {
      const rawImages = row.project_images ?? []
      const sortedImages = [...rawImages].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      const coverImg = sortedImages.find(img => img.is_cover) ?? sortedImages[0]
      const coverUrl = coverImg ? resolveImageUrl(supabase, coverImg.storage_path) : null

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        status: row.status,
        featured: row.featured,
        display_order: row.display_order,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        archived_at: row.archived_at,
        cover_url: coverUrl,
      }
    })

    return {
      success: true,
      data: projects,
    }
  } catch (err) {
    console.error('[admin:getAdminProjects] Unexpected error:', err)
    return { success: false, error: 'Não foi possível carregar os projetos' }
  }
}
