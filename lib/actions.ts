"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas."
        default:
          return "Algo salió mal."
      }
    }
    throw error
  }
}

export async function registerUser(
  prevState: { message: string; success: boolean } | undefined,
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email || !password) {
      return { message: "Todos los campos son requeridos.", success: false }
    }

    if (password !== confirmPassword) {
      return { message: "Las contraseñas no coinciden.", success: false }
    }

    if (password.length < 6) {
      return { message: "La contraseña debe tener al menos 6 caracteres.", success: false }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { message: "Este email ya está registrado.", success: false }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Verificar si es el primer usuario
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? "admin" : "user",
      },
    })

    return { message: "Usuario creado exitosamente. Ahora puedes iniciar sesión.", success: true }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { message: "Error al crear el usuario.", success: false }
  }
}
