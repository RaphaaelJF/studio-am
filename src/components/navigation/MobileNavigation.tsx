'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { mainNavItems } from '@/data/navigation';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle native dialog close event (e.g. via Escape key)
  const handleDialogClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-dialog"
        aria-label={isOpen ? 'Fechar Menu de Navegação' : 'Abrir Menu de Navegação'}
        className="min-h-[44px] min-w-[44px] px-3 py-2 text-body-sm font-medium text-foreground hover:text-muted focus-visible:outline-foreground transition-colors duration-fast flex items-center justify-center"
      >
        {isOpen ? 'Fechar' : 'Menu'}
      </button>

      <dialog
        id="mobile-menu-dialog"
        ref={dialogRef}
        onClose={handleDialogClose}
        className="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none bg-background text-foreground backdrop:bg-transparent p-0 border-none overflow-hidden"
      >
        <div className="flex flex-col h-full w-full px-6 py-6 sm:px-8">
          {/* Mobile Modal Header */}
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <span className="text-body-sm font-semibold tracking-wider text-foreground block">
                STUDIO AM
              </span>
              <span className="text-caption text-muted block">
                Arquitetura + Engenharia
              </span>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fechar Menu"
              className="min-h-[44px] min-w-[44px] px-3 py-2 text-body-sm font-medium text-foreground hover:text-muted focus-visible:outline-foreground transition-colors duration-fast flex items-center justify-center"
            >
              Fechar
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav aria-label="Navegação Mobile" className="flex-1 flex flex-col justify-center gap-8 my-auto">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-heading-2 font-display text-foreground hover:text-muted transition-colors duration-fast focus-visible:outline-foreground py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Footer Info */}
          <div className="border-t border-border pt-6 text-caption text-muted">
            <span>Studio AM · Arquitetura + Engenharia</span>
          </div>
        </div>
      </dialog>
    </div>
  );
}
