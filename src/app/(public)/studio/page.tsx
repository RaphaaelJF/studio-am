import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRightIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Studio | Studio AM — Arquitetura + Engenharia',
  description:
    'Conheça o Studio AM, fundado pela engenheira civil Anne Martins. Projetos residenciais e comerciais personalizados integrando sensibilidade estética e rigor construtivo.',
  openGraph: {
    title: 'Studio | Studio AM — Arquitetura + Engenharia',
    description:
      'Projetos residenciais e comerciais personalizados integrando sensibilidade estética e rigor construtivo.',
    images: [{ url: '/images/anne/anne-martins.webp', alt: 'Anne Martins — Engenheira Civil' }],
  },
};

export default function StudioPage() {
  return (
    <div className="bg-warm-white text-[#171717]">
      {/* Header Editorial da Página */}
      <section className="pt-16 md:pt-24 pb-12 px-6 md:px-12 border-b border-light-gray">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-3">
            O Estúdio
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#171717] leading-tight max-w-4xl">
            Arquitetura que conecta. Engenharia que sustenta.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#404040] max-w-2xl font-normal leading-relaxed">
            Desenvolvemos projetos pensados para a vida real, unindo partido arquitetônico inteligente à viabilidade técnica de cada etapa da construção.
          </p>
        </div>
      </section>

      {/* Seção Anne Martins — Apresentação Profissional */}
      <section className="py-14 md:py-28 px-6 md:px-12 bg-beige">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          {/* Retrato Profissional */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full max-w-[340px] sm:max-w-md mx-auto lg:mx-0 bg-warm-white border border-light-gray p-3 shadow-sm">
              <div className="w-full h-full relative overflow-hidden bg-light-gray">
                <Image
                  src="/images/anne/anne-martins.webp"
                  alt="Anne Martins — Engenheira Civil e responsável pela Studio AM"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 450px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Biografia e Postura */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-5 md:mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
                Direção Técnica
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
                Anne Martins
              </h2>
              <p className="text-sm font-semibold tracking-wider uppercase text-[#8C7A6B] mt-1">
                Engenheira Civil
              </p>
            </div>

            <div className="space-y-6 text-[#404040] text-base md:text-[17px] font-normal leading-relaxed">
              <p>
                A Studio AM nasce com a convicção de que um bom projeto arquitetônico não pode ser concebido desconectado da lógica de sua execução. Cada traço é pensado desde o início considerando a geografia do terreno, os fluxos da rotina e a viabilidade estrutural.
              </p>
              <p>
                Anne Martins atua à frente do escritório conduzindo estudos preliminares, projetos arquitetônicos, projetos complementares e acompanhamento de obras. Sua abordagem alia sensibilidade espacial, escuta atenta dos clientes e precisão técnica para transformar necessidades reais em espaços confortáveis e perenes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Institucionais */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-warm-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-14 pb-4 border-b border-light-gray">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-2">
              Diretrizes de Projeto
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-[#171717] tracking-tight">
              Como pensamos e construímos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8C7A6B] mb-3">
                01 / Escuta & Contexto
              </span>
              <h3 className="text-xl font-medium text-[#171717] mb-3">
                Projetos para a vida real
              </h3>
              <p className="text-base text-[#404040] leading-relaxed font-normal">
                Antes do desenho, compreendemos hábitos, recursos e prioridades. Não impomos fórmulas prontas: a arquitetura se molda à rotina de quem a habita.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8C7A6B] mb-3">
                02 / Integração Total
              </span>
              <h3 className="text-xl font-medium text-[#171717] mb-3">
                Arquitetura e Engenharia unidas
              </h3>
              <p className="text-base text-[#404040] leading-relaxed font-normal">
                A compatibilização entre forma espacial e soluções estruturais evita retrabalhos, reduz imprevistos na obra e preserva a integridade estética do projeto.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8C7A6B] mb-3">
                03 / Rigor Construtivo
              </span>
              <h3 className="text-xl font-medium text-[#171717] mb-3">
                Detalhamento executivo
              </h3>
              <p className="text-base text-[#404040] leading-relaxed font-normal">
                Pranchas claras e especificações minuciosas garantem que construtores e fornecedores executem a obra com fidelidade e previsibilidade orçamentária.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada para Ação */}
      <section className="border-t border-light-gray py-20 px-6 md:px-12 bg-warm-white">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-medium text-[#171717] tracking-tight mb-2">
              Pronto para conversar sobre o seu projeto?
            </h3>
            <p className="text-[#404040] text-base md:text-[17px] font-normal leading-relaxed max-w-xl">
              Entre em contato para agendarmos uma primeira conversa e avaliarmos o seu terreno ou imóvel.
            </p>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 bg-[#c8baab] text-[#171717] px-8 py-4 text-xs font-semibold tracking-wider uppercase hover:bg-[#171717] hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            Falar com a Anne
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
