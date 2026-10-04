import React from 'react'
import { AdminCard } from './AdminSharedUI'
import type { AnalyticsSummary } from '@/lib/admin/metrics'
import Link from 'next/link'

export function AdminAnalyticsPreview({ metrics }: { metrics?: AnalyticsSummary | null }) {
  const views = metrics?.views?.last_30d ?? 0
  const visits = metrics?.visits?.last_30d ?? 0
  const visitors = metrics?.visitors?.last_30d ?? 0
  const topPage = metrics?.top_pages && metrics.top_pages.length > 0 ? metrics.top_pages[0] : null

  return (
    <div className="admin-dashboard space-y-5 p-2">
      <div className="admin-section-header flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--admin-text)' }}>
            Métricas do Site
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--admin-muted)' }}>
            Visão geral dos últimos 30 dias
          </p>
        </div>
      </div>

      <div className="admin-metrics-grid grid grid-cols-3 gap-3">
        <AdminCard className="admin-metric-card p-4">
          <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{views}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Visualizações</p>
        </AdminCard>
        <AdminCard className="admin-metric-card p-4">
          <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{visits}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Visitas</p>
        </AdminCard>
        <AdminCard className="admin-metric-card p-4">
          <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{visitors}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Visitantes únicos</p>
        </AdminCard>
      </div>

      {topPage && (
        <AdminCard className="p-4 mt-4">
          <p className="text-[11px] font-medium" style={{ color: 'var(--admin-muted)' }}>Página Mais Acessada</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{topPage.path}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{topPage.views} views</p>
          </div>
        </AdminCard>
      )}
    </div>
  )
}

export function AdminProjectsPreview({ metrics }: { metrics?: AnalyticsSummary | null }) {
  const projectsSorted = metrics?.projects && metrics.projects.length > 0
    ? [...metrics.projects].sort((a, b) => b.views_30d - a.views_30d)
    : []

  const topProject = projectsSorted[0] ?? null
  const top3 = projectsSorted.slice(0, 3)

  return (
    <div className="admin-dashboard space-y-5 p-2">
      <div className="admin-section-header flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--admin-text)' }}>
            Desempenho dos Projetos
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--admin-muted)' }}>
            Ranking e conversões (30 dias)
          </p>
        </div>
      </div>

      {topProject ? (
        <div className="space-y-4">
          <AdminCard className="p-4">
            <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--admin-muted)' }}>
              Projeto Mais Visualizado
            </p>
            <p className="text-base font-semibold truncate" style={{ color: 'var(--admin-text)' }}>
              {topProject.title}
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>{topProject.views_30d}</p>
                <p className="text-[10px]" style={{ color: 'var(--admin-muted)' }}>Views</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>{topProject.whatsapp_clicks}</p>
                <p className="text-[10px]" style={{ color: 'var(--admin-muted)' }}>WhatsApp</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>{topProject.contact_clicks}</p>
                <p className="text-[10px]" style={{ color: 'var(--admin-muted)' }}>Contato</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--admin-border)' }}>
              <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--admin-muted)' }}>Ranking (Top 3)</h2>
            </div>
            <ul>
              {top3.map((p, i) => (
                <li key={p.project_id} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i < top3.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                  <p className="text-sm font-medium truncate flex-1" style={{ color: 'var(--admin-text)' }}>
                    {i + 1}. {p.title}
                  </p>
                  <p className="text-xs font-semibold shrink-0" style={{ color: 'var(--admin-muted)' }}>
                    {p.views_30d} views
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>
      ) : (
        <AdminCard className="p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>Nenhum dado de projeto disponível.</p>
        </AdminCard>
      )}
    </div>
  )
}
