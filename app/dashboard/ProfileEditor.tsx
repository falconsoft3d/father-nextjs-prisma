"use client"

import { useState } from "react"
import { User2, Mail, Lock, Shield, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface User {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
}

export default function ProfileEditor({ user }: { user?: User }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Perfil actualizado correctamente" })
        setIsEditing(false)
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.error || "Error al actualizar perfil" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" })
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Contraseña actualizada correctamente" })
        setIsChangingPassword(false)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setMessage({ type: "error", text: data.error || "Error al actualizar contraseña" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/user/${user?.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Cuenta eliminada correctamente" })
        setTimeout(async () => {
          await signOut({ callbackUrl: "/login" })
        }, 1500)
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Error al eliminar la cuenta" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar la cuenta" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Información del perfil */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-md">
                <User2 size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Nombre</p>
                  <p className="text-sm text-gray-900">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-md">
                <Mail size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-md">
                <Shield size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Rol</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded ${
                      user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user?.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Save size={16} />
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({ name: user?.name || "", email: user?.email || "" })
                  }}
                  className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Eliminar cuenta */}
      <div className="bg-white rounded-lg border border-red-200">
        <div className="p-6 border-b border-red-200">
          <h2 className="text-lg font-semibold text-red-700">Zona de peligro</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Eliminar cuenta</h3>
              <p className="text-sm text-gray-600">Esta acción es permanente y no se puede deshacer.</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center gap-2"
            >
              <Trash2 size={16} />
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Contraseña</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Cambiar contraseña
              </button>
            )}
          </div>
        </div>

        {isChangingPassword && (
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña actual <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nueva contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmar nueva contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Lock size={16} />
                  {loading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }}
                  className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
