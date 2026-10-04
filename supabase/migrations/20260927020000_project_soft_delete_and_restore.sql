-- Migration: Soft delete and restoration for projects
-- Studio AM — Arquitetura + Engenharia

-- 1. Add deleted_at column to public.projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

CREATE INDEX IF NOT EXISTS projects_deleted_at_idx
  ON public.projects (deleted_at);

-- 2. RPC function to safely soft-delete a project
CREATE OR REPLACE FUNCTION public.soft_delete_project_atomic(
  p_project_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- 1. Permissão de admin
  IF public.is_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'Acesso não autorizado: perfil administrativo ativo necessário.';
  END IF;

  -- 2. Remove imediatamente a publicação ativa (em cascata limpa project_publication_images)
  DELETE FROM public.project_publications
  WHERE project_id = p_project_id;

  -- 3. Marca deleted_at na tabela projects
  UPDATE public.projects
  SET
    deleted_at = now(),
    status = 'draft',
    featured = false
  WHERE id = p_project_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.soft_delete_project_atomic(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_project_atomic(uuid) TO authenticated, postgres;

-- 3. RPC function to restore a soft-deleted project
CREATE OR REPLACE FUNCTION public.restore_project_atomic(
  p_project_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- 1. Permissão de admin
  IF public.is_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'Acesso não autorizado: perfil administrativo ativo necessário.';
  END IF;

  -- 2. Restaura deleted_at para NULL e força status como 'draft'
  UPDATE public.projects
  SET
    deleted_at = NULL,
    status = 'draft',
    featured = false
  WHERE id = p_project_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_project_atomic(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restore_project_atomic(uuid) TO authenticated, postgres;
