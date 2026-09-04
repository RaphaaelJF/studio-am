import { logoutAction } from '../actions'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-[#1A1A1A]">
      <div className="w-full max-w-md bg-white border border-[#E5E0D8] p-8 rounded-sm shadow-sm text-center">
        <div className="mb-6">
          <h1 className="text-xl font-medium tracking-wide text-[#1A1A1A] uppercase">
            Studio AM
          </h1>
          <p className="text-xs text-[#706F6C] mt-1 tracking-wider uppercase">
            Painel Administrativo
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm text-[#4A4947] leading-relaxed">
            Sua conta não possui acesso ativo ao painel administrativo.
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#333333] transition-colors rounded-sm"
          >
            Sair
          </button>
        </form>
      </div>
    </div>
  )
}
