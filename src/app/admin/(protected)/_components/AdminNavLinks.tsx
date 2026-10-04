'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  ExternalLinkIcon,
  LayoutDashboardIcon,
  FolderIcon,
  StarIcon,
  FileTextIcon,
  PaletteIcon,
  ImageIcon,
  UsersIcon,
  SettingsIcon,
} from '@/components/shared/Icons'

const navItems = [
  { label: 'Dashboard', description: 'Visão geral', href: '/admin', exact: true, icon: LayoutDashboardIcon },
  { label: 'Projetos', description: 'Criar, editar e publicar', href: '/admin/projetos', exact: false, icon: FolderIcon },
  { label: 'Destaques da Home', description: 'Selecionar projetos exibidos', href: '/admin/destaques', exact: false, icon: StarIcon },
  { label: 'Identidade Visual', description: 'Cores, fontes e diretrizes', href: '/admin/aparencia', exact: false, icon: PaletteIcon },
  { label: 'Mídia', description: 'Biblioteca de imagens', href: '/admin/midia', exact: false, icon: ImageIcon },
  { label: 'Métricas do Site', description: 'Visitas e acessos', href: '/admin/analytics', exact: true, icon: FileTextIcon },
  { label: 'Desempenho dos Projetos', description: 'Ranking e conversões', href: '/admin/analytics/projetos', exact: false, icon: StarIcon },
  { label: 'Páginas', description: 'Conteúdos institucionais', href: '/admin/paginas', exact: false, icon: FileTextIcon },
  { label: 'Usuários', description: 'Acesso e permissões', href: '/admin/usuarios', exact: false, icon: UsersIcon },
  { label: 'Configurações', description: 'Geral e integrações', href: '/admin/configuracoes', exact: false, icon: SettingsIcon },
]

interface AdminNavLinksProps {
  onItemClick?: () => void
}

export function AdminNavLinks({ onItemClick }: AdminNavLinksProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('visual') === 'demo'

  const withMode = (href: string) => isDemo ? `${href}?visual=demo` : href

  return (
    <nav aria-label="Navegação administrativa">
      <ul className="admin-dark-nav-list">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                href={withMode(item.href)}
                onClick={onItemClick}
                aria-current={isActive ? 'page' : undefined}
                className={`grid min-h-12 grid-cols-[18px_minmax(0,1fr)] items-start gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'is-active' : ''
                }`}
                style={{
                  color: isActive ? '#fff' : '#f1f0ed',
                  background: isActive ? '#151b20' : 'transparent',
                  border: isActive ? '1px solid #303940' : '1px solid transparent',
                  boxShadow: isActive ? 'inset 2px 0 0 var(--admin-cream)' : 'none',
                }}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-current" />

                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span className="block w-full text-[13px] font-semibold leading-[1.3] text-inherit">
                    {item.label}
                  </span>

                  <span className="block w-full text-[11px] leading-[1.4] text-current opacity-70">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="admin-dark-nav-external mt-1.5 pt-1.5" style={{ borderTop: '1px solid #2f3539' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onItemClick}
          className="grid min-h-12 grid-cols-[18px_minmax(0,1fr)] items-start gap-x-3 px-3 py-2.5 rounded-lg transition-colors hover:text-white hover:bg-[#151b20]"
          style={{ color: '#f1f0ed' }}
        >
          <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-current" />

          <span className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="block w-full text-[13px] font-semibold leading-[1.3] text-inherit">
              Visualizar site
            </span>

            <span className="block w-full text-[11px] leading-[1.4] text-current opacity-70">
              Abrir versão pública
            </span>
          </span>
        </a>
      </div>
    </nav>
  )
}
