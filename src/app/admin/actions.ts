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
    const displayName = (formData.get('name') as string)?.trim() || 'Usuário de Demonstração'

    // Define cookie temporário seguro para navegação demonstrativa
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

  // Fluxo normal por email e senha para Production / Supabase Auth real
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
  const inTestMode = await checkIsTestMode()
  if (!inTestMode) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  const cookieStore = await cookies()
  cookieStore.delete('admin_display_name')

  redirect('/admin/login')
}
