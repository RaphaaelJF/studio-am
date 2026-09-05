'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const allowed = [
  'Criar, editar e publicar projetos', 'Adicionar, remover e ordenar fotos',
  'Editar textos, subtítulos e descrições', 'Selecionar destaques da Home',
  'Escolher presets de cores e fontes', 'Editar conteúdos das páginas',
  'Visualizar analytics básicos', 'Fazer upload de imagens',
  'Salvar rascunhos', 'Preview em tempo real',
]

const protectedItems = [
  'Estrutura do site', 'Layout das seções', 'Código, componentes e animações',
  'Mover seções', 'Criar novos componentes', 'Header e Footer',
  'SEO técnico', 'Configurações do servidor', 'Integrações avançadas',
]

const technologies = [
  ['Frontend', 'Next.js + Tailwind CSS', 'N'], ['Backend', 'Next.js + Supabase', 'N'],
  ['Banco de Dados', 'PostgreSQL', 'DB'], ['Armazenamento', 'Supabase Storage', 'S'],
  ['Autenticação', 'Supabase Auth', 'A'], ['Hospedagem', 'Vercel', 'V'],
]

const workflow = [
  ['+', ['Criar', 'Projeto']], ['✎', ['Preencher', 'Informações']],
  ['▧', ['Adicionar', 'Fotos']], ['☷', ['Detalhes', 'Técnicos']],
  ['◉', ['Preview']], ['➤', ['Publicar']],
] as const

function DesktopFooterSection({ title, className, children }: { title: string, className?: string, children: React.ReactNode }) {
  return (
    <section className={`admin-dark-card ${className || ''}`}>
      <h2 className="mb-3.5">{title}</h2>
      <div>
        {children}
      </div>
    </section>
  )
}

