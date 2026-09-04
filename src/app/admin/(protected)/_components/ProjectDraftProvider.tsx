'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ProjectFormData, AnyImageItem, LocalImageItem } from '@/types/admin-project-form'
import { EMPTY_FORM_DATA } from '@/types/admin-project-form'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProjectDraftContextValue {
  formData: ProjectFormData
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
  images: AnyImageItem[]
  setImages: React.Dispatch<React.SetStateAction<AnyImageItem[]>>
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
  draftKey: string
  resetDraft: () => void
  imagesHaveLost: boolean // true after reload with local images
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ProjectDraftContext = createContext<ProjectDraftContextValue | null>(null)

export function useProjectDraft(): ProjectDraftContextValue {
  const ctx = useContext(ProjectDraftContext)
  if (!ctx) throw new Error('useProjectDraft must be used within ProjectDraftProvider')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface ProjectDraftProviderProps {
  children: React.ReactNode
  draftKey: string
  initialFormData?: ProjectFormData
  initialImages?: AnyImageItem[]
}

export function ProjectDraftProvider({
  children,
  draftKey,
  initialFormData,
  initialImages = [],
}: ProjectDraftProviderProps) {
  const [formData, setFormData] = useState<ProjectFormData>(
    initialFormData ?? EMPTY_FORM_DATA
  )
  const [images, setImages] = useState<AnyImageItem[]>(initialImages)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [imagesHaveLost, setImagesHaveLost] = useState(false)

  // Track local objectUrls for cleanup
  const objectUrlsRef = useRef<Set<string>>(new Set())

  // Register new objectUrls for cleanup
  useEffect(() => {
    images.forEach(img => {
      if (img.kind === 'local') {
        objectUrlsRef.current.add(img.objectUrl)
      }
    })
  }, [images])

  // Cleanup objectUrls on unmount
  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      urls.forEach(url => {
        try { URL.revokeObjectURL(url) } catch { /* ignore */ }
      })
    }
  }, [])

  // beforeunload when there are unsaved changes with local files
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasLocalImages = images.some(img => img.kind === 'local')
      if (hasUnsavedChanges || hasLocalImages) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges, images])

  const resetDraft = useCallback(() => {
    // Revoke all local objectUrls before reset
    images.forEach(img => {
      if (img.kind === 'local') {
        try { URL.revokeObjectURL(img.objectUrl) } catch { /* ignore */ }
        objectUrlsRef.current.delete(img.objectUrl)
      }
    })
    setFormData(initialFormData ?? EMPTY_FORM_DATA)
    setImages(initialImages)
    setHasUnsavedChanges(false)
    setImagesHaveLost(false)
  }, [initialFormData, initialImages, images])

  return (
    <ProjectDraftContext.Provider value={{
      formData,
      setFormData,
      images,
      setImages,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      draftKey,
      resetDraft,
      imagesHaveLost,
    }}>
      {children}
    </ProjectDraftContext.Provider>
  )
}

// ─── Hook for safe image manipulation ────────────────────────────────────────

export function useImageManager() {
  const { images, setImages, setHasUnsavedChanges } = useProjectDraft()

  const addLocalImages = useCallback((files: File[]) => {
    setImages(prev => {
      const newItems: LocalImageItem[] = files.map((file, idx) => ({
        kind: 'local',
        localId: `local-${Date.now()}-${idx}`,
        file,
        objectUrl: URL.createObjectURL(file),
        alt: '',
        caption: '',
        is_cover: prev.length === 0 && idx === 0, // auto-set cover for first image
        display_order: prev.length + idx,
        uploadState: 'ready',
      }))
      return [...prev, ...newItems]
    })
    setHasUnsavedChanges(true)
  }, [setImages, setHasUnsavedChanges])

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const item = prev.find(img =>
        img.kind === 'local' ? img.localId === id : img.id === id
      )
      if (item?.kind === 'local') {
        try { URL.revokeObjectURL(item.objectUrl) } catch { /* ignore */ }
      }
      const filtered = prev.filter(img =>
        img.kind === 'local' ? img.localId !== id : img.id !== id
      )
      // If removed was cover, set first remaining as cover
      const hasCover = filtered.some(img => img.is_cover)
      if (!hasCover && filtered.length > 0) {
        return filtered.map((img, i) => i === 0 ? { ...img, is_cover: true } : img)
      }
      return filtered.map((img, i) => ({ ...img, display_order: i }))
    })
    setHasUnsavedChanges(true)
  }, [setImages, setHasUnsavedChanges])

  const setCover = useCallback((id: string) => {
    setImages(prev =>
      prev.map(img => ({
        ...img,
        is_cover: (img.kind === 'local' ? img.localId : img.id) === id,
      }))
    )
    setHasUnsavedChanges(true)
  }, [setImages, setHasUnsavedChanges])

  const updateImageMeta = useCallback((id: string, patch: { alt?: string; caption?: string }) => {
    setImages(prev =>
      prev.map(img => {
        const imgId = img.kind === 'local' ? img.localId : img.id
        return imgId === id ? { ...img, ...patch } : img
      })
    )
    setHasUnsavedChanges(true)
  }, [setImages, setHasUnsavedChanges])

  const moveImage = useCallback((id: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const idx = prev.findIndex(img =>
        (img.kind === 'local' ? img.localId : img.id) === id
      )
      if (idx === -1) return prev
      const newArr = [...prev]
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= newArr.length) return prev
      ;[newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]]
      return newArr.map((img, i) => ({ ...img, display_order: i }))
    })
    setHasUnsavedChanges(true)
  }, [setImages, setHasUnsavedChanges])

  return { images, addLocalImages, removeImage, setCover, updateImageMeta, moveImage }
}
