import React from 'react';

export function ManifestoSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-warm-white">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-10 border-b border-black/10 pb-4 inline-block">
          Manifesto
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal leading-tight text-neutral-900 mb-12">
          &quot;<span className="font-bold">O papel aceita tudo. A obra não.</span> Desenhar é a metade do caminho;{' '}
          <span className="font-light text-neutral-700">
            saber construir é o destino final.
          </span>
          &quot;
        </h2>
        <div className="border-l border-black/10 pl-6 md:pl-10 relative max-w-3xl mx-auto text-left">
          <div className="absolute -left-px top-0 w-px h-12 bg-neutral-900"></div>
          <p className="text-base md:text-[17px] text-neutral-700 font-normal leading-relaxed">
            Entendemos o terreno, a sua rotina, suas necessidades e os recursos disponíveis antes de traçar a primeira linha, garantindo que o desejo se traduza em uma obra exequível. Cada escolha parte da sua rotina e termina em uma solução possível de construir.
          </p>
        </div>
      </div>
    </section>
  );
}
