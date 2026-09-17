'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';

export function PublicFooter() {
  const pathname = usePathname();
  const isContactPage = pathname === '/contato';

  return <SiteFooter showContactCta={!isContactPage} />;
}
