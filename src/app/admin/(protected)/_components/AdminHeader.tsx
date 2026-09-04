import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AdminProfile } from '@/lib/auth/admin'
import { AdminMobileNav } from './AdminMobileNav'

interface AdminHeaderProps {
  profile: AdminProfile
  context?: string
}

const features = [
  { title: 'Simples para Anne usar', description: 'Interface intuitiva e organizada.', icon: 'users' },
  { title: 'Seguro e controlado', description: 'Componentes e estrutura protegidos.', icon: 'shield' },
  { title: 'Preview em tempo real', description: 'Veja exatamente como ficará no site.', icon: 'preview' },
  { title: 'Publicação com 1 clique', description: 'Rascunho, revisar e publicar.', icon: 'publish' },
] as const

function FeatureIcon({ name }: { name: typeof features[number]['icon'] }) {
  if (name === 'users') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  }
  if (name === 'shield') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
  }
  if (name === 'preview') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v8h16v-8M12 3v12M8 7l4-4 4 4" /><path d="M7 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-3" /></svg>
}

export function AdminHeader({ profile, context }: AdminHeaderProps) {
  return (
    <header className="admin-board-header">
      <div className="admin-mobile-header">
        <div className="admin-mobile-menu-button flex items-center justify-center">
          <AdminMobileNav profile={profile} />
        </div>
        <Link href="/admin" aria-label="Ir para o painel Studio AM" className="admin-mobile-logo flex items-center justify-center">
          <Image
            src="/brand/studio-am-logo.png"
            alt="Studio AM — Arquitetura e Engenharia"
            width={2048}
            height={1054}
            priority
            className="w-[124px] h-auto object-contain"
          />
        </Link>
      </div>

      <div className="admin-board-title-block">
        <h1>Painel Studio AM <span>— V1</span></h1>
        <p>{context ?? 'Gestão de Projetos e Conteúdo'}</p>
      </div>

      <div className="admin-board-features">
        {features.map((feature) => (
          <div className="admin-board-feature" key={feature.title}>
            <div className="admin-board-feature-icon"><FeatureIcon name={feature.icon} /></div>
            <div>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-board-principle">
        <span>Princípio</span>
        <p>Anne controla o conteúdo.<br />O sistema protege o design<br />e a estrutura do site.</p>
      </div>
    </header>
  )
}
