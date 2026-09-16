import React from 'react';
import Image from 'next/image';

export function FeaturedProjectSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-beige border-t border-light-gray">
      <div className="max-w-[1280px] mx-auto">
        {/* Cabeçalho da seção */}
        <div className="mb-12 md:mb-16 text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
            Caso de Estudo
          </p>
          <h2 className="text-3xl md:text-5xl font-medium text-neutral-900 tracking-tight">
            Casa Andreia e Marco
          </h2>
        </div>

        {/* Grade em 2 colunas: Imagem (~55%) e Narrativa (~45%) com gap de 40px */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Coluna Esquerda: Ilustração Conceitual (~55%) */}
          <figure className="lg:col-span-7 flex flex-col m-0">
            <div className="w-full bg-transparent overflow-hidden">
              <Image
                src="/images/concepts/aproveitamento-desnivel.png"
                alt="Ilustração em corte de uma residência em terreno inclinado, com aproveitamento do pavimento inferior."
                width={1024}
                height={768}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="w-full h-auto object-contain"
              />
            </div>
            <figcaption className="mt-4 text-sm text-neutral-600 font-normal leading-relaxed">
              Ilustração conceitual do aproveitamento do desnível. Não representa o projeto original.
            </figcaption>
          </figure>

          {/* Coluna Direita: Narrativa Técnica (~45%) */}
          <div className="lg:col-span-5 flex flex-col justify-start border-l-2 border-black/15 pl-6 md:pl-8 py-1">
            <h3 className="text-2xl md:text-[28px] font-medium mb-8 text-neutral-900 leading-snug">
              Transformando um custo estrutural em oportunidade arquitetônica.
            </h3>

            {/* Contexto, Desafio e Decisão dispostos verticalmente */}
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> O Contexto
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  Residência em terreno com acentuada declividade. O projeto pedia aproveitamento inteligente das condições naturais.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> O Desafio
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  As fundações e estruturas necessárias para nivelar uma residência de um pavimento teriam custo próximo ao cenário com aproveitamento do desnível.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> A Decisão
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  Avaliar a criação de um subsolo, aproveitando o investimento estrutural mandatório e convertendo-o em espaço habitável.
                </p>
              </div>
            </div>

            {/* O Resultado */}
            <div className="bg-warm-white p-6 md:p-8 border border-light-gray shadow-sm">
              <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-900 mb-2">
                O Resultado
              </h4>
              <p className="text-base md:text-[17px] font-medium text-neutral-900 leading-relaxed">
                O aproveitamento do desnível transformou uma condicionante do terreno em uma oportunidade para ampliar o uso da residência e integrar melhor arquitetura, estrutura e implantação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}