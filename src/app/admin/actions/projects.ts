'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdminProfile } from '@/lib/auth/admin'
import { isNameLoginEnabled } from '@/lib/auth/mode'
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

function isPreviewTestMode(): boolean {
  return isNameLoginEnabled()
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

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — salvamento no banco requer autenticação real.',
      }
    }

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

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — salvamento no banco requer autenticação real.',
      }
    }

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

    // Consulta estado atual para saber status e slug anterior (em caso de renomeação de slug)
    const { data: previous, error: prevError } = await supabase
      .from('projects')
      .select('slug, status')
      .eq('id', cleanId)
      .maybeSingle()

    if (prevError) {
      console.error('[updateProjectDraft] Falha ao verificar estado anterior do projeto:', prevError.message)
      return {
        success: false,
        error: 'Falha ao consultar dados atuais do projeto.',
      }
    }

    if (!previous) {
      return {
        success: false,
        error: 'Projeto não encontrado ou você não possui permissão para editá-lo.',
      }
    }

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

export interface UploadedImageRecordInput {
  storagePath: string
  alt: string
  caption?: string | null
  is_cover: boolean
  display_order?: number
}

/**
 * Registra no banco de dados os metadados de imagens cujo upload binário foi
 * realizado diretamente pelo navegador para o Supabase Storage.
 * Garante RLS, unicidade de capa e revalidação de caminhos no Next.js.
 */
export async function registerUploadedProjectImages(
  projectId: string,
  records: UploadedImageRecordInput[],
): Promise<ActionResponse<{ registered: number }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — registro de imagens requer autenticação real.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    if (!Array.isArray(records) || records.length === 0) {
      return { success: false, error: 'Nenhum registro de imagem fornecido.' }
    }

    const supabase = await createClient()

    // 1. Consulta se o projeto existe
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id')
      .eq('id', cleanId)
      .maybeSingle()

    if (projErr || !project) {
      return { success: false, error: 'Projeto não encontrado.' }
    }

    // 2. Consulta ordem base (maior display_order atual)
    const { data: existing } = await supabase
      .from('project_images')
      .select('display_order, is_cover')
      .eq('project_id', cleanId)
      .order('display_order', { ascending: false })
      .limit(1)

    const baseOrder = existing?.[0]?.display_order != null ? Number(existing[0].display_order) + 1 : 0

    let registered = 0
    const errors: string[] = []

    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      const cleanPath = (rec.storagePath ?? '').trim()
      const alt = (rec.alt ?? '').trim()

      if (!cleanPath) {
        errors.push(`Imagem ${i + 1}: caminho no storage ausente.`)
        continue
      }
      if (!alt) {
        errors.push(`Imagem ${i + 1}: texto alternativo (alt) é obrigatório.`)
        continue
      }

      // Se esta imagem for marcada como capa, remove a marcação de capa anterior
      if (rec.is_cover) {
        await supabase
          .from('project_images')
          .update({ is_cover: false })
          .eq('project_id', cleanId)
          .eq('is_cover', true)
      }

      const displayOrder = Number.isFinite(rec.display_order)
        ? Math.max(0, Math.floor(rec.display_order!))
        : baseOrder + i

      const { error: insertErr } = await supabase.from('project_images').insert({
        project_id: cleanId,
        storage_path: cleanPath,
        alt,
        caption: (rec.caption ?? '').trim() || null,
        display_order: displayOrder,
        is_cover: !!rec.is_cover,
      })

      if (insertErr) {
        console.error('[registerUploadedProjectImages] erro ao inserir:', insertErr.message)
        errors.push(`Falha ao registrar imagem: ${insertErr.message}`)
        continue
      }

      registered++
    }

    // 3. Garante que exista exatamente uma capa se há imagens no projeto
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

    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')

    if (registered === 0) {
      return { success: false, error: errors.join(' ') || 'Nenhuma imagem foi registrada.' }
    }

    return { success: true, data: { registered } }
  } catch (err) {
    console.error('[registerUploadedProjectImages] inesperado:', err)
    return { success: false, error: 'Erro de autenticação ou falha interna.' }
  }
}

