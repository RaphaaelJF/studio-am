import React from 'react';

export function MethodSection() {
  return (
    <section id="processo" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-32 px-6 md:px-12 bg-warm-white border-y border-light-gray">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-medium text-black">O Processo</h2>
          <p className="text-graphite mt-3 text-base md:text-lg font-light">Do terreno à execução, você entende cada etapa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 relative gap-y-12 md:gap-y-0">
          {/* Linha horizontal conectora para desktop */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-px bg-light-gray"></div>

          {/* Etapa 1 */}
          <div className="pt-0 md:pt-8 relative border-t border-light-gray md:border-none">
            <div className="hidden md:block absolute top-[-3px] left-0 w-1.5 h-1.5 bg-black"></div>
            <span className="block text-xs font-semibold tracking-widest uppercase text-gray mb-4 mt-6 md:mt-0">01</span>
            <h3 className="text-lg font-medium text-black mb-3 pr-4">Conversar e levantar</h3>
            <p className="text-graphite text-xs font-light leading-relaxed pr-6">
              Entendemos a sua rotina, o terreno e o orçamento para alinhar expectativas e recursos.
            </p>
          </div>

          {/* Etapa 2 */}
          <div className="pt-0 md:pt-8 relative border-t border-light-gray md:border-none">
            <div className="hidden md:block absolute top-[-3px] left-0 w-1.5 h-1.5 bg-light-gray"></div>
            <span className="block text-xs font-semibold tracking-widest uppercase text-gray mb-4 mt-6 md:mt-0">02</span>
            <h3 className="text-lg font-medium text-black mb-3 pr-4">Estudar e desenvolver</h3>
            <p className="text-graphite text-xs font-light leading-relaxed pr-6">
              Traduzimos as necessidades em volumetria, plantas e distribuição espacial.
            </p>
          </div>

          {/* Etapa 3 */}
          <div className="pt-0 md:pt-8 relative border-t border-light-gray md:border-none">
            <div className="hidden md:block absolute top-[-3px] left-0 w-1.5 h-1.5 bg-light-gray"></div>
            <span className="block text-xs font-semibold tracking-widest uppercase text-gray mb-4 mt-6 md:mt-0">03</span>
            <h3 className="text-lg font-medium text-black mb-3 pr-4">Aprovar e integrar</h3>
            <p className="text-graphite text-xs font-light leading-relaxed pr-6">
              Refinamos detalhes, compatibilizamos disciplinas de engenharia e preparamos documentação.
            </p>
          </div>

          {/* Etapa 4 */}
          <div className="pt-0 md:pt-8 relative border-t border-light-gray md:border-none">
            <div className="hidden md:block absolute top-[-3px] left-0 w-1.5 h-1.5 bg-light-gray"></div>
            <span className="block text-xs font-semibold tracking-widest uppercase text-gray mb-4 mt-6 md:mt-0">04</span>
            <h3 className="text-lg font-medium text-black mb-3 pr-4">Acompanhar e orientar</h3>
            <p className="text-graphite text-xs font-light leading-relaxed pr-6">
              Acompanhamos as etapas previstas no escopo, buscando preservar a fidelidade técnica e estética durante a execução.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}