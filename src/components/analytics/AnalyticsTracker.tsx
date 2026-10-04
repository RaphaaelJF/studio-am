'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/tracker'

const REFRESH_DEDUPE_TIME_MS = 60 * 1000 // 60 segundos de deduplicação por path

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<{ path: string; time: number } | null>(null)

  useEffect(() => {
    // Não rastreia rotas internas do painel administrativo
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    const now = Date.now()

    // Deduplica refresh excessivo na mesma rota dentro de 60 segundos
    if (
      lastTracked.current &&
      lastTracked.current.path === pathname &&
      now - lastTracked.current.time < REFRESH_DEDUPE_TIME_MS
    ) {
      return
    }

    lastTracked.current = { path: pathname, time: now }
    trackEvent('page_view', { path: pathname })
  }, [pathname])

  // Ouvinte global para cliques nos elementos de conversão (WhatsApp, Instagram, Iniciar Projeto)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a, button')
      if (!target) return

      const href = target.getAttribute('href') || ''
      const text = (target.textContent || '').toLowerCase()

      if (href.includes('wa.me') || href.includes('whatsapp') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click')
        return
      }

      if (href.includes('instagram.com')) {
        trackEvent('instagram_click')
        return
      }

      if (text.includes('iniciar projeto') || text.includes('falar sobre meu projeto') || href === '#contato' || href.includes('/contato')) {
        trackEvent('contact_click')
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
