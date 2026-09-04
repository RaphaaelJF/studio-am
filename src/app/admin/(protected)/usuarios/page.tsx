import React from 'react'
import { AdminDemoBanner, AdminSectionHeader, AdminCard, AdminPrimaryButton } from '../_components/AdminSharedUI'
import { isDemoMode } from '../_fixtures/demo-projects'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminUsuariosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  const usuarios = [
      { nome: 'Anne Martins', email: 'anne@studioam.com.br', papel: 'Owner', status: 'Ativo', ultimoAcesso: 'Hoje, 09:41' },
      { nome: 'Equipe Marketing', email: 'marketing@studioam.com.br', papel: 'Editor', status: 'Ativo', ultimoAcesso: 'Ontem, 16:30' },
      { nome: 'Desenvolvedor', email: 'dev@agencia.com', papel: 'Admin', status: 'Inativo', ultimoAcesso: 'Há 15 dias' },
  ]

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Usuários e Permissões" 
        subtitle="Controle de acesso à área administrativa."
        action={<AdminPrimaryButton>Convidar usuário</AdminPrimaryButton>}
      />
      
      <AdminCard className="admin-users-table overflow-hidden">
         <table className="hidden md:table w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
               <tr>
                  <th className="px-6 py-4 font-semibold">Usuário</th>
                  <th className="px-6 py-4 font-semibold">Papel</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Último Acesso</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {usuarios.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                          <p className="font-medium text-black">{u.nome}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${u.papel === 'Owner' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'}`}>{u.papel}</span>
                      </td>
                      <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-xs text-gray-600">
                              <span className={`w-2 h-2 rounded-full ${u.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              {u.status}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{u.ultimoAcesso}</td>
                      <td className="px-6 py-4 text-right">
                          <button className="text-xs font-medium text-gray-400 hover:text-black">Editar</button>
                      </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div className="md:hidden divide-y" style={{ borderColor: 'var(--admin-border)' }}>
            {usuarios.map((u) => (
              <article key={u.email} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-black truncate">{u.nome}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 px-2 py-1 rounded">{u.papel}</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-2"><i className={`w-2 h-2 rounded-full ${u.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'}`} />{u.status}</span>
                  <span>{u.ultimoAcesso}</span>
                </div>
              </article>
            ))}
         </div>
      </AdminCard>
    </div>
  )
}