export function AdminWorkflowFooter() {
  const pathname = usePathname()
  const isOverview = pathname === '/admin'
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false)

  // Operações mobile: esconder completamente o rodapé nas páginas operacionais abaixo de 768px
  if (!isOverview) {
    return (
      <footer className="admin-workflow-footer hidden md:grid">
        <DesktopFooterSection title="Fluxo de trabalho de um projeto" className="admin-workflow-card">
          <div
            className="admin-workflow-steps relative"
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            {workflow.map(([icon, lines], index) => (
              <React.Fragment key={lines.join('-')}>
                <div className={`admin-workflow-step ${index === 0 ? 'is-publish' : ''}`}>
                  <span>{icon}</span>
                  <small>{lines.map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</small>
                </div>
                {index < workflow.length - 1 && (
                  <i aria-hidden="true">→</i>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="admin-draft-line">✦ ············· Rascunho (pode editar quando quiser) ············· ↑</div>
        </DesktopFooterSection>

        <section className="admin-dark-card admin-permission-card">
          <div>
            <h2 className="mb-3.5">O que Anne pode editar</h2>
            <ul>{allowed.map(item => <li className="allowed" key={item}>{item}</li>)}</ul>
          </div>
          <div className="admin-permission-protected">
            <h2>O que Anne não pode editar</h2>
            <ul>{protectedItems.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <DesktopFooterSection title="Tecnologias sugeridas" className="admin-tech-card">
          <div className="admin-tech-grid">
            {technologies.map(([title, description, icon]) => (
              <div key={title}><span>{icon}</span><p><strong>{title}</strong><small>{description}</small></p></div>
            ))}
          </div>
        </DesktopFooterSection>
      </footer>
    )
  }

  // Visão geral /admin:
  // Desktop/Tablet (>=768px): 3 quadros normais
  // Mobile (<768px): única faixa compacta preta "Ajuda e permissões +"
  return (
    <>
      {/* Mobile-only compact accordion (< 768px) */}
      <footer className="md:hidden w-full">
        <div className="admin-mobile-help-wrapper">
          <button
            type="button"
            className="admin-mobile-help-bar"
            onClick={() => setMobileAccordionOpen(prev => !prev)}
            aria-expanded={mobileAccordionOpen}
            aria-label="Ajuda e permissões"
          >
            <span>Ajuda e permissões</span>
            <span className="text-[var(--admin-dark-muted)] font-mono text-base">
              {mobileAccordionOpen ? '−' : '+'}
            </span>
          </button>

          {mobileAccordionOpen && (
            <div className="admin-mobile-help-content">
              {/* 1. Fluxo de trabalho */}
              <div className="space-y-3">
                <p className="admin-mobile-help-subheading">Fluxo de trabalho de um projeto</p>
                <div className="admin-workflow-steps">
                  {workflow.map(([icon, lines], index) => (
                    <div key={lines.join('-')} className={`admin-workflow-step ${index === workflow.length - 1 ? 'is-publish' : ''}`}>
                      <span>{icon}</span>
                      <small>{lines.map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</small>
                    </div>
                  ))}
                </div>
                <div className="admin-draft-line">✦ ··· Rascunho (editável a qualquer momento) ··· ↑</div>
              </div>

              {/* Separador sutil */}
              <div className="h-px bg-[#262e35] my-4" />

              {/* 2. O que Anne pode editar */}
              <div className="space-y-2">
                <p className="admin-mobile-help-subheading">O que Anne pode editar</p>
                <ul className="admin-mobile-perm-list">
                  {allowed.map(item => (
                    <li className="allowed" key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Separador sutil */}
              <div className="h-px bg-[#262e35] my-4" />

              {/* 3. O que Anne não pode editar */}
              <div className="space-y-2">
                <p className="admin-mobile-help-subheading">O que Anne não pode editar</p>
                <ul className="admin-mobile-perm-list">
                  {protectedItems.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* Desktop and tablet (>=768px): layout aprovado preservado */}
      <footer className="admin-workflow-footer hidden md:grid">
        <DesktopFooterSection title="Fluxo de trabalho de um projeto" className="admin-workflow-card">
          <div
            className="admin-workflow-steps relative"
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            {workflow.map(([icon, lines], index) => (
              <React.Fragment key={lines.join('-')}>
                <div className={`admin-workflow-step ${index === workflow.length - 1 ? 'is-publish' : ''}`}>
                  <span>
                    <span className="admin-publish-icon">{icon}</span>
                    {index === workflow.length - 1 && (
                      <svg className="admin-publish-burst" viewBox="0 0 120 120" aria-hidden="true">
                        <line className="admin-publish-burst__ray" x1="60" y1="35" x2="60" y2="25" stroke="#43F58A" />
                        <line className="admin-publish-burst__ray" x1="60" y1="85" x2="60" y2="95" stroke="#FFD54A" />
                        <line className="admin-publish-burst__ray" x1="35" y1="60" x2="25" y2="60" stroke="#FFFFFF" />
                        <line className="admin-publish-burst__ray" x1="85" y1="60" x2="95" y2="60" stroke="#43F58A" />
                        <line className="admin-publish-burst__ray" x1="42" y1="42" x2="35" y2="35" stroke="#FFD54A" />
                        <line className="admin-publish-burst__ray" x1="78" y1="78" x2="85" y2="85" stroke="#FFFFFF" />
                        
                        <circle className="admin-publish-burst__dot" cx="75" cy="40" r="3" fill="#4DEBFF" />
                        <circle className="admin-publish-burst__dot" cx="40" cy="75" r="3.5" fill="#43F58A" />
                        <circle className="admin-publish-burst__dot" cx="80" cy="80" r="2.5" fill="#FFD54A" />
                        <circle className="admin-publish-burst__dot" cx="45" cy="45" r="3" fill="#FFFFFF" />
                        
                        <path className="admin-publish-burst__star" d="M30 85 Q35 85 35 80 Q35 85 40 85 Q35 85 35 90 Q35 85 30 85 Z" fill="#4DEBFF" />
                        <path className="admin-publish-burst__star" d="M85 30 Q90 30 90 25 Q90 30 95 30 Q90 30 90 35 Q90 30 85 30 Z" fill="#FFD54A" />
                      </svg>
                    )}
                  </span>
                  <small>{lines.map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</small>
                </div>
                {index < workflow.length - 1 && (
                  <i aria-hidden="true">→</i>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="admin-draft-line">✦ ············· Rascunho (pode editar quando quiser) ············· ↑</div>
        </DesktopFooterSection>

        <section className="admin-dark-card admin-permission-card">
          <div>
            <h2 className="mb-3.5">O que Anne pode editar</h2>
            <ul>{allowed.map(item => <li className="allowed" key={item}>{item}</li>)}</ul>
          </div>
          <div className="admin-permission-protected">
            <h2>O que Anne não pode editar</h2>
            <ul>{protectedItems.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <DesktopFooterSection title="Tecnologias sugeridas" className="admin-tech-card">
          <div className="admin-tech-grid">
            {technologies.map(([title, description, icon]) => (
              <div key={title}><span>{icon}</span><p><strong>{title}</strong><small>{description}</small></p></div>
            ))}
          </div>
        </DesktopFooterSection>
      </footer>
    </>
  )
}
