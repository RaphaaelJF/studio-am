'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AdminProfile } from '@/lib/auth/admin'
import { AdminNavLinks } from './AdminNavLinks'
import { MenuIcon, XIcon } from '@/components/shared/Icons'
import { logoutAction } from '../../actions'

interface AdminMobileNavProps {
  profile: AdminProfile
}

export function AdminMobileNav({ profile }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const isDemo = searchParams.get('visual') === 'demo'

  const displayName = isDemo ? 'Anne Martins' : (profile.display_name || 'Usuário')
  const roleLabel = isDemo ? 'Editora' : (profile.role === 'owner' ? 'Owner' : 'Editor')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const closeDrawer = () => setIsOpen(false)

  return (
    <div>
      <button
        type="button"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        aria-controls="admin-mobile-drawer"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-mobile-menu-button admin-mobile-drawer-trigger flex items-center justify-center w-[44px] h-[44px] rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          color: 'var(--admin-dark-text)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {isOpen && mounted && typeof document !== 'undefined' && createPortal(
        <>
          {/* Overlay */}
          <button
            type="button"
            className="admin-drawer-overlay"
            aria-label="Fechar menu"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <aside
            id="admin-mobile-drawer"
            className="admin-mobile-drawer flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu administrativo"
          >
            {/* Drawer header */}
            <div className="grid grid-cols-[44px_1fr_44px] items-center px-2 py-4" style={{ borderBottom: '1px solid var(--admin-dark-border)' }}>
              <div></div>
              <Link href="/admin" onClick={closeDrawer} aria-label="Ir para o painel Studio AM" className="flex justify-center">
                <Image
                  src="/brand/studio-am-logo.png"
                  alt="Studio AM — Arquitetura e Engenharia"
                  width={2048}
                  height={1054}
                  className="h-auto w-[118px] sm:w-[128px] object-contain"
                />
              </Link>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={closeDrawer}
                className="p-2 rounded-lg flex items-center justify-center min-h-[44px] min-w-[44px]"
                style={{ color: 'var(--admin-dark-text)' }}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4 px-3 overflow-y-auto hide-scrollbar">
              <AdminNavLinks onItemClick={closeDrawer} />
            </div>

            {/* Profile footer */}
            <div className="px-5 py-4" style={{ borderTop: '1px solid var(--admin-dark-border)' }}>
              <p className="text-sm font-medium truncate mb-1" style={{ color: 'var(--admin-dark-text)' }}>
                {displayName}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase"
                  style={{ background: 'var(--admin-cream-soft)', color: '#42372d' }}
                >
                  {roleLabel}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs font-medium hover:underline"
                    style={{ color: 'var(--admin-dark-muted)' }}
                  >
                    Sair
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </>,
        document.body
      )}
    </div>
  )
}
