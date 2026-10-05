import React from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectPreview } from '../../../_components/ProjectPreview'
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

export default async function ProjectPreviewPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { visual } = await searchParams
  const isDemo =
    (visual === 'demo' && isDemoMode()) ||
    (process.env.VERCEL_ENV !== 'production' && process.env.ADMIN_TEST_MODE === 'true')

  const editUrl = isDemo
    ? `/admin/projetos/${id}/editar?visual=demo`
    : `/admin/projetos/${id}/editar`

  // ── Demo path ─────────────────────────────────────────────────────────────
  if (isDemoId(id)) {
    if (!isDemoMode()) return notFound()
    const demo = demoProjectsFull[id]
    return (
      <ProjectPreview
        formData={demo.formData}
        images={demo.images}
        editUrl={editUrl}
        projectId={id}
        isDemo
      />
    )
  }

  // Special key for new project draft (can't load from DB)
  if (id === 'rascunho-local') {
    // Can't recover local draft after reload — honest about it
    return (
      <div>
        <div className="bg-graphite text-warm-white px-4 py-3 text-xs">
          Pré-visualização do novo projeto — os dados locais são perdidos ao recarregar a página.
        </div>
        <div className="p-8">
          <p className="text-sm text-muted">
            Volte ao formulário e abra a prévia sem recarregar a página para ver os dados preenchidos.
          </p>
        </div>
      </div>
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
    console.error('[preview:project] DB error:', error.message)
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-medium text-black uppercase">Pré-visualização</h1>
        <AdminErrorState message="Não foi possível carregar o projeto." />
      </div>
    )
  }

  if (!data) return notFound()

  const project = data as DbProject
  const formData: ProjectFormData = {
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

  // Carrega imagens de trabalho (project_images) para visualização fidedigna no preview do admin
  const { data: imgRows } = await supabase
    .from('project_images')
    .select('id, storage_path, alt, caption, display_order, is_cover')
    .eq('project_id', id)
    .order('display_order', { ascending: true })

  const previewImages = ((imgRows ?? []) as {
    id: string; storage_path: string; alt: string; caption: string | null; display_order: number; is_cover: boolean
  }[]).map((img) => {
    const url = (img.storage_path.startsWith('http') || img.storage_path.startsWith('/'))
      ? img.storage_path
      : supabase.storage.from('project-images').getPublicUrl(img.storage_path.replace(/^project-images\//, '')).data.publicUrl
    return {
      kind: 'remote' as const,
      id: img.id,
      storageUrl: url,
      alt: img.alt ?? '',
      caption: img.caption ?? '',
      is_cover: img.is_cover,
      display_order: img.display_order,
    }
  })

  return (
    <ProjectPreview
      formData={formData}
      images={previewImages}
      editUrl={editUrl}
      projectId={id}
      isDemo={isDemo}
    />
  )
}
