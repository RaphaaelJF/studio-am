-- Migration: Storage bucket for project images (real version)
-- Studio AM — permite que a cliente troque imagens pelo painel admin

-- 1. Bucket público para leitura (URLs públicas usadas no site)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Leitura pública: qualquer pessoa pode ver imagens do bucket
DROP POLICY IF EXISTS "project_images_public_read" ON storage.objects;
CREATE POLICY "project_images_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-images');

-- 3. Escrita: só admin ativo (owner/editor) pode enviar
DROP POLICY IF EXISTS "project_images_admin_insert" ON storage.objects;
CREATE POLICY "project_images_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND public.is_admin()
);

-- 4. Atualização: só admin ativo
DROP POLICY IF EXISTS "project_images_admin_update" ON storage.objects;
CREATE POLICY "project_images_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'project-images'
  AND public.is_admin()
);

-- 5. Remoção: só admin ativo
DROP POLICY IF EXISTS "project_images_admin_delete" ON storage.objects;
CREATE POLICY "project_images_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND public.is_admin()
);
