'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within AdminToastProvider')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && createPortal(
        <ToastStack toasts={toasts} onDismiss={dismiss} />,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

// ─── Toast Stack ─────────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-l-4 border-l-black bg-warm-white',
  error:   'border-l-4 border-l-gray bg-warm-white',
  info:    'border-l-4 border-l-light-gray bg-warm-white',
  warning: 'border-l-4 border-l-graphite bg-warm-white',
}

const variantLabel: Record<ToastVariant, string> = {
  success: 'Concluído',
  error:   'Atenção',
  info:    'Informação',
  warning: 'Aviso',
}

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      role="region"
      aria-label="Notificações"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 shadow-lg border border-border rounded-sm ${variantStyles[t.variant]}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-0.5">
          {variantLabel[t.variant]}
        </p>
        <p className="text-xs text-black leading-snug">{t.message}</p>
      </div>
      <button
        type="button"
        aria-label="Fechar notificação"
        onClick={() => {
          if (timerRef.current) clearTimeout(timerRef.current)
          onDismiss(t.id)
        }}
        className="text-muted hover:text-black shrink-0 p-0.5 focus-visible:outline-black"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
