import React from 'react';

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-dark focus:text-on-dark focus:border focus:border-border focus:text-body-sm focus:font-medium focus:outline-none"
    >
      Pular para o conteúdo
    </a>
  );
}
