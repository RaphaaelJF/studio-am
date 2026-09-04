-- Migration: Foundation for projects module (projects and project_images)
-- Studio AM — Arquitetura + Engenharia

-- 1. Enum for publication status
CREATE TYPE public.project_status AS ENUM ('draft', 'published');

-- 2. Projects table
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  summary text,
  description text,
  category text NOT NULL,
  location text,
  year integer,
  area text,
  status public.project_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_slug_key UNIQUE (slug),
  CONSTRAINT projects_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT projects_category_not_empty CHECK (char_length(trim(category)) > 0),
  CONSTRAINT projects_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT projects_display_order_non_negative CHECK (display_order >= 0)
);

-- 3. Project images table
CREATE TABLE public.project_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  storage_path text NOT NULL,
  alt text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_images_pkey PRIMARY KEY (id),
  CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_images_storage_path_not_empty CHECK (char_length(trim(storage_path)) > 0),
  CONSTRAINT project_images_alt_not_empty CHECK (char_length(trim(alt)) > 0),
  CONSTRAINT project_images_display_order_non_negative CHECK (display_order >= 0)
);

-- 4. Constraint: At most one cover image per project (enforced through partial unique index)
CREATE UNIQUE INDEX project_images_single_cover_idx
  ON public.project_images (project_id)
  WHERE (is_cover = true);

-- 5. Query Optimization Indexes
CREATE INDEX projects_status_display_order_idx
  ON public.projects (status, display_order);

CREATE INDEX project_images_project_order_idx
  ON public.project_images (project_id, display_order);

-- 6. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

CREATE TRIGGER on_projects_updated
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_project_images_updated
  BEFORE UPDATE ON public.project_images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- 8. Helper function to verify active admin role (owner or editor)
-- Reutiliza public.current_user_role(), que valida auth.uid() e active = true
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT coalesce(
    public.current_user_role() IN ('owner'::public.app_role, 'editor'::public.app_role),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, postgres;

-- 9. Table Grants
REVOKE ALL ON TABLE public.projects FROM anon, authenticated;
REVOKE ALL ON TABLE public.project_images FROM anon, authenticated;

GRANT SELECT ON TABLE public.projects TO anon;
GRANT SELECT ON TABLE public.project_images TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.projects TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.project_images TO authenticated;

GRANT ALL ON TABLE public.projects TO postgres, service_role;
GRANT ALL ON TABLE public.project_images TO postgres, service_role;

-- 10. Policies for public.projects

-- Public / Anonymous can read only published projects
CREATE POLICY "projects_public_select" ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Active Admins (owner or editor) have full access to select, insert, update, delete
CREATE POLICY "projects_admin_manage" ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11. Policies for public.project_images

-- Public / Anonymous can read images belonging to published projects
CREATE POLICY "project_images_public_select" ON public.project_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.project_images.project_id
        AND public.projects.status = 'published'
    )
  );

-- Active Admins (owner or editor) have full access to project images
CREATE POLICY "project_images_admin_manage" ON public.project_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
