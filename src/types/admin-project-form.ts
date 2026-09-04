import type { ProjectStatus } from './project'

// ─── Form types (separados dos tipos de banco) ──────────────────────────────

export interface ProjectFormData {
  title: string
  slug: string
  category: string
  summary: string
  description: string
  location: string
  year: string
  area: string
  status: ProjectStatus
  featured: boolean
  display_order: number
}

export const EMPTY_FORM_DATA: ProjectFormData = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  description: '',
  location: '',
  year: '',
  area: '',
  status: 'draft',
  featured: false,
  display_order: 0,
}

// ─── Gallery image types ─────────────────────────────────────────────────────

export type ImageItemKind = 'remote' | 'local'
export type ImageUploadState = 'idle' | 'processing' | 'ready' | 'error'

export interface RemoteImageItem {
  kind: 'remote'
  id: string           // uuid do banco
  storageUrl: string   // URL pública ou assinada do Storage
  alt: string
  caption: string
  is_cover: boolean
  display_order: number
}

export interface LocalImageItem {
  kind: 'local'
  localId: string      // ID temporário (nunca enviado ao banco)
  file: File
  objectUrl: string
  alt: string
  caption: string
  is_cover: boolean
  display_order: number
  uploadState: ImageUploadState
  errorMessage?: string
}

export type AnyImageItem = RemoteImageItem | LocalImageItem

// ─── Categorias da taxonomia pública ────────────────────────────────────────

export const PROJECT_CATEGORIES = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'interiores', label: 'Interiores' },
  { value: 'reforma', label: 'Reforma e Regularização' },
] as const

export type ProjectCategory = typeof PROJECT_CATEGORIES[number]['value']

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  errors: Partial<Record<keyof ProjectFormData | 'cover_alt' | 'images', string>>
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function validateProjectForm(
  data: ProjectFormData,
  images: AnyImageItem[],
  forPublishing = false,
): ValidationResult {
  const errors: ValidationResult['errors'] = {}

  if (!data.title.trim()) errors.title = 'Título é obrigatório'
  if (!data.slug.trim()) {
    errors.slug = 'Slug é obrigatório'
  } else if (!SLUG_REGEX.test(data.slug)) {
    errors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
  }
  if (!data.category) errors.category = 'Categoria é obrigatória'

  if (forPublishing) {
    if (!data.summary.trim()) errors.summary = 'Resumo é obrigatório para publicação'
    if (!data.description.trim()) errors.description = 'Descrição é obrigatória para publicação'
    if (images.length === 0) errors.images = 'Ao menos uma imagem é necessária para publicação'
    const cover = images.find(img => img.is_cover)
    if (!cover) {
      errors.images = (errors.images ?? '') + ' Defina uma imagem de capa.'
    } else if (!cover.alt.trim()) {
      errors.cover_alt = 'Texto alternativo da capa é obrigatório para publicação'
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function getPublicationChecklist(data: ProjectFormData, images: AnyImageItem[]) {
  const cover = images.find(img => img.is_cover)
  return [
    { key: 'title', label: 'Título', ok: !!data.title.trim() },
    { key: 'slug', label: 'Slug válido', ok: !!data.slug && SLUG_REGEX.test(data.slug) },
    { key: 'category', label: 'Categoria', ok: !!data.category },
    { key: 'summary', label: 'Resumo', ok: !!data.summary.trim() },
    { key: 'description', label: 'Descrição', ok: !!data.description.trim() },
    { key: 'images', label: 'Ao menos uma imagem', ok: images.length > 0 },
    { key: 'cover', label: 'Imagem de capa', ok: !!cover },
    { key: 'cover_alt', label: 'Alt text da capa', ok: !!(cover?.alt.trim()) },
  ]
}

// ─── Slug utilities ──────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(new Date(isoString))
  } catch {
    return '—'
  }
}
