-- Migration: Dedicated publication snapshot tables with strict RLS isolation
-- Studio AM — Arquitetura + Engenharia
-- 1. Create table public.project_publications
CREATE TABLE IF NOT EXISTS public.project_publications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  summary text,
  description text,
  category text NOT NULL,
  location text,
  year integer,
  area text,
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_publications_pkey PRIMARY KEY (id),
  CONSTRAINT project_publications_project_id_key UNIQUE (project_id),
  CONSTRAINT project_publications_slug_key UNIQUE (slug),
  CONSTRAINT project_publications_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_publications_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT project_publications_category_not_empty CHECK (char_length(trim(category)) > 0),
  CONSTRAINT project_publications_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT project_publications_display_order_non_negative CHECK (display_order >= 0)
);

CREATE INDEX IF NOT EXISTS project_publications_display_order_idx
  ON public.project_publications (display_order, updated_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER on_project_publications_updated
  BEFORE UPDATE ON public.project_publications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Create table public.project_publication_images
CREATE TABLE IF NOT EXISTS public.project_publication_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL,
  storage_path text NOT NULL,
  alt text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_publication_images_pkey PRIMARY KEY (id),
  CONSTRAINT project_publication_images_pub_fkey FOREIGN KEY (publication_id)
    REFERENCES public.project_publications(id) ON DELETE CASCADE,
  CONSTRAINT project_publication_images_storage_path_not_empty CHECK (char_length(trim(storage_path)) > 0),
  CONSTRAINT project_publication_images_alt_not_empty CHECK (char_length(trim(alt)) > 0),
  CONSTRAINT project_publication_images_display_order_non_negative CHECK (display_order >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS project_publication_images_single_cover_idx
  ON public.project_publication_images (publication_id)
  WHERE (is_cover = true);

CREATE INDEX IF NOT EXISTS project_publication_images_order_idx
  ON public.project_publication_images (publication_id, display_order);

-- 3. Grants and Revokes
-- Work tables: revoke public/anon read
REVOKE ALL ON TABLE public.projects FROM anon;
REVOKE ALL ON TABLE public.project_images FROM anon;

-- Drop old public policies on work tables
DROP POLICY IF EXISTS "projects_public_select" ON public.projects;
DROP POLICY IF EXISTS "project_images_public_select" ON public.project_images;

-- Public tables: enable RLS
ALTER TABLE public.project_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_publication_images ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.project_publications FROM anon, authenticated;
REVOKE ALL ON TABLE public.project_publication_images FROM anon, authenticated;

-- Public read access on publications
GRANT SELECT ON TABLE public.project_publications TO anon, authenticated;
GRANT SELECT ON TABLE public.project_publication_images TO anon, authenticated;

-- Admin full access on publications
GRANT ALL ON TABLE public.project_publications TO authenticated, postgres, service_role;
GRANT ALL ON TABLE public.project_publication_images TO authenticated, postgres, service_role;

-- RLS Policies
CREATE POLICY "project_publications_public_select"
  ON public.project_publications
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "project_publications_admin_manage"
  ON public.project_publications
  FOR ALL
  TO authenticated
  USING (public.is_admin() IS TRUE)
  WITH CHECK (public.is_admin() IS TRUE);

CREATE POLICY "project_publication_images_public_select"
  ON public.project_publication_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "project_publication_images_admin_manage"
  ON public.project_publication_images
  FOR ALL
  TO authenticated
  USING (public.is_admin() IS TRUE)
  WITH CHECK (public.is_admin() IS TRUE);

-- 4. Initial Migration of existing published projects
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
SELECT
  id,
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
  coalesce(published_at, now()),
  updated_at
FROM public.projects
WHERE status = 'published'
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
  updated_at = EXCLUDED.updated_at;

-- Migrate images for those publications
INSERT INTO public.project_publication_images (
  publication_id,
  storage_path,
  alt,
  caption,
  display_order,
  is_cover,
  created_at
)
SELECT
  pub.id,
  img.storage_path,
  img.alt,
  img.caption,
  img.display_order,
  img.is_cover,
  img.created_at
FROM public.project_images img
JOIN public.project_publications pub ON pub.project_id = img.project_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.project_publication_images ex
  WHERE ex.publication_id = pub.id AND ex.storage_path = img.storage_path
);

-- 5. RPC function for atomic publish transaction
CREATE OR REPLACE FUNCTION public.publish_project_atomic(
  p_project_id uuid,
  p_featured boolean DEFAULT false,
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

  -- 4. Valida imagens do rascunho
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

  -- 5. Upsert em project_publications
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

  -- 6. Substitui imagens publicadas atomicamente
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

  -- 7. Atualiza status na tabela de trabalho
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

-- 6. RPC function for unpublish
CREATE OR REPLACE FUNCTION public.unpublish_project_atomic(
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

  -- 2. Remove da publicação (em cascata remove project_publication_images)
  DELETE FROM public.project_publications
  WHERE project_id = p_project_id;

  -- 3. Marca status como draft na tabela de trabalho
  UPDATE public.projects
  SET status = 'draft', featured = false
  WHERE id = p_project_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.unpublish_project_atomic(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unpublish_project_atomic(uuid) TO authenticated, postgres;
