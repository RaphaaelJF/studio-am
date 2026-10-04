'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/tracker'

interface ProjectViewTrackerProps {
  projectId?: string
  slug: string
}

export function ProjectViewTracker({ projectId, slug }: ProjectViewTrackerProps) {
  useEffect(() => {
    trackEvent('project_view', {
      path: `/projetos/${slug}`,
      projectId: projectId || null,
    })
  }, [projectId, slug])

  return null
}
