'use client'

import React, { useState } from 'react'
import { useToast } from './AdminToastContext'
import { demoThumbnails } from '../_fixtures/demo-projects'

type AppearanceTab = 'presets' | 'cores' | 'tipografia' | 'espacamentos'

const tabs: Array<{ id: AppearanceTab; label: string }> = [
  { id: 'presets', label: 'Presets de tema' },
  { id: 'cores', label: 'Cores' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'espacamentos', label: 'Espaçamentos' },
]

const presets = [
  { id: 'mineral', name: 'Mineral', top: '#a99f8c', background: '#f7f5ef', text: '#1b1b19', accent: '#9d9580' },
  { id: 'areia', name: 'Areia', top: '#ead3b5', background: '#fbf8f2', text: '#24201c', accent: '#c8a77f' },
  { id: 'grafite', name: 'Grafite', top: '#292a2a', background: '#f2f2ef', text: '#111315', accent: '#626361' },
  { id: 'oliva', name: 'Oliva', top: '#9b9b69', background: '#f6f5ee', text: '#25251f', accent: '#7c7d50' },
  { id: 'noturno', name: 'Noturno', top: '#0c1822', background: '#f2f4f4', text: '#101820', accent: '#3f5868' },
] as const

export function AppearancePanel() {
  const { toast } = useToast()
  const [tab, setTab] = useState<AppearanceTab>('presets')
  const [selected, setSelected] = useState(0)
  const preset = presets[selected] ?? presets[0]

  const save = () => toast('Aparência salva somente nesta sessão demonstrativa.', 'info')

  return (
    <div className="appearance-panel">
      <div className="appearance-panel-header">
        <div>
          <h1>Aparência</h1>
          <p>Personalize o visual do site de forma segura.</p>
        </div>
        <button type="button" onClick={save}>Salvar alterações</button>
      </div>

      <div className="appearance-panel-body">
        <aside className="appearance-tabs admin-tabs-outer" aria-label="Opções de aparência">
          <div className="admin-tabs-inner">
            {tabs.map(item => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={tab === item.id ? 'is-active whitespace-nowrap' : 'whitespace-nowrap'}>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="appearance-content">
          {tab === 'presets' && (
            <>
              <h2>Presets de tema</h2>
              <p className="appearance-help">Escolha uma variação de tema. A estrutura do site não será alterada.</p>
              <div className="appearance-presets">
                {presets.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected === index}
                    onClick={() => setSelected(index)}
                    className={selected === index ? 'is-active' : ''}
                  >
                    <span className="appearance-preset-bar" style={{ background: item.top }} />
                    <strong style={{ color: item.text }}>Aa</strong>
                    <span className="appearance-swatches">
                      <i style={{ background: item.text }} /><i style={{ background: item.accent }} /><i style={{ background: item.background }} />
                    </span>
                    <small>{item.name}</small>
                    {selected === index && <em>Ativo</em>}
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === 'cores' && <SafeOption title="Cores permitidas" description="Ajuste apenas a paleta de superfícies, textos e destaque." />}
          {tab === 'tipografia' && <SafeOption title="Tipografia" description="Escolha combinações aprovadas para títulos e textos." />}
          {tab === 'espacamentos' && <SafeOption title="Espaçamentos" description="Use densidade compacta, equilibrada ou confortável sem mover seções." />}

          <h2 className="appearance-preview-title">Prévia rápida</h2>
          <div className="appearance-preview" style={{ background: preset.background, color: preset.text }}>
            <div className="appearance-preview-nav">
              <div><strong>Studio AM</strong><small>Arquitetura • Engenharia</small></div>
              <nav><span>Projetos</span><span>Serviços</span><span>Processo</span><span>Sobre</span><span>Contato</span></nav>
            </div>
            <div className="appearance-preview-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={demoThumbnails['demo-andreia-marco']} alt="Prévia da Casa Andreia e Marco" />
              <div><span>Residencial • 2024</span><strong>Casa Andreia e Marco</strong></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SafeOption({ title, description }: { title: string; description: string }) {
  return (
    <div className="appearance-safe-option">
      <h2>{title}</h2>
      <p>{description}</p>
      <div><button type="button">Compacto</button><button type="button">Equilibrado</button><button type="button">Confortável</button></div>
    </div>
  )
}
