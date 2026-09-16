'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_INFO } from '@/data/studio';
/* ── Ícones Locais com Estilização Conforme Diretrizes ── */

function WhatsAppIcon({ className = "w-[26px] h-[26px] text-white" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.74C7 10.98 7.9 12.18 8.03 12.35C8.15 12.51 9.8 15.06 12.32 16.14C12.92 16.4 13.38 16.55 13.75 16.67C14.35 16.86 14.9 16.83 15.33 16.77C15.81 16.7 16.81 16.16 17.02 15.57C17.23 14.97 17.23 14.47 17.17 14.36C17.11 14.26 16.95 14.2 16.68 14.07C16.42 13.94 15.13 13.31 14.89 13.22C14.65 13.13 14.48 13.09 14.31 13.34C14.15 13.59 13.68 14.14 13.53 14.31C13.39 14.47 13.25 14.5 12.98 14.36C12.72 14.23 11.87 13.95 10.86 13.05C10.08 12.35 9.55 11.49 9.4 11.24C9.25 10.98 9.38 10.84 9.52 10.71C9.64 10.59 9.78 10.4 9.92 10.24C10.05 10.07 10.1 9.95 10.19 9.78C10.27 9.62 10.23 9.47 10.17 9.35C10.1 9.22 9.63 8.07 9.43 7.6C9.24 7.14 9.04 7.2 8.89 7.19C8.75 7.19 8.58 7.19 8.53 7.33Z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-[26px] h-[26px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

function ArrowUpRightDiagonalIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-warm-white text-black py-14 md:py-16 px-6 md:px-12 border-t border-black/5">
      <div className="max-w-[1200px] mx-auto">
        {/* Bloco Principal em 2 colunas (desktop) ou empilhado (mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Coluna 1: Marca e descrição */}
          <div className="flex flex-col items-start text-left">
            <Link
              href="/"
              className="focus-visible:outline-black focus-visible:outline-offset-4 rounded-sm mb-5 block"
            >
              <Image
                src="/brand/studio-am-horizontal.png"
                alt="Studio AM — Arquitetura e Engenharia"
                width={672}
                height={125}
                className="w-[260px] h-auto object-contain"
              />
            </Link>
            <p className="text-[16px] md:text-[18px] text-[#404040] font-normal leading-[1.6] max-w-[420px]">
              Arquitetura que conecta,
              <br />
              engenharia que sustenta
            </p>
          </div>

          {/* Coluna 2: “Converse com a Anne” */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-[20px] font-medium text-[#171717] mb-4">
              Converse com a Anne
            </h3>
            <div className="flex flex-col space-y-3 w-full">
              {/* WhatsApp */}
              <a
                href={CONTACT_INFO.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[12px] p-1 -ml-1 rounded-sm text-[#404040] select-none cursor-pointer hover:underline focus-visible:outline-black focus-visible:outline-offset-2 group"
                title="Conversar no WhatsApp"
              >
                <div className="w-[44px] h-[44px] rounded-[10px] bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="w-[26px] h-[26px] text-white" />
                </div>
                <span className="text-[16px] font-normal text-[#404040]">WhatsApp</span>
                <ArrowUpRightDiagonalIcon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href={CONTACT_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[12px] p-1 -ml-1 rounded-sm text-[#404040] select-none cursor-pointer hover:underline focus-visible:outline-black focus-visible:outline-offset-2 group"
                title="Acessar Instagram"
              >
                <div 
                  className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(45deg, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                >
                  <InstagramIcon className="w-[26px] h-[26px]" />
                </div>
                <span className="text-[16px] font-normal text-[#404040]">Instagram</span>
                <ArrowUpRightDiagonalIcon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
              </a>
            </div>
          </div>

        </div>

        {/* Linha Inferior com Borda Discreta */}
        <div className="mt-14 md:mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[14px] font-normal text-[#595959]">
          <p>© {new Date().getFullYear()} Studio AM. Todos os direitos reservados.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[#595959] hover:text-neutral-900 transition-colors focus-visible:outline-black focus-visible:outline-offset-2 rounded-sm cursor-pointer"
          >
            Voltar ao topo ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
