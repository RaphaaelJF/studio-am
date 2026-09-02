'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mainNavItems } from '@/data/navigation';
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation';
import { MenuIcon, XIcon } from '@/components/shared/Icons';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-warm-white text-black border-b border-black/5 z-50 sticky top-0 px-6 md:px-12 py-4 md:py-5 flex justify-between items-center">
      {/* Typographic Logo */}
      <Link href="/" className="flex items-center space-x-2 focus-visible:outline-black">
        <div className="border-l border-black/20 pl-4 py-0.5 flex flex-col justify-center">
          <span className="font-semibold tracking-[0.22em] text-base md:text-lg uppercase leading-none text-black">
            Studio AM
          </span>
          <span className="text-[8.5px] md:text-[9.5px] tracking-[0.25em] font-light uppercase text-black/70 mt-2 leading-none">
            Arquitetura + Engenharia
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Mobile Nav Toggle */}
      <button
        type="button"
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMenuOpen}
        className="md:hidden text-black p-1 focus-visible:outline-black"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-warm-white text-black flex flex-col justify-center items-center space-y-8 text-lg font-medium tracking-widest uppercase md:hidden">
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
        </div>
      )}
    </header>
  );
}
