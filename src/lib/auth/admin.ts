import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return profile as AdminProfile
}
