'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { DashboardPage } from '@/components/pages/dashboard'
import { MembersPage } from '@/components/pages/members'
import { ContributionsPage } from '@/components/pages/contributions'
import { PayoutsPage } from '@/components/pages/payouts'

type PageType = 'dashboard' | 'members' | 'contributions' | 'payouts'

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

  return (
    <div className="flex min-h-screen bg-background text-foreground pt-16 lg:pt-0">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto w-full">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'members' && <MembersPage />}
        {currentPage === 'contributions' && <ContributionsPage />}
        {currentPage === 'payouts' && <PayoutsPage />}
      </main>
    </div>
  )
}
