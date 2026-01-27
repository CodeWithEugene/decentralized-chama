'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { DashboardPage } from '@/components/pages/dashboard'
import { MembersPage } from '@/components/pages/members'
import { ContributionsPage } from '@/components/pages/contributions'
import { PayoutsPage } from '@/components/pages/payouts'

type PageType = 'dashboard' | 'members' | 'contributions' | 'payouts'

import { TopBar } from '@/components/top-bar';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={isCollapsed}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          isSidebarCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-auto w-full">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'members' && <MembersPage />}
          {currentPage === 'contributions' && <ContributionsPage />}
          {currentPage === 'payouts' && <PayoutsPage />}
        </main>
      </div>
    </div>
  )
}
