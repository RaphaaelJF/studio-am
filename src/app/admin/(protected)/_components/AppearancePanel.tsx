'use client'

import React, { useState } from 'react'
import { AdminCard } from './AdminSharedUI'
import type { AnalyticsSummary } from '@/lib/admin/metrics'

interface ColorToken {
  name: string
  token: string
  hex: string
  role: string
  textColor?: string
  borderColor?: string
}

const officialColors: ColorToken[] = [
  {
    name: 'Preto Profundo',
    token: '--color-black',
    hex: '#0B0B0B',
    role: 'Títulos principais e tipografia de máximo contraste',
    textColor: '#FFFFFF',
  },
  {
    name: 'Grafite Arquitetônico',
    token: '--color-graphite',
    hex: '#2B2B2A',
    role: 'Fundo da seção de contato e rodapés escuros',
    textColor: '#FFFFFF',
  },
  {
    name: 'Cinza Editorial',
    token: '--color-gray',
    hex: '#70706D',
    role: 'Textos de apoio, legendas e elementos secundários',
    textColor: '#FFFFFF',
  },
  {
    name: 'Cinza Claro',
    token: '--color-light-gray',
    hex: '#D9D8D4',
    role: 'Linhas divisórias e bordas estruturais',
    textColor: '#1B1B19',
    borderColor: '#C5C4BF',
  },
  {
    name: 'Bege Mineral',
    token: '--color-beige',
    hex: '#F2EFE9',
    role: 'Fundo principal das páginas e leitura quente',
    textColor: '#1B1B19',
    borderColor: '#E2DFD8',
  },
  {
    name: 'Branco Quente',
    token: '--color-warm-white',
    hex: '#FBFAF7',
    role: 'Superfícies elevadas e cartões editoriais',
    textColor: '#1B1B19',
    borderColor: '#EBE9E3',
  },
  {
    name: 'Branco Puro',
    token: '--color-white',
    hex: '#FFFFFF',
    role: 'Destaques pontuais e fundos neutros',
    textColor: '#1B1B19',
    borderColor: '#E5E5E5',
  },
]

interface AppearancePanelProps {
  metrics?: AnalyticsSummary | null
  isDemo?: boolean
}

type PeriodFilter = '7d' | '30d' | 'total'

export function AppearancePanel({ isDemo: _isDemo }: AppearancePanelProps) {
  return (
    <div className="space-y-10 max-w-5xl">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: 'var(--admin-text)' }}>
          Identidade Visual
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
          Guia de identidade visual oficial, paletas de cores e tipografia do Studio AM.
        </p>
      </div>

      {/* BLOCO 1: IDENTIDADE VISUAL (Compacto e objetivo) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              1. Identidade Visual — Paleta Mineral
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Cores oficiais aprovadas no V2.5. Não são permitidas cores externas ou saturações artificiais.
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
            Design Congelado V2.5
          </span>
        </div>

        <AdminCard className="p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {officialColors.map((c) => (
              <div key={c.token} className="space-y-1.5">
                <div
                  className="w-full h-11 rounded flex items-end justify-between p-1.5 text-[10px] font-mono shadow-xs"
                  style={{
                    backgroundColor: c.hex,
                    color: c.textColor,
                    border: c.borderColor ? `1px solid ${c.borderColor}` : 'none',
                  }}
                >
                  <span className="font-semibold">{c.hex}</span>
                </div>
                <div>
                  <p className="font-medium text-xs text-gray-900 leading-tight">{c.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{c.token}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      {/* BLOCO 2: TIPOGRAFIA (Compacto e focado) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            2. Tipografia — Família Montserrat
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            A família tipográfica oficial é a Montserrat. Sem fontes serifadas ou famílias paralelas.
          </p>
        </div>

        <AdminCard className="p-4 divide-y divide-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                TÍTULO DISPLAY / H1 (Semibold)
              </span>
              <p className="text-lg sm:text-xl font-semibold text-gray-950 tracking-tight leading-snug">
                Arquitetura que conecta. Engenharia que sustenta.
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                TÍTULO DE CAPÍTULO / H2 (Medium)
              </span>
              <p className="text-base font-medium text-gray-900 tracking-tight leading-snug">
                Projetos Selecionados & Casos de Estudo
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                CORPO DE TEXTO / APOIO (Regular)
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                Projetos residenciais e comerciais funcionais, tecnicamente viáveis e pensados para a vida real.
              </p>
            </div>
          </div>
          <div className="pt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>Escala: H1 (36–64px) • H2 (24–32px) • Body (14–16px)</span>
            <span className="text-gray-400">WCAG AA Standard</span>
          </div>
        </AdminCard>
      </section>
    </div>
  )
}
