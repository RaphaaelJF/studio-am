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
  const isTestMode =
    process.env.VERCEL_ENV !== 'production' &&
    process.env.ADMIN_TEST_MODE === 'true'

  if (isTestMode) {
    const cookieStore = await cookies()
    const customName = cookieStore.get('admin_display_name')?.value?.trim()
    if (customName) {
      return {
        id: '00000000-0000-0000-0000-000000000000',
        display_name: customName,
        role: 'editor',
        active: true,
      }
    }
  }

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

  return profile as AdminProfile
}
