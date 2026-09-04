'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

const labels: Array<[RegExp, string]> = [
  [/\/admin\/projetos\/[^/]+\/editar/, '3. EDITAR PROJETO'],
  [/\/admin\/projetos\/[^/]+\/preview/, '3. PRÉ-VISUALIZAÇÃO'],
  [/\/admin\/projetos\/novo/, '3. NOVO PROJETO'],
  [/\/admin\/projetos/, '2. PROJETOS'],
  [/\/admin\/aparencia/, '4. APARÊNCIA (OPÇÕES PERMITIDAS)'],
  [/\/admin\/destaques/, '5. DESTAQUES DA HOME'],
  [/\/admin\/paginas/, '6. PÁGINAS'],
  [/\/admin\/midia/, '7. MÍDIA'],
  [/\/admin\/usuarios/, '8. USUÁRIOS'],
  [/\/admin\/configuracoes/, '9. CONFIGURAÇÕES'],
  [/\/admin/, '1. DASHBOARD'],
]

export function AdminWorkspaceFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin') return <>{children}</>
  const label = labels.find(([pattern]) => pattern.test(pathname))?.[1] ?? 'PAINEL'

  return (
    <section className="admin-workspace-frame">
      <span className="admin-workspace-label">{label}</span>
      <div className="admin-workspace-content">{children}</div>
    </section>
  )
}