// ─── Upload real de imagens (compatibilidade legada) ───────────────────
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
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')

    if (uploaded === 0) {
      return { success: false, error: errors.join(' ') || 'Nenhuma imagem foi enviada.' }
    }
    if (errors.length > 0) {
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

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — exclusão de imagens requer autenticação real.',
      }
    }

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

    // Remove do banco de rascunho (project_images)
    const { error: dbError } = await supabase.from('project_images').delete().eq('id', imageId.trim())
    if (dbError) {
      return { success: false, error: 'Não foi possível remover a imagem do rascunho.' }
    }

    // REGRA DE SEGURANÇA: Não apagar o arquivo físico do Storage se ele estiver sendo utilizado
    // pela publicação pública ativa (project_publication_images)
    if (storagePath && !storagePath.startsWith('http')) {
      const cleanPath = storagePath.replace(/^project-images\//, '')
      const { data: pubInUse } = await supabase
        .from('project_publication_images')
        .select('id')
        .eq('storage_path', storagePath)
        .limit(1)

      if (!pubInUse || pubInUse.length === 0) {
        await supabase.storage.from('project-images').remove([cleanPath])
      }
    }

    // Se era capa no rascunho, promove a primeira restante no rascunho
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
    revalidatePath(`/admin/projetos/${projectId}/preview`)
    revalidatePath('/admin/projetos')

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

    // Busca project_id da imagem
    const { data: img, error: imgErr } = await supabase
      .from('project_images')
      .select('project_id')
      .eq('id', imageId.trim())
      .maybeSingle()

    if (imgErr || !img) {
      console.error('[updateProjectImageMeta] Imagem não encontrada:', imgErr?.message)
      return { success: false, error: 'Imagem não encontrada para atualização.' }
    }

    const { error } = await supabase.from('project_images').update(payload).eq('id', imageId.trim())
    if (error) return { success: false, error: 'Não foi possível atualizar a imagem.' }

    revalidatePath(`/admin/projetos/${img.project_id}/editar`)
    revalidatePath(`/admin/projetos/${img.project_id}/preview`)

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

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — definição de capa requer autenticação real.',
      }
    }

    if (!UUID_REGEX.test(projectId.trim()) || !UUID_REGEX.test(imageId.trim())) {
      return { success: false, error: 'Identificadores inválidos.' }
    }
    const cleanProjectId = projectId.trim()
    const cleanImageId = imageId.trim()
    const supabase = await createClient()

    // Executa a troca de capa atômica no banco de dados via RPC transacional apenas no rascunho
    const { error: rpcError } = await supabase.rpc('set_project_cover_image_atomic', {
      p_project_id: cleanProjectId,
      p_image_id: cleanImageId,
    })

    if (rpcError) {
      console.error('[setProjectCoverImage] Falha na operação atômica de troca de capa:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível definir a nova capa.' }
    }

    revalidatePath(`/admin/projetos/${cleanProjectId}/editar`)
    revalidatePath(`/admin/projetos/${cleanProjectId}/preview`)
    revalidatePath('/admin/projetos')

    return { success: true, data: null }
  } catch (err) {
    console.error('[setProjectCoverImage] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}

// ─── Publicação real atômica ──────────────────────────────────────────
export async function publishProject(
  projectId: string,
  opts?: { featured?: boolean; display_order?: number },
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — publicação real requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Consulta slug atualmente publicado (se já houver publicação ativa)
    const { data: currentPub } = await supabase
      .from('project_publications')
      .select('slug')
      .eq('project_id', cleanId)
      .maybeSingle()

    // 2. Executa a transação atômica de publicação no banco via RPC
    const { data: pubId, error: rpcError } = await supabase.rpc('publish_project_atomic', {
      p_project_id: cleanId,
      p_featured: opts?.featured !== undefined ? !!opts.featured : null,
      p_display_order: opts?.display_order !== undefined && Number.isFinite(opts.display_order)
        ? Math.max(0, Math.floor(opts.display_order))
        : null,
    })

    if (rpcError) {
      console.error('[publishProject] Falha na RPC publish_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível publicar o projeto.' }
    }

    // 3. Consulta o slug que acabou de ser publicado
    const { data: newPub } = await supabase
      .from('project_publications')
      .select('slug')
      .eq('id', pubId)
      .maybeSingle()

    // 4. Somente após a publicação bem-sucedida, executa revalidatePath
    revalidatePath('/')
    revalidatePath('/projetos')
    if (currentPub?.slug) {
      revalidatePath(`/projetos/${currentPub.slug}`)
    }
    if (newPub?.slug && newPub.slug !== currentPub?.slug) {
      revalidatePath(`/projetos/${newPub.slug}`)
    }
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
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

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — despublicação requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Consulta slug antes de despublicar para invalidar a rota pública
    const { data: currentPub } = await supabase
      .from('project_publications')
      .select('slug')
      .eq('project_id', cleanId)
      .maybeSingle()

    // 2. Executa a despublicação atômica no banco via RPC
    const { error: rpcError } = await supabase.rpc('unpublish_project_atomic', {
      p_project_id: cleanId,
    })

    if (rpcError) {
      console.error('[unpublishProject] Falha na RPC unpublish_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível despublicar o projeto.' }
    }

    // 3. Revalida rotas públicas afetadas
    revalidatePath('/')
    revalidatePath('/projetos')
    if (currentPub?.slug) {
      revalidatePath(`/projetos/${currentPub.slug}`)
    }
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[unpublishProject] inesperado:', err)
    return { success: false, error: 'Erro interno.' }
  }
}

export async function softDeleteProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — exclusão de projetos requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Consulta slug antes de excluir para invalidar rota pública
    const { data: currentPub } = await supabase
      .from('project_publications')
      .select('slug')
      .eq('project_id', cleanId)
      .maybeSingle()

    // 2. Executa a exclusão lógica atômica via RPC
    const { error: rpcError } = await supabase.rpc('soft_delete_project_atomic', {
      p_project_id: cleanId,
    })

    if (rpcError) {
      console.error('[softDeleteProject] Falha na RPC soft_delete_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível excluir o projeto.' }
    }

    // 3. Revalida rotas públicas e administrativas
    revalidatePath('/')
    revalidatePath('/projetos')
    if (currentPub?.slug) {
      revalidatePath(`/projetos/${currentPub.slug}`)
    }
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[softDeleteProject] inesperado:', err)
    return { success: false, error: 'Erro interno ao excluir projeto.' }
  }
}

