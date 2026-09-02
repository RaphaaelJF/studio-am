import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRightIcon, ArrowUpRightIcon } from '@/components/shared/Icons';

export function SelectedProjectsSection() {
  return (
    <section id="projetos" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-32 px-6 md:px-12 bg-warm-white border-t border-light-gray">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-light-gray pb-6">
          <h2 className="text-3xl md:text-5xl font-medium text-black tracking-tight">Projetos Selecionados.</h2>
          <Link href="#contato" className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-gray hover:text-black transition-colors mb-2">
            Ver portfólio completo <MoveRightIcon className="ml-2 w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-16">
          {/* Projeto 1 */}
          <div className="col-span-1 md:col-span-12 group cursor-pointer">
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-6 bg-light-gray">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2564&auto=format&fit=crop"
                alt="Imagem conceitual temporária para composição visual do projeto Casa Andreia e Marco"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="absolute bottom-4 right-4 px-2 py-1 border border-white/20 bg-black/40 backdrop-blur-md z-10">
                <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/90">
                  Imagem conceitual temporária
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-black mb-1">Casa Andreia e Marco</h3>
                <p className="text-gray text-xs font-light">Residencial • Em execução</p>
              </div>
              <div className="flex items-center text-[11px] font-semibold tracking-widest uppercase text-black">
                Ver projeto <ArrowUpRightIcon className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Projeto 2 */}
          <div className="col-span-1 md:col-span-5 md:mt-24 group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-light-gray">
              <Image
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                alt="Imagem conceitual temporária para composição visual do projeto Casa Carlos"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 600px"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="absolute bottom-3 right-3 px-2 py-1 border border-white/20 bg-black/40 backdrop-blur-md z-10">
                <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/90">
                  Imagem conceitual temporária
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg md:text-xl font-medium text-black mb-1">Casa Carlos</h3>
                <p className="text-gray text-xs font-light">Residencial • Obra pronta</p>
              </div>
              <ArrowUpRightIcon className="w-5 h-5 text-black ml-2" />
            </div>
          </div>

          {/* Projeto 3 */}
          <div className="col-span-1 md:col-span-7 group cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-light-gray">
              <Image
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
                alt="Imagem conceitual temporária para composição visual do projeto Casa Cristina de Oliveira"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 800px"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="absolute bottom-3 right-3 px-2 py-1 border border-white/20 bg-black/40 backdrop-blur-md z-10">
                <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/90">
                  Imagem conceitual temporária
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg md:text-xl font-medium text-black mb-1">Casa Cristina de Oliveira</h3>
                <p className="text-gray text-xs font-light">Residencial • Obra pronta</p>
              </div>
              <ArrowUpRightIcon className="w-5 h-5 text-black ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}