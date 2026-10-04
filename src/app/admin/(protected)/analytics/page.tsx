import React from 'react'
import Link from 'next/link'
import { AdminDemoBanner } from '../_components/AdminSharedUI'
import { AnalyticsPanel } from '../_components/AnalyticsPanel'
import { isDemoMode } from '../_fixtures/demo-projects'
import { getSiteAnalyticsSummary } from '@/lib/admin/metrics'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  const metricsResult = isDemo ? null : await getSiteAnalyticsSummary()
  const metrics = metricsResult?.success ? metricsResult.data : null

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

  return (
    <>
      {isDemo && <AdminDemoBanner />}
      {backLink}
      <AnalyticsPanel metrics={metrics} isDemo={isDemo} />
    </>
  )
}
