-- Migration: Analytics Events & Aggregated Metrics
-- Studio AM — Arquitetura + Engenharia

-- 1. Create table public.analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  path text NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  visitor_id uuid NOT NULL,
  session_id uuid NOT NULL,
  referrer_source text NOT NULL DEFAULT 'direct',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT analytics_events_event_name_check CHECK (
    event_name IN ('page_view', 'project_view', 'contact_click', 'whatsapp_click', 'instagram_click')
  ),
  CONSTRAINT analytics_events_path_not_empty CHECK (char_length(trim(path)) > 0),
  CONSTRAINT analytics_events_referrer_source_check CHECK (
    referrer_source IN ('google', 'instagram', 'direct', 'other')
  )
);

-- 2. Indexes for fast aggregation
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx 
  ON public.analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_event_name_created_idx 
  ON public.analytics_events (event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_project_id_created_idx 
  ON public.analytics_events (project_id, created_at DESC) 
  WHERE project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS analytics_events_visitor_session_idx 
  ON public.analytics_events (visitor_id, session_id);

-- 3. Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4. Permissions and Policies
-- Regra estrita: Anônimos NÃO podem consultar nem inserir diretamente via PostgREST.
REVOKE ALL ON TABLE public.analytics_events FROM anon, authenticated;

-- Somente admins podem consultar dados de analytics
CREATE POLICY "analytics_events_admin_select" ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 5. RPC to ingest an event safely
-- O endpoint /api/telemetry valida o payload no servidor e chama esta RPC.
-- Com SECURITY DEFINER, ela grava com segurança sem expor permissão de INSERT a clientes web.
CREATE OR REPLACE FUNCTION public.record_analytics_event(
  p_event_name text,
  p_path text,
  p_project_id uuid,
  p_visitor_id uuid,
  p_session_id uuid,
  p_referrer_source text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Validações de integridade
  IF p_event_name NOT IN ('page_view', 'project_view', 'contact_click', 'whatsapp_click', 'instagram_click') THEN
    RAISE EXCEPTION 'Nome de evento inválido: %', p_event_name;
  END IF;

  IF p_referrer_source NOT IN ('google', 'instagram', 'direct', 'other') THEN
    p_referrer_source := 'other';
  END IF;

  IF trim(coalesce(p_path, '')) = '' THEN
    p_path := '/';
  END IF;

  -- Se project_id foi fornecido, garante que exista em projects
  IF p_project_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE id = p_project_id) THEN
      p_project_id := NULL;
    END IF;
  END IF;

  INSERT INTO public.analytics_events (
    event_name,
    path,
    project_id,
    visitor_id,
    session_id,
    referrer_source,
    created_at
  )
  VALUES (
    p_event_name,
    p_path,
    p_project_id,
    p_visitor_id,
    p_session_id,
    p_referrer_source,
    now()
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.record_analytics_event(text, text, uuid, uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_analytics_event(text, text, uuid, uuid, uuid, text) TO anon, authenticated, postgres;

-- 6. RPC to retrieve aggregated site & project metrics
-- Apenas administradores autenticados podem consultar as métricas.
CREATE OR REPLACE FUNCTION public.get_site_analytics_summary()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_res jsonb;
  v_now timestamp with time zone := now();
  v_7d timestamp with time zone := v_now - interval '7 days';
  v_30d timestamp with time zone := v_now - interval '30 days';

  v_views_total bigint;
  v_views_7d bigint;
  v_views_30d bigint;

  v_visits_total bigint;
  v_visits_7d bigint;
  v_visits_30d bigint;

  v_visitors_total bigint;
  v_visitors_7d bigint;
  v_visitors_30d bigint;

  v_top_pages jsonb;
  v_referrers jsonb;
  v_projects_performance jsonb;

  v_clicks_iniciar_projeto bigint;
  v_clicks_whatsapp bigint;
  v_clicks_instagram bigint;
BEGIN
  IF public.is_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'Acesso não autorizado: perfil administrativo ativo necessário.';
  END IF;

  -- 1. Visualizações (page_view)
  SELECT
    count(*),
    count(*) FILTER (WHERE created_at >= v_7d),
    count(*) FILTER (WHERE created_at >= v_30d)
  INTO
    v_views_total,
    v_views_7d,
    v_views_30d
  FROM public.analytics_events
  WHERE event_name = 'page_view';

  -- 2. Visitas (COUNT DISTINCT session_id)
  SELECT
    count(DISTINCT session_id),
    count(DISTINCT session_id) FILTER (WHERE created_at >= v_7d),
    count(DISTINCT session_id) FILTER (WHERE created_at >= v_30d)
  INTO
    v_visits_total,
    v_visits_7d,
    v_visits_30d
  FROM public.analytics_events;

  -- 3. Visitantes únicos (COUNT DISTINCT visitor_id)
  SELECT
    count(DISTINCT visitor_id),
    count(DISTINCT visitor_id) FILTER (WHERE created_at >= v_7d),
    count(DISTINCT visitor_id) FILTER (WHERE created_at >= v_30d)
  INTO
    v_visitors_total,
    v_visitors_7d,
    v_visitors_30d
  FROM public.analytics_events;

  -- 4. Top páginas mais acessadas
  SELECT coalesce(jsonb_agg(sub), '[]'::jsonb)
  INTO v_top_pages
  FROM (
    SELECT path, count(*) as views
    FROM public.analytics_events
    WHERE event_name = 'page_view'
    GROUP BY path
    ORDER BY views DESC
    LIMIT 5
  ) sub;

  -- 5. Origem principal (Google, Instagram, Direto, Outros)
  SELECT coalesce(jsonb_agg(sub), '[]'::jsonb)
  INTO v_referrers
  FROM (
    SELECT referrer_source as source, count(DISTINCT session_id) as visits
    FROM public.analytics_events
    GROUP BY referrer_source
    ORDER BY visits DESC
  ) sub;

  -- 6. Cliques de conversão
  SELECT
    count(*) FILTER (WHERE event_name = 'contact_click'),
    count(*) FILTER (WHERE event_name = 'whatsapp_click'),
    count(*) FILTER (WHERE event_name = 'instagram_click')
  INTO
    v_clicks_iniciar_projeto,
    v_clicks_whatsapp,
    v_clicks_instagram
  FROM public.analytics_events;

  -- 7. Desempenho por Projeto (visualizações e cliques atribuídos)
  SELECT coalesce(jsonb_agg(sub), '[]'::jsonb)
  INTO v_projects_performance
  FROM (
    SELECT
      p.id as project_id,
      p.title,
      p.slug,
      count(*) FILTER (WHERE e.event_name = 'project_view') as views_total,
      count(*) FILTER (WHERE e.event_name = 'project_view' AND e.created_at >= v_7d) as views_7d,
      count(*) FILTER (WHERE e.event_name = 'project_view' AND e.created_at >= v_30d) as views_30d,
      count(*) FILTER (WHERE e.event_name = 'contact_click') as contact_clicks,
      count(*) FILTER (WHERE e.event_name = 'whatsapp_click') as whatsapp_clicks
    FROM public.projects p
    LEFT JOIN public.analytics_events e ON e.project_id = p.id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id, p.title, p.slug
    ORDER BY views_total DESC, p.title ASC
  ) sub;

  v_res := jsonb_build_object(
    'views', jsonb_build_object(
      'total', v_views_total,
      'last_7d', v_views_7d,
      'last_30d', v_views_30d
    ),
    'visits', jsonb_build_object(
      'total', v_visits_total,
      'last_7d', v_visits_7d,
      'last_30d', v_visits_30d
    ),
    'visitors', jsonb_build_object(
      'total', v_visitors_total,
      'last_7d', v_visitors_7d,
      'last_30d', v_visitors_30d
    ),
    'top_pages', v_top_pages,
    'referrers', v_referrers,
    'conversion_clicks', jsonb_build_object(
      'iniciar_projeto', v_clicks_iniciar_projeto,
      'whatsapp', v_clicks_whatsapp,
      'instagram', v_clicks_instagram
    ),
    'projects', v_projects_performance
  );

  RETURN v_res;
END;
$$;

REVOKE ALL ON FUNCTION public.get_site_analytics_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_analytics_summary() TO authenticated, postgres;
