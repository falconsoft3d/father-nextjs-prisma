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
  ChevronLeft,
  LayoutDashboard,
  Bot,
  Coins,
  Package,
  UsersRound,
  Timer,
  ScrollText,
  Ticket,
  Settings,
  Book,
  CreditCard
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface SidebarProps {
  userName?: string | null
  userRole?: string
  userImage?: string | null
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export default function Sidebar({ userName, userRole, userImage, isCollapsed, setIsCollapsed }: SidebarProps) {
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
          <div
            className="p-5 border-b border-gray-200 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expandir" : "Colapsar"}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <Database className="text-white shrink-0 w-5 h-5" />
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


                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Dashboard" : ""}
                >
                  <LayoutDashboard className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>

                {/* Modelos IA */}
                <Link
                  href="/dashboard/ai-models"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/ai-models"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Modelos IA" : ""}
                >
                  <Bot className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Modelos IA</span>}
                </Link>
                {/* Contactos */}
                <Link
                  href="/dashboard/contacts"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/contacts"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Contactos" : ""}
                >
                  <UsersRound className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Contactos</span>}
                </Link>

                {/* Productos */}
                <Link
                  href="/dashboard/products"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/products"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Productos" : ""}
                >
                  <Package className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Productos</span>}
                </Link>

                {/* Tickets */}
                <Link
                  href="/dashboard/tickets"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/tickets"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Tickets" : ""}
                >
                  <Ticket className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Tickets</span>}
                </Link>

                {/* Monedas */}
                <Link
                  href="/dashboard/currencies"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/currencies"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Monedas" : ""}
                >
                  <Coins className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Monedas</span>}
                </Link>

                {/* Pagos */}
                <Link
                  href="/dashboard/payments"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/payments"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Pagos" : ""}
                >
                  <CreditCard className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Pagos</span>}
                </Link>

                {/* Diarios */}
                <Link
                  href="/dashboard/journals"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/journals"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Diarios" : ""}
                >
                  <Book className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Diarios</span>}
                </Link>

                {/* Logs */}
                <Link
                  href="/dashboard/logs"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/logs"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Logs" : ""}
                >
                  <ScrollText className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Logs</span>}
                </Link>

                {/* Tareas Planificadas */}
                <Link
                  href="/dashboard/tasks"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/tasks"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Tareas" : ""}
                >
                  <Timer className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Tareas</span>}
                </Link>

                {/* Usuarios - Visible para todos */}
                <Link
                  href="/dashboard/users"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/users"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Usuarios" : ""}
                >
                  <Users className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Usuarios</span>}
                </Link>

                {/* Configuración */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${pathname === "/dashboard/settings"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Configuración" : ""}
                >
                  <Settings className="shrink-0 w-5 h-5" />
                  {!isCollapsed && <span>Configuración</span>}
                </Link>
              </nav>
            </div>
          </div>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200">


            {!isCollapsed && (
              <div className="mb-3 px-3 py-2 flex items-center gap-3">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserCircle size={24} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate" title={userName || ""}>{userName}</p>
                </div>
              </div>
            )}
            {/* Perfil - Siempre visible */}
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors mb-1 ${pathname === "/dashboard/profile"
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:bg-gray-50"
                } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Perfil" : ""}
            >
              <UserCircle className="shrink-0 w-5 h-5" />
              {!isCollapsed && <span>Perfil</span>}
            </Link>
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors w-full ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="shrink-0 w-5 h-5" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
