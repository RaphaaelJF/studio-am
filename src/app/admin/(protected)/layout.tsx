import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { requireAdminProfile } from '@/lib/auth/admin'
import { AdminHeader } from './_components/AdminHeader'
import { AdminSidebar } from './_components/AdminSidebar'
import { AdminWorkspaceFrame } from './_components/AdminWorkspaceFrame'
import { AdminWorkflowFooter } from './_components/AdminWorkflowFooter'
import { AdminToastProvider } from './_components/AdminToastContext'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireAdminProfile()

  return (
    <AdminToastProvider>
      <div className="admin-board">
        <div className="admin-board-brand">
          <Link
            href="/admin"
            className="flex items-center justify-center w-full"
            aria-label="Ir para o painel Studio AM"
          >
            <Image
              src="/brand/studio-am-logo.png"
              alt="Studio AM — Arquitetura e Engenharia"
              width={2048}
              height={1054}
              priority
              className="h-auto w-[170px] object-contain"
            />
          </Link>
        </div>
        <AdminHeader profile={profile} />
        <AdminSidebar profile={profile} />
        <main className="admin-board-workspace">
          <AdminWorkspaceFrame>
            {children}
          </AdminWorkspaceFrame>
        </main>
        <AdminWorkflowFooter />
      </div>
    </AdminToastProvider>
  )
}
