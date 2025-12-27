import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { title, description, solution, status } = body

        if (!title || !description) {
            return new NextResponse("Title and Description are required", { status: 400 })
        }

        const ticket = await prisma.ticket.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                solution,
                status,
            },
        })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("[TICKETS_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        const ticket = await prisma.ticket.delete({
            where: { id: parseInt(id) },
        })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("[TICKETS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
