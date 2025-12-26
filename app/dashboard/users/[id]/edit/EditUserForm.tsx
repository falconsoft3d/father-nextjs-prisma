"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    role: user.role,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: data.message, type: "success" })
        setTimeout(() => {
          router.push("/dashboard/users")
        }, 1500)
      } else {
        setMessage({ text: data.error, type: "error" })
      }
    } catch (error) {
      setMessage({ text: "Error al actualizar el usuario", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${user.email}?`)) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: data.message, type: "success" })
        setTimeout(() => {
          router.push("/dashboard/users")
        }, 1500)
      } else {
        setMessage({ text: data.error, type: "error" })
      }
    } catch (error) {
      setMessage({ text: "Error al eliminar el usuario", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Editar usuario</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {user.id.substring(0, 13)}...</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Eliminar usuario
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Link
              href="/dashboard/users"
              className="flex-1 px-4 py-2 text-sm text-center text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
