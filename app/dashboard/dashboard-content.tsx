'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { MainContent } from './main-content'

export function DashboardContent() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <MainContent />
    </div>
  )
}