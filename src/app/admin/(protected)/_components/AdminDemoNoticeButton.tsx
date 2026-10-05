'use client'

import React from 'react'
import { useToast } from './AdminToastContext'

interface AdminDemoNoticeButtonProps {
  label: string
  actionName?: string
  className?: string
  variant?: 'primary' | 'secondary'
}

export function AdminDemoNoticeButton({
  label,
  actionName,
  className = '',
  variant = 'primary',
}: AdminDemoNoticeButtonProps) {
  const { toast } = useToast()

  const handleClick = () => {
    toast(
      actionName
        ? `"${actionName}" indisponível no modo demonstração.`
        : 'Indisponível no modo demonstração.',
      'info'
    )
  }

  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md transition-colors ${className}`}
        style={{
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          color: 'var(--admin-text)',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-md transition-opacity hover:opacity-90 ${className}`}
      style={{ backgroundColor: 'var(--admin-text)' }}
    >
      {label}
    </button>
  )
}
