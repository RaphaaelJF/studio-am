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
    <header className="bg-warm-white text-black border-b border-black/5 z-50 sticky top-0 px-6 md:px-12 py-4 md:py-5 flex justify-between items-center">
      {/* Official Brand Logo */}
      <Link href="/" className="flex items-center focus-visible:outline-black focus-visible:outline-offset-4 rounded-sm">
        <Image
          src="/brand/studio-am-logo.png"
          alt="Studio AM — Arquitetura e Engenharia"
          width={2048}
          height={1054}
          priority
          className="h-14 md:h-16 w-auto object-contain brightness-0"
        />
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
