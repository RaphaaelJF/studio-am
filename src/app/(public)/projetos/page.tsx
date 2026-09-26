import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/projects-public';
import { ArrowUpRightIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Portfólio de Projetos | Studio AM',
  description: 'Conheça os projetos e visualizações arquitetônicas desenvolvidos pelo Studio AM — Arquitetura + Engenharia.',
};

// Revalida o portfólio a cada 60s para refletir publicações sem rebuild.
export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="bg-warm-white min-h-screen py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Cabeçalho Editorial */}
        <header className="border-b border-light-gray pb-10 mb-16 md:mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-3">
            Portfólio Selecionado
          </p>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-[#171717]">
            Projetos.
          </h1>
        </header>

        {/* Grade de Projetos ou Estado Vazio */}
        {projects.length === 0 ? (
          <div className="py-20 text-center border-t border-light-gray">
            <p className="text-lg text-neutral-600 font-normal mb-2">
              Nenhum projeto publicado no momento.
            </p>
            <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              Novos projetos e estudos serão disponibilizados em breve.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-16">
            {projects.map((project, index) => {
              // Composição variada preservando acabamento editorial
              const isFirst = index === 0;

              return (
                <article
                  key={project.slug}
                  className={`col-span-1 ${
                    isFirst
                      ? 'md:col-span-12'
                      : 'md:col-span-6'
                  }`}
              >
                <Link
                  href={`/projetos/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden mb-6 bg-light-gray">
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes={
                        isFirst
                          ? '(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px'
                          : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px'
                      }
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority={isFirst}
                    />
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-y-3 gap-x-4">
                    <div className="max-w-full">
                      <h2 className="text-xl md:text-2xl font-medium text-[#171717] mb-1.5 group-hover:text-[#404040] transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-sm font-normal text-[#595959]">
                        {project.category}
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-semibold tracking-wider uppercase text-[#171717] group-hover:text-[#404040] transition-colors shrink-0 whitespace-nowrap mt-1 md:mt-1.5">
                      Ver projeto <ArrowUpRightIcon className="ml-2 w-4 h-4 shrink-0" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
