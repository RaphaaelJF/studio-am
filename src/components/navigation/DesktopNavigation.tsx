import React from 'react';
import Link from 'next/link';
import { mainNavItems } from '@/data/navigation';

export function DesktopNavigation() {
  return (
    <nav aria-label="Navegação Principal" className="hidden xl:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold tracking-wider uppercase text-[#171717]">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-[#595959] transition-colors focus-visible:outline-black"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
