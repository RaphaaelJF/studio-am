import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function StudioIntroSection() {
  return (
    <section id="sobre" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-32 px-6 md:px-12 bg-beige">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Retrato Profissional Anne Martins */}
        <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1 bg-warm-white border border-light-gray p-3 shadow-sm">
          <div className="w-full h-full relative overflow-hidden bg-light-gray">
            <Image
              src="/images/anne/anne-martins.webp"
              alt="Anne Martins — Engenheira Civil e responsável pela Studio AM"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 450px"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Informações Institucionais e Profissionais */}
        <div className="order-1 lg:order-2">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Sobre o Studio AM
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
              Anne Martins
            </h2>
          </div>

          <div className="space-y-6 text-neutral-700 text-base md:text-[17px] font-normal leading-relaxed mb-12">
            <p>
              A Studio AM desenvolve projetos residenciais e comerciais personalizados, conectando arquitetura, engenharia e viabilidade construtiva. Cada solução nasce da escuta cuidadosa da rotina, das necessidades e dos recursos de quem vai viver ou trabalhar no espaço.
            </p>
            <p>
              Anne Martins é engenheira civil e responsável pela Studio AM. Atua com projetos de arquitetura e engenharia, aliando sensibilidade estética e rigor técnico para que cada desenho se torne, de fato, uma obra real e bem executada.
            </p>
          </div>

          <div className="pt-8 border-t border-black/10 grid grid-cols-2 gap-8 relative mb-10">
            <div className="absolute -top-px left-0 w-12 h-px bg-neutral-900"></div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-1.5">Responsável</p>
              <p className="text-neutral-900 font-medium text-base md:text-[17px]">Anne Martins</p>
              <p className="text-sm text-neutral-600 font-normal mt-0.5">Engenheira Civil</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-1.5">Atuação</p>
              <p className="text-neutral-900 font-medium text-base md:text-[17px]">Projetos &amp; Obras</p>
              <p className="text-sm text-neutral-600 font-normal mt-0.5">Atendimento presencial e remoto</p>
            </div>
          </div>

          {/* CTA editorial para /studio */}
          <Link
            href="/studio"
            className="inline-flex items-center gap-3 mt-2 text-sm font-semibold tracking-[0.16em] uppercase text-neutral-900 hover:text-[#8C7A6B] transition-colors duration-200 py-3 group"
          >
            Conheça o Studio AM
            <span aria-hidden="true" className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
