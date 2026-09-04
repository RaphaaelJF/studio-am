'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminProfile } from '@/lib/auth/admin'
import { AdminNavLinks } from './AdminNavLinks'
import { logoutAction } from '../../actions'

interface AdminSidebarProps {
  profile: AdminProfile
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('visual') === 'demo'

  const displayName = isDemo ? 'Anne Martins' : (profile.display_name || 'Usuário')
  const roleLabel = isDemo ? 'Editora' : (profile.role === 'owner' ? 'Owner' : 'Editor')
  const avatarInitials = isDemo
    ? 'AM'
    : (displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('') || 'U')

  return (
    <aside aria-label="Barra lateral administrativa" className="admin-board-sidebar">
      <section className="admin-dark-card admin-modules-card">
        <h2>Módulos do painel</h2>
        <AdminNavLinks />
      </section>

      <section className="admin-dark-card admin-access-card">
        <h2>Perfis de acesso</h2>
        <div className="admin-access-profile">
          <div className="admin-access-heading">
            <span className="admin-access-avatar">{avatarInitials}</span>
            <strong>{displayName}</strong>
            <span className="admin-role-chip">{roleLabel}</span>
          </div>
          <p>Pode gerenciar projetos, conteúdos, imagens, destaques e aparências permitidas.</p>
          <span className="admin-permissions-title">Permissões</span>
          <ul className="admin-permissions-list">
            {['Projetos (CRUD)', 'Mídia (Upload)', 'Destaques da Home', 'Páginas (Conteúdo)', 'Aparência (Presets)', 'Ver Analytics', 'Preview e Publicar'].map(item => (
              <li key={item} className="allowed">{item}</li>
            ))}
            <li className="denied">Acesso a Código / Estrutura</li>
          </ul>
          <form action={logoutAction}>
            <button type="submit" className="admin-logout">Sair do painel</button>
          </form>
        </div>
        <div className="admin-access-profile admin-owner-profile">
          <div className="admin-access-heading">
            <span className="admin-access-avatar">OC</span>
            <strong>Owner / Equipe</strong>
            <span className="admin-role-chip">Admin</span>
          </div>
          <p>Controle total do sistema, estrutura, usuários e configurações avançadas.</p>
        </div>
      </section>
    </aside>
  )
}
