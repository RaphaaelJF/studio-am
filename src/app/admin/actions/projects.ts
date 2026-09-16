'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdminProfile } from '@/lib/auth/admin'
import type { ProjectFormData } from '@/types/admin-project-form'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> }

interface SanitizedDraftPayload {
  title: string
  slug: string
  category: string
  summary: string | null
  description: string | null
  location: string | null
  year: number | null
  area: string | null
  display_order: number
}

export interface ImageMetaInput {
  alt: string
  caption: string
  is_cover: boolean
  display_order: number
}

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp'])

/** Valida o conteúdo real do arquivo pelos magic bytes (não confia no MIME do browser). */
function detectImageKind(bytes: Uint8Array): 'jpeg' | 'png' | 'webp' | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  if (
    bytes.length > 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return 'png'
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50 // WEBP
  ) return 'webp'
  return null
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(-120)
}

function sanitizeAndValidateDraft(raw: ProjectFormData): {
  valid: boolean
  errors: Record<string, string>
  payload?: SanitizedDraftPayload
} {
  const errors: Record<string, string> = {}

  const title = typeof raw.title === 'string' ? raw.title.trim() : ''
  if (!title) {
    errors.title = 'Título é obrigatório'
  }

  const slug = typeof raw.slug === 'string' ? raw.slug.trim().toLowerCase() : ''
  if (!slug) {
    errors.slug = 'Slug é obrigatório'
  } else if (!SLUG_REGEX.test(slug)) {
    errors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
  }

  const category = typeof raw.category === 'string' ? raw.category.trim() : ''
  if (!category) {
    errors.category = 'Categoria é obrigatória'
  }

  let parsedYear: number | null = null
  if (raw.year !== undefined && raw.year !== null) {
    const trimmedYear = String(raw.year).trim()
    if (trimmedYear !== '') {
      const num = parseInt(trimmedYear, 10)
      if (isNaN(num) || num < 1800 || num > 2100) {
        errors.year = 'Ano deve ser um número válido'
      } else {
        parsedYear = num
      }
    }
  }

  let parsedOrder = 0
  if (raw.display_order !== undefined && raw.display_order !== null) {
    const orderNum = typeof raw.display_order === 'number' ? raw.display_order : parseInt(String(raw.display_order), 10)
    if (isNaN(orderNum) || orderNum < 0) {
      errors.display_order = 'Ordem deve ser um número maior ou igual a zero'
    } else {
      parsedOrder = Math.floor(orderNum)
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  const summary = typeof raw.summary === 'string' && raw.summary.trim() ? raw.summary.trim() : null
  const description = typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim() : null
  const location = typeof raw.location === 'string' && raw.location.trim() ? raw.location.trim() : null
  const area = typeof raw.area === 'string' && raw.area.trim() ? raw.area.trim() : null

  return {
    valid: true,
    errors: {},
    payload: {
      title,
      slug,
      category,
      summary,
      description,
      location,
      year: parsedYear,
      area,
      display_order: parsedOrder,
    },
  }
}

export async function createProjectDraft(
  formData: ProjectFormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    const validation = sanitizeAndValidateDraft(formData)
    if (!validation.valid || !validation.payload) {
      return {
        success: false,
        error: 'Preencha todos os campos obrigatórios corretamente.',
        fieldErrors: validation.errors,
      }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...validation.payload, status: 'draft', featured: false, published_at: null })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Já existe um projeto com este slug. Por favor, escolha outro identificador.',
          fieldErrors: { slug: 'Este slug já está em uso' },
        }
      }

      console.error('[createProjectDraft] Falha ao inserir projeto:', error.message)
      return {
        success: false,
        error: 'Não foi possível salvar o rascunho no banco de dados.',
      }
    }

    if (!data?.id) {
      return {
        success: false,
        error: 'O banco de dados não retornou a identificação do projeto criado.',
      }
    }

    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      data: { id: data.id },
    }
  } catch (err) {
    console.error('[createProjectDraft] Erro não esperado ao criar rascunho:', err)
    return {
      success: false,
      error: 'Erro de autenticação ou falha interna do servidor.',
    }
  }
}

