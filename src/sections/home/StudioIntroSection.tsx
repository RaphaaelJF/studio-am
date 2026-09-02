import React from 'react';

export function StudioIntroSection() {
  return (
    <section id="sobre" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-32 px-6 md:px-12 bg-beige">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Placeholder técnico Anne */}
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0 order-2 lg:order-1 bg-warm-white border border-light-gray p-3 shadow-sm">
          <div className="w-full h-full border border-light-gray flex flex-col items-center justify-center p-8 text-center bg-beige/30 relative">
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gray/40"></div>
            <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-gray/40"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-gray/40"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gray/40"></div>

            <span className="block w-px h-12 bg-light-gray mb-6"></span>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray mb-2">Foto profissional da Anne</p>
            <p className="text-[10px] font-light tracking-widest uppercase text-gray/70">Material pendente</p>
            <span className="block w-px h-12 bg-light-gray mt-6"></span>
          </div>
        </div>

        {/* Informações Institucionais e Profissionais */}
        <div className="order-1 lg:order-2">
          <div className="space-y-6 text-graphite text-base md:text-lg font-light leading-relaxed mb-12">
            <p>
              A Studio AM desenvolve projetos residenciais e comerciais personalizados, conectando arquitetura, engenharia e viabilidade construtiva. Cada solução nasce da escuta cuidadosa da rotina, das necessidades e dos recursos de quem vai viver ou trabalhar no espaço.
            </p>
            <p>
              Anne Martins é engenheira civil e responsável pela Studio AM. Atua com projetos de arquitetura e engenharia, aliando sensibilidade estética e rigor técnico para que cada desenho se torne, de fato, uma obra real e bem executada.
            </p>
          </div>

          <div className="pt-8 border-t border-black/10 grid grid-cols-2 gap-8 relative">
            <div className="absolute -top-px left-0 w-12 h-px bg-black"></div>
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-1.5">Responsável</p>
              <p className="text-black font-medium text-base">Anne Martins</p>
              <p className="text-xs text-gray font-light mt-0.5">Engenheira Civil</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-1.5">Atuação</p>
              <p className="text-black font-medium text-base">Projetos & Obras</p>
              <p className="text-xs text-gray font-light mt-0.5">Atendimento presencial e remoto</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
