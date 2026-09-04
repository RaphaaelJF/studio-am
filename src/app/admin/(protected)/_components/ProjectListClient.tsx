'use client'

import React, { useState, useCallback, useDeferredValue } from 'react'
import Link from 'next/link'
import type { AdminProjectListItem } from '@/lib/admin/projects'
import type { ProjectStatus } from '@/types/project'
import { AdminEmptyState, AdminCard, AdminDemoBanner } from './AdminSharedUI'
import { ConfirmDialog } from './ConfirmDialog'
import { useToast } from './AdminToastContext'
import { PlusIcon, SearchIcon, EllipsisIcon, EditIcon, EyeIcon } from '@/components/shared/Icons'
import { formatDate, PROJECT_CATEGORIES } from '@/types/admin-project-form'
import { demoThumbnails } from '../_fixtures/demo-projects'
import type { DemoId } from '../_fixtures/demo-projects'

// ─── Types ───────────────────────────────────────────────────────────────────
type FilterStatus = 'all' | ProjectStatus | 'featured' | 'archived'
type SortKey = 'display_order' | 'updated_at' | 'title'

interface ProjectListClientProps {
  projects: AdminProjectListItem[]
  isDemo: boolean
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ProjectListClient({ projects: initialProjects, isDemo }: ProjectListClientProps) {
  const { toast } = useToast()
  const [projects, setProjects] = useState<AdminProjectListItem[]>(initialProjects)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortKey, setSortKey] = useState<SortKey>('display_order')
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectListItem | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const deferredSearch = useDeferredValue(search)