export async function updateProjectDraft(
  projectId: string,
  formData: ProjectFormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (!projectId || typeof projectId !== 'string' || !UUID_REGEX.test(projectId.trim())) {
      return {
        success: false,
        error: 'Identificador de projeto inválido.',
      }
    }

    const cleanId = projectId.trim()

    const validation = sanitizeAndValidateDraft(formData)
    if (!validation.valid || !validation.payload) {
      return {
        success: false,
        error: 'Preencha todos os campos obrigatórios corretamente.',
        fieldErrors: validation.errors,
      }
    }

    const supabase = await createClient()

    // Preserva status/featured/published_at — edição de texto nunca despublica sozinha.
    const { data, error } = await supabase
      .from('projects')
      .update(validation.payload)
      .eq('id', cleanId)
      .select('id')
      .maybeSingle()

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Já existe outro projeto com este slug. Por favor, escolha outro identificador.',
          fieldErrors: { slug: 'Este slug já está em uso por outro projeto' },
        }
      }

      console.error('[updateProjectDraft] Falha ao atualizar projeto:', error.message)
      return {
        success: false,
        error: 'Não foi possível atualizar o rascunho no banco de dados.',
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Projeto não encontrado ou você não possui permissão para editá-lo.',
      }
    }

    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      data: { id: data.id },
    }
  } catch (err) {
    console.error('[updateProjectDraft] Erro não esperado ao atualizar rascunho:', err)
    return {
      success: false,
      error: 'Erro de autenticação ou falha interna do servidor.',
    }
  }
}

// ─── Upload real de imagens ─────────────────────────────────────────────
// Recebe FormData com: projectId (string), files (File[]), meta (JSON de ImageMetaInput[])
export async function uploadProjectImages(
  projectId: string,
  formData: FormData,
): Promise<ActionResponse<{ uploaded: number }>> {
  try {
    await requireAdminProfile()

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
    if (files.length === 0) {
      return { success: false, error: 'Nenhum arquivo recebido.' }
    }
    if (files.length > 20) {
      return { success: false, error: 'Máximo de 20 imagens por envio.' }
    }

    let meta: ImageMetaInput[] = []
    const rawMeta = formData.get('meta')
    if (typeof rawMeta === 'string' && rawMeta) {
      try {
        meta = JSON.parse(rawMeta) as ImageMetaInput[]
      } catch {
        return { success: false, error: 'Metadados das imagens inválidos.' }
      }
    }

    // Ordem base = maior display_order já existente
    const { data: existing } = await supabase
      .from('project_images')
      .select('display_order, is_cover')
      .eq('project_id', cleanId)
      .order('display_order', { ascending: false })
      .limit(1)
    const baseOrder = existing?.[0]?.display_order != null ? Number(existing[0].display_order) + 1 : 0
    const hasExistingCover = false // recalculado abaixo via banco quando necessário

    let uploaded = 0
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const m: ImageMetaInput = meta[i] ?? { alt: '', caption: '', is_cover: false, display_order: baseOrder + i }

      if (!ALLOWED_MIME.has(file.type)) {
        errors.push(`${file.name}: formato não suportado (use JPEG, PNG ou WebP).`)
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        errors.push(`${file.name}: excede 5 MB.`)
        continue
      }
      if (file.size < 16) {
        errors.push(`${file.name}: arquivo inválido ou vazio.`)
        continue
      }

      const bytes = new Uint8Array(await file.arrayBuffer())

      // Conteúdo real precisa ser JPEG/PNG/WebP (bloqueia SVG/HTML disfarçado → stored XSS)
      const kind = detectImageKind(bytes)
      if (!kind) {
        errors.push(`${file.name}: conteúdo não é uma imagem válida (use JPEG, PNG ou WebP).`)
        continue
      }
      const ext = (file.name.split('.').pop() ?? '').toLowerCase()
      if (!ALLOWED_EXT.has(ext)) {
        errors.push(`${file.name}: extensão não permitida (use .jpg, .png ou .webp).`)
        continue
      }

      const safeName = sanitizeFileName(file.name || `imagem-${i}.webp`)
      const storagePath = `${cleanId}/${Date.now()}-${i}-${safeName}`

      const contentType = kind === 'jpeg' ? 'image/jpeg' : kind === 'png' ? 'image/png' : 'image/webp'
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(storagePath, bytes, { contentType, upsert: false })

      if (uploadError) {
        console.error('[uploadProjectImages] storage error:', uploadError.message)
        errors.push(`${file.name}: falha no upload.`)
        continue
      }

      // Se esta imagem será capa, remove capa anterior antes (partial unique index)
      if (m.is_cover) {
        await supabase.from('project_images').update({ is_cover: false }).eq('project_id', cleanId).eq('is_cover', true)
      }

      const alt = (m.alt ?? '').trim()
      if (!alt) {
        // Alt vazio viola CHECK — remove arquivo e avisa
        await supabase.storage.from('project-images').remove([storagePath])
        errors.push(`${file.name}: preencha o texto alternativo antes de enviar.`)
        continue
      }

      const { error: dbError } = await supabase.from('project_images').insert({
        project_id: cleanId,
        storage_path: storagePath,
        alt,
        caption: (m.caption ?? '').trim() || null,
        display_order: Number.isFinite(m.display_order) ? Math.max(0, Math.floor(m.display_order)) : baseOrder + i,
        is_cover: !!m.is_cover,
      })

      if (dbError) {
        console.error('[uploadProjectImages] db error:', dbError.message)
        await supabase.storage.from('project-images').remove([storagePath])
        errors.push(`${file.name}: falha ao registrar no banco.`)
        continue
      }
      uploaded++
    }

    // Garante que exista exatamente uma capa se há imagens e nenhuma marcada
    if (uploaded > 0 && !hasExistingCover) {
      const { data: covers } = await supabase
        .from('project_images')
        .select('id')
        .eq('project_id', cleanId)
        .eq('is_cover', true)
        .limit(1)
      if (!covers || covers.length === 0) {
        const { data: first } = await supabase
          .from('project_images')
          .select('id')
          .eq('project_id', cleanId)
          .order('display_order', { ascending: true })
          .limit(1)
        if (first?.[0]?.id) {
          await supabase.from('project_images').update({ is_cover: true }).eq('id', first[0].id)
        }
      }
    }

    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath('/admin/projetos')
    revalidatePath('/projetos')
    revalidatePath('/')

    if (uploaded === 0) {
      return { success: false, error: errors.join(' ') || 'Nenhuma imagem foi enviada.' }
    }
    if (errors.length > 0) {
      // Upload parcial: informa mas retorna sucesso com ressalva no erro? Mantém sucesso.
      console.warn('[uploadProjectImages] parcial:', errors.join(' '))
    }
    return { success: true, data: { uploaded } }
  } catch (err) {
    console.error('[uploadProjectImages] inesperado:', err)
    return { success: false, error: 'Erro de autenticação ou falha interna.' }
  }
}

