'use client'

import React, { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      // Move focus to confirm on open
      requestAnimationFrame(() => confirmBtnRef.current?.focus())
    } else {
      if (dialog.open) dialog.close()
    }
  }, [open])

  // Close on native cancel (Escape)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handler = (e: Event) => {
      e.preventDefault()
      onCancel()
    }
    dialog.addEventListener('cancel', handler)
    return () => dialog.removeEventListener('cancel', handler)
  }, [onCancel])

  return (
    <dialog
      ref={dialogRef}
      className="p-0 border border-border rounded-sm shadow-xl bg-warm-white max-w-sm w-[calc(100vw-2rem)] backdrop:bg-black/40"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-sm font-semibold text-black uppercase tracking-wider mb-2">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="px-6 pb-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium uppercase tracking-wider border border-border text-foreground hover:bg-beige transition-colors rounded-sm focus-visible:outline-black min-h-[44px]"
        >
          {cancelLabel}
        </button>
        <button
          ref={confirmBtnRef}
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors focus-visible:outline-black min-h-[44px] ${
            destructive
              ? 'bg-graphite text-warm-white hover:bg-black'
              : 'bg-black text-white hover:bg-graphite'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

// ─── Unsaved Changes Dialog ───────────────────────────────────────────────────

interface UnsavedChangesDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Alterações não salvas"
      description="As alterações feitas nesta sessão não foram salvas e serão perdidas. Deseja continuar mesmo assim?"
      confirmLabel="Sair sem salvar"
      cancelLabel="Continuar editando"
      onConfirm={onConfirm}
      onCancel={onCancel}
      destructive
    />
  )
}
