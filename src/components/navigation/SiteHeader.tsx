'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mainNavItems } from '@/data/navigation';
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation';
import { MenuIcon, XIcon } from '@/components/shared/Icons';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-warm-white text-black border-b border-black/5 z-50 sticky top-0 flex justify-center w-full">
      <div className="w-full max-w-[1600px] mx-auto px-5 md:px-8 xl:px-12 py-4 xl:py-5 flex justify-between items-center">
      {/* Official Brand Logo */}
      <Link href="/" className="flex items-center focus-visible:outline-black focus-visible:outline-offset-4 rounded-sm flex-shrink-0">
        <Image
          src="/brand/studio-am-horizontal.png"
          alt="Studio AM — Arquitetura e Engenharia"
          width={672}
          height={125}
          priority
          className="w-[190px] sm:w-[220px] lg:w-[336px] h-auto object-contain"
        />
      </Link>

      {/* Desktop Navigation — visible lg+ only */}
      <DesktopNavigation />

      {/* CTA Iniciar Projeto — visible xl+ only, same breakpoint as nav */}
      <Link
        href="/contato"
        className="hidden xl:inline-flex items-center justify-center gap-2 bg-[#c8baab] text-black px-6 min-h-[44px] text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-normal focus-visible:outline-black flex-shrink-0"
      >
        Iniciar Projeto
        <span aria-hidden="true">→</span>
      </Link>

      {/* Mobile Nav Toggle — visible below xl */}
      <button
        type="button"
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMenuOpen}
        className="xl:hidden text-black p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-black"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-warm-white text-black flex flex-col justify-between p-6 xl:hidden">
          {/* Top Bar: Logo + Close Button */}
          <div className="flex items-center justify-between w-full pb-4 border-b border-black/5">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center"
            >
              <Image
                src="/brand/studio-am-horizontal.png"
                alt="Studio AM — Arquitetura e Engenharia"
                width={672}
                height={125}
                className="w-[180px] h-auto object-contain"
              />
            </Link>
            <button
              type="button"
              aria-label="Fechar menu"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-black focus-visible:outline-black"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="w-7 h-7" />
            </button>
          </div>

          {/* Nav Items — centered */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-7">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-center px-4 text-lg font-medium tracking-widest uppercase hover:text-gray transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* CTA no menu mobile */}
            <Link
              href="/contato"
              onClick={() => setIsMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#c8baab] text-black px-8 min-h-[48px] text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
            >
              Iniciar Projeto →
            </Link>
          </div>

          {/* Bottom spacer for balance */}
          <div className="py-2 text-center text-xs text-neutral-400 font-normal">
            Arquitetura + Engenharia
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
