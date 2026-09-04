import React from 'react'
import { AdminDemoBanner, AdminSectionHeader, AdminCard, AdminPrimaryButton } from '../_components/AdminSharedUI'
import { demoProjects, demoThumbnails, isDemoMode } from '../_fixtures/demo-projects'
import type { DemoId } from '../_fixtures/demo-projects'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminDestaquesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Destaques da Home" 
        subtitle="Gerencie os projetos que aparecem na página inicial."
        action={<AdminPrimaryButton>Salvar Ordem</AdminPrimaryButton>}
      />
      
      <div className="max-w-3xl space-y-4">
        {demoProjects.slice(0, 4).map((p, i) => (
           <AdminCard key={p.id} className="admin-destaque-card cursor-move hover:bg-gray-50 transition-colors">
              <span className="text-base font-bold text-gray-400 text-center">{i + 1}</span>
              <div className="w-[64px] h-[56px] bg-gray-200 rounded overflow-hidden shrink-0">
                 <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${demoThumbnails[p.id as DemoId]}')`}}></div>
              </div>
              <div className="min-w-0 pr-2">
                 <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--admin-text)' }}>{p.title}</p>
                 <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>{p.category}</p>
              </div>
              <div className="w-[44px] h-[44px] flex items-center justify-center cursor-grab opacity-50 hover:opacity-100 justify-self-end">
                <span className="flex flex-col items-center justify-center gap-1">
                  <span className="w-4 h-0.5 bg-gray-500 block rounded-full"></span>
                  <span className="w-4 h-0.5 bg-gray-500 block rounded-full"></span>
                  <span className="w-4 h-0.5 bg-gray-500 block rounded-full"></span>
                </span>
              </div>
           </AdminCard>
        ))}
        
        <AdminCard className="p-6 border-dashed text-center mt-6">
           <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>Você pode adicionar mais 2 projetos à Home (total de 6).</p>
           <button className="mt-3 text-xs font-medium underline" style={{ color: 'var(--admin-text)' }}>Selecionar projeto</button>
        </AdminCard>
      </div>
    </div>
  )
}
