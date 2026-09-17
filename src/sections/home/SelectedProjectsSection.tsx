import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRightIcon, ArrowUpRightIcon } from '@/components/shared/Icons';
import { getPublishedProjects } from '@/lib/projects-public';

export async function SelectedProjectsSection() {
  const projects = await getPublishedProjects();
  const [project1, project2, project3] = projects;

  return (
    <section id="projetos" className="scroll-mt-24 md:scroll-mt-28 pt-16 md:pt-24 pb-16 md:pb-20 px-6 md:px-12 bg-warm-white border-t border-light-gray">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-14 gap-8 border-b border-light-gray pb-6">
          <h2 className="text-3xl md:text-5xl font-medium text-neutral-900 tracking-tight">Projetos Selecionados.</h2>
          <Link href="/projetos" className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-neutral-600 hover:text-neutral-900 transition-colors mb-2">
            Ver portfólio completo <MoveRightIcon className="ml-2 w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 lg:gap-x-16">
          {/* Projeto 1 */}
          {project1 && (
            <Link
              href={`/projetos/${project1.slug}`}
              className="col-span-1 md:col-span-12 group block"
            >
              <div className="relative aspect-[16/9] overflow-hidden mb-6 bg-light-gray">
                <Image
                  src={project1.cover.src}
                  alt={project1.cover.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium text-neutral-900 mb-1.5 group-hover:text-neutral-700 transition-colors">
                    {project1.title}
                  </h3>
                  <p className="text-sm font-normal text-neutral-600">{project1.category}</p>
                </div>
                <div className="flex items-center text-xs font-semibold tracking-widest uppercase text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  Ver projeto <ArrowUpRightIcon className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          )}

          {/* Projeto 2 */}
          {project2 && (
            <Link
              href={`/projetos/${project2.slug}`}
              className="col-span-1 md:col-span-5 md:mt-12 group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-light-gray">
                <Image
                  src={project2.cover.src}
                  alt={project2.cover.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 600px"
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-1.5 group-hover:text-neutral-700 transition-colors">
                    {project2.title}
                  </h3>
                  <p className="text-sm font-normal text-neutral-600">{project2.category}</p>
                </div>
                <ArrowUpRightIcon className="w-5 h-5 text-neutral-900 ml-2 group-hover:text-neutral-700 transition-colors" />
              </div>
            </Link>
          )}

          {/* Projeto 3 */}
          {project3 && (
            <Link
              href={`/projetos/${project3.slug}`}
              className="col-span-1 md:col-span-7 group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-light-gray">
                <Image
                  src={project3.cover.src}
                  alt={project3.cover.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 800px"
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-1.5 group-hover:text-neutral-700 transition-colors">
                    {project3.title}
                  </h3>
                  <p className="text-sm font-normal text-neutral-600">{project3.category}</p>
                </div>
                <ArrowUpRightIcon className="w-5 h-5 text-neutral-900 ml-2 group-hover:text-neutral-700 transition-colors" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
