import { createClient } from '@/lib/supabase/server'

export interface AnalyticsSummary {
  views: {
    total: number
    last_7d: number
    last_30d: number
  }
  visits: {
    total: number
    last_7d: number
    last_30d: number
  }
  visitors: {
    total: number
    last_7d: number
    last_30d: number
  }
  top_pages: Array<{
    path: string
    views: number
  }>
  referrers: Array<{
    source: string
    visits: number
  }>
  conversion_clicks: {
    iniciar_projeto: number
    whatsapp: number
    instagram: number
  }
  projects: Array<{
    project_id: string
    title: string
    slug: string
    views_total: number
    views_7d: number
    views_30d: number
    contact_clicks: number
    whatsapp_clicks: number
  }>
}

export type GetAnalyticsSummaryResult =
  | { success: true; data: AnalyticsSummary }
  | { success: false; error: string }

export async function getSiteAnalyticsSummary(): Promise<GetAnalyticsSummaryResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('get_site_analytics_summary')

    if (error) {
      console.error('[getSiteAnalyticsSummary] Erro na RPC:', error.message)
      return { success: false, error: 'Não foi possível carregar as métricas.' }
    }

    return {
      success: true,
      data: data as AnalyticsSummary,
    }
  } catch (err) {
    console.error('[getSiteAnalyticsSummary] Inesperado:', err)
    return { success: false, error: 'Erro ao consultar métricas.' }
  }
}
