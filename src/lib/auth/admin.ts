import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export type AdminRole = 'owner' | 'editor'

export type AdminProfile = {
  id: string
  display_name: string
  role: AdminRole
  active: boolean
}

export async function requireAdminProfile(): Promise<AdminProfile> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, role, active')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !profile || profile.active !== true) {
    redirect('/admin/access-denied')
  }

  // Se o modo de teste estiver ativo (apenas fora de produção) e houver nome temporário definido
  if (process.env.VERCEL_ENV !== 'production' && process.env.ADMIN_TEST_MODE === 'true') {
    const cookieStore = await cookies()
    const customName = cookieStore.get('admin_display_name')?.value?.trim()
    if (customName) {
      return {
        ...(profile as AdminProfile),
        display_name: customName,
      }
    }
  }

  return profile as AdminProfile
}
