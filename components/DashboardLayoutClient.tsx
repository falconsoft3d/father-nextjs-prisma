"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"

interface DashboardLayoutClientProps {
  userName?: string | null
  userRole?: string
  userImage?: string | null
  children: React.ReactNode
}

export default function DashboardLayoutClient({ userName, userRole, userImage, children }: DashboardLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userName={userName}
        userRole={userRole}
        userImage={userImage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        {children}
      </main>
    </div>
  )
}
