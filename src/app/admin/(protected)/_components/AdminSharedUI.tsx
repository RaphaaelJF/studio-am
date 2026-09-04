import React from 'react'

// ─── AdminEmptyState ──────────────────────────────────────────────────────────
interface AdminEmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    disabled?: boolean
  }
}

import Link from 'next/link'

export function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <div
      className="admin-empty-state flex flex-col items-center justify-center text-center rounded-lg w-full min-w-0 max-w-full py-6 px-4 sm:py-12 sm:px-8 min-h-[160px]"
      style={{ border: '1px dashed var(--admin-border)' }}
    >
      <p className="text-sm font-medium mb-1 text-center" style={{ color: 'var(--admin-text)' }}>{title}</p>
      <p className="text-sm mb-4 line-clamp-2 max-w-[320px] text-center" style={{ color: 'var(--admin-muted)' }}>{description}</p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white rounded-lg min-h-[44px] w-auto shrink-0"
            style={{ backgroundColor: 'var(--admin-text)' }}
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white rounded-lg disabled:opacity-40 min-h-[44px] w-auto shrink-0"
            style={{ backgroundColor: 'var(--admin-text)' }}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}

// ─── AdminErrorState ──────────────────────────────────────────────────────────
interface AdminErrorStateProps {
  message?: string
}

export function AdminErrorState({ message = 'Não foi possível carregar os dados.' }: AdminErrorStateProps) {
  return (
    <div className="py-8 px-6 rounded-lg" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--admin-text)' }}>Falha de carregamento</p>
      <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>{message}</p>
    </div>
  )
}

// ─── ProjectStatusBadge ───────────────────────────────────────────────────────
import type { ProjectStatus } from '@/types/project'

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function ProjectStatusBadge({ status, className = '' }: ProjectStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${status === 'published' ? 'badge-published' : 'badge-draft'
      } ${className}`}>
      {status === 'published' ? 'Publicado' : 'Rascunho'}
    </span>
  )
}

// ─── AdminDemoBanner ──────────────────────────────────────────────────────────
export function AdminDemoBanner() {
  return (
    <div
      className="admin-demo-banner flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px]"
      style={{ background: '#FFF4E1', border: '1px solid #EED9B8', color: '#81582C' }}
    >
      <span className="font-medium">Modo demonstrativo</span>
      <span>— os dados exibidos são fictícios e não serão persistidos.</span>
    </div>
  )
}

// ─── AdminSectionHeader ───────────────────────────────────────────────────────
export function AdminSectionHeader({
  title, subtitle, action
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="admin-section-header flex items-center justify-between gap-4 mb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--admin-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-muted)' }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ─── AdminCard ────────────────────────────────────────────────────────────────
export function AdminCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-md ${className}`}
      style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
    >
      {children}
    </div>
  )
}

// ─── AdminMetricStrip (legacy compat) ─────────────────────────────────────────
interface MetricItem { label: string; value: number | string }
interface AdminMetricStripProps { items: MetricItem[] }

export function AdminMetricStrip({ items }: AdminMetricStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <AdminCard key={i} className="p-4">
          <span className="block text-[11px] font-medium mb-1" style={{ color: 'var(--admin-muted)' }}>
            {item.label}
          </span>
          <span className="block text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
            {item.value}
          </span>
        </AdminCard>
      ))}
    </div>
  )
}

// ─── AdminPrimaryButton ───────────────────────────────────────────────────────
export function AdminPrimaryButton({
  children, onClick, disabled = false, type = 'button', className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-md transition-opacity disabled:opacity-50 ${className}`}
      style={{ backgroundColor: 'var(--admin-text)' }}
    >
      {children}
    </button>
  )
}

// ─── AdminSecondaryButton ─────────────────────────────────────────────────────
export function AdminSecondaryButton({
  children, onClick, disabled = false, type = 'button', className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${className}`}
      style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
    >
      {children}
    </button>
  )
}
