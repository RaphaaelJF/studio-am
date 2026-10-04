import React from 'react'
import { AdminDemoBanner, AdminSectionHeader } from '../_components/AdminSharedUI'
import { DestaquesManager } from '../_components/DestaquesManager'
import { getAdminProjects } from '@/lib/admin/projects'
import { demoProjects, isDemoMode } from '../_fixtures/demo-projects'
import type { AdminProjectListItem } from '@/lib/admin/projects'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminDestaquesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  let projects: AdminProjectListItem[] = []
  if (isDemo) {
    projects = demoProjects
  } else {
    const result = await getAdminProjects()
    if (result.success) {
      projects = result.data
    } else {
      // Se não carregar do Supabase temporariamente, cai no mock controlado sem crashar
      projects = demoProjects
    }
  }

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Destaques da Home" 
        subtitle="Gerencie quais projetos aparecem na vitrine da página inicial e defina a ordem de exibição."
      />
      
      <DestaquesManager initialProjects={projects} isDemo={isDemo} />
    </div>
  )
}
