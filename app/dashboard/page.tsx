import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Users, Package, UsersRound, Ticket } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  const [userCount, productCount, contactCount, ticketCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.contact.count(),
    prisma.ticket.count(),
  ])

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Bienvenido, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Usuarios */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Usuarios</p>
            <h3 className="text-3xl font-bold text-gray-900">{userCount}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* KPI Productos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Productos</p>
            <h3 className="text-3xl font-bold text-gray-900">{productCount}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        {/* KPI Contactos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Contactos</p>
            <h3 className="text-3xl font-bold text-gray-900">{contactCount}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <UsersRound className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* KPI Tickets */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Tickets</p>
            <h3 className="text-3xl font-bold text-gray-900">{ticketCount}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <Ticket className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

