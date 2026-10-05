import React from 'react'
import Link from 'next/link'
import { getAdminProjects } from '@/lib/admin/projects'
import { ProjectListClient } from '../_components/ProjectListClient'
import { demoProjects, isDemoMode } from '../_fixtures/demo-projects'
import { AdminErrorState } from '../_components/AdminSharedUI'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()
  const backUrl = isDemo ? '/admin?visual=demo' : '/admin'
  const backLink = (
    <div className="mb-4">
      <Link
        href={backUrl}
        className="inline-flex items-center gap-1 text-xs font-medium py-1.5 px-2.5 rounded transition-colors"
        style={{ color: 'var(--admin-muted)', background: 'transparent' }}
      >
        ← Voltar à visão geral
      </Link>
    </div>
  )

  if (isDemo) {
    return <>{backLink}<ProjectListClient projects={demoProjects} isDemo /></>
  }

  const result = await getAdminProjects()

  if (!result.success) {
    if (process.env.VERCEL_ENV !== 'production' && process.env.ADMIN_TEST_MODE === 'true') {
      return <>{backLink}<ProjectListClient projects={demoProjects} isDemo={true} /></>
    }
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-black uppercase">Projetos</h1>
        </div>
        <AdminErrorState message="Não foi possível carregar os projetos." />
      </div>
    )
  }

  return <>{backLink}<ProjectListClient projects={result.data} isDemo={false} /></>
}
