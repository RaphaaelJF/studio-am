import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRightIcon } from '@/components/shared/Icons';

export function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-12 bg-warm-white w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-12 md:mb-16">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-medium leading-[1.05] tracking-tight text-black md:ml-4 lg:ml-8 mb-8 md:mb-12">
            Arquitetura que conecta.<br />
            <span className="font-light italic text-graphite">Engenharia que sustenta.</span>
          </h1>

          {/* Support Text & CTAs */}
          <div className="md:ml-24 lg:ml-40 max-w-lg">
            <p className="text-graphite text-base md:text-lg font-light leading-relaxed mb-10">
              Projetos residenciais e comerciais personalizados, funcionais e tecnicamente viáveis — pensados para a vida real e para cada etapa da construção.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="#contato"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-4 min-h-[48px] font-semibold uppercase tracking-widest text-[11px] hover:bg-graphite transition-colors"
              >
                Falar sobre meu projeto
                <MoveRightIcon className="ml-3 w-3 h-3" />
              </Link>
              <Link
                href="#projetos"
                className="inline-flex items-center justify-center bg-transparent border border-black/20 text-black px-8 py-4 min-h-[48px] font-semibold uppercase tracking-widest text-[11px] hover:border-black hover:bg-black/5 transition-colors"
              >
                Conhecer projetos
              </Link>
            </div>
          </div>
        </div>

        {/* Photography */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-light-gray overflow-hidden md:w-[95%] ml-auto border border-black/5 p-1 md:p-2">
          <div className="w-full h-full relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2574&auto=format&fit=crop"
              alt="Arquitetura de uma casa moderna"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 95vw, 1400px"
              className="object-cover"
              unoptimized
            />
            {/* Imagem temporária indicação editorial */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-warm-white/90 px-3 py-1.5 border border-black/10 z-10">
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-black/80">
                Imagem conceitual temporária
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
