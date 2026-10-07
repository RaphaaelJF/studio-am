import React from 'react'
import { ProjectDraftProvider } from '../../_components/ProjectDraftProvider'
import { ProjectForm } from '../../_components/ProjectForm'

import { isDemoMode } from '../../_fixtures/demo-projects'
import { isNameLoginEnabled } from '@/lib/auth/mode'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo =
    (params.visual === 'demo' && isDemoMode()) ||
    isNameLoginEnabled()

  const draftKey = 'rascunho-local'
  const backUrl = isDemo ? '/admin/projetos?visual=demo' : '/admin/projetos'
  return (
    <ProjectDraftProvider draftKey={draftKey}>
      <ProjectForm
        mode="new"
        backUrl={backUrl}
        isDemo={isDemo}
      />
    </ProjectDraftProvider>
  )
}
