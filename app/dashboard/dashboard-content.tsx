'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { MainContent } from './main-content'

export function DashboardContent() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} className="h-full" />
      <div className="flex-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  )
}