export async function deleteProjectImage(imageId: string): Promise<ActionResponse<null>> {
  try {
    await requireAdminProfile()
    if (!imageId || !UUID_REGEX.test(imageId.trim())) {
      return { success: false, error: 'Identificador de imagem inválido.' }
    }
    const supabase = await createClient()
    const { data: img, error: fetchError } = await supabase
      .from('project_images')
      .select('id, project_id, storage_path, is_cover')
      .eq('id', imageId.trim())
      .maybeSingle()
    if (fetchError || !img) {
      return { success: false, error: 'Imagem não encontrada.' }
    }
    const projectId = (img as { project_id: string }).project_id
    const storagePath = (img as { storage_path: string }).storage_path
    const wasCover = (img as { is_cover: boolean }).is_cover

    const { error: dbError } = await supabase.from('project_images').delete().eq('id', imageId.trim())
    if (dbError) {
      return { success: false, error: 'Não foi possível remover a imagem.' }
    }
    if (storagePath && !storagePath.startsWith('http')) {
      await supabase.storage.from('project-images').remove([storagePath.replace(/^project-images\//, '')])
    }
    // Se era capa, promove a primeira restante
    if (wasCover) {
      const { data: first } = await supabase
        .from('project_images')
        .select('id')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true })
        .limit(1)
      if (first?.[0]?.id) {
        await supabase.from('project_images').update({ is_cover: true }).eq('id', first[0].id)
      }
    }

    revalidatePath(`/admin/projetos/${projectId}/editar`)
    revalidatePath('/admin/projetos')
    revalidatePath('/projetos')
    revalidatePath('/')
    return { success: true, data: null }
  } catch (err) {
    console.error('[deleteProjectImage] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}

export async function updateProjectImageMeta(
  imageId: string,
  patch: { alt?: string; caption?: string },
): Promise<ActionResponse<null>> {
  try {
    await requireAdminProfile()
    if (!imageId || !UUID_REGEX.test(imageId.trim())) {
      return { success: false, error: 'Identificador de imagem inválido.' }
    }
    const payload: Record<string, unknown> = {}
    if (patch.alt !== undefined) {
      const alt = patch.alt.trim()
      if (!alt) return { success: false, error: 'Texto alternativo é obrigatório.' }
      payload.alt = alt
    }
    if (patch.caption !== undefined) {
      payload.caption = patch.caption.trim() || null
    }
    if (Object.keys(payload).length === 0) return { success: true, data: null }

    const supabase = await createClient()
    const { error } = await supabase.from('project_images').update(payload).eq('id', imageId.trim())
    if (error) return { success: false, error: 'Não foi possível atualizar a imagem.' }
    return { success: true, data: null }
  } catch (err) {
    console.error('[updateProjectImageMeta] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}

export async function setProjectCoverImage(
  projectId: string,
  imageId: string,
): Promise<ActionResponse<null>> {
  try {
    await requireAdminProfile()
    if (!UUID_REGEX.test(projectId.trim()) || !UUID_REGEX.test(imageId.trim())) {
      return { success: false, error: 'Identificadores inválidos.' }
    }
    const supabase = await createClient()
    await supabase.from('project_images').update({ is_cover: false }).eq('project_id', projectId.trim()).eq('is_cover', true)
    const { error } = await supabase
      .from('project_images')
      .update({ is_cover: true })
      .eq('id', imageId.trim())
      .eq('project_id', projectId.trim())
    if (error) return { success: false, error: 'Não foi possível definir a capa.' }
    revalidatePath(`/admin/projetos/${projectId.trim()}/editar`)
    return { success: true, data: null }
  } catch (err) {
    console.error('[setProjectCoverImage] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}

// ─── Publicação real ────────────────────────────────────────────────
export async function publishProject(
  projectId: string,
  opts?: { featured?: boolean; display_order?: number },
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()
    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // Valida requisitos no servidor (não confia só no client)
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id, title, slug, category, summary, description')
      .eq('id', cleanId)
      .maybeSingle()
    if (projError || !project) {
      return { success: false, error: 'Projeto não encontrado.' }
    }
    const p = project as { title: string; slug: string; category: string; summary: string | null; description: string | null }
    if (!p.title?.trim() || !p.slug?.trim() || !p.category?.trim()) {
      return { success: false, error: 'Título, slug e categoria são obrigatórios.' }
    }
    if (!p.summary?.trim() || !p.description?.trim()) {
      return { success: false, error: 'Resumo e descrição são obrigatórios para publicação.' }
    }
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('id, alt, is_cover')
      .eq('project_id', cleanId)
    if (imgError) {
      return { success: false, error: 'Não foi possível validar as imagens.' }
    }
    if (!images || images.length === 0) {
      return { success: false, error: 'Adicione ao menos uma imagem antes de publicar.' }
    }
    const cover = (images as { alt: string; is_cover: boolean }[]).find((i) => i.is_cover)
    if (!cover) {
      return { success: false, error: 'Defina uma imagem de capa antes de publicar.' }
    }
    if (!cover.alt?.trim()) {
      return { success: false, error: 'O texto alternativo da capa é obrigatório.' }
    }

    const payload: Record<string, unknown> = {
      status: 'published',
      published_at: new Date().toISOString(),
    }
    if (opts?.featured !== undefined) payload.featured = !!opts.featured
    if (opts?.display_order !== undefined && Number.isFinite(opts.display_order)) {
      payload.display_order = Math.max(0, Math.floor(opts.display_order))
    }

    const { error: updateError } = await supabase.from('projects').update(payload).eq('id', cleanId)
    if (updateError) {
      console.error('[publishProject] update error:', updateError.message)
      return { success: false, error: 'Não foi possível publicar o projeto.' }
    }

    revalidatePath('/')
    revalidatePath('/projetos')
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[publishProject] inesperado:', err)
    return { success: false, error: 'Erro de autenticação ou falha interna.' }
  }
}

export async function unpublishProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()
    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()
    const { error } = await supabase
      .from('projects')
      .update({ status: 'draft', featured: false })
      .eq('id', cleanId)
    if (error) return { success: false, error: 'Não foi possível despublicar.' }
    revalidatePath('/')
    revalidatePath('/projetos')
    revalidatePath('/admin/projetos')
    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[unpublishProject] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}
