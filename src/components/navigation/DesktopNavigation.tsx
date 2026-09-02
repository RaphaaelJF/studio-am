import React from 'react';
import Link from 'next/link';
import { mainNavItems } from '@/data/navigation';

export function DesktopNavigation() {
  return (
    <nav aria-label="Navegação Principal" className="hidden md:flex items-center space-x-10 text-[11px] font-semibold tracking-widest uppercase">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-gray transition-colors focus-visible:outline-black"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
