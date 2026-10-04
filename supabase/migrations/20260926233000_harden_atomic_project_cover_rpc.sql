-- Migration: Hardened atomic project cover image update RPC
-- Studio AM — Preserva migrações anteriores e fecha casos limites:
-- 1. Validação estrita contra NULL via `public.is_admin() IS NOT TRUE`.
-- 2. Bloqueio concorrente da imagem alvo com `FOR UPDATE` para impedir exclusão simultânea.
-- 3. Confirmação de que exatamente uma linha foi atualizada (GET DIAGNOSTICS), desfazendo a troca se não for.

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
  v_project_exists boolean;
  v_image_id uuid;
  v_rows_updated integer;
BEGIN
  -- 1. Validação estrita de autorização: nega explicitamente se for false OU null
  IF public.is_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'Acesso negado: permissão de administrador necessária.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Serializa operações concorrentes no projeto via lock exclusivo de linha (FOR UPDATE)
  SELECT EXISTS(
    SELECT 1 FROM public.projects
    WHERE id = p_project_id
    FOR UPDATE
  ) INTO v_project_exists;

  IF NOT v_project_exists THEN
    RAISE EXCEPTION 'Projeto não encontrado.'
      USING ERRCODE = 'P0002';
  END IF;

  -- 3. Valida se a imagem pertence ao projeto e adquire lock de linha na imagem (FOR UPDATE)
  -- Isso impede exclusão ou alteração simultânea da imagem alvo por outra transação
  SELECT id INTO v_image_id
  FROM public.project_images
  WHERE id = p_image_id AND project_id = p_project_id
  FOR UPDATE;

  IF v_image_id IS NULL THEN
    RAISE EXCEPTION 'Imagem não encontrada ou não pertence ao projeto informado.'
      USING ERRCODE = 'P0002';
  END IF;

  -- 4. Desmarca a capa anterior dentro da transação atômica
  UPDATE public.project_images
  SET is_cover = false
  WHERE project_id = p_project_id AND is_cover = true;

  -- 5. Marca a nova capa e valida estritamente a afetação de exatamente 1 linha
  UPDATE public.project_images
  SET is_cover = true
  WHERE id = p_image_id AND project_id = p_project_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  IF v_rows_updated <> 1 THEN
    RAISE EXCEPTION 'Falha ao definir nova capa: esperado 1 registro alterado, obtido %.', v_rows_updated
      USING ERRCODE = 'P0001';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'project_id', p_project_id,
    'image_id', p_image_id
  );
END;
$$;

-- Preserva permissões existentes
REVOKE ALL ON FUNCTION public.set_project_cover_image_atomic(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_project_cover_image_atomic(uuid, uuid) TO authenticated, postgres;
