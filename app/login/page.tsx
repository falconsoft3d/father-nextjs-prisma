"use client"

import { authenticate } from "@/lib/actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Database, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
    >
      {pending ? (
        "Logging in..."
      ) : (
        <>
          Login
          <ArrowRight size={16} />
        </>
      )}
    </button>
  )
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail")
    const savedPassword = localStorage.getItem("savedPassword")
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRemember(true)
    }
  }, [])

  const handleSubmit = (formData: FormData) => {
    if (remember) {
      localStorage.setItem("savedEmail", email)
      localStorage.setItem("savedPassword", password)
    } else {
      localStorage.removeItem("savedEmail")
      localStorage.removeItem("savedPassword")
    }
    dispatch(formData)
  }

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
            Dashboard
          </h1>
          <p className="text-sm text-gray-600">Admin login</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white text-gray-900"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 text-gray-900 bg-gray-50 border-gray-300 rounded focus:ring-gray-400 focus:ring-1"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Recordar contraseña
            </label>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          <LoginButton />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-gray-900 hover:underline font-medium"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
