/**
 * Chave única do modo de acesso ao painel administrativo.
 *
 * true  -> acesso temporário por nome (sem e-mail/senha, sem Supabase Auth).
 * false -> login real com e-mail + senha via Supabase Auth (código preservado
 *          em actions.ts, LoginForm.tsx, middleware e requireAdminProfile).
 *
 * Para reativar a autenticação real na hospedagem definitiva, basta mudar
 * para false.
 */
export const ADMIN_NAME_LOGIN_ENABLED = true

export function isNameLoginEnabled(): boolean {
  return ADMIN_NAME_LOGIN_ENABLED
}
