import React from 'react';
import Image from 'next/image';

export function FeaturedProjectSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-beige border-t border-light-gray">
      <div className="max-w-[1280px] mx-auto">
        {/* Cabeçalho da seção */}
        <div className="mb-12 md:mb-16 text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
            Estudo Conceitual
          </p>
          <h2 className="text-3xl md:text-5xl font-medium text-neutral-900 tracking-tight">
            Projetar considerando o terreno
          </h2>
        </div>

        {/* Grade em 2 colunas: Imagem (~55%) e Narrativa (~45%) com gap de 40px */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Coluna Esquerda: Ilustração Conceitual (~55%) */}
          <figure className="lg:col-span-7 flex flex-col m-0">
            <div className="w-full bg-transparent overflow-hidden">
              <Image
                src="/images/concepts/aproveitamento-desnivel.png"
                alt="Ilustração conceitual demonstrando possibilidade de aproveitamento de terreno em declive."
                width={1024}
                height={768}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="w-full h-auto object-contain"
              />
            </div>
            <figcaption className="mt-4 text-sm text-neutral-600 font-normal leading-relaxed">
              Ilustração conceitual criada para demonstrar uma possibilidade de aproveitamento de terreno em declive. Não representa projeto executado pelo Studio AM.
            </figcaption>
          </figure>

          {/* Coluna Direita: Narrativa Conceitual (~45%) */}
          <div className="lg:col-span-5 flex flex-col justify-start border-l-2 border-black/15 pl-6 md:pl-8 py-1">
            <h3 className="text-2xl md:text-[28px] font-medium mb-8 text-neutral-900 leading-snug">
              Transformando um custo estrutural em oportunidade arquitetônica.
            </h3>

            {/* Contexto, Desafio e Estratégia */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> Contexto
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  Terrenos com declive acentuado exigem atenção especial à implantação, estrutura e aproveitamento dos níveis.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> Desafio
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  Buscar uma solução que reduza intervenções desnecessárias no terreno e transforme o desnível em oportunidade arquitetônica.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-neutral-500"></span> Estratégia
                </h4>
                <p className="text-base md:text-[18px] text-neutral-700 font-normal leading-relaxed">
                  Considerar desde o início a integração entre arquitetura, estrutura e implantação, utilizando os diferentes níveis de forma funcional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}