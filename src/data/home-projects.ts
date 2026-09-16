export interface ProjectImageItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  type: 'visualizacao-arquitetonica';
}

export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  cover: ProjectImageItem;
  gallery: ProjectImageItem[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'cabana-maria-celia',
    title: 'Cabana Maria Célia',
    category: 'Residencial',
    cover: {
      src: '/images/projects/cabana-maria-celia/hero.webp',
      alt: 'Visualização arquitetônica da fachada e volumetria da Cabana Maria Célia',
      width: 1672,
      height: 941,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: '/images/projects/cabana-maria-celia/hero.webp',
        alt: 'Visualização arquitetônica da fachada principal e volumetria em madeira da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/cabana-maria-celia/cabana-01.webp',
        alt: 'Visualização arquitetônica da vista em perspectiva da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/cabana-maria-celia/cabana-03.webp',
        alt: 'Visualização arquitetônica dos detalhes de madeira e cobertura da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/cabana-maria-celia/cabana-04.webp',
        alt: 'Visualização arquitetônica posterior e integração ao terreno da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
    ],
  },
  {
    slug: 'residencia-debora-william',
    title: 'Residência Débora e William',
    category: 'Residencial',
    cover: {
      src: '/images/projects/residencia-debora-william/debora-william-02.webp',
      alt: 'Visualização arquitetônica da fachada principal da Residência Débora e William',
      width: 1280,
      height: 720,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: '/images/projects/residencia-debora-william/debora-william-01.webp',
        alt: 'Visualização arquitetônica angular da fachada da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/residencia-debora-william/debora-william-02.webp',
        alt: 'Visualização arquitetônica da fachada frontal e acessos da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/residencia-debora-william/debora-william-03.webp',
        alt: 'Visualização arquitetônica lateral e garagem da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/residencia-debora-william/debora-william-04.webp',
        alt: 'Visualização arquitetônica da área de lazer e fundos da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
    ],
  },
  {
    slug: 'quiosque-familia-oliveira',
    title: 'Quiosque Família Oliveira',
    category: 'Lazer & Convivência',
    cover: {
      src: '/images/projects/quiosque-familia-oliveira/quiosque-04.webp',
      alt: 'Visualização arquitetônica da fachada e varanda do Quiosque Família Oliveira',
      width: 1672,
      height: 941,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: '/images/projects/quiosque-familia-oliveira/quiosque-02.webp',
        alt: 'Visualização arquitetônica da área de churrasqueira e espaço gourmet do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/quiosque-familia-oliveira/quiosque-04.webp',
        alt: 'Visualização arquitetônica externa e integração com a natureza do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/quiosque-familia-oliveira/quiosque-05.webp',
        alt: 'Visualização arquitetônica da perspectiva angular do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: '/images/projects/quiosque-familia-oliveira/quiosque-06.webp',
        alt: 'Visualização arquitetônica dos detalhes construtivos e esquadrias do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
    ],
  },
];

export function getPortfolioProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug);
}
