'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function checkIsTestMode(): Promise<boolean> {
  // Bloqueado estritamente em produção real (Vercel Production)
  if (process.env.VERCEL_ENV === 'production') return false
  return process.env.ADMIN_TEST_MODE === 'true'
}

export async function loginAction(formData: FormData) {
  const inTestMode = await checkIsTestMode()

  if (inTestMode) {
    const displayName = (formData.get('name') as string)?.trim() || 'Usuário de Teste'
    const testEmail = process.env.ADMIN_TEST_EMAIL?.trim()
    const testPassword = process.env.ADMIN_TEST_PASSWORD?.trim()

    if (!testEmail || !testPassword) {
      console.error('[admin:login] ADMIN_TEST_MODE está ativo, mas ADMIN_TEST_EMAIL ou ADMIN_TEST_PASSWORD não foram configurados no servidor.')
      return { error: 'Configuração da conta técnica de teste incompleta no servidor.' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    if (error) {
      console.error('[admin:login] Falha ao autenticar conta técnica de teste no Supabase Auth:', error.message)
      return { error: 'Falha na autenticação da conta de teste no Supabase. Verifique se o provider Email está ativado e as credenciais corretas.' }
    }

    // Grava o nome digitado em cookie HTTP-only seguro apenas para exibição na UI
    const cookieStore = await cookies()
    cookieStore.set('admin_display_name', displayName, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    redirect('/admin')
  }

  // Fluxo normal por email e senha
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Preencha todos os campos.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciais inválidas ou falha na autenticação.' }
  }

  const cookieStore = await cookies()
  cookieStore.delete('admin_display_name')

  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.delete('admin_display_name')

  redirect('/admin/login')
}
