import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, currentPassword, newPassword } = body

    // Si está cambiando contraseña
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 6 caracteres" },
          { status: 400 }
        )
      }

      // Verificar contraseña actual
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)

      if (!passwordMatch) {
        return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 })
      }

      // Actualizar contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      })

      return NextResponse.json({
        success: true,
        message: "Contraseña actualizada correctamente",
      })
    }

    // Actualizar perfil (nombre y email)
    if (name || email) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(body.image !== undefined && { image: body.image }),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Perfil actualizado correctamente",
      })
    }

    return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 })
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json(
      { error: error.message || "Error al actualizar perfil" },
      { status: 500 }
    )
  }
}

