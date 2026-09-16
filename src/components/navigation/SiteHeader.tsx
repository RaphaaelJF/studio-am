'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mainNavItems } from '@/data/navigation';
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation';
import { MenuIcon, XIcon } from '@/components/shared/Icons';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        href="/#contato"
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
        className="xl:hidden text-black p-1 focus-visible:outline-black"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-warm-white text-black flex flex-col justify-center items-center space-y-8 text-lg font-medium tracking-widest uppercase xl:hidden">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* CTA no menu mobile */}
          <Link
            href="/#contato"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-[#c8baab] text-black px-6 min-h-[44px] text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
          >
            Iniciar Projeto →
          </Link>
        </div>
      )}
      </div>
    </header>
  );
}
