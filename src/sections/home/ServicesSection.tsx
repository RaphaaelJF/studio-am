import React from 'react';

/* ── Ícones dos Serviços (Traço uniforme ~1.75px, cor #c8baab) ── */

/** 1. Projetos: Esquadro triangular com recorte triangular interno */
function TriangularSquareIcon({ className = "w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Triângulo externo */}
      <path d="M4 20h16a1 1 0 0 0 .8-1.6L5.6 3.2A1 1 0 0 0 4 4v16z" />
      {/* Recorte triangular interno */}
      <path d="M7 17h6.5L7 8.5V17z" />
      {/* Marcas/graduações de escala na base */}
      <line x1="9" y1="17" x2="9" y2="19" />
      <line x1="12" y1="17" x2="12" y2="19" />
      <line x1="15" y1="17" x2="15" y2="19" />
    </svg>
  );
}

/** 2. Obras: Capacete de proteção */
function HardHatIcon({ className = "w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2z" />
      <path d="M10 10V5a2 2 0 0 1 4 0v5" />
      <path d="M4 14a8 8 0 0 1 16 0" />
    </svg>
  );
}

/** 3. Documentação e Regularização: Documento com check */
function FileCheckIcon({ className = "w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

/** 4. Consultoria e Serviços Técnicos: Documento com lupa */
function FileSearchIcon({ className = "w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="11.5" cy="14.5" r="2.5" />
      <path d="m13.5 16.5 2 2" />
    </svg>
  );
}

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="scroll-mt-24 md:scroll-mt-28 py-16 md:py-[80px] px-6 md:px-12 bg-black text-white overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Cabeçalho da seção */}
        <div className="mb-10 md:mb-12 text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            Nossa Atuação
          </p>
          <h2 className="text-[32px] md:text-[48px] font-medium text-white tracking-tight leading-[1.15]">
            Nossos serviços
          </h2>
        </div>

        {/* Grade 2x2 no desktop com 56px horizontal e 48px vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[56px] gap-y-[48px]">
          
          {/* Serviço 1: Projetos */}
          <div className="border-t border-white/20 pt-6 flex items-start gap-3 md:gap-5">
            <div className="flex-shrink-0 pt-0.5">
              <TriangularSquareIcon className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <h3 className="text-[22px] md:text-[26px] font-medium text-white tracking-tight leading-snug">
                Projetos
              </h3>
              <p className="text-[16px] md:text-[18px] text-neutral-300 font-normal leading-[1.65] mt-3">
                Projetos arquitetônicos e complementares para uso residencial e comercial. Desenvolvemos também soluções técnicas para reformas e ampliações.
              </p>
            </div>
          </div>

          {/* Serviço 2: Obras */}
          <div className="border-t border-white/20 pt-6 flex items-start gap-3 md:gap-5">
            <div className="flex-shrink-0 pt-0.5">
              <HardHatIcon className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <h3 className="text-[22px] md:text-[26px] font-medium text-white tracking-tight leading-snug">
                Obras
              </h3>
              <p className="text-[16px] md:text-[18px] text-neutral-300 font-normal leading-[1.65] mt-3">
                Execução e acompanhamento técnico para garantir a fidelidade do projeto. Atuamos com gerenciamento e orientação em todas as etapas da obra.
              </p>
            </div>
          </div>

          {/* Serviço 3: Documentação e Regularização */}
          <div className="border-t border-white/20 pt-6 flex items-start gap-3 md:gap-5">
            <div className="flex-shrink-0 pt-0.5">
              <FileCheckIcon className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <h3 className="text-[22px] md:text-[26px] font-medium text-white tracking-tight leading-snug">
                Documentação e Regularização
              </h3>
              <p className="text-[16px] md:text-[18px] text-neutral-300 font-normal leading-[1.65] mt-3">
                Elaboração de documentação técnica, assessoria técnica em processos de financiamento bancário e regularização de imóveis.
              </p>
            </div>
          </div>

          {/* Serviço 4: Consultoria e Serviços Técnicos */}
          <div className="border-t border-white/20 pt-6 flex items-start gap-3 md:gap-5">
            <div className="flex-shrink-0 pt-0.5">
              <FileSearchIcon className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] text-[#c8baab]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <h3 className="text-[22px] md:text-[26px] font-medium text-white tracking-tight leading-snug">
                Consultoria e Serviços Técnicos
              </h3>
              <p className="text-[16px] md:text-[18px] text-neutral-300 font-normal leading-[1.65] mt-3">
                Consultoria especializada para obras e imóveis. Realizamos inspeções prediais e emissão de laudos técnicos detalhados.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
