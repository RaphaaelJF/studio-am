'use client'

import React from 'react'

const workflow = [
  ['+', ['Criar', 'Projeto']], ['✎', ['Preencher', 'Informações']],
  ['▧', ['Adicionar', 'Fotos']], ['☷', ['Detalhes', 'Técnicos']],
  ['◉', ['Preview']], ['➤', ['Publicar']],
] as const

export function AdminWorkflowFooter() {
  return (
    <footer className="admin-workflow-footer">
      <section className="admin-dark-card admin-workflow-card">
        <h2 className="mb-3.5 text-center">Fluxo de trabalho de um projeto</h2>
        <div
          className="admin-workflow-steps relative"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
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
      </section>
    </footer>
  )
}