export async function restoreProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — restauração de projetos requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Executa a restauração atômica via RPC
    const { error: rpcError } = await supabase.rpc('restore_project_atomic', {
      p_project_id: cleanId,
    })

    if (rpcError) {
      console.error('[restoreProject] Falha na RPC restore_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível restaurar o projeto.' }
    }

    // 2. Revalida rotas administrativas (o projeto volta como rascunho, NÃO publicado)
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[restoreProject] inesperado:', err)
    return { success: false, error: 'Erro interno ao restaurar projeto.' }
  }
}

export async function archiveProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — arquivamento de projetos requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Consulta slug antes de arquivar para invalidar rota pública
    const { data: currentPub } = await supabase
      .from('project_publications')
      .select('slug')
      .eq('project_id', cleanId)
      .maybeSingle()

    // 2. Executa arquivamento atômico via RPC
    const { error: rpcError } = await supabase.rpc('archive_project_atomic', {
      p_project_id: cleanId,
    })

    if (rpcError) {
      console.error('[archiveProject] Falha na RPC archive_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível arquivar o projeto.' }
    }

    // 3. Revalida rotas públicas e administrativas
    revalidatePath('/')
    revalidatePath('/projetos')
    if (currentPub?.slug) {
      revalidatePath(`/projetos/${currentPub.slug}`)
    }
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[archiveProject] inesperado:', err)
    return { success: false, error: 'Erro interno ao arquivar projeto.' }
  }
}

export async function unarchiveProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — desarquivamento de projetos requer autenticação no Supabase.',
      }
    }

    if (!projectId || !UUID_REGEX.test(projectId.trim())) {
      return { success: false, error: 'Identificador de projeto inválido.' }
    }
    const cleanId = projectId.trim()
    const supabase = await createClient()

    // 1. Executa desarquivamento atômico via RPC (volta como draft, não republicado)
    const { error: rpcError } = await supabase.rpc('unarchive_project_atomic', {
      p_project_id: cleanId,
    })

    if (rpcError) {
      console.error('[unarchiveProject] Falha na RPC unarchive_project_atomic:', rpcError.message)
      return { success: false, error: rpcError.message || 'Não foi possível desarquivar o projeto.' }
    }

    // 2. Revalida rotas administrativas
    revalidatePath(`/admin/projetos/${cleanId}/editar`)
    revalidatePath(`/admin/projetos/${cleanId}/preview`)
    revalidatePath('/admin/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, data: { id: cleanId } }
  } catch (err) {
    console.error('[unarchiveProject] inesperado:', err)
    return { success: false, error: 'Erro interno ao desarquivar projeto.' }
  }
}

/**
 * Atualiza os projetos em destaque da Home e suas respectivas ordens de exibição (display_order).
 */
export async function updateFeaturedProjects(
  featuredIds: string[]
): Promise<ActionResponse<{ count: number }>> {
  try {
    await requireAdminProfile()

    if (isPreviewTestMode()) {
      return {
        success: false,
        error: 'Indisponível no modo demonstração — salvamento de destaques requer autenticação no Supabase.',
      }
    }

    const supabase = await createClient()

    // 1. Zera featured na tabela projects e em project_publications
    const filterCondition = featuredIds.length > 0 
      ? `(${featuredIds.map(id => `"${id}"`).join(',')})`
      : '("")'

    await supabase
      .from('projects')
      .update({ featured: false })
      .not('id', 'in', filterCondition)

    await supabase
      .from('project_publications')
      .update({ featured: false })
      .not('project_id', 'in', filterCondition)

    // 2. Para cada ID da lista, atualiza featured = true e o display_order sequencial nas duas tabelas
    for (let i = 0; i < featuredIds.length; i++) {
      const pid = featuredIds[i]
      if (!UUID_REGEX.test(pid)) continue
      const order = i + 1
      const now = new Date().toISOString()

      // Atualiza o projeto de trabalho
      await supabase
        .from('projects')
        .update({
          featured: true,
          display_order: order,
          updated_at: now,
        })
        .eq('id', pid)

      // Atualiza a publicação ativa (se já estiver publicado)
      await supabase
        .from('project_publications')
        .update({
          featured: true,
          display_order: order,
          updated_at: now,
        })
        .eq('project_id', pid)
    }

    // 3. Revalida a Home e as páginas de administração
    revalidatePath('/')
    revalidatePath('/projetos')
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/destaques')
    revalidatePath('/admin/projetos')

    return { success: true, data: { count: featuredIds.length } }
  } catch (err) {
    console.error('[updateFeaturedProjects] Erro inesperado:', err)
    return { success: false, error: 'Erro ao atualizar destaques da Home.' }
  }
}

