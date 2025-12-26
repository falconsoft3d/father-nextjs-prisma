"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Database,
  Users, 
  UserCircle, 
  LogOut,
  Menu,
  X,
  ChevronLeft
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface SidebarProps {
  userName?: string | null
  userRole?: string
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export default function Sidebar({ userName, userRole, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200 text-gray-700"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-16" : "lg:w-56"}
          w-56
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <Database size={18} className="text-white" />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-semibold text-gray-900">Dashboard</span>
              )}
            </div>
          </div>

          {/* Collections */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <nav className="space-y-1">
                {/* Perfil - Siempre visible */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Perfil" : ""}
                >
                  <UserCircle size={16} />
                  {!isCollapsed && <span>Perfil</span>}
                </Link>

                {/* Usuarios - Visible para todos */}
                <Link
                  href="/dashboard/users"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === "/dashboard/users"
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Usuarios" : ""}
                >
                  <Users size={16} />
                  {!isCollapsed && <span>Usuarios</span>}
                </Link>
              </nav>
            </div>
          </div>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200">
            {/* Toggle collapse button - solo en desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-3"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
              {!isCollapsed && <span className="ml-2 text-sm">Colapsar</span>}
            </button>

            {!isCollapsed && (
              <div className="mb-3 px-3 py-2">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors w-full ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut size={16} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
