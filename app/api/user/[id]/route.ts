import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, role } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      )
    }

    const updateData: any = {
      name,
      email,
      role: role || "user",
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
      user,
    })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // No permitir que el usuario se elimine a sí mismo
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Usuario eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    )
  }
}
