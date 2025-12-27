import Link from "next/link"
import { ArrowRight, Database, Code, Shield, Users, Zap } from "lucide-react"

import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <Database size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex gap-3">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                >
                  {session.user.name}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 
                             transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Sistema de gestión completo
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Dashboard profesional con autenticación, gestión de usuarios
            y panel de administración.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white 
                       rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Comenzar ahora
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 
                       border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Ver demo
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Database size={24} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Backend integrado
            </h3>
            <p className="text-sm text-gray-600">
              Sistema completo con base de datos PostgreSQL y Prisma ORM para gestión eficiente
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Autenticación segura
            </h3>
            <p className="text-sm text-gray-600">
              NextAuth con contraseñas encriptadas, protección de rutas y gestión de sesiones
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users size={24} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Panel de administración
            </h3>
            <p className="text-sm text-gray-600">
              Gestiona usuarios, perfiles y roles con interfaz intuitiva tipo tabla
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Tecnologías
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Code size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Next.js 14 + TypeScript
                </h4>
                <p className="text-sm text-gray-600">
                  App Router, Server Components y tipado estático para código robusto
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Database size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  PostgreSQL + Prisma
                </h4>
                <p className="text-sm text-gray-600">
                  Base de datos relacional con ORM moderno y type-safe
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Shield size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  NextAuth v5
                </h4>
                <p className="text-sm text-gray-600">
                  Autenticación con credenciales, middleware y gestión de sesiones
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Zap size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Tailwind CSS
                </h4>
                <p className="text-sm text-gray-600">
                  Diseño moderno, responsive y totalmente personalizable
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