  const visibleProjects = useCallback(() => {
    let list = [...projects]
    if (deferredSearch) {
      const q = deferredSearch.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (filterStatus === 'archived') {
      list = []
    } else if (filterStatus === 'featured') {
      list = list.filter(p => p.featured)
    } else if (filterStatus !== 'all') {
      list = list.filter(p => p.status === filterStatus)
    }
    list.sort((a, b) => {
      if (sortKey === 'display_order') return a.display_order - b.display_order
      if (sortKey === 'updated_at') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      if (sortKey === 'title') return a.title.localeCompare(b.title, 'pt-BR')
      return 0
    })
    return list
  }, [projects, deferredSearch, filterStatus, sortKey])

  const handleToggleStatus = (project: AdminProjectListItem) => {
    const next: ProjectStatus = project.status === 'published' ? 'draft' : 'published'
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: next } : p))
    toast(`"${project.title}" → ${next === 'published' ? 'Publicado' : 'Rascunho'}. Não persistido.`, 'info')
    setOpenMenuId(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setProjects(prev => prev.filter(p => p.id !== deleteTarget.id))
    toast(`"${deleteTarget.title}" removido nesta sessão. Não persistido.`, 'info')
    setDeleteTarget(null)
  }

  const viewUrl = (p: AdminProjectListItem) =>
    isDemo ? `/admin/projetos/${p.id}/preview?visual=demo` : `/admin/projetos/${p.id}/preview`
  const editUrl = (p: AdminProjectListItem) =>
    isDemo ? `/admin/projetos/${p.id}/editar?visual=demo` : `/admin/projetos/${p.id}/editar`
  const newProjectHref = isDemo ? '/admin/projetos/novo?visual=demo' : '/admin/projetos/novo'

  const visible = visibleProjects()
  const totalCount = isDemo ? 12 : projects.length
  const publishedCount = isDemo ? 9 : projects.filter(p => p.status === 'published').length
  const draftCount = isDemo ? 3 : projects.filter(p => p.status === 'draft').length

  const tabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: totalCount },
    { id: 'published', label: 'Publicados', count: publishedCount },
    { id: 'draft', label: 'Rascunhos', count: draftCount },
    { id: 'archived', label: 'Arquivados', count: 0 },
  ]

  return (
    <div className="space-y-5">
      {isDemo && <AdminDemoBanner />}

      {/* Header */}
      <div className="admin-section-header flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--admin-text)' }}>Projetos</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-muted)' }}>
            Crie, edite e gerencie seu portfólio.
          </p>
        </div>
        <Link
          href={newProjectHref}
          className="admin-header-button flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
          style={{ background: 'var(--admin-text)' }}
        >
          <PlusIcon className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Novo projeto</span>
        </Link>
      </div>

      {/* Main card */}
      <AdminCard>
        {/* Mobile Status Select (< 768px) */}
        <div className="admin-project-status-mobile md:hidden p-3 border-b border-[var(--admin-border)]">
          <label htmlFor="admin-mobile-status-select" className="sr-only">Filtrar por status</label>
          <select
            id="admin-mobile-status-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg focus:outline-none"
            style={{
              border: '1px solid var(--admin-border)',
              background: 'var(--admin-canvas)',
              color: 'var(--admin-text)',
            }}
          >
            <option value="all">Status: Todos ({totalCount})</option>
            <option value="published">Status: Publicados ({publishedCount})</option>
            <option value="draft">Status: Rascunhos ({draftCount})</option>
            <option value="archived">Status: Arquivados (0)</option>
          </select>
        </div>

        {/* Desktop Tabs outer (>= 768px) */}
        <div
          className="admin-project-tabs-desktop admin-tabs-outer hidden md:block"
          style={{ borderBottom: '1px solid var(--admin-border)' }}
        >
          {/* Tabs inner */}
          <div className="admin-tabs-inner items-center gap-1 px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-h-[44px]"
                style={{
                  borderBottomColor: filterStatus === tab.id ? 'var(--admin-text)' : 'transparent',
                  color: filterStatus === tab.id ? 'var(--admin-text)' : 'var(--admin-muted)',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
                <span
                  className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: filterStatus === tab.id ? 'var(--admin-active)' : 'transparent',
                    color: 'var(--admin-muted)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:px-5 sm:py-3"
          style={{ borderBottom: '1px solid var(--admin-border)' }}
        >
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--admin-muted)]"
            />
            <input
              type="search"
              placeholder="Buscar projetos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none w-full min-h-[44px] min-w-0"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-canvas)',
                color: 'var(--admin-text)',
              }}
            />
          </div>

          {/* Sort + Filters */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="text-sm py-2 px-3 rounded-lg focus:outline-none min-w-0 min-h-[44px]"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-canvas)',
                color: 'var(--admin-text)',
              }}
            >
              <option value="display_order">Ordem do portfólio</option>
              <option value="updated_at">Mais recentes</option>
              <option value="title">Título A–Z</option>
            </select>
            <button
              type="button"
              className="text-sm py-2 px-4 rounded-lg focus:outline-none shrink-0 min-h-[44px]"
              style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text)' }}
            >
              ☷&nbsp; Filtros
            </button>
          </div>
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <div className="p-4 sm:p-8">
            <AdminEmptyState
              title="Nenhum projeto encontrado"
              description={search || filterStatus !== 'all' ? 'Nenhum projeto corresponde aos filtros.' : 'Crie o primeiro projeto do portfólio.'}
              action={{ label: 'Novo projeto', href: newProjectHref }}
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    {['Projeto', 'Categoria', 'Status', 'Atualizado', ''].map((h, i) => (
                      <th
                        key={i}
                        className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--admin-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, rowIndex) => {
                    const thumb = p.id in demoThumbnails ? demoThumbnails[p.id as DemoId] : null
                    return (
                      <tr
                        key={p.id}
                        className="group transition-colors"
                        style={{
                          borderBottom: rowIndex < visible.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-canvas)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Projeto (thumbnail + title) */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="shrink-0 rounded overflow-hidden"
                              style={{
                                width: 48,
                                height: 36,
                                background: 'var(--admin-active)',
                                border: '1px solid var(--admin-border)',
                              }}
                            >
                              {thumb && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <Link
                                href={editUrl(p)}
                                className="font-medium text-sm hover:underline"
                                style={{ color: 'var(--admin-text)' }}
                              >
                                {p.title}
                              </Link>
                              <p
                                className="text-[11px] font-mono mt-0.5"
                                style={{ color: 'var(--admin-muted)' }}
                              >
                                /{p.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="px-5 py-3 capitalize text-sm" style={{ color: 'var(--admin-muted)' }}>
                          {PROJECT_CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${p.status === 'published' ? 'badge-published' : 'badge-draft'
                              }`}
                          >
                            {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>

                        {/* Atualizado */}
                        <td className="px-5 py-3 text-sm" style={{ color: 'var(--admin-muted)' }}>
                          {formatDate(p.updated_at)}
                        </td>

                        {/* Ações */}
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={viewUrl(p)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--admin-muted)' }}
                              aria-label={`Preview ${p.title}`}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>
                            <Link
                              href={editUrl(p)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--admin-muted)' }}
                              aria-label={`Editar ${p.title}`}
                            >
                              <EditIcon className="w-4 h-4" />
                            </Link>
                            <ActionMenu
                              project={p}
                              isOpen={openMenuId === p.id}
                              onToggle={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                              onClose={() => setOpenMenuId(null)}
                              onToggleStatus={() => handleToggleStatus(p)}
                              onDelete={() => { setDeleteTarget(p); setOpenMenuId(null) }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Pagination placeholder */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderTop: '1px solid var(--admin-border)' }}
              >
                <p className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                  {visible.length} projeto{visible.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(pg => (
                    <button
                      key={pg}
                      className="w-7 h-7 flex items-center justify-center text-xs rounded"
                      style={{
                        background: pg === 1 ? 'var(--admin-text)' : 'transparent',
                        color: pg === 1 ? 'white' : 'var(--admin-muted)',
                        border: pg !== 1 ? '1px solid var(--admin-border)' : 'none',
                      }}
                    >
                      {pg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--admin-border)' }}>
              {visible.map(p => {
                const thumb = p.id in demoThumbnails ? demoThumbnails[p.id as DemoId] : null
                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 rounded overflow-hidden"
                        style={{ width: 56, height: 42, background: 'var(--admin-active)', border: '1px solid var(--admin-border)' }}
                      >
                        {thumb && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={editUrl(p)} className="text-sm font-semibold truncate block hover:underline" style={{ color: 'var(--admin-text)' }}>
                          {p.title}
                        </Link>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                          {PROJECT_CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${p.status === 'published' ? 'badge-published' : 'badge-draft'
                        }`}>
                        {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs" style={{ color: 'var(--admin-muted)' }}>
                      <span>Atualizado {formatDate(p.updated_at)}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={viewUrl(p)}
                          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-xs font-medium rounded hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--admin-muted)' }}
                          aria-label={`Visualizar ${p.title}`}
                        >
                          Visualizar
                        </Link>
                        <Link
                          href={editUrl(p)}
                          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-xs font-medium rounded hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--admin-text)' }}
                          aria-label={`Editar ${p.title}`}
                        >
                          Editar
                        </Link>
                        <ActionMenu
                          project={p}
                          isOpen={openMenuId === p.id}
                          onToggle={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                          onClose={() => setOpenMenuId(null)}
                          onToggleStatus={() => handleToggleStatus(p)}
                          onDelete={() => { setDeleteTarget(p); setOpenMenuId(null) }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </AdminCard>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir projeto"
        description={`Excluir "${deleteTarget?.title}"? Nenhum dado será removido do banco nesta sessão.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        destructive
      />
    </div>
  )
}

// ─── Action Menu ─────────────────────────────────────────────────────────────
interface ActionMenuProps {
  project: AdminProjectListItem
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

function ActionMenu({ project, isOpen, onToggle, onClose, onToggleStatus, onDelete }: ActionMenuProps) {
  React.useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-action-menu]')) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  return (
    <div className="relative" data-action-menu>
      <button
        type="button"
        aria-label="Ações"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: 'var(--admin-muted)' }}
      >
        <EllipsisIcon className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-44 rounded-lg shadow-md z-20 py-1"
          style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
          role="menu"
        >
          <button
            type="button"
            onClick={onToggleStatus}
            className="w-full text-left px-4 py-2 text-sm transition-colors"
            style={{ color: 'var(--admin-text)' }}
            role="menuitem"
          >
            {project.status === 'published' ? 'Reverter para rascunho' : 'Publicar (sessão)'}
          </button>
          <div style={{ height: '1px', background: 'var(--admin-border)', margin: '4px 0' }} />
          <button
            type="button"
            onClick={onDelete}
            className="w-full text-left px-4 py-2 text-sm transition-colors text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}
