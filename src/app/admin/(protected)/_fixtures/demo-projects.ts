import type { AdminProjectListItem } from '@/lib/admin/projects'
import type { ProjectFormData, AnyImageItem } from '@/types/admin-project-form'

// Projetos demo disponíveis apenas em development
export const DEMO_IDS = [
  'demo-andreia-marco',
  'demo-carlos',
  'demo-cristina',
  'demo-bela-vista',
  'demo-clinica-harmonia',
] as const

export type DemoId = typeof DEMO_IDS[number]

export function isDemoId(id: string): id is DemoId {
  return (DEMO_IDS as readonly string[]).includes(id)
}

export function isDemoMode(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Imagens locais: o modo demonstrativo não depende de serviços externos.
const IMG = {
  andreia: '/temp/hero.jpg',
  carlos:  '/temp/featured.jpg',
  cristina:'/temp/project01.jpg',
  bela:    '/temp/project01.jpg',
  clinica: '/temp/featured.jpg',
}

// ─── Lista de projetos para tabela ──────────────────────────────────────────

export const demoProjects: AdminProjectListItem[] = [
  {
    id: 'demo-andreia-marco',
    title: 'Casa Andreia e Marco',
    slug: 'casa-andreia-marco',
    category: 'residencial',
    status: 'published',
    featured: true,
    display_order: 1,
    updated_at: '2025-05-22T14:30:00Z',
  },
  {
    id: 'demo-carlos',
    title: 'Casa Carlos',
    slug: 'casa-carlos',
    category: 'residencial',
    status: 'draft',
    featured: false,
    display_order: 3,
    updated_at: '2025-05-20T10:00:00Z',
  },
  {
    id: 'demo-cristina',
    title: 'Casa Cristina de Oliveira',
    slug: 'casa-cristina-de-oliveira',
    category: 'residencial',
    status: 'published',
    featured: false,
    display_order: 2,
    updated_at: '2025-05-18T09:00:00Z',
  },
  {
    id: 'demo-bela-vista',
    title: 'Apartamento Bela Vista',
    slug: 'apartamento-bela-vista',
    category: 'comercial',
    status: 'draft',
    featured: false,
    display_order: 4,
    updated_at: '2025-05-19T11:20:00Z',
  },
  {
    id: 'demo-clinica-harmonia',
    title: 'Clínica Harmonia',
    slug: 'clinica-harmonia',
    category: 'comercial',
    status: 'published',
    featured: false,
    display_order: 5,
    updated_at: '2025-05-15T08:45:00Z',
  },
]

// Mapa de thumbnails por ID (para uso na tabela e no dashboard)
export const demoThumbnails: Record<DemoId, string> = {
  'demo-andreia-marco':   IMG.andreia,
  'demo-carlos':          IMG.carlos,
  'demo-cristina':        IMG.cristina,
  'demo-bela-vista':      IMG.bela,
  'demo-clinica-harmonia':IMG.clinica,
}

// ─── Form data expandida para edição ────────────────────────────────────────

export interface DemoProjectFull {
  id: string
  formData: ProjectFormData
  images: AnyImageItem[]
}

export const demoProjectsFull: Record<DemoId, DemoProjectFull> = {
  'demo-andreia-marco': {
    id: 'demo-andreia-marco',
    formData: {
      title: 'Casa Andreia e Marco',
      slug: 'casa-andreia-marco',
      category: 'residencial',
      summary: 'Residência unifamiliar implantada em terreno inclinado, com programa integrado à topografia natural do lote.',
      description: 'O projeto partiu de um desafio técnico: um terreno com aclive significativo que, em uma leitura convencional, demandaria volumes elevados de movimentação de terra e contenções custosas. A decisão foi trabalhar a favor do terreno — escalonando o programa ao longo da encosta, permitindo que cada pavimento encontrasse o solo em cotas distintas.\n\nEssa estratégia resultou em uma implantação que respeita a topografia, reduz impacto estrutural e cria relações visuais distintas a cada nível da casa. A engenharia foi conduzida como parte inseparável da arquitetura, não como adaptação posterior.',
      location: 'Belo Horizonte — MG',
      year: '2024',
      area: '320 m²',
      status: 'published',
      featured: true,
      display_order: 1,
    },
    images: [
      {
        id: 'demo-img-1',
        kind: 'remote',
        storageUrl: IMG.andreia,
        alt: 'Casa Andreia e Marco — Imagem conceitual temporária',
        caption: '',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  'demo-carlos': {
    id: 'demo-carlos',
    formData: {
      title: 'Casa Carlos',
      slug: 'casa-carlos',
      category: 'residencial',
      summary: 'Residência com programa funcional organizado em torno de um pátio central que distribui luz e ventilação natural.',
      description: 'Projeto desenvolvido a partir da necessidade de integração entre os espaços sociais e privados sem perda de privacidade. O pátio central funciona como elemento organizador do programa e como regulador climático natural.',
      location: 'Contagem — MG',
      year: '2023',
      area: '260 m²',
      status: 'draft',
      featured: false,
      display_order: 2,
    },
    images: [
      {
        id: 'demo-img-2',
        kind: 'remote',
        storageUrl: IMG.carlos,
        alt: 'Casa Carlos — Imagem conceitual temporária',
        caption: '',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  'demo-cristina': {
    id: 'demo-cristina',
    formData: {
      title: 'Casa Cristina de Oliveira',
      slug: 'casa-cristina-de-oliveira',
      category: 'residencial',
      summary: 'Projeto residencial em desenvolvimento. Programa a ser definido com a cliente.',
      description: '',
      location: 'Nova Lima — MG',
      year: '2025',
      area: '',
      status: 'published',
      featured: false,
      display_order: 3,
    },
    images: [
      {
        id: 'demo-img-3',
        kind: 'remote',
        storageUrl: IMG.cristina,
        alt: 'Casa Cristina de Oliveira — Imagem conceitual temporária',
        caption: '',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  'demo-bela-vista': {
    id: 'demo-bela-vista',
    formData: {
      title: 'Apartamento Bela Vista',
      slug: 'apartamento-bela-vista',
      category: 'comercial',
      summary: 'Reforma e readequação de apartamento com integração de áreas sociais e novo layout de iluminação.',
      description: 'A intervenção foi orientada pela otimização do espaço em planta existente, sem alterações estruturais. A integração sala-cozinha e a escolha de revestimentos neutros criaram uma base versátil para o mobiliário do cliente.',
      location: 'Belo Horizonte — MG',
      year: '2024',
      area: '95 m²',
      status: 'draft',
      featured: false,
      display_order: 4,
    },
    images: [
      {
        id: 'demo-img-4',
        kind: 'remote',
        storageUrl: IMG.bela,
        alt: 'Apartamento Bela Vista — Imagem conceitual temporária',
        caption: '',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  'demo-clinica-harmonia': {
    id: 'demo-clinica-harmonia',
    formData: {
      title: 'Clínica Harmonia',
      slug: 'clinica-harmonia',
      category: 'comercial',
      summary: 'Projeto de reforma e adequação de espaço clínico com foco em fluxo de atendimento, conforto e biossegurança.',
      description: 'O programa clínico demandou setorização rigorosa entre áreas de atendimento, espera e suporte. A solução priorizou fluxos separados para pacientes e equipe, com materiais de fácil higienização e iluminação técnica adequada para os consultórios.',
      location: 'Belo Horizonte — MG',
      year: '2023',
      area: '180 m²',
      status: 'published',
      featured: false,
      display_order: 5,
    },
    images: [
      {
        id: 'demo-img-5',
        kind: 'remote',
        storageUrl: IMG.clinica,
        alt: 'Clínica Harmonia — Imagem conceitual temporária',
        caption: '',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
}
