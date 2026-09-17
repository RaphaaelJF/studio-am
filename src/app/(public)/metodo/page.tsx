import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ChatIllustration,
  HouseBlueprintIllustration,
  ClipboardApprovalIllustration,
  HelmetIllustration,
} from '@/sections/home/MethodSection';
import { ArrowUpRightIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Método | Studio AM — Arquitetura + Engenharia',
  description:
    'Conheça as etapas do método Studio AM: do levantamento inicial à compatibilização de projetos e acompanhamento da obra com fidelidade técnica e estética.',
};

const detailedSteps = [
  {
    number: '01',
    title: 'Conversar e levantar',
    subtitle: 'Compreensão de rotina e diagnóstico físico',
    description:
      'Nenhuma decisão é tomada às cegas. Iniciamos ouvindo profundamente suas expectativas, rotina e limites de investimento. Em seguida, realizamos o levantamento de dados reais: topografia, orientação solar, ventilação e legislações vigentes para o terreno ou edificação.',
    deliverables: [
      'Briefing alinhado às necessidades reais',
      'Levantamento métrico e fotográfico',
      'Análise de parâmetros urbanísticos municipais',
    ],
    icon: <ChatIllustration />,
  },
  {
    number: '02',
    title: 'Estudar e desenvolver',
    subtitle: 'Conceito, volumetria e partido arquitetônico',
    description:
      'Desenvolvemos os primeiros estudos da edificação: zoneamento, circulação, relação com o terreno e volumetria em 3D. O cliente visualiza as soluções com clareza e participa das definições até que o partido arquitetônico e o orçamento estejam em total equilíbrio.',
    deliverables: [
      'Estudos preliminares e implantação',
      'Plantas baixas esquemáticas',
      'Visualizações arquitetônicas tridimensionais',
    ],
    icon: <HouseBlueprintIllustration />,
  },
  {
    number: '03',
    title: 'Aprovar e integrar',
    subtitle: 'Projetos executivos e compatibilização total',
    description:
      'Com o conceito validado, partimos para a documentação técnica executiva: detalhamento arquitetônico minucioso e integração com os projetos de engenharia (estrutural, hidrossanitário e elétrico). Isso assegura precisão orçamentária e elimina interferências antes de iniciar a obra.',
    deliverables: [
      'Projeto legal para aprovação municipal',
      'Detalhamento arquitetônico executivo completo',
      'Compatibilização entre arquitetura e engenharias',
    ],
    icon: <ClipboardApprovalIllustration />,
  },
  {
    number: '04',
    title: 'Acompanhar e orientar',
    subtitle: 'Fidelidade técnica e respaldo na execução',
    description:
      'Acompanhamos as etapas previstas no escopo, buscando preservar a fidelidade técnica e estética durante a execução. Orientamos a equipe de obra, esclarecemos dúvidas sobre as especificações e garantimos que o desenho se traduza com excelência no canteiro.',
    deliverables: [
      'Visitas técnicas periódicas',
      'Respaldo para construtores e instaladores',
      'Conferência da fidelidade técnica ao projeto aprovado',
    ],
    icon: <HelmetIllustration />,
  },
];

export default function MethodPage() {
  return (
    <div className="bg-warm-white text-[#171717]">
      {/* Header Editorial */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-12 border-b border-light-gray">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-3">
            Metodologia Construtiva
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#171717] leading-tight max-w-4xl">
            Como conduzimos cada projeto.
          </h1>
          <p className="mt-5 md:mt-6 text-lg md:text-xl text-[#404040] max-w-2xl font-normal leading-relaxed">
            Do terreno à entrega da obra, um processo transparente e estruturado em quatro etapas que reduzem incertezas e garantem viabilidade.
          </p>
        </div>
      </section>

      {/* Grade Detalhada dos 4 Passos */}
      <section className="py-12 md:py-28 px-6 md:px-12 bg-warm-white">
        <div className="max-w-[1280px] mx-auto space-y-10 md:space-y-24">
          {detailedSteps.map((step, idx) => (
            <article
              key={step.number}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-16 items-start pb-10 md:pb-16 border-b border-light-gray last:border-b-0"
            >
              {/* Coluna Ilustração + Número */}
              <div className="lg:col-span-4 flex items-center gap-5 md:gap-6">
                <div className="flex h-[80px] w-[80px] md:h-[96px] md:w-[96px] shrink-0 items-center justify-center p-2 rounded-2xl bg-beige border border-[#EFECE6]">
                  {step.icon}
                </div>
                <div>
                  <span className="text-3xl md:text-5xl font-light text-[#8C7A6B] block leading-none">
                    {step.number}
                  </span>
                  <span className="text-[11px] md:text-xs uppercase tracking-widest text-[#595959] font-medium mt-1 block">
                    Etapa {idx + 1}
                  </span>
                </div>
              </div>

              {/* Coluna Conteúdo e Entregáveis */}
              <div className="lg:col-span-8">
                <h2 className="text-2xl md:text-3xl font-medium text-[#171717] tracking-tight mb-1">
                  {step.title}
                </h2>
                <p className="text-sm font-semibold tracking-wider text-[#8C7A6B] uppercase mb-3 md:mb-4">
                  {step.subtitle}
                </p>
                <p className="text-base md:text-[17px] text-[#404040] font-normal leading-relaxed mb-4 md:mb-6">
                  {step.description}
                </p>

                {/* Entregáveis da Etapa */}
                <div className="bg-beige/60 border border-light-gray p-4 sm:p-6 rounded-lg">
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-[#171717] mb-2.5 md:mb-3">
                    Principais Entregas Desta Etapa:
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {step.deliverables.map((item) => (
                      <li key={item} className="flex items-start text-sm text-[#404040] gap-2.5">
                        <span className="text-[#8C7A6B] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Direcionador */}
      <section className="border-t border-light-gray py-20 px-6 md:px-12 bg-beige">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-medium text-[#171717] tracking-tight mb-2">
              Dúvidas sobre como funciona para o seu caso?
            </h3>
            <p className="text-[#404040] text-base md:text-[17px] font-normal leading-relaxed max-w-xl">
              Podemos avaliar as particularidades do seu terreno ou reforma logo no primeiro atendimento.
            </p>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 bg-[#c8baab] text-[#171717] px-8 py-4 text-xs font-semibold tracking-wider uppercase hover:bg-[#171717] hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            Iniciar Meu Projeto
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
