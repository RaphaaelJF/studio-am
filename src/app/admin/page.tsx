import { createClient } from '@/lib/supabase/server'
import { logoutAction } from './actions'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E0D8] p-8 rounded-sm shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-6 mb-6">
          <div>
            <h1 className="text-xl font-medium tracking-wide text-[#1A1A1A] uppercase">
              STUDIO AM
            </h1>
            <p className="text-xs text-[#706F6C] mt-1 tracking-wider uppercase">
              Painel Administrativo
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-transparent border border-[#E5E0D8] text-[#1A1A1A] text-xs font-medium uppercase tracking-wider hover:bg-[#FDFBF7] transition-colors rounded-sm"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-[#4A4947]">
            Usuário autenticado: <span className="font-mono text-xs text-[#1A1A1A]">{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
