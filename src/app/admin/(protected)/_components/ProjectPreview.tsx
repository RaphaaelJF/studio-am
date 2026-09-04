'use client'

import React from 'react'
import Link from 'next/link'
import { ProjectStatusBadge } from './AdminSharedUI'
import { ArrowLeftIcon, ExternalLinkIcon } from '@/components/shared/Icons'
import type { ProjectFormData, AnyImageItem } from '@/types/admin-project-form'
import { PROJECT_CATEGORIES } from '@/types/admin-project-form'

interface ProjectPreviewProps {
  formData: ProjectFormData
  images: AnyImageItem[]
  editUrl: string
  projectId: string
  isDemo?: boolean
  onClose?: () => void
  embedded?: boolean
}

export function ProjectPreview({ formData, images, editUrl, isDemo, onClose, embedded = false }: ProjectPreviewProps) {
  const cover = images.find(img => img.is_cover) ?? images[0]
  const coverUrl = cover
    ? (cover.kind === 'local' ? cover.objectUrl : cover.storageUrl)
    : null

  const categoryLabel = PROJECT_CATEGORIES.find(c => c.value === formData.category)?.label ?? formData.category

  const publicUrl = formData.slug ? `/projetos/${formData.slug}` : null

  return (
    <div className={embedded ? 'admin-embedded-preview' : ''}>
      {/* Admin bar */}
      <div className="bg-graphite text-warm-white px-4 py-3 flex items-center justify-between gap-4 flex-wrap text-xs sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {onClose ? (
            <button type="button" onClick={onClose} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity focus-visible:outline-white">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              Voltar ao editor
            </button>
          ) : (
            <Link href={editUrl} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity focus-visible:outline-white">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              Voltar ao editor
            </Link>
          )}
          <div className="w-px h-4 bg-warm-white/20" />
          <ProjectStatusBadge status={formData.status} className="border border-warm-white/20" />
          {isDemo && <span className="text-warm-white/60 italic">Modo visual</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-warm-white/60">Pré-visualização — não publicada</span>
          {publicUrl && formData.status === 'published' && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity focus-visible:outline-white"
            >
              Ver versão pública
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`bg-warm-white ${embedded ? 'min-h-[640px]' : 'min-h-screen'}`}>
        {/* Cover */}
        {coverUrl ? (
          <div className="w-full aspect-video max-h-[60vh] bg-beige overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={cover?.alt || formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-beige flex items-center justify-center">
            <span className="text-[11px] text-muted uppercase tracking-widest">
              {images.length === 0 ? 'Nenhuma imagem adicionada' : 'Imagem de capa não definida'}
            </span>
          </div>
        )}

        {/* Project content */}
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          {/* Category + year */}
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-muted mb-6">
            {categoryLabel && <span>{categoryLabel}</span>}
            {formData.year && <><span>·</span><span>{formData.year}</span></>}
            {formData.location && <><span>·</span><span>{formData.location}</span></>}
            {formData.area && <><span>·</span><span>{formData.area}</span></>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-black uppercase mb-6 leading-tight">
            {formData.title || <span className="text-muted italic">Sem título</span>}
          </h1>

          {/* Summary */}
          {formData.summary && (
            <p className="text-base text-foreground/80 leading-relaxed mb-8 border-l-2 border-border pl-4">
              {formData.summary}
            </p>
          )}

          {/* Description */}
          {formData.description ? (
            <div className="prose-sm text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {formData.description}
            </div>
          ) : (
            <p className="text-sm text-muted italic">Nenhuma descrição adicionada.</p>
          )}

          {/* Gallery */}
          {images.length > 1 && (
            <div className="mt-12 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-4">Galeria</p>
              <div className="grid grid-cols-2 gap-3">
                {images.filter(img => !img.is_cover).map(img => {
                  const id = img.kind === 'local' ? img.localId : img.id
                  const url = img.kind === 'local' ? img.objectUrl : img.storageUrl
                  return (
                    <div key={id} className="aspect-video bg-beige overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={img.alt || 'Imagem do projeto'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Local images warning */}
        {images.some(img => img.kind === 'local') && (
          <div className="border-t border-border px-6 py-4 bg-beige/40 text-center">
            <p className="text-[11px] text-muted">
              As imagens exibidas existem somente nesta sessão. Se a página for recarregada, as imagens locais serão perdidas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
