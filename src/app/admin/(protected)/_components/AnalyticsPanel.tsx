'use client'

import React, { useState } from 'react'
import type { AnalyticsSummary } from '@/lib/admin/metrics'

interface AnalyticsPanelProps {
  metrics: AnalyticsSummary | null
  isDemo?: boolean
}

// Paleta de acento para o painel de analytics (interna, não afeta o site público)
const ACCENT = {
  views:     { bg: '#0B1120', text: '#FFFFFF', sub: 'rgba(255,255,255,0.55)', bar: '#4F8EF7', badge: 'rgba(79,142,247,0.18)', badgeText: '#93BFFD' },
  visits:    { bg: '#0B2318', text: '#FFFFFF', sub: 'rgba(255,255,255,0.55)', bar: '#34D399', badge: 'rgba(52,211,153,0.18)', badgeText: '#6EE7B7' },
  visitors:  { bg: '#1E0B2C', text: '#FFFFFF', sub: 'rgba(255,255,255,0.55)', bar: '#C084FC', badge: 'rgba(192,132,252,0.18)', badgeText: '#DDD6FE' },
}

const SOURCE_COLOR: Record<string, { bar: string; dot: string; badge: string; badgeText: string }> = {
  direct:    { bar: '#4F8EF7', dot: '#4F8EF7', badge: '#EFF6FF', badgeText: '#1D4ED8' },
  google:    { bar: '#34D399', dot: '#34D399', badge: '#ECFDF5', badgeText: '#065F46' },
  instagram: { bar: '#C084FC', dot: '#C084FC', badge: '#F5F3FF', badgeText: '#6D28D9' },
  other:     { bar: '#FBA94C', dot: '#FBA94C', badge: '#FFFBEB', badgeText: '#92400E' },
}

