import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const tickets = await prisma.ticket.findMany({
            orderBy: { id: "desc" },
        })

        return NextResponse.json(tickets)
    } catch (error) {
        console.error("[TICKETS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { title, description, solution, status } = body

        if (!title || !description) {
            return new NextResponse("Title and Description are required", { status: 400 })
        }

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                solution,
                status: status || "Abierto",
            },
        })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("[TICKETS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
