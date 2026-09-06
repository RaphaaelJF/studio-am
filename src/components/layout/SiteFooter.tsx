import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="bg-warm-white text-black pt-16 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Marca & Identidade */}
        <div className="flex flex-col items-start border-l border-black/20 pl-4">
          <Link href="/" className="focus-visible:outline-black focus-visible:outline-offset-4 rounded-sm mb-4">
            <Image
              src="/brand/studio-am-logo.png"
              alt="Studio AM — Arquitetura e Engenharia"
              width={2048}
              height={1054}
              className="h-12 w-auto object-contain brightness-0"
            />
          </Link>
          <p className="text-[12px] text-graphite font-light max-w-[200px] leading-relaxed">
            O espaço e a técnica fazem parte da mesma decisão.
          </p>
        </div>

        {/* Navegação */}
        <div className="flex flex-col gap-3 text-[11px] font-semibold tracking-widest uppercase text-gray">
          <Link href="#projetos" className="hover:text-black transition-colors flex items-center gap-2">
            <span className="w-2 h-px bg-gray/50"></span> Portfólio
          </Link>
          <Link href="#servicos" className="hover:text-black transition-colors flex items-center gap-2">
            <span className="w-2 h-px bg-gray/50"></span> Serviços
          </Link>
          <Link href="#processo" className="hover:text-black transition-colors flex items-center gap-2">
            <span className="w-2 h-px bg-gray/50"></span> Processo
          </Link>
          <Link href="#sobre" className="hover:text-black transition-colors flex items-center gap-2">
            <span className="w-2 h-px bg-gray/50"></span> Sobre
          </Link>
        </div>

        {/* Contato & Redes */}
        <div className="flex flex-col gap-3 text-[11px] font-semibold tracking-widest uppercase text-gray md:text-right md:items-end">
          <Link href="#contato" className="hover:text-black transition-colors">
            Contato & Briefing
          </Link>
          <a href="#" className="hover:text-black transition-colors">
            Instagram
          </a>
          <Link href="#contato" className="hover:text-black transition-colors">
            WhatsApp
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-light-gray flex flex-col md:flex-row justify-between items-center text-[10px] font-medium tracking-widest uppercase text-gray">
        <p>© {new Date().getFullYear()} Studio AM. Todos os direitos reservados.</p>
        <p className="mt-4 md:mt-0">Serra Gaúcha — Brasil</p>
      </div>
    </footer>
  );
}
