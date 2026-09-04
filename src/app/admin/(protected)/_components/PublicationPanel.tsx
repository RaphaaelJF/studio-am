'use client'

import React from 'react'
import { CheckIcon, AlertCircleIcon } from '@/components/shared/Icons'
import { useProjectDraft } from './ProjectDraftProvider'
import { getPublicationChecklist } from '@/types/admin-project-form'
import { formatDate } from '@/types/admin-project-form'

export function PublicationPanel() {
  const { formData, setFormData, images, setHasUnsavedChanges } = useProjectDraft()

  const checklist = getPublicationChecklist(formData, images)
  const canPublish = checklist.every(item => item.ok)

  const handleStatusChange = (value: 'draft' | 'published') => {
    setFormData(prev => ({ ...prev, status: value }))
    setHasUnsavedChanges(true)
  }

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const featured = e.target.checked
    if (featured && formData.status === 'draft') return // guard at UI level
    setFormData(prev => ({ ...prev, featured }))
    setHasUnsavedChanges(true)
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    setFormData(prev => ({ ...prev, display_order: isNaN(val) ? 0 : Math.max(0, val) }))
    setHasUnsavedChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-3">Status</p>
        <div className="space-y-2">
          {(['draft', 'published'] as const).map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={() => handleStatusChange(status)}
                className="accent-black w-3.5 h-3.5"
              />
              <span className="text-xs font-medium text-black">
                {status === 'draft' ? 'Rascunho' : 'Publicado'}
              </span>
            </label>
          ))}
        </div>
        {formData.status === 'published' && (
          <p className="mt-2 text-[10px] text-muted leading-relaxed">
            Simular publicação — nenhum dado foi enviado ao banco.
          </p>
        )}
      </div>

      {/* Destaque */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-3">Destaque na Home</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={handleFeaturedChange}
            disabled={formData.status === 'draft'}
            className="accent-black w-3.5 h-3.5 disabled:opacity-40"
            aria-describedby="featured-note"
          />
          <span className={`text-xs font-medium ${formData.status === 'draft' ? 'text-muted' : 'text-black'}`}>
            Exibir na seção de destaque
          </span>
        </label>
        {formData.status === 'draft' && (
          <p id="featured-note" className="mt-1 text-[10px] text-muted">
            Rascunhos não podem ser marcados como destaque.
          </p>
        )}
      </div>

      {/* Ordem */}
      <div>
        <label htmlFor="display-order" className="block text-[10px] uppercase tracking-widest text-muted font-medium mb-2">
          Ordem de exibição
        </label>
        <input
          id="display-order"
          type="number"
          min="0"
          value={formData.display_order}
          onChange={handleOrderChange}
          className="w-24 px-3 py-2 text-xs border border-border bg-warm-white text-black focus:outline-black rounded-sm"
        />
        <p className="text-[10px] text-muted mt-1">Menor número → exibido primeiro no portfólio.</p>
      </div>

      {/* Checklist de publicação */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-3">
          Requisitos para publicação
        </p>
        <ul className="space-y-1.5" role="list">
          {checklist.map(item => (
            <li key={item.key} className="flex items-center gap-2">
              <span className={`w-4 h-4 shrink-0 flex items-center justify-center ${item.ok ? 'text-black' : 'text-border'}`}>
                {item.ok
                  ? <CheckIcon className="w-3.5 h-3.5" />
                  : <AlertCircleIcon className="w-3.5 h-3.5" />
                }
              </span>
              <span className={`text-[11px] ${item.ok ? 'text-foreground' : 'text-muted'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {!canPublish && (
          <p className="text-[10px] text-muted mt-3 leading-relaxed">
            Complete os requisitos acima antes de publicar o projeto.
          </p>
        )}
      </div>

      {/* Last updated (dummy for new projects) */}
      <div className="pt-3 border-t border-border/60">
        <p className="text-[10px] text-muted">
          Sessão iniciada: {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  )
}
