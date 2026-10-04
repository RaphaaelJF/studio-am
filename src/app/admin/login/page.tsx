'use client'

import { useState, useEffect } from 'react'
import { loginAction, checkIsTestMode } from '../actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)

  useEffect(() => {
    checkIsTestMode().then(setIsTestMode)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-[#1A1A1A]">
      <div className="w-full max-w-md bg-white border border-[#E5E0D8] p-8 rounded-sm shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium tracking-wide text-[#1A1A1A] uppercase">
            Studio AM
          </h1>
          <p className="text-xs text-[#706F6C] mt-1 tracking-wider uppercase">
            Painel Administrativo
          </p>
          {isTestMode && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Modo de Teste Temporário Ativo
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FDF2F2] border border-[#F87171]/20 text-[#991B1B] text-xs font-medium rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isTestMode ? (
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[#4A4947] uppercase tracking-wider mb-2"
              >
                Seu Nome para Identificação
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#E5E0D8] text-sm text-[#1A1A1A] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                placeholder="Ex: Anne Martins, Raphael..."
              />
              <p className="text-[11px] text-[#706F6C] mt-1.5">
                Neste modo de teste não é exigida senha. Digite qualquer nome para entrar.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[#4A4947] uppercase tracking-wider mb-2"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#E5E0D8] text-sm text-[#1A1A1A] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#4A4947] uppercase tracking-wider mb-2"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#E5E0D8] text-sm text-[#1A1A1A] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#333333] transition-colors disabled:opacity-50 rounded-sm mt-4"
          >
            {loading ? 'Entrando...' : isTestMode ? 'Entrar no Painel' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
