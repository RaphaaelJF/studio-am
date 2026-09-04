import React from 'react'
import { AdminDemoBanner, AdminSectionHeader, AdminCard, AdminSecondaryButton } from '../_components/AdminSharedUI'
import { isDemoMode } from '../_fixtures/demo-projects'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminPaginasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  const paginas = [
    { title: 'Home', path: '/', status: 'Publicado' },
    { title: 'Sobre', path: '/studio', status: 'Publicado' },
    { title: 'Serviços', path: '/metodo', status: 'Publicado' },
    { title: 'Processo', path: '/metodo', status: 'Rascunho' },
    { title: 'Contato', path: '/contato', status: 'Publicado' },
  ]

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Páginas Institucionais" 
        subtitle="Gerencie o conteúdo das páginas estáticas do site."
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
         {paginas.map((pagina) => (
             <AdminCard key={pagina.title} className="p-5 flex flex-col justify-between h-32">
                <div>
                   <div className="flex items-start justify-between mb-2">
                       <h3 className="font-semibold text-sm" style={{ color: 'var(--admin-text)' }}>{pagina.title}</h3>
                       <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${pagina.status === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{pagina.status}</span>
                   </div>
                   <p className="text-xs font-mono" style={{ color: 'var(--admin-muted)' }}>{pagina.path}</p>
                </div>
                <div className="flex justify-end">
                    <AdminSecondaryButton>Editar conteúdo</AdminSecondaryButton>
                </div>
             </AdminCard>
         ))}
      </div>
    </div>
  )
}
