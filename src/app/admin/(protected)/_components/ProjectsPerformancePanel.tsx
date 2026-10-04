'use client'

import React, { useState } from 'react'
import { AdminCard } from './AdminSharedUI'
import type { AnalyticsSummary } from '@/lib/admin/metrics'

interface ProjectsPerformancePanelProps {
  metrics: AnalyticsSummary | null
  isDemo?: boolean
}

export function ProjectsPerformancePanel({ metrics, isDemo: _isDemo }: ProjectsPerformancePanelProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | 'total'>('30d')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const allProjects = metrics?.projects ?? []

  // Ordenação dos projetos pelo período selecionado
  const projectsSorted = [...allProjects].sort((a, b) => {
    const viewsA = period === '7d' ? a.views_7d : period === '30d' ? a.views_30d : a.views_total
    const viewsB = period === '7d' ? b.views_7d : period === '30d' ? b.views_30d : b.views_total
    return viewsB - viewsA
  })

  // Projeto atualmente selecionado (se houver)
  const selectedProject = selectedProjectId
    ? allProjects.find((p) => p.project_id === selectedProjectId) ?? null
    : null

  // Projeto top 1 geral
  const topProject = projectsSorted.length > 0 ? projectsSorted[0] : null

  // Métricas de conversão: se houver projeto selecionado, foca nele; senão, mostra globais
  const whatsappCount = selectedProject
    ? selectedProject.whatsapp_clicks
    : (metrics?.conversion_clicks?.whatsapp ?? 0)

  const contactCount = selectedProject
    ? selectedProject.contact_clicks
    : (metrics?.conversion_clicks?.iniciar_projeto ?? 0)

  const instagramCount = selectedProject
    ? 0 // Instagram click não é vinculado a projeto específico no schema
    : (metrics?.conversion_clicks?.instagram ?? 0)

  const viewsCount = selectedProject
    ? (period === '7d' ? selectedProject.views_7d : period === '30d' ? selectedProject.views_30d : selectedProject.views_total)
    : null

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight">
            4. Desempenho dos Projetos & Conversões
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Visualizações dedicadas e conversões por projeto individual ou no consolidado geral.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              period === '7d'
                ? 'bg-white text-gray-950 font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              period === '30d'
                ? 'bg-white text-gray-950 font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            Últimos 30 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('total')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              period === 'total'
                ? 'bg-white text-gray-950 font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            Total
          </button>
        </div>
      </div>

      {/* Barra de Filtro / Seleção Interativa de Projeto */}
      <AdminCard className="p-3.5 sm:p-4 bg-gray-50/50 border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider shrink-0">
              Filtrar Projeto:
            </span>
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => setSelectedProjectId(e.target.value ? e.target.value : null)}
              className="text-xs rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 w-full sm:w-auto min-w-[240px]"
            >
              <option value="">Todos os Projetos (Visão Consolidada)</option>
              {projectsSorted.map((p) => (
                <option key={p.project_id} value={p.project_id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedProject ? (
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors inline-flex items-center gap-1"
              >
                ✕ Limpar filtro (Ver todos)
              </button>
            ) : (
              <span className="text-[11px] text-gray-500 font-mono">
                Dica: clique em um projeto na tabela ou selecione no menu para isolar as métricas.
              </span>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Cards de Métricas: Adaptam-se se houver projeto isolado ou geral */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {selectedProject ? (
          <>
            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-gray-900 bg-gray-50/40">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                Visualizações do Projeto
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {(viewsCount ?? 0).toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">
                {period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : 'Período total'}
              </p>
            </AdminCard>

            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-emerald-600 bg-emerald-50/20">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                WhatsApp deste Projeto
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {whatsappCount.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">origem: /{selectedProject.slug}</p>
            </AdminCard>

            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-blue-600 bg-blue-50/20">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-800 font-semibold">
                Contato deste Projeto
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {contactCount.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">origem: /{selectedProject.slug}</p>
            </AdminCard>
          </>
        ) : (
          <>
            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-emerald-600 bg-emerald-50/20">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                Cliques no WhatsApp (Geral)
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {whatsappCount.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">whatsapp_click</p>
            </AdminCard>

            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-gray-900 bg-gray-50/40">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                Cliques em Contato (Geral)
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {contactCount.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">contact_click</p>
            </AdminCard>

            <AdminCard className="p-4 sm:p-5 border-l-4 border-l-pink-600 bg-pink-50/20">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-800 font-semibold">
                Cliques no Instagram (Geral)
              </span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1.5 font-mono">
                {instagramCount.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">instagram_click</p>
            </AdminCard>
          </>
        )}
      </div>

      {/* Bloco de Destaque: Mostra o Projeto Selecionado ou o Top 1 Geral */}
      {selectedProject ? (
        <div
          className="p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          style={{
            background: '#F2EFE9',
            border: '2px solid #111827',
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                PROJETO SELECIONADO (ISOLADO)
              </span>
              <span className="text-xs font-mono text-gray-600">
                {period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : 'Período Total'}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-950 mt-1.5">
              {selectedProject.title}
            </p>
            <p className="text-xs text-gray-600 font-mono mt-0.5">
              Slug: /{selectedProject.slug} • ID: {selectedProject.project_id}
            </p>
          </div>
          <div className="flex items-center gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-300">
            <div className="text-left sm:text-right">
              <span className="text-3xl font-extrabold font-mono text-gray-950">
                {period === '7d'
                  ? selectedProject.views_7d
                  : period === '30d'
                  ? selectedProject.views_30d
                  : selectedProject.views_total}
              </span>
              <span className="text-xs text-gray-700 ml-1.5 font-semibold">views</span>
              <div className="text-[11px] text-gray-600 font-mono mt-0.5">
                Total acumulado: {selectedProject.views_total}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="text-xs font-bold text-gray-700 underline hover:text-gray-950 px-2 py-1"
            >
              Fechar visão isolada
            </button>
          </div>
        </div>
      ) : topProject ? (
        <div
          className="p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          style={{
            background: '#F2EFE9',
            border: '1px solid #D9D8D4',
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                ★ PROJETO MAIS VISUALIZADO
              </span>
              <span className="text-xs font-mono text-gray-600">
                {period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : 'Período Total'}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-950 mt-1.5">
              {topProject.title}
            </p>
            <p className="text-xs text-gray-600 font-mono mt-0.5">
              Slug: /{topProject.slug}
            </p>
          </div>
          <div className="flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-300">
            <div className="text-left sm:text-right shrink-0">
              <span className="text-3xl font-extrabold font-mono text-gray-950">
                {period === '7d' ? topProject.views_7d : period === '30d' ? topProject.views_30d : topProject.views_total}
              </span>
              <span className="text-xs text-gray-700 ml-1.5 font-semibold">visualizações</span>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                {topProject.whatsapp_clicks} cliques em WhatsApp
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(topProject.project_id)}
              className="text-xs font-medium px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Isolar métricas
            </button>
          </div>
        </div>
      ) : null}

      {/* Tabela de Ranking com suporte a clique e destaque visual */}
      <AdminCard className="overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-gray-950">Ranking de Desempenho por Projeto</h3>
            <p className="text-xs text-gray-500">
              Clique em uma linha para selecionar e isolar o projeto • Ordenado por views ({period})
            </p>
          </div>
          <span className="text-xs text-gray-400 font-mono">project_view</span>
        </div>

        {projectsSorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Projeto</th>
                  <th className="py-3 px-4 text-right">Views (7d)</th>
                  <th className="py-3 px-4 text-right">Views (30d)</th>
                  <th className="py-3 px-4 text-right font-bold text-gray-900">Views Total</th>
                  <th className="py-3 px-4 text-right text-emerald-700">WhatsApp</th>
                  <th className="py-3 px-4 text-right text-gray-700">Contato</th>
                  <th className="py-3 px-4 text-center w-24">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projectsSorted.map((p, idx) => {
                  const isSelected = selectedProjectId === p.project_id
                  return (
                    <tr
                      key={p.project_id}
                      onClick={() => setSelectedProjectId(isSelected ? null : p.project_id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/60 font-medium'
                          : 'hover:bg-gray-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                          <div>
                            {p.title}
                            <span className="block text-[11px] font-mono font-normal text-gray-400">/{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600">
                        {p.views_7d.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600">
                        {p.views_30d.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950">
                        {p.views_total.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-800 font-medium">
                        {p.whatsapp_clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-700">
                        {p.contact_clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProjectId(isSelected ? null : p.project_id)
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          {isSelected ? 'Isolado ✓' : 'Isolar'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400">
            Nenhuma visualização de projeto registrada ainda. Conforme os visitantes acessarem as páginas dos projetos, as métricas e o ranking serão atualizados automaticamente.
          </div>
        )}
      </AdminCard>
    </div>
  )
}

