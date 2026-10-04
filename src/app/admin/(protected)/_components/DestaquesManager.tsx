'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AdminCard, AdminPrimaryButton } from './AdminSharedUI'
import { useToast } from './AdminToastContext'
import { ChevronUpIcon, ChevronDownIcon, TrashIcon, PlusIcon, ExternalLinkIcon } from '@/components/shared/Icons'
import { demoThumbnails } from '../_fixtures/demo-projects'
import type { DemoId } from '../_fixtures/demo-projects'
import type { AdminProjectListItem } from '@/lib/admin/projects'
import { updateFeaturedProjects } from '@/app/admin/actions/projects'

interface DestaquesManagerProps {
  initialProjects: AdminProjectListItem[]
  isDemo: boolean
}

export function DestaquesManager({ initialProjects, isDemo }: DestaquesManagerProps) {
  const { toast } = useToast()
  const [allProjects, setAllProjects] = useState<AdminProjectListItem[]>(initialProjects)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Filtra projetos ativos marcados como featured e ordena por display_order
  const featuredProjects = allProjects
    .filter(p => !p.deleted_at && !p.archived_at && p.featured)
    .sort((a, b) => a.display_order - b.display_order)

  // Candidatos que podem ser adicionados aos destaques (não arquivados, não deletados e ainda não destacados)
  const availableCandidates = allProjects.filter(
    p => !p.deleted_at && !p.archived_at && !p.featured
  )

  const moveUp = (index: number) => {
    if (index === 0) return
    const list = [...featuredProjects]
    const temp = list[index - 1]
    list[index - 1] = list[index]
    list[index] = temp

    // Recalcula display_order
    const updatedFeatured = list.map((item, i) => ({ ...item, display_order: i + 1 }))
    setAllProjects(prev =>
      prev.map(p => {
        const found = updatedFeatured.find(f => f.id === p.id)
        return found ? found : p
      })
    )
  }

  const moveDown = (index: number) => {
    if (index === featuredProjects.length - 1) return
    const list = [...featuredProjects]
    const temp = list[index + 1]
    list[index + 1] = list[index]
    list[index] = temp

    const updatedFeatured = list.map((item, i) => ({ ...item, display_order: i + 1 }))
    setAllProjects(prev =>
      prev.map(p => {
        const found = updatedFeatured.find(f => f.id === p.id)
        return found ? found : p
      })
    )
  }

  const removeFeatured = (id: string, title: string) => {
    setAllProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: false } : p))
    )
    toast(`"${title}" removido dos destaques. Clique em "Salvar Ordem" para confirmar.`, 'info')
  }

  const addFeatured = (project: AdminProjectListItem) => {
    if (featuredProjects.length >= 6) {
      toast('Limite de 6 projetos em destaque atingido.', 'warning')
      return
    }
    const newOrder = featuredProjects.length + 1
    setAllProjects(prev =>
      prev.map(p => (p.id === project.id ? { ...p, featured: true, display_order: newOrder } : p))
    )
    setShowAddModal(false)
    toast(`"${project.title}" adicionado como #${newOrder} na Home.`, 'success')
  }

  const handleSave = async () => {
    const ids = featuredProjects.map(p => p.id)
    if (isDemo) {
      toast('Ordem dos destaques salva temporariamente na sessão!', 'success')
      return
    }

    setIsSaving(true)
    try {
      const res = await updateFeaturedProjects(ids)
      if (res.success) {
        toast('Destaques da Home atualizados com sucesso!', 'success')
      } else {
        toast(res.error || 'Erro ao salvar destaques.', 'error')
      }
    } catch {
      toast('Erro de comunicação ao salvar.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Barra de Ações do Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-[var(--admin-text)]">
            Organização dos Destaques na Home
          </h2>
          <p className="text-xs text-[var(--admin-muted)] mt-1">
            {featuredProjects.length} de 6 posições preenchidas. O projeto <strong>#1</strong> recebe o maior destaque editorial na página inicial.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminPrimaryButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Ordem'}
          </AdminPrimaryButton>
        </div>
      </div>

      {/* Lista de Projetos em Destaque */}
      <div className="space-y-3">
        {featuredProjects.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <p className="text-sm font-medium text-[var(--admin-text)]">Nenhum projeto em destaque na Home.</p>
            <p className="text-xs text-[var(--admin-muted)] mt-1">Clique no botão abaixo para adicionar projetos.</p>
          </div>
        ) : (
          featuredProjects.map((p, index) => {
            const thumb = p.cover_url || (p.id in demoThumbnails ? demoThumbnails[p.id as DemoId] : null)
            return (
              <AdminCard
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 transition-all hover:border-[#b8bab9] shadow-sm"
              >
                {/* Lado Esquerdo: Posição + Capa + Informações */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Posição */}
                  <div className="flex flex-col items-center justify-center w-8 shrink-0">
                    <span className="text-base sm:text-lg font-bold text-[var(--admin-text)]">
                      #{index + 1}
                    </span>
                    {index === 0 && (
                      <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">
                        Capa
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-14 h-11 sm:w-16 sm:h-12 bg-neutral-200 rounded shrink-0 overflow-hidden relative border border-[var(--admin-border)]">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, 64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-mono">
                        AM
                      </div>
                    )}
                  </div>

                  {/* Detalhes do Projeto */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <Link
                        href={`/admin/projetos/${p.id}/editar`}
                        className="text-xs sm:text-sm font-semibold text-[var(--admin-text)] hover:underline truncate max-w-[180px] sm:max-w-none"
                      >
                        {p.title}
                      </Link>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] sm:text-xs text-[var(--admin-muted)]">
                      <span>{p.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] sm:text-[11px] truncate">/{p.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Controles de Ordem e Ações */}
                <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t border-[var(--admin-border)] sm:border-t-0 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-active)] disabled:opacity-30 disabled:hover:bg-[var(--admin-surface)] flex items-center justify-center text-[var(--admin-text)] transition-colors"
                    title="Mover para cima"
                    aria-label="Mover para cima"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === featuredProjects.length - 1}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-active)] disabled:opacity-30 disabled:hover:bg-[var(--admin-surface)] flex items-center justify-center text-[var(--admin-text)] transition-colors"
                    title="Mover para baixo"
                    aria-label="Mover para baixo"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  <div className="h-5 w-px bg-[var(--admin-border)] mx-1" />

                  <Link
                    href={`/projetos/${p.slug}`}
                    target="_blank"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-active)] flex items-center justify-center text-[var(--admin-text)] transition-colors"
                    title="Ver página pública"
                    aria-label="Ver página pública"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFeatured(p.id, p.title)}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-red-200 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors ml-auto sm:ml-0"
                    title="Remover dos destaques"
                    aria-label="Remover dos destaques"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </AdminCard>
            )
          })
        )}
      </div>

      {/* Bloco de Adicionar Mais Projetos */}
      {featuredProjects.length < 6 && (
        <AdminCard className="p-6 border-dashed text-center bg-transparent hover:bg-[var(--admin-surface)] transition-colors">
          <p className="text-sm font-medium text-[var(--admin-text)]">
            Você pode adicionar mais {6 - featuredProjects.length} projeto(s) à Home.
          </p>
          <p className="text-xs text-[var(--admin-muted)] mt-1">
            Escolha entre os projetos existentes para exibi-los no carrossel/grade principal.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-[var(--admin-text)] text-white hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Adicionar Projeto aos Destaques
          </button>
        </AdminCard>
      )}

      {/* Modal / Diálogo de Seleção de Candidato */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[var(--admin-surface)] rounded-xl border border-[var(--admin-border)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--admin-text)]">Selecionar Projeto para Destaque</h3>
                <p className="text-xs text-[var(--admin-muted)] mt-0.5">Selecione um projeto cadastrado para exibir na Home.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {availableCandidates.length === 0 ? (
                <p className="text-sm text-center py-8 text-[var(--admin-muted)]">
                  Nenhum projeto disponível para adicionar. Todos os projetos já estão em destaque ou você precisa criar novos projetos.
                </p>
              ) : (
                availableCandidates.map(candidate => {
                  const thumb = candidate.cover_url || (candidate.id in demoThumbnails ? demoThumbnails[candidate.id as DemoId] : null)
                  return (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--admin-border)] hover:bg-[var(--admin-canvas)] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-9 bg-neutral-200 rounded shrink-0 overflow-hidden relative border border-[var(--admin-border)]">
                          {thumb ? (
                            <Image src={thumb} alt={candidate.title} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">AM</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--admin-text)] truncate">{candidate.title}</p>
                          <p className="text-xs text-[var(--admin-muted)]">{candidate.category}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addFeatured(candidate)}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-[var(--admin-text)] text-white hover:opacity-90 shrink-0"
                      >
                        Destacar
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <div className="px-5 py-3 border-t border-[var(--admin-border)] flex justify-end bg-[var(--admin-canvas)]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-gray-100 text-[var(--admin-text)]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
