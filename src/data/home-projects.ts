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

const STORAGE_BASE = 'https://kzhlligmdddsgleivhrt.supabase.co/storage/v1/object/public/project-images';

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'cabana-maria-celia',
    title: 'Cabana Maria Célia',
    category: 'Residencial',
    cover: {
      src: `${STORAGE_BASE}/7938e2bf-5606-48b6-abb7-588040ed512f/hero.webp`,
      alt: 'Visualização arquitetônica da fachada e volumetria da Cabana Maria Célia',
      width: 1672,
      height: 941,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: `${STORAGE_BASE}/7938e2bf-5606-48b6-abb7-588040ed512f/hero.webp`,
        alt: 'Visualização arquitetônica da fachada principal e volumetria em madeira da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/7938e2bf-5606-48b6-abb7-588040ed512f/cabana-01.webp`,
        alt: 'Visualização arquitetônica da vista em perspectiva da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/7938e2bf-5606-48b6-abb7-588040ed512f/cabana-03.webp`,
        alt: 'Visualização arquitetônica dos detalhes de madeira e cobertura da Cabana Maria Célia',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/7938e2bf-5606-48b6-abb7-588040ed512f/cabana-04.webp`,
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
      src: `${STORAGE_BASE}/dd2f9d30-8945-4a8d-8be9-5ea69670a79e/debora-william-02.webp`,
      alt: 'Visualização arquitetônica da fachada principal da Residência Débora e William',
      width: 1280,
      height: 720,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: `${STORAGE_BASE}/dd2f9d30-8945-4a8d-8be9-5ea69670a79e/debora-william-01.webp`,
        alt: 'Visualização arquitetônica angular da fachada da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/dd2f9d30-8945-4a8d-8be9-5ea69670a79e/debora-william-02.webp`,
        alt: 'Visualização arquitetônica da fachada frontal e acessos da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/dd2f9d30-8945-4a8d-8be9-5ea69670a79e/debora-william-03.webp`,
        alt: 'Visualização arquitetônica lateral e garagem da Residência Débora e William',
        width: 1280,
        height: 720,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/dd2f9d30-8945-4a8d-8be9-5ea69670a79e/debora-william-04.webp`,
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
      src: `${STORAGE_BASE}/3062cd5a-6b2d-4d25-8bcb-bd4a7fbf6c2e/quiosque-04.webp`,
      alt: 'Visualização arquitetônica da fachada e varanda do Quiosque Família Oliveira',
      width: 1672,
      height: 941,
      type: 'visualizacao-arquitetonica',
    },
    gallery: [
      {
        src: `${STORAGE_BASE}/3062cd5a-6b2d-4d25-8bcb-bd4a7fbf6c2e/quiosque-02.webp`,
        alt: 'Visualização arquitetônica da área de churrasqueira e espaço gourmet do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/3062cd5a-6b2d-4d25-8bcb-bd4a7fbf6c2e/quiosque-04.webp`,
        alt: 'Visualização arquitetônica externa e integração com a natureza do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/3062cd5a-6b2d-4d25-8bcb-bd4a7fbf6c2e/quiosque-05.webp`,
        alt: 'Visualização arquitetônica da perspectiva angular do Quiosque Família Oliveira',
        width: 1672,
        height: 941,
        type: 'visualizacao-arquitetonica',
      },
      {
        src: `${STORAGE_BASE}/3062cd5a-6b2d-4d25-8bcb-bd4a7fbf6c2e/quiosque-06.webp`,
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
