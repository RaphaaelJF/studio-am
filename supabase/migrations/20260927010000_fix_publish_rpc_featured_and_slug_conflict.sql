-- Migration: Fix p_featured default and handle slug conflict in publish_project_atomic
-- Studio AM — Arquitetura + Engenharia

-- 1. Redefine publish_project_atomic with p_featured DEFAULT NULL and explicit slug conflict check
CREATE OR REPLACE FUNCTION public.publish_project_atomic(
  p_project_id uuid,
  p_featured boolean DEFAULT NULL,
  p_display_order integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_proj record;
  v_pub_id uuid;
  v_has_cover boolean;
  v_img_count integer;
  v_conflict_proj_id uuid;
BEGIN
  -- 1. Permissão de admin
  IF public.is_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'Acesso não autorizado: perfil administrativo ativo necessário.';
  END IF;

  -- 2. Lock no projeto de trabalho
  SELECT * INTO v_proj
  FROM public.projects
  WHERE id = p_project_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Projeto não encontrado: %', p_project_id;
  END IF;

  -- 3. Validações de obrigatoriedade
  IF trim(coalesce(v_proj.title, '')) = '' THEN
    RAISE EXCEPTION 'Título é obrigatório para publicação.';
  END IF;
  IF trim(coalesce(v_proj.slug, '')) = '' THEN
    RAISE EXCEPTION 'Slug é obrigatório para publicação.';
  END IF;
  IF trim(coalesce(v_proj.category, '')) = '' THEN
    RAISE EXCEPTION 'Categoria é obrigatória para publicação.';
  END IF;
  IF trim(coalesce(v_proj.summary, '')) = '' THEN
    RAISE EXCEPTION 'Resumo é obrigatório para publicação.';
  END IF;
  IF trim(coalesce(v_proj.description, '')) = '' THEN
    RAISE EXCEPTION 'Descrição é obrigatória para publicação.';
  END IF;

  -- 4. Validação de conflito de slug em project_publications
  SELECT project_id INTO v_conflict_proj_id
  FROM public.project_publications
  WHERE slug = v_proj.slug AND project_id != p_project_id;

  IF FOUND THEN
    RAISE EXCEPTION 'Este slug já está em uso por outro projeto publicado.';
  END IF;

  -- 5. Valida imagens do rascunho
  SELECT count(*), bool_or(is_cover)
  INTO v_img_count, v_has_cover
  FROM public.project_images
  WHERE project_id = p_project_id;

  IF v_img_count = 0 THEN
    RAISE EXCEPTION 'Adicione ao menos uma imagem antes de publicar.';
  END IF;
  IF v_has_cover IS NOT TRUE THEN
    RAISE EXCEPTION 'Defina uma imagem de capa antes de publicar.';
  END IF;

  -- 6. Upsert em project_publications
  INSERT INTO public.project_publications (
    project_id,
    slug,
    title,
    summary,
    description,
    category,
    location,
    year,
    area,
    featured,
    display_order,
    published_at,
    updated_at
  )
  VALUES (
    p_project_id,
    v_proj.slug,
    v_proj.title,
    v_proj.summary,
    v_proj.description,
    v_proj.category,
    v_proj.location,
    v_proj.year,
    v_proj.area,
    coalesce(p_featured, v_proj.featured),
    coalesce(p_display_order, v_proj.display_order),
    now(),
    now()
  )
  ON CONFLICT (project_id) DO UPDATE SET
    slug = EXCLUDED.slug,
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    location = EXCLUDED.location,
    year = EXCLUDED.year,
    area = EXCLUDED.area,
    featured = EXCLUDED.featured,
    display_order = EXCLUDED.display_order,
    published_at = EXCLUDED.published_at,
    updated_at = EXCLUDED.updated_at
  RETURNING id INTO v_pub_id;

  -- 7. Substitui imagens publicadas atomicamente
  DELETE FROM public.project_publication_images
  WHERE publication_id = v_pub_id;

  INSERT INTO public.project_publication_images (
    publication_id,
    storage_path,
    alt,
    caption,
    display_order,
    is_cover
  )
  SELECT
    v_pub_id,
    storage_path,
    alt,
    caption,
    display_order,
    is_cover
  FROM public.project_images
  WHERE project_id = p_project_id
  ORDER BY display_order ASC;

  -- 8. Atualiza status na tabela de trabalho
  UPDATE public.projects
  SET
    status = 'published',
    featured = coalesce(p_featured, v_proj.featured),
    display_order = coalesce(p_display_order, v_proj.display_order),
    published_at = now()
  WHERE id = p_project_id;

  RETURN v_pub_id;
END;
$$;

REVOKE ALL ON FUNCTION public.publish_project_atomic(uuid, boolean, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_project_atomic(uuid, boolean, integer) TO authenticated, postgres;
