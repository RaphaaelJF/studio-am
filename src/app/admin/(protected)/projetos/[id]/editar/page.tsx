import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectDraftProvider } from '../../../_components/ProjectDraftProvider'
import { ProjectForm } from '../../../_components/ProjectForm'
import { AdminErrorState } from '../../../_components/AdminSharedUI'
import {
  demoProjectsFull, isDemoId, isDemoMode,
} from '../../../_fixtures/demo-projects'
import type { ProjectFormData } from '@/types/admin-project-form'
import type { DbProject } from '@/types/project'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ visual?: string }>
}

export default async function EditProjectPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { visual } = await searchParams
  const isDemo = visual === 'demo' && isDemoMode()

  const backUrl = isDemo ? '/admin/projetos?visual=demo' : '/admin/projetos'
  const dashUrl = isDemo ? '/admin?visual=demo' : '/admin'
  const backLink = (
    <div className="mb-4">
      <Link
        href={dashUrl}
        className="inline-flex items-center gap-1 text-xs font-medium py-1.5 px-2.5 rounded transition-colors"
        style={{ color: 'var(--admin-muted)', background: 'transparent' }}
      >
        ← Voltar à visão geral
      </Link>
    </div>
  )
  // ── Demo path ────────────────────────────────────────────────────────────
  if (isDemoId(id)) {
    if (!isDemoMode()) return notFound()

    const demo = demoProjectsFull[id]
    return (
      <ProjectDraftProvider draftKey={id} initialFormData={demo.formData} initialImages={demo.images}>
        {backLink}
        <ProjectForm mode="edit" backUrl={backUrl} isDemo={isDemo} />
      </ProjectDraftProvider>
    )
  }

  // ── Real project path ─────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, slug, category, summary, description, location, year, area, status, featured, display_order')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[edit:project] DB error:', error.message)
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-medium tracking-tight text-black uppercase">Editar Projeto</h1>
        <AdminErrorState message="Não foi possível carregar o projeto." />
      </div>
    )
  }

  if (!data) return notFound()

  const project = data as DbProject
  const initialFormData: ProjectFormData = {
    title: project.title,
    slug: project.slug,
    category: project.category,
    summary: project.summary ?? '',
    description: project.description ?? '',
    location: project.location ?? '',
    year: project.year ? String(project.year) : '',
    area: project.area ?? '',
    status: project.status,
    featured: project.featured,
    display_order: project.display_order,
  }

  return (
    <ProjectDraftProvider draftKey={id} initialFormData={initialFormData}>
      {backLink}
      <ProjectForm mode="edit" backUrl={backUrl} isDemo={isDemo} />
    </ProjectDraftProvider>
  )
}
