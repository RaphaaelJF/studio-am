import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { requireAdminProfile } from '@/lib/auth/admin'
import { isNameLoginEnabled } from '@/lib/auth/mode'
import { getAdminProjects } from '@/lib/admin/projects'
import { AdminDemoBanner, AdminCard } from './_components/AdminSharedUI'
import { demoProjects, demoThumbnails, isDemoMode, demoProjectsFull } from './_fixtures/demo-projects'
import type { AdminProjectListItem } from '@/lib/admin/projects'
import type { DemoId } from './_fixtures/demo-projects'
import { PlusIcon } from '@/components/shared/Icons'
import { formatDate } from '@/types/admin-project-form'

import { ProjectListClient } from './_components/ProjectListClient'
import { AdminAnalyticsPreview, AdminProjectsPreview } from './_components/DashboardPreviews'

import { getSiteAnalyticsSummary } from '@/lib/admin/metrics'

function OverviewFrame({ title, url, children }: { title: string; url: string; children: React.ReactNode }) {
  return (
    <section className="admin-overview-panel relative">
      <div className="admin-overview-label">
        <span>{title}</span>
        <Link href={url} className="admin-overview-open relative z-20 pointer-events-auto cursor-pointer hover:underline">Abrir módulo</Link>
      </div>
      <div className="admin-overview-content relative z-10">
        {children}
      </div>
    </section>
  )
}

