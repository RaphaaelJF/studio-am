import React from 'react'
import { AdminDemoBanner, AdminSectionHeader, AdminCard, AdminPrimaryButton, AdminSecondaryButton } from '../_components/AdminSharedUI'
import { isDemoMode } from '../_fixtures/demo-projects'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminConfiguracoesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Configurações Gerais" 
        subtitle="Identidade, contato e integrações do site."
        action={<AdminPrimaryButton>Salvar todas as configurações</AdminPrimaryButton>}
      />
      
      <div className="grid md:grid-cols-2 gap-6 items-start">
         <div className="space-y-6">
             <AdminCard className="p-6">
                 <h3 className="font-semibold text-sm mb-4">Informações da Empresa</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-medium text-gray-500 mb-1">Nome Fantasia</label>
                         <input type="text" defaultValue="Studio AM" className="w-full text-sm p-2 border rounded bg-gray-50 text-black outline-none" />
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-gray-500 mb-1">Descrição Curta (SEO)</label>
                         <textarea rows={2} defaultValue="Arquitetura que conecta. Engenharia que sustenta." className="w-full text-sm p-2 border rounded bg-gray-50 text-black outline-none" />
                     </div>
                 </div>
                 <div className="mt-4 flex justify-end"><AdminSecondaryButton>Atualizar informações</AdminSecondaryButton></div>
             </AdminCard>
             
             <AdminCard className="p-6">
                 <h3 className="font-semibold text-sm mb-4">Dados de Contato</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp (Principal CTA)</label>
                         <input type="text" defaultValue="+55 31 99999-9999" className="w-full text-sm p-2 border rounded bg-gray-50 text-black outline-none" />
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-gray-500 mb-1">E-mail Corporativo</label>
                         <input type="email" defaultValue="contato@studioam.com.br" className="w-full text-sm p-2 border rounded bg-gray-50 text-black outline-none" />
                     </div>
                 </div>
                 <div className="mt-4 flex justify-end"><AdminSecondaryButton>Atualizar contato</AdminSecondaryButton></div>
             </AdminCard>
         </div>
         
         <div className="space-y-6">
            <AdminCard className="p-6">
                 <h3 className="font-semibold text-sm mb-4">Integrações & Domínio</h3>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 border rounded">
                         <div>
                             <p className="text-sm font-medium">Google Analytics 4</p>
                             <p className="text-xs text-gray-500">ID: G-XXXXXX123</p>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-1 rounded">Conectado</span>
                     </div>
                     <div className="flex items-center justify-between p-3 border rounded">
                         <div>
                             <p className="text-sm font-medium">Domínio Principal</p>
                             <p className="text-xs text-gray-500">www.studioam.com.br</p>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-1 rounded">Ativo</span>
                     </div>
                 </div>
             </AdminCard>
         </div>
      </div>
    </div>
  )
}
