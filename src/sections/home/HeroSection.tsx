import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRightIcon } from '@/components/shared/Icons';

export function HeroSection() {
  return (
    <section className="bg-warm-white w-full overflow-hidden">
      {/* ── LAYOUT ──────────────────────────────────────────────────
          Mobile / Tablet (< 1024px): stacked — text then image
          Desktop (≥ 1024px):         two columns — text 42% | image 58%
      ─────────────────────────────────────────────────────────────── */}
      <div className="lg:flex lg:min-h-[680px]">

        {/* ── LEFT COLUMN: Text content ─── */}
        <div className="w-full lg:w-[42%] flex-shrink-0 flex justify-end">
          <div className="
            flex flex-col justify-center
            w-full max-w-[672px]
            px-5 md:px-8 xl:px-12
            pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-24 lg:pb-16
          ">
          {/* Eyebrow / Overline */}
          <div className="flex items-center gap-3 md:gap-4 mb-6">
            <div className="w-8 md:w-10 h-[1px] bg-neutral-900/40"></div>
            <p className="text-xs leading-[1.5] font-semibold tracking-widest uppercase text-neutral-500">
              Studio AM · Arquitetura e Engenharia
            </p>
          </div>

          {/* Headline */}
          <h1 className="
            text-[36px] md:text-5xl lg:text-6xl xl:text-[64px]
            leading-[1.05] tracking-tight mb-7 md:mb-8
          ">
            <span className="block font-bold text-neutral-900">
              Arquitetura<br />
              que conecta.
            </span>
            <span className="block font-light text-neutral-700 mt-1">
              Engenharia<br />
              que sustenta.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-neutral-700 text-base md:text-[18px] font-normal leading-relaxed mb-7 md:mb-8 max-w-[40ch]">
            Projetamos casas e espaços comerciais para a sua rotina, unindo arquitetura e engenharia para transformar suas ideias em espaços que você possa construir e viver.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/#contato"
              className="inline-flex items-center justify-center bg-[#171717] text-white px-8 py-4 min-h-[48px] font-semibold uppercase tracking-wider text-xs hover:bg-[#2b2b2a] transition-colors"
            >
              Iniciar um projeto
              <MoveRightIcon className="ml-3 w-3 h-3" />
            </Link>
            <Link
              href="/#projetos"
              className="inline-flex items-center justify-center bg-transparent border border-[#171717]/30 text-[#171717] px-8 py-4 min-h-[48px] font-semibold uppercase tracking-wider text-xs hover:border-[#171717] hover:bg-black/5 transition-colors"
            >
              Ver projetos
            </Link>
          </div>

          {/* Editorial anchors — desktop only */}
          <div className="hidden lg:flex items-stretch gap-4 mt-8 lg:mt-10 text-[10px] leading-[1.6] font-semibold tracking-[0.3em] uppercase text-black/40">
            <div className="w-[1px] bg-black/20"></div>
            <div className="flex flex-col justify-between py-0.5 gap-2">
              <span>Espaços</span>
              <span>Pessoas</span>
              <span>Propósito</span>
            </div>
          </div>
        </div>
        </div>

        {/* ── RIGHT COLUMN: Photography ─── */}
        <div className="
          relative
          w-full aspect-[4/3]
          lg:aspect-auto lg:flex-1
        ">
          {/* Desktop Gradient Overlay to blend image with warm-white background (limited and subtle) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-24 xl:w-32 bg-gradient-to-r from-warm-white to-transparent z-10 pointer-events-none"></div>

          <Image
            src="/images/projects/cabana-maria-celia/hero.webp"
            alt="Visualização arquitetônica da Cabana Maria Célia"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-center"
          />

          {/* Editorial label — bottom right */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 right-4 lg:bottom-10 lg:right-10 z-20 flex items-center gap-3"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white drop-shadow-md">
              Do conceito à realidade
            </span>
            <div className="w-[1px] h-6 bg-white/40 hidden md:block"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