export function AnalyticsPanel({ metrics, isDemo: _isDemo }: AnalyticsPanelProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | 'total'>('30d')

  const getMetric = (type: 'views' | 'visits' | 'visitors') => {
    if (!metrics) return 0
    if (period === '7d') return metrics[type].last_7d
    if (period === '30d') return metrics[type].last_30d
    return metrics[type].total
  }

  const viewsCount    = getMetric('views')
  const visitsCount   = getMetric('visits')
  const visitorsCount = getMetric('visitors')

  const pagesPerVisit = visitsCount   > 0 ? (viewsCount  / visitsCount).toFixed(1)   : '—'
  const returningRate = visitorsCount > 0 ? (visitsCount  / visitorsCount).toFixed(1) : '—'

  const topPage     = metrics?.top_pages?.[0]
  const topReferrer = metrics?.referrers?.[0]

  const maxPageViews = metrics?.top_pages?.length
    ? Math.max(...metrics.top_pages.map((p) => p.views), 1)
    : 1

  const totalReferrerVisits = metrics?.referrers?.reduce((s, r) => s + r.visits, 0) || 1

  const sourceConfig: Record<string, { label: string; icon: string }> = {
    direct:    { label: 'Acesso Direto', icon: '→' },
    google:    { label: 'Google',        icon: '⊙' },
    instagram: { label: 'Instagram',     icon: '◈' },
    other:     { label: 'Outros',        icon: '⊕' },
  }

  const evolutionData = metrics
    ? [
        { key: '7d',    label: '7 dias',     views: metrics.views.last_7d,  visits: metrics.visits.last_7d  },
        { key: '30d',   label: '30 dias',    views: metrics.views.last_30d, visits: metrics.visits.last_30d },
        { key: 'total', label: 'Acumulado',  views: metrics.views.total,    visits: metrics.visits.total    },
      ]
    : []

  const maxEvolutionViews = evolutionData.length
    ? Math.max(...evolutionData.map((d) => d.views), 1)
    : 1

  return (
    <div className="space-y-6">

      {/* ── CABEÇALHO ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-emerald-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--admin-text)' }}>
              Métricas &amp; Audiência
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>
            Tráfego e engajamento do site Studio AM — telemetria anônima.
          </p>
        </div>

        {/* Seletor de período */}
        <div
          className="inline-flex items-center p-1 rounded-xl border self-start sm:self-auto"
          style={{ background: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
          {([
            { key: '7d',    label: '7 dias' },
            { key: '30d',   label: '30 dias' },
            { key: 'total', label: 'Total' },
          ] as const).map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={
                period === p.key
                  ? { background: '#0B1120', color: '#ffffff', fontWeight: 700 }
                  : { color: 'var(--admin-muted)' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(
          [
            {
              key: 'views',
              label: 'Visualizações',
              value: viewsCount,
              sub: `${pagesPerVisit} páginas por visita`,
              accent: ACCENT.views,
            },
            {
              key: 'visits',
              label: 'Visitas',
              value: visitsCount,
              sub: `${returningRate}× visitas por pessoa`,
              accent: ACCENT.visits,
            },
            {
              key: 'visitors',
              label: 'Pessoas únicas',
              value: visitorsCount,
              sub: 'Coleta anônima — LGPD ✓',
              accent: ACCENT.visitors,
            },
          ] as const
        ).map((card) => (
          <div
            key={card.key}
            className="rounded-2xl p-6 flex flex-col justify-between gap-5"
            style={{ background: card.accent.bg, minHeight: 168 }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: card.accent.sub }}
              >
                {card.label}
              </span>
              {/* Barra sparkline decorativa */}
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: card.accent.badge, color: card.accent.badgeText }}
              >
                {period === '7d' ? '7d' : period === '30d' ? '30d' : '∞'}
              </span>
            </div>

            <div>
              <div
                className="text-5xl font-black tracking-tight leading-none"
                style={{ color: card.accent.text }}
              >
                {card.value.toLocaleString('pt-BR')}
              </div>
              <div
                className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: card.accent.sub }}
              >
                <span>{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── EVOLUÇÃO DOS ACESSOS ───────────────────────────────────── */}
      {evolutionData.length > 0 && (
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--admin-text)' }}>
                Evolução dos Acessos
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                Comparação por janela de tempo
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--admin-muted)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: ACCENT.views.bar }} />
                Visualizações
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: ACCENT.visits.bar }} />
                Visitas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {evolutionData.map((d) => {
              const viewsPct  = Math.max(Math.round((d.views  / maxEvolutionViews) * 100), 3)
              const visitsPct = Math.max(Math.round((d.visits / maxEvolutionViews) * 100), 2)
              const isActive  = d.key === period
              return (
                <div
                  key={d.key}
                  className="flex flex-col gap-3 rounded-xl p-4 transition-all"
                  style={{
                    background: isActive ? 'var(--admin-canvas)' : 'transparent',
                    border: isActive ? '1px solid var(--admin-border)' : '1px solid transparent',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {/* Barras verticais */}
                  <div className="flex items-end gap-2 h-24">
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${viewsPct}%`, background: ACCENT.views.bar }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${visitsPct}%`, background: ACCENT.visits.bar }}
                      />
                    </div>
                  </div>

                  {/* Legenda */}
                  <div className="border-t pt-3" style={{ borderColor: 'var(--admin-border)' }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--admin-muted)' }}>
                      {d.label}
                    </p>
                    <p className="text-2xl font-black mt-0.5 tracking-tight" style={{ color: 'var(--admin-text)' }}>
                      {d.views.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                      {d.visits.toLocaleString('pt-BR')} visitas
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── INFERIOR: PÁGINAS + ORIGENS ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Páginas Mais Visitadas */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--admin-text)' }}>
                Páginas Mais Visitadas
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                Conteúdos com maior audiência
              </p>
            </div>
            {topPage && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ml-3"
                style={{
                  background: ACCENT.views.badge,
                  color: ACCENT.views.badgeText,
                  border: `1px solid ${ACCENT.views.bar}30`,
                }}
              >
                Líder: {topPage.path}
              </span>
            )}
          </div>

          {metrics?.top_pages && metrics.top_pages.length > 0 ? (
            <div className="space-y-4">
              {metrics.top_pages.map((p, idx) => {
                const pct = Math.max(Math.round((p.views / maxPageViews) * 100), 3)
                const isTop = idx === 0
                return (
                  <div key={p.path}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="text-xs font-black w-5 text-center shrink-0 tabular-nums"
                          style={{ color: isTop ? ACCENT.views.bar : 'var(--admin-muted)' }}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className="text-sm font-semibold truncate"
                          style={{ color: 'var(--admin-text)' }}
                          title={p.path}
                        >
                          {p.path}
                        </span>
                      </div>
                      <span className="text-sm font-black ml-4 shrink-0 tabular-nums" style={{ color: 'var(--admin-text)' }}>
                        {p.views.toLocaleString('pt-BR')}
                        <span className="text-xs font-normal ml-1" style={{ color: 'var(--admin-muted)' }}>views</span>
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full h-1.5"
                      style={{ background: 'var(--admin-canvas)' }}
                    >
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: isTop ? ACCENT.views.bar : '#94A3B8',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
              Nenhuma visita registrada ainda.
            </div>
          )}
        </div>

        {/* De onde vêm os visitantes */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--admin-text)' }}>
                De onde vêm os visitantes
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                Canais de descoberta do Studio AM
              </p>
            </div>
            {topReferrer && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ml-3 capitalize"
                style={{
                  background: SOURCE_COLOR[topReferrer.source]?.badge ?? '#F3F4F6',
                  color: SOURCE_COLOR[topReferrer.source]?.badgeText ?? '#374151',
                  border: `1px solid ${SOURCE_COLOR[topReferrer.source]?.bar ?? '#9CA3AF'}30`,
                }}
              >
                Líder: {sourceConfig[topReferrer.source]?.label ?? topReferrer.source}
              </span>
            )}
          </div>

          {metrics?.referrers && metrics.referrers.length > 0 ? (
            <div className="space-y-5">
              {metrics.referrers.map((r) => {
                const conf  = sourceConfig[r.source] ?? { label: r.source, icon: '·' }
                const color = SOURCE_COLOR[r.source] ?? { bar: '#9CA3AF', dot: '#9CA3AF', badge: '#F3F4F6', badgeText: '#374151' }
                const pct   = Math.max(Math.round((r.visits / totalReferrerVisits) * 100), 2)
                return (
                  <div key={r.source}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: color.dot }}
                        />
                        <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>
                          {conf.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tabular-nums" style={{ color: 'var(--admin-text)' }}>
                          {r.visits.toLocaleString('pt-BR')}
                        </span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[40px] text-center"
                          style={{ background: color.badge, color: color.badgeText }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-full rounded-full h-2.5"
                      style={{ background: 'var(--admin-canvas)' }}
                    >
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color.bar }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
              Nenhum canal registrado ainda.
            </div>
          )}
        </div>
      </div>

      {/* ── RODAPÉ ────────────────────────────────────────────────── */}
      <div
        className="rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
        style={{ background: 'var(--admin-canvas)', border: '1px solid var(--admin-border)' }}
      >
        <p style={{ color: 'var(--admin-muted)' }}>
          Monitoramento sem cookies. Nenhum dado pessoal ou IP é armazenado — em conformidade com a LGPD.
        </p>
        <span className="shrink-0 font-semibold" style={{ color: 'var(--admin-text)' }}>
          Studio AM · Telemetria interna
        </span>
      </div>

    </div>
  )
}
