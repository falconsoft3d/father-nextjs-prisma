"use client"

import { registerUser } from "@/lib/actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Database, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function RegisterButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
    >
      {pending ? (
        "Creando cuenta..."
      ) : (
        <>
          Crear cuenta
          <ArrowRight size={16} />
        </>
      )}
    </button>
  )
}

export default function RegisterPage() {
  const [state, dispatch] = useActionState(registerUser, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }, [state?.success, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center">
              <Database size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Crear cuenta
          </h1>
          <p className="text-sm text-gray-600">Regístrate en el sistema</p>
        </div>

        <form action={dispatch} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          {state?.message && (
            <div
              className={`px-3 py-2 rounded-md text-sm ${
                state.success
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <RegisterButton />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-gray-900 hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
