'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectDraft } from './ProjectDraftProvider'
import { ProjectGalleryEditor } from './ProjectGalleryEditor'
import { PublicationPanel } from './PublicationPanel'
import { ProjectPreview } from './ProjectPreview'
import { UnsavedChangesDialog } from './ConfirmDialog'
import { useToast } from './AdminToastContext'
import { AdminCard, AdminDemoBanner } from './AdminSharedUI'
import { ArrowLeftIcon } from '@/components/shared/Icons'
import { PROJECT_CATEGORIES, slugify, validateProjectForm } from '@/types/admin-project-form'
import type { ProjectFormData } from '@/types/admin-project-form'

import {
  createProjectDraft,
  updateProjectDraft,
  registerUploadedProjectImages,
  publishProject,
  updateProjectImageMeta,
  setProjectCoverImage,
} from '@/app/admin/actions/projects'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
}

interface ProjectFormProps {
  mode: 'new' | 'edit'
  backUrl: string
  isDemo?: boolean
  projectId?: string
}

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { id: 1, label: 'Informações' },
  { id: 2, label: 'Galeria' },
  { id: 3, label: 'Detalhes' },
  { id: 4, label: 'Publicação' },
]

export function ProjectForm({ mode, backUrl, isDemo, projectId }: ProjectFormProps) {
  const { formData, setFormData, images, hasUnsavedChanges, setHasUnsavedChanges } = useProjectDraft()
  const { toast } = useToast()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  useEffect(() => {
    if (!slugManuallyEdited) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.title) }))
    }
  }, [formData.title, slugManuallyEdited, setFormData])

  useEffect(() => {
    if (!showPreview) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowPreview(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [showPreview])

  const updateField = <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e })
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    updateField('slug', value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
  }

  const handleSave = async () => {
    if (isSaving) return

    const validation = validateProjectForm(formData, images, false)
    if (!validation.valid) {
      setErrors(validation.errors as Record<string, string>)
      toast('Corrija os campos obrigatórios.', 'error')
      return
    }

    setIsSaving(true)

    // Modo demonstrativo permanece puramente local/simulado
    if (isDemo) {
      await new Promise(r => setTimeout(r, 600))
      setIsSaving(false)
      setHasUnsavedChanges(false)
      toast('Rascunho salvo no modo visual. Nenhum dado foi persistido.', 'info')
      return
    }

    try {
      const locals = images.filter(img => img.kind === 'local')

      // Função que realiza o upload direto do binário para o Supabase Storage via browser
      const performDirectStorageUpload = async (targetProjectId: string) => {
        if (locals.length === 0) return { success: true }
        const supabase = createBrowserClient()
        const recordsToRegister = []

        for (let i = 0; i < locals.length; i++) {
          const item = locals[i]
          if (item.kind !== 'local') continue

          const safeName = sanitizeFileName(item.file.name || `imagem-${i}.webp`)
          const storagePath = `${targetProjectId}/${Date.now()}-${i}-${safeName}`

          const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(storagePath, item.file, {
              upsert: false,
              contentType: item.file.type || 'image/webp',
            })

          if (uploadError) {
            console.error('[ProjectForm:directUpload] Falha no storage:', uploadError.message)
            return {
              success: false,
              error: `Falha ao enviar arquivo ${item.file.name}: ${uploadError.message}`,
            }
          }

          recordsToRegister.push({
            storagePath,
            alt: item.alt.trim() || item.file.name.replace(/\.[^/.]+$/, ''),
            caption: item.caption?.trim() || null,
            is_cover: item.is_cover,
            display_order: item.display_order,
          })
        }

        const regRes = await registerUploadedProjectImages(targetProjectId, recordsToRegister)
        if (!regRes.success) {
          return { success: false, error: regRes.error }
        }

        return { success: true }
      }

      if (mode === 'new') {
        const res = await createProjectDraft(formData)
        if (!res.success) {
          if (res.fieldErrors) {
            setErrors(prev => ({ ...prev, ...res.fieldErrors }))
          }
          toast(res.error, 'error')
          setIsSaving(false)
          return
        }

        const newId = res.data.id
        if (locals.length > 0) {
          const up = await performDirectStorageUpload(newId)
          if (!up.success) {
            toast(`Projeto criado, mas houve erro no envio das imagens: ${up.error}`, 'error')
            setIsSaving(false)
            router.push(`/admin/projetos/${newId}/editar`)
            return
          }
        }

        setHasUnsavedChanges(false)
        toast('Rascunho criado com sucesso.', 'success')
        router.push(`/admin/projetos/${newId}/editar`)
        return
      }

      if (!projectId) {
        toast('Identificador do projeto não encontrado para edição.', 'error')
        setIsSaving(false)
        return
      }

      const res = await updateProjectDraft(projectId, formData)
      if (!res.success) {
        if (res.fieldErrors) {
          setErrors(prev => ({ ...prev, ...res.fieldErrors }))
        }
        toast(res.error, 'error')
        setIsSaving(false)
        return
      }

      // Persiste metadados das imagens remotas (alt/legenda) + capa
      const remotes = images.filter(img => img.kind === 'remote')
      for (const img of remotes) {
        if (img.kind !== 'remote') continue
        await updateProjectImageMeta(img.id, { alt: img.alt, caption: img.caption })
      }
      const coverRemote = remotes.find(img => img.kind === 'remote' && img.is_cover)
      if (coverRemote && coverRemote.kind === 'remote') {
        await setProjectCoverImage(projectId, coverRemote.id)
      }

      if (locals.length > 0) {
        const up = await performDirectStorageUpload(projectId)
        if (!up.success) {
          toast(`Texto salvo, mas houve erro no envio das imagens: ${up.error}`, 'error')
          setIsSaving(false)
          return
        }
      }

      setHasUnsavedChanges(false)
      toast('Projeto atualizado com sucesso.', 'success')
    } catch {
      toast('Ocorreu um erro ao salvar.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    const validation = validateProjectForm(formData, images, true)
    if (!validation.valid) {
      setErrors(validation.errors as Record<string, string>)
      toast('Preencha todos os campos antes de publicar.', 'error')
      setCurrentStep(1)
      return
    }
    if (isDemo) {
      setIsSaving(true)
      await new Promise(r => setTimeout(r, 700))
      setFormData(prev => ({ ...prev, status: 'published' }))
      setIsSaving(false)
      setHasUnsavedChanges(false)
      toast('Publicação simulada nesta sessão. Nenhum dado foi persistido.', 'info')
      return
    }
    if (!projectId) {
      toast('Salve o rascunho antes de publicar.', 'error')
      return
    }
    setIsSaving(true)
    try {
      // Garante texto + imagens persistidos antes de publicar
      const upd = await updateProjectDraft(projectId, formData)
      if (!upd.success) {
        toast(upd.error, 'error')
        setIsSaving(false)
        return
      }
      const remotes = images.filter(img => img.kind === 'remote')
      for (const img of remotes) {
        if (img.kind !== 'remote') continue
        await updateProjectImageMeta(img.id, { alt: img.alt, caption: img.caption })
      }
      const coverRemote = remotes.find(img => img.kind === 'remote' && img.is_cover)
      if (coverRemote && coverRemote.kind === 'remote') {
        await setProjectCoverImage(projectId, coverRemote.id)
      }
      const locals = images.filter(img => img.kind === 'local')
      if (locals.length > 0) {
        const supabase = createBrowserClient()
        const recordsToRegister = []

        for (let i = 0; i < locals.length; i++) {
          const item = locals[i]
          if (item.kind !== 'local') continue

          const safeName = sanitizeFileName(item.file.name || `imagem-${i}.webp`)
          const storagePath = `${projectId}/${Date.now()}-${i}-${safeName}`

          const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(storagePath, item.file, {
              upsert: false,
              contentType: item.file.type || 'image/webp',
            })

          if (uploadError) {
            console.error('[ProjectForm:handlePublish] Falha no storage:', uploadError.message)
            toast(`Falha ao enviar arquivo ${item.file.name}: ${uploadError.message}`, 'error')
            setIsSaving(false)
            return
          }

          recordsToRegister.push({
            storagePath,
            alt: item.alt.trim() || item.file.name.replace(/\.[^/.]+$/, ''),
            caption: item.caption?.trim() || null,
            is_cover: item.is_cover,
            display_order: item.display_order,
          })
        }

        const regRes = await registerUploadedProjectImages(projectId, recordsToRegister)
        if (!regRes.success) {
          toast(`Não foi possível registrar as imagens: ${regRes.error}`, 'error')
          setIsSaving(false)
          return
        }
      }

      const pub = await publishProject(projectId, { featured: formData.featured, display_order: formData.display_order })
      if (!pub.success) {
        toast(pub.error, 'error')
        setIsSaving(false)
        return
      }
      setFormData(prev => ({ ...prev, status: 'published' }))
      setHasUnsavedChanges(false)
      toast('Projeto publicado com sucesso.', 'success')
    } catch {
      toast('Ocorreu um erro ao publicar.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const navigateWithGuard = (href: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(href)
      setShowUnsavedDialog(true)
    } else {
      router.push(href)
    }
  }

  const confirmNavigation = () => {
    if (pendingNavigation) {
      setShowUnsavedDialog(false)
      router.push(pendingNavigation)
    }
  }

  const cover = images.find(img => img.is_cover)
  const coverUrl = cover ? (cover.kind === 'local' ? cover.objectUrl : cover.storageUrl) : null

  return (
    <>
      <div className="admin-project-editor space-y-4">
        {isDemo && <AdminDemoBanner />}

        {/* Top bar */}
        <div className="admin-editor-toolbar flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateWithGuard(backUrl)}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
              aria-label="Voltar"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>
                {mode === 'new' ? 'Novo Projeto' : 'Editar Projeto'}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                {formData.title || 'Sem título'}
                {hasUnsavedChanges && <span className="ml-1 italic">— alterações não salvas</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-surface)',
                color: 'var(--admin-text)',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Salvando...' : 'Salvar rascunho'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-surface)',
                color: 'var(--admin-text)',
              }}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ background: 'var(--admin-text)', opacity: isSaving ? 0.6 : 1 }}
            >
              Publicar
            </button>
            <button
              type="button"
              onClick={() => navigateWithGuard(backUrl)}
              className="admin-editor-close"
              aria-label="Fechar editor"
            >
              ×
            </button>
          </div>
        </div>

        {/* Editor body */}
        <AdminCard className="admin-editor-card flex flex-col md:flex-row min-h-[520px]">
          {/* Steps nav */}
          <div
            className="admin-editor-steps w-full md:w-40 shrink-0 flex-col"
            style={{ borderRight: '1px solid var(--admin-border)' }}
          >
            <div className="p-2 sm:p-4 grid grid-cols-4 md:flex md:flex-col gap-1 w-full">
              {STEPS.map(step => (
                <button
                  key={step.id}
                  type="button"
                  aria-label={`Etapa ${step.id}: ${step.label}`}
                  onClick={() => setCurrentStep(step.id as Step)}
                  className="flex items-center justify-center md:justify-start gap-2 px-2 sm:px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-center md:text-left min-w-0"
                  style={{
                    background: currentStep === step.id ? 'var(--admin-active)' : 'transparent',
                    color: currentStep === step.id ? 'var(--admin-text)' : 'var(--admin-muted)',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: currentStep === step.id ? 'var(--admin-text)' : 'var(--admin-border)',
                      color: currentStep === step.id ? 'white' : 'var(--admin-muted)',
                    }}
                  >
                    {step.id}
                  </span>
                  <span className="hidden md:inline truncate">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="admin-editor-content flex-1 min-w-0 p-5">
            {currentStep === 1 && (
              <div>
                <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>
                  Informações básicas
                </h2>
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Título *" error={errors.title}>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={e => updateField('title', e.target.value)}
                          placeholder="Nome do projeto"
                          className={fieldClass(!!errors.title)}
                        />
                      </Field>
                      <Field label="Categoria *" error={errors.category}>
                        <select
                          value={formData.category}
                          onChange={e => updateField('category', e.target.value)}
                          className={fieldClass(!!errors.category)}
                        >
                          <option value="">Selecionar...</option>
                          {PROJECT_CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Subtítulo" hint="Uma frase curta abaixo do nome do projeto.">
                      <input
                        type="text"
                        value={formData.summary}
                        onChange={e => updateField('summary', e.target.value)}
                        placeholder="Residência em execução"
                        className={fieldClass(false)}
                      />
                    </Field>

                    <Field label="Localização">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => updateField('location', e.target.value)}
                        placeholder="Cidade — UF"
                        className={fieldClass(false)}
                      />
                    </Field>

                    <Field label="Descrição curta" hint="Exibida na apresentação resumida do projeto.">
                      <textarea
                        value={formData.description}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="Breve descrição do projeto..."
                        rows={3}
                        className={fieldClass(false)}
                      />
                    </Field>
                  </div>

                  {/* Cover preview */}
                  <div className="admin-editor-cover w-full lg:w-[340px] shrink-0">
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--admin-text)' }}>
                      Imagem de capa
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="block w-full rounded-lg overflow-hidden relative group"
                      style={{
                        border: '1px solid var(--admin-border)',
                        background: 'var(--admin-active)',
                        aspectRatio: '4/3',
                      }}
                    >
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>Sem capa</span>
                          <span className="text-[11px]" style={{ color: 'var(--admin-muted)' }}>Clique para adicionar</span>
                        </div>
                      )}
                      <div
                        className="absolute inset-x-0 bottom-0 py-2 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center"
                        style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--admin-text)' }}
                      >
                        Alterar na Galeria
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button
                    type="button"
                    disabled
                    className="px-5 py-2 text-sm font-medium rounded-lg opacity-40"
                    style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
                    style={{ background: 'var(--admin-text)' }}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>
                  Galeria do Projeto
                </h2>
                {errors.images && (
                  <p className="text-xs text-red-600 mb-3">{errors.images}</p>
                )}
                <ProjectGalleryEditor />
                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2 text-sm font-medium rounded-lg"
                    style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
                    style={{ background: 'var(--admin-text)' }}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>
                  Detalhes Técnicos & Narrativa
                </h2>
                <div className="space-y-4 max-w-2xl">
                  <Field label="Endereço do projeto" error={errors.slug} hint={formData.slug ? `/projetos/${formData.slug}` : undefined}>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => handleSlugChange(e.target.value)}
                      placeholder="nome-do-projeto"
                      className={`font-mono ${fieldClass(!!errors.slug)}`}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Localização">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => updateField('location', e.target.value)}
                        placeholder="Cidade — UF"
                        className={fieldClass(false)}
                      />
                    </Field>
                    <Field label="Ano">
                      <input
                        type="text"
                        value={formData.year}
                        onChange={e => updateField('year', e.target.value)}
                        placeholder="2024"
                        className={fieldClass(false)}
                      />
                    </Field>
                    <Field label="Área">
                      <input
                        type="text"
                        value={formData.area}
                        onChange={e => updateField('area', e.target.value)}
                        placeholder="320 m²"
                        className={fieldClass(false)}
                      />
                    </Field>
                  </div>
                  <Field label="Descrição completa" error={errors.description}>
                    <textarea
                      value={formData.description}
                      onChange={e => updateField('description', e.target.value)}
                      placeholder="Contexto, desafios técnicos, decisões e resultado..."
                      rows={10}
                      className={fieldClass(!!errors.description)}
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 text-sm font-medium rounded-lg"
                    style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
                    style={{ background: 'var(--admin-text)' }}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>
                  Publicação
                </h2>
                <div className="max-w-md">
                  <PublicationPanel />
                </div>
                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2 text-sm font-medium rounded-lg"
                    style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
                    style={{ background: 'var(--admin-text)', opacity: isSaving ? 0.6 : 1 }}
                  >
                    {isSaving ? 'Publicando...' : 'Publicar agora'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onConfirm={confirmNavigation}
        onCancel={() => { setShowUnsavedDialog(false); setPendingNavigation(null) }}
      />

      {showPreview && (
        <div className="admin-preview-modal" role="dialog" aria-modal="true" aria-label="Pré-visualização do projeto">
          <button type="button" className="admin-preview-backdrop" onClick={() => setShowPreview(false)} aria-label="Fechar pré-visualização" />
          <div className="admin-preview-dialog">
            <ProjectPreview
              formData={formData}
              images={images}
              editUrl={backUrl}
              projectId="editor-current-draft"
              isDemo={isDemo}
              onClose={() => setShowPreview(false)}
              embedded
            />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Field helper ─────────────────────────────────────────────────────────────
function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none transition-colors ${
    hasError ? 'border-red-400' : ''
  }`
}

function Field({
  label, children, error, hint,
}: {
  label: string
  children: React.ReactNode
  error?: string
  hint?: string
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: 'var(--admin-text)' }}
      >
        {label}
      </label>
      <div style={{
        border: `1px solid ${error ? '#F87171' : 'var(--admin-border)'}`,
        borderRadius: '8px',
        background: 'var(--admin-surface)',
        overflow: 'hidden',
      }}>
        {React.cloneElement(children as React.ReactElement<{ style?: React.CSSProperties }>, {
          style: {
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            color: 'var(--admin-text)',
            resize: 'vertical',
          },
        })}
      </div>
      {hint && !error && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--admin-muted)' }}>{hint}</p>
      )}
      {error && (
        <p className="text-[11px] mt-1 text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}
