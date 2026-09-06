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
  status: 'draft'
  featured: false
  display_order: number
  published_at: null
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
      status: 'draft',
      featured: false,
      display_order: parsedOrder,
      published_at: null,
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
      .insert(validation.payload)
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