export default async function AdminDashboardPage(props: {
  searchParams?: Promise<{ visual?: string }>
}) {
  const profile = await requireAdminProfile()
  const searchParams = await props.searchParams
  const isDemo = searchParams?.visual === 'demo' && isDemoMode()

  let projects: AdminProjectListItem[] = []
  if (isDemo) {
    projects = demoProjects
  } else {
    const result = await getAdminProjects()
    if (result.success) {
      projects = result.data
    } else if (isNameLoginEnabled()) {
      projects = demoProjects
    }
  }

  const metricsResult = isDemo ? null : await getSiteAnalyticsSummary()
  const metrics = metricsResult?.success ? metricsResult.data : null

  const publishedCount = isDemo ? 12 : projects.filter(p => p.status === 'published').length
  const draftCount = isDemo ? 3 : projects.filter(p => p.status === 'draft').length
  const featuredCount = isDemo ? 8 : projects.filter(p => p.featured).length
  const recentProjects = [...projects]
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const newProjectHref = isDemo ? '/admin/projetos/novo?visual=demo' : '/admin/projetos/novo'
  const projectsHref = isDemo ? '/admin/projetos?visual=demo' : '/admin/projetos'
  const dashUrl = isDemo ? '/admin/dashboard?visual=demo' : '/admin/dashboard'
  const projUrl = isDemo ? '/admin/projetos?visual=demo' : '/admin/projetos'
  const analyticsUrl = isDemo ? '/admin/analytics?visual=demo' : '/admin/analytics'
  const projAnalyticsUrl = isDemo ? '/admin/analytics/projetos?visual=demo' : '/admin/analytics/projetos'

  const activity = [
    { text: 'Casa Andreia e Marco atualizada', time: '3 horas atrás' },
    { text: 'Imagem adicionada em Casa Carlos', time: 'Ontem, 16:42' },
    { text: 'Destaques da Home atualizados', time: 'Há 2 dias' },
    { text: 'Projeto Clínica Harmonia publicado', time: 'Há 3 dias' },
  ]

  // Em modo real, a atividade deriva dos projetos do banco — nada fictício.
  const realActivity = [...projects]
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
    .slice(0, 4)
    .map((p) => ({
      text: `${p.title} — ${p.status === 'published' ? 'publicado' : 'atualizado como rascunho'}`,
      time: formatDate(p.updated_at),
    }))
  const feed = isDemo ? activity : realActivity

  return (
    <div className="flex flex-col space-y-4">
      {isDemo && <AdminDemoBanner />}
      <div className="admin-overview-grid">
        
        {/* QUADRO 1: DASHBOARD */}
        <OverviewFrame title="1. DASHBOARD" url={dashUrl}>
          <div className="admin-dashboard space-y-5">
            <div className="admin-section-header flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--admin-text)' }}>
                  Dashboard
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-muted)' }}>
                  {greeting}, {profile.display_name}.
                </p>
              </div>
              <Link href={newProjectHref} className="admin-header-button flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90" style={{ background: 'var(--admin-text)' }}>
                <PlusIcon className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Novo projeto</span>
              </Link>
            </div>
            <div className="admin-metrics-grid grid grid-cols-4 gap-3">
              <AdminCard className="admin-metric-card p-4">
                <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{publishedCount}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Projetos publicados</p>
              </AdminCard>
              <AdminCard className="admin-metric-card p-4">
                <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{draftCount}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Rascunhos</p>
              </AdminCard>
              <AdminCard className="admin-metric-card p-4">
                <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{featuredCount}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>Destaques na Home</p>
              </AdminCard>
              <AdminCard className="admin-metric-card p-4">
                <p className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>{isDemo ? '1.248' : '—'}</p>
                <div className="admin-metric-footer">
                  <p className="text-[11px]" style={{ color: 'var(--admin-muted)' }}>Visitas (30 dias)</p>
                  <svg viewBox="0 0 80 24" className="admin-metric-sparkline" style={{ opacity: 0.55 }}>
                    <polyline points="0,20 13,16 27,18 40,8 53,12 67,4 80,1" fill="none" stroke="var(--admin-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </AdminCard>
            </div>
            <div className="flex flex-col gap-4">
              <AdminCard>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>Projetos recentes</h2>
                  <Link href={projectsHref} className="text-xs font-medium hover:underline" style={{ color: 'var(--admin-muted)' }}>Ver todos</Link>
                </div>
                {recentProjects.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>Nenhum projeto cadastrado.</p>
                  </div>
                ) : (
                  <ul>
                    {recentProjects.map((p, i) => {
                      const thumb = p.cover_url || (isDemo && (p.id in demoThumbnails) ? demoThumbnails[p.id as DemoId] : null)
                      const editHref = isDemo ? `/admin/projetos/${p.id}/editar?visual=demo` : `/admin/projetos/${p.id}/editar`
                      return (
                        <li key={p.id} style={{ borderBottom: i < recentProjects.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                          <Link href={editHref} className="flex items-center gap-3 px-5 py-3 transition-colors" style={{ color: 'inherit' }}>
                            <div className="shrink-0 rounded overflow-hidden flex items-center justify-center relative" style={{ width: 56, height: 40, background: 'var(--admin-active)', border: '1px solid var(--admin-border)' }}>
                              {thumb ? (
                                <Image src={thumb} alt={p.title} width={56} height={40} className="w-full h-full object-cover" unoptimized />
                              ) : (
                                <svg
                                  className="w-4 h-4 opacity-40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ color: 'var(--admin-muted)' }}
                                >
                                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                  <circle cx="9" cy="9" r="2" />
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: 'var(--admin-text)' }}>{p.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>{formatDate(p.updated_at)}</p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${p.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                              {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </AdminCard>
              <AdminCard>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>Atividade recente</h2>
                </div>
                <ul className="px-5 py-2">
                  {feed.length === 0 ? (
                    <li className="py-6 text-center">
                      <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>Nenhuma atividade ainda. Crie seu primeiro projeto.</p>
                    </li>
                  ) : (
                    feed.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < feed.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                      <div className="mt-1.5 shrink-0 rounded-full" style={{ width: 6, height: 6, background: 'var(--admin-muted)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--admin-text)' }}>{item.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>{item.time}</p>
                      </div>
                    </li>
                    ))
                  )}
                </ul>
              </AdminCard>
            </div>
          </div>
        </OverviewFrame>

        {/* QUADRO 2: PROJETOS */}
        <OverviewFrame title="2. PROJETOS" url={projUrl}>
          <ProjectListClient projects={projects} isDemo={isDemo} />
        </OverviewFrame>

        {/* QUADRO 3: MÉTRICAS DO SITE */}
        <OverviewFrame title="3. MÉTRICAS DO SITE" url={analyticsUrl}>
          <AdminAnalyticsPreview metrics={metrics} />
        </OverviewFrame>

        {/* QUADRO 4: DESEMPENHO DOS PROJETOS */}
        <OverviewFrame title="4. DESEMPENHO DOS PROJETOS" url={projAnalyticsUrl}>
          <AdminProjectsPreview metrics={metrics} />
        </OverviewFrame>

      </div>
    </div>
  )
}
