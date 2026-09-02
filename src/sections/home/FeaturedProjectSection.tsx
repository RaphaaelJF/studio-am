import React from 'react';
import Image from 'next/image';

export function FeaturedProjectSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-beige border-t border-light-gray">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-3">Caso de Estudo</p>
          <h2 className="text-3xl md:text-4xl font-medium text-black">Casa Andreia e Marco</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Coluna Visual */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] bg-light-gray mb-6 p-2 border border-light-gray">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2070&auto=format&fit=crop"
                  alt="Imagem conceitual temporária para composição visual do projeto Casa Andreia e Marco"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-3 right-3 px-2 py-1 border border-white/20 bg-black/40 backdrop-blur-md z-10">
                  <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/90">
                    Imagem conceitual temporária
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] font-semibold tracking-widest uppercase text-gray border-b border-light-gray pb-3">
              <span>Visão: Arquitetura Integrada</span>
              <span>Serra Gaúcha</span>
            </div>
          </div>

          {/* Coluna Narrativa */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="border-l border-black/10 pl-6 md:pl-10">
              <h3 className="text-xl md:text-2xl font-medium mb-8 text-black leading-snug">
                Transformando um custo estrutural em oportunidade arquitetônica.
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-1.5 flex items-center gap-2">
                    <span className="w-3 h-px bg-gray"></span> O Contexto
                  </h4>
                  <p className="text-sm text-graphite font-light leading-relaxed pl-5">
                    Residência em terreno com acentuada declividade. O projeto pedia aproveitamento inteligente das condições naturais.
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-1.5 flex items-center gap-2">
                    <span className="w-3 h-px bg-gray"></span> O Desafio
                  </h4>
                  <p className="text-sm text-graphite font-light leading-relaxed pl-5">
                    As fundações e estruturas necessárias para nivelar uma residência de um pavimento teriam custo próximo ao cenário com aproveitamento do desnível.
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-1.5 flex items-center gap-2">
                    <span className="w-3 h-px bg-gray"></span> A Decisão
                  </h4>
                  <p className="text-sm text-graphite font-light leading-relaxed pl-5">
                    Avaliar a criação de um subsolo, aproveitando o investimento estrutural mandatório e convertendo-o em espaço habitável.
                  </p>
                </div>
              </div>

              <div className="mt-10 bg-warm-white p-6 border border-light-gray shadow-sm">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-black mb-2">O Resultado</h4>
                <p className="text-sm md:text-base font-medium text-black leading-relaxed">
                  O aproveitamento do desnível transformou uma condicionante do terreno em uma oportunidade para ampliar o uso da residência e integrar melhor arquitetura, estrutura e implantação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}