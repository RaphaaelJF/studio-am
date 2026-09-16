import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedProjects, getPublishedProjectBySlug } from '@/lib/projects-public';
import { ArrowLeftIcon, MoveRightIcon } from '@/components/shared/Icons';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Revalida detalhes a cada 60s; slugs novos publicados após o build
// são gerados sob demanda (dynamicParams padrão).
export const revalidate = 60

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Projeto não encontrado | Studio AM',
    };
  }

  return {
    title: `${project.title} | Studio AM`,
    description: project.summary ?? `Visualizações arquitetônicas e detalhes do projeto ${project.title} desenvolvido pelo Studio AM — Arquitetura + Engenharia.`,
    openGraph: {
      title: `${project.title} | Studio AM`,
      description: project.summary ?? undefined,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="bg-warm-white min-h-screen py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Navegação de Retorno */}
        <nav aria-label="Navegação do Projeto" className="mb-12">
          <Link
            href="/projetos"
            className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#595959] hover:text-[#171717] transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 mr-2" />
            Voltar para projetos
          </Link>
        </nav>

        {/* Cabeçalho do Projeto */}
        <header className="border-b border-light-gray pb-12 mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-3">
            {project.category}
            {project.location ? ` — ${project.location}` : ''}
            {project.year ? ` · ${project.year}` : ''}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#171717] leading-tight">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-4 text-lg text-[#404040] max-w-2xl leading-relaxed">{project.summary}</p>
          )}
        </header>

        {/* Imagem de Capa Principal */}
        <div className="relative aspect-[16/9] lg:aspect-[21/9] max-h-[72vh] w-full overflow-hidden mb-16 md:mb-24 bg-light-gray">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
            className="object-contain"
          />
        </div>

        {project.description && (
          <div className="max-w-3xl mb-16 md:mb-24">
            <p className="text-[#404040] text-base md:text-[17px] leading-[1.7] whitespace-pre-line">
              {project.description}
            </p>
            {(project.area || project.location) && (
              <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                {project.location && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-[#595959]">Localização</dt>
                    <dd className="text-[#171717] font-medium">{project.location}</dd>
                  </div>
                )}
                {project.area && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-[#595959]">Área</dt>
                    <dd className="text-[#171717] font-medium">{project.area}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}

        {/* Galeria de Visualizações Arquitetônicas */}
        <section aria-labelledby="galeria-heading" className="mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 pb-4 border-b border-light-gray gap-2">
            <h2 id="galeria-heading" className="text-xl md:text-2xl font-medium text-[#171717] tracking-tight">
              Galeria do Projeto
            </h2>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#595959]">
              Visualizações arquitetônicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {project.gallery.map((image, index) => (
              <figure key={`${image.src}-${index}`} className="flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-light-gray mb-3">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                    className="object-contain transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="text-sm text-[#595959] font-normal leading-[1.6]">
                  {image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Seção de Contato / Chamada para Ação */}
        <section className="border-t border-light-gray pt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-medium text-[#171717] tracking-tight mb-2">
              Deseja conversar sobre o seu projeto?
            </h3>
            <p className="text-[#404040] text-base md:text-[17px] font-normal leading-[1.7] max-w-xl">
              Entre em contato com o Studio AM para avaliar a viabilidade arquitetônica e estrutural da sua construção ou reforma.
            </p>
          </div>
          <Link
            href="/#contato"
            className="inline-flex items-center justify-center gap-3 bg-[#c8baab] text-[#171717] px-8 py-4 text-xs font-semibold tracking-wider uppercase hover:bg-[#171717] hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            Falar sobre meu projeto
            <MoveRightIcon className="w-3.5 h-3.5" />
          </Link>
        </section>
      </div>
    </article>
  );
}
