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
>

export type GetAdminProjectsResult =
  | { success: true; data: AdminProjectListItem[] }
  | { success: false; error: string }

/**
 * Consulta a lista de projetos do painel administrativo respeitando as policies RLS do Supabase.
 * Ordena por display_order ASC e secundariamente por updated_at DESC.
 */
export async function getAdminProjects(): Promise<GetAdminProjectsResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('id, title, slug, category, status, featured, display_order, updated_at')
      .order('display_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[admin:getAdminProjects] Database query error:', error.message)
      return { success: false, error: 'Não foi possível carregar os projetos' }
    }

    return {
      success: true,
      data: (data ?? []) as AdminProjectListItem[],
    }
  } catch (err) {
    console.error('[admin:getAdminProjects] Unexpected error:', err)
    return { success: false, error: 'Não foi possível carregar os projetos' }
  }
}
