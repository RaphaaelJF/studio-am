import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRightIcon } from '@/components/shared/Icons';

export function ServicesSection() {
  return (
    <section id="servicos" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-32 px-6 md:px-12 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="w-px h-12 bg-white/20 mb-6"></div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray mb-4">Nossa Atuação</p>
          <h2 className="text-3xl md:text-5xl font-medium text-white">
            Direções de<br />Arquitetura & Engenharia
          </h2>
        </div>

        <div className="space-y-16 md:space-y-16">
          {/* Serviço 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-6 aspect-[16/9] bg-graphite relative group border border-white/10 p-2">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                  alt="Projeto Arquitetônico — Imagem conceitual temporária"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-3">01.</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">
                Projeto<br />Arquitetônico
              </h3>
              <p className="text-sm text-white/70 font-light mb-6 leading-relaxed">
                Para casas, espaços comerciais e ampliações. Traduz necessidades, rotina, terreno e investimento em organização espacial, volumetria, fachadas, conforto e funcionalidade.
              </p>
              <div className="w-6 h-px bg-white/30 mb-6"></div>
              <Link
                href="#contato"
                className="inline-flex items-center text-[11px] font-semibold tracking-widest uppercase text-white hover:text-light-gray transition-colors"
              >
                Falar sobre arquitetura <MoveRightIcon className="ml-2 w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Serviço 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1 md:col-span-4 flex flex-col justify-center md:items-end md:text-right">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-3">02.</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">
                Projetos<br />Complementares
              </h3>
              <p className="text-sm text-white/70 font-light mb-6 leading-relaxed">
                Integra disciplinas necessárias à execução, reduzindo conflitos entre arquitetura, estrutura e instalações. Pode envolver projetos estrutural, elétrico, hidráulico, sanitário, lógica e mais.
              </p>
              <div className="w-6 h-px bg-white/30 mb-6"></div>
              <Link
                href="#contato"
                className="inline-flex items-center text-[11px] font-semibold tracking-widest uppercase text-white hover:text-light-gray transition-colors"
              >
                Falar sobre engenharia <MoveRightIcon className="ml-2 w-3 h-3" />
              </Link>
            </div>
            <div className="order-1 md:order-2 md:col-span-7 md:col-start-6 aspect-[21/9] bg-graphite relative group border border-white/10 p-2">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2662&auto=format&fit=crop"
                  alt="Projetos Complementares — Imagem conceitual temporária"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px"
                  className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Serviço 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-5 aspect-[4/5] bg-graphite relative group border border-white/10 p-2">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                  alt="Reformas e Regularizações — Imagem conceitual temporária"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                  className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
            <div className="md:col-span-5 md:col-start-7 flex flex-col justify-center">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-3">03.</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">
                Reformas e<br />Regularizações
              </h3>
              <p className="text-sm text-white/70 font-light mb-6 leading-relaxed">
                Avalia o existente, organiza intervenções, adequações documentais e melhorias de uso, buscando adaptar o espaço às novas rotinas com segurança.
              </p>
              <div className="w-6 h-px bg-white/30 mb-6"></div>
              <Link
                href="#contato"
                className="inline-flex items-center text-[11px] font-semibold tracking-widest uppercase text-white hover:text-light-gray transition-colors"
              >
                Falar sobre reforma <MoveRightIcon className="ml-2 w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Serviço 4 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1 md:col-span-5 flex flex-col justify-center md:items-end md:text-right">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray mb-3">04.</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">
                Acompanhamento<br />de Obra
              </h3>
              <p className="text-sm text-white/70 font-light mb-6 leading-relaxed">
                Apoia a interpretação do projeto, acompanha etapas previstas no contrato e auxilia na conferência das decisões executadas, visando a fidelidade da execução.
              </p>
              <div className="w-6 h-px bg-white/30 mb-6"></div>
              <Link
                href="#contato"
                className="inline-flex items-center text-[11px] font-semibold tracking-widest uppercase text-white hover:text-light-gray transition-colors"
              >
                Falar sobre acompanhamento <MoveRightIcon className="ml-2 w-3 h-3" />
              </Link>
            </div>
            <div className="order-1 md:order-2 md:col-span-6 md:col-start-7 aspect-[16/9] bg-graphite relative group border border-white/10 p-2">
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                  alt="Acompanhamento de Obra — Imagem conceitual temporária de inspeção de engenharia no canteiro"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
