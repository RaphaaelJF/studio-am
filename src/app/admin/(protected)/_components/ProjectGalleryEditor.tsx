'use client'

import React, { useRef } from 'react'
import { useImageManager } from './ProjectDraftProvider'
import { ConfirmDialog } from './ConfirmDialog'
import {
  ImageIcon, TrashIcon, CheckIcon,
  ChevronUpIcon, ChevronDownIcon,
} from '@/components/shared/Icons'
import type { AnyImageItem } from '@/types/admin-project-form'

export function ProjectGalleryEditor() {
  const { images, addLocalImages, removeImage, setCover, updateImageMeta, moveImage } = useImageManager()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    addLocalImages(files)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const getImageUrl = (img: AnyImageItem) =>
    img.kind === 'local' ? img.objectUrl : img.storageUrl

  const getImageId = (img: AnyImageItem) =>
    img.kind === 'local' ? img.localId : img.id

  const cover = images.find(img => img.is_cover)

  return (
    <div className="space-y-5">
      {/* Upload area */}
      <div>
        <input
          ref={fileInputRef}
          id="gallery-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          aria-label="Adicionar imagens à galeria"
          className="sr-only"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border hover:border-black/40 transition-colors bg-beige/30 hover:bg-beige/50 py-8 px-4 text-center focus-visible:outline-black rounded-sm"
        >
          <ImageIcon className="w-6 h-6 text-muted mx-auto mb-2" />
          <p className="text-xs font-medium text-black uppercase tracking-wider">
            Selecionar imagens
          </p>
          <p className="text-[11px] text-muted mt-1">
            JPEG, PNG ou WebP — proporção recomendada 4:3 ou 16:9 · Máx. 5 MB por arquivo
          </p>
        </button>
      </div>

      {/* Guidance */}
      {images.length === 0 && (
        <p className="text-[11px] text-muted leading-relaxed">
          Nenhuma imagem adicionada. As imagens existirão somente como prévia local nesta sessão — nenhum upload será enviado ao servidor.
        </p>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-3">
          {/* Cover indicator */}
          {cover && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
              Capa: {cover.alt.trim() || <span className="text-muted italic">sem texto alternativo</span>}
            </div>
          )}

          {images.map((img, idx) => {
            const id = getImageId(img)
            const url = getImageUrl(img)
            const isFirst = idx === 0
            const isLast = idx === images.length - 1

            return (
              <div key={id} className={`border bg-warm-white ${img.is_cover ? 'border-black' : 'border-border'}`}>
                <div className="flex items-start gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 shrink-0 bg-beige overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={img.alt || 'Prévia local'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.currentTarget
                        el.style.display = 'none'
                      }}
                    />
                    {img.kind === 'local' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                        <span className="text-[8px] text-white uppercase tracking-wider">Local</span>
                      </div>
                    )}
                    {img.is_cover && (
                      <div className="absolute top-1 right-1 bg-black text-white rounded-sm p-0.5">
                        <CheckIcon className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <label
                        htmlFor={`alt-${id}`}
                        className="block text-[10px] uppercase tracking-wider text-muted font-medium mb-1"
                      >
                        Texto alternativo {img.is_cover && <span className="text-black">*</span>}
                      </label>
                      <input
                        id={`alt-${id}`}
                        type="text"
                        value={img.alt}
                        onChange={e => updateImageMeta(id, { alt: e.target.value })}
                        placeholder="Descrição da imagem para acessibilidade"
                        className="w-full px-3 py-1.5 text-xs border border-border bg-beige/20 text-black placeholder:text-muted focus:outline-black rounded-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`caption-${id}`}
                        className="block text-[10px] uppercase tracking-wider text-muted font-medium mb-1"
                      >
                        Legenda (opcional)
                      </label>
                      <input
                        id={`caption-${id}`}
                        type="text"
                        value={img.caption}
                        onChange={e => updateImageMeta(id, { caption: e.target.value })}
                        placeholder="Texto exibido abaixo da imagem"
                        className="w-full px-3 py-1.5 text-xs border border-border bg-beige/20 text-black placeholder:text-muted focus:outline-black rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveImage(id, 'up')}
                      aria-label="Mover imagem para cima"
                      className="p-1.5 text-muted hover:text-black disabled:opacity-30 transition-colors focus-visible:outline-black"
                    >
                      <ChevronUpIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveImage(id, 'down')}
                      aria-label="Mover imagem para baixo"
                      className="p-1.5 text-muted hover:text-black disabled:opacity-30 transition-colors focus-visible:outline-black"
                    >
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(id)}
                      aria-label="Remover imagem"
                      className="p-1.5 text-muted hover:text-graphite transition-colors focus-visible:outline-black"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cover selector */}
                <div className="px-4 pb-3 border-t border-border/50 pt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                    <input
                      type="radio"
                      name="cover-image"
                      value={id}
                      checked={img.is_cover}
                      onChange={() => setCover(id)}
                      className="accent-black w-3.5 h-3.5"
                    />
                    Usar como capa
                  </label>
                  {img.kind === 'local' && (
                    <span className="text-[10px] text-muted italic">Mantida somente nesta sessão</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirm remove */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remover imagem"
        description="Tem certeza que deseja remover esta imagem da galeria? Se for a capa, uma nova capa deverá ser definida."
        confirmLabel="Remover"
        onConfirm={() => {
          if (deleteTarget) removeImage(deleteTarget)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
        destructive
      />
    </div>
  )
}
