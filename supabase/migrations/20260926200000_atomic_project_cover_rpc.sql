-- Migration: Atomic project cover image update RPC
-- Studio AM — Garante que a troca de capa seja 100% transacional,
-- validando propriedade da imagem, serializando acessos do projeto e preservando permissões de admin.

CREATE OR REPLACE FUNCTION public.set_project_cover_image_atomic(
  p_project_id uuid,
  p_image_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_image_exists boolean;
  v_project_exists boolean;
BEGIN
  -- 1. Valida se o usuário autenticado é admin ativo (owner ou editor)
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: permissão de administrador necessária.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Serializa operações no mesmo projeto via lock de linha exclusivo na tabela projects
  SELECT EXISTS(
    SELECT 1 FROM public.projects
    WHERE id = p_project_id
    FOR UPDATE
  ) INTO v_project_exists;

  IF NOT v_project_exists THEN
    RAISE EXCEPTION 'Projeto não encontrado.'
      USING ERRCODE = 'P0002';
  END IF;

  -- 3. Valida se a imagem informada existe e pertence exatamente ao projeto informado
  SELECT EXISTS(
    SELECT 1 FROM public.project_images
    WHERE id = p_image_id AND project_id = p_project_id
  ) INTO v_image_exists;

  IF NOT v_image_exists THEN
    RAISE EXCEPTION 'Imagem não encontrada ou não pertence ao projeto informado.'
      USING ERRCODE = 'P0002';
  END IF;

  -- 4. Operação atômica dentro da transação:
  -- Remove a capa anterior e marca a nova
  UPDATE public.project_images
  SET is_cover = false
  WHERE project_id = p_project_id AND is_cover = true;

  UPDATE public.project_images
  SET is_cover = true
  WHERE id = p_image_id AND project_id = p_project_id;

  RETURN jsonb_build_object(
    'success', true,
    'project_id', p_project_id,
    'image_id', p_image_id
  );
END;
$$;

-- Restringe privilégios de execução
REVOKE ALL ON FUNCTION public.set_project_cover_image_atomic(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_project_cover_image_atomic(uuid, uuid) TO authenticated, postgres;
