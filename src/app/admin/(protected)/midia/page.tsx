import { AdminDemoBanner, AdminSectionHeader, AdminCard } from '../_components/AdminSharedUI'
import { DEMO_IDS, demoThumbnails, isDemoMode } from '../_fixtures/demo-projects'

import { AdminDemoNoticeButton } from '../_components/AdminDemoNoticeButton'

interface PageProps {
  searchParams: Promise<{ visual?: string }>
}

export default async function AdminMidiaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isDemo = params.visual === 'demo' && isDemoMode()

  return (
    <div className="space-y-6">
      {isDemo && <AdminDemoBanner />}
      <AdminSectionHeader 
        title="Biblioteca de Mídia" 
        subtitle="Gerencie imagens e arquivos usados em todo o site."
        action={<AdminDemoNoticeButton label="Upload de arquivo" actionName="Upload de arquivo" />}
      />
      
      <AdminCard className="p-1 mb-4 flex items-center justify-between">
         <div className="flex px-3 gap-4 text-sm font-medium" style={{ color: 'var(--admin-muted)' }}>
             <span className="text-black border-b-2 border-black pb-2 pt-2 cursor-pointer">Todas as imagens</span>
             <span className="pb-2 pt-2 cursor-pointer hover:text-black">Documentos</span>
             <span className="pb-2 pt-2 cursor-pointer hover:text-black">Não utilizados</span>
         </div>
         <div className="px-3 py-2 flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>Filtrar por:</span>
            <select className="text-xs border p-1 rounded">
               <option>Mais recentes</option>
               <option>Tamanho (maior)</option>
            </select>
         </div>
      </AdminCard>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => i).map((i) => (
             <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden relative group">
                 <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${demoThumbnails[DEMO_IDS[i % DEMO_IDS.length]]}')`}}></div>
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white text-xs font-medium border border-white px-3 py-1 rounded hover:bg-white hover:text-black cursor-pointer">Ver detalhes</span>
                 </div>
             </div>
          ))}
      </div>
    </div>
  )
}
