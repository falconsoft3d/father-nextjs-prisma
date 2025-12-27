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
        const { name, function: func, frequency, interval, isActive } = body

        if (!name || !func || !frequency) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const task = await prisma.scheduledTask.update({
            where: { id },
            data: {
                name,
                function: func,
                frequency,
                interval: Number(interval),
                isActive,
            },
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error("[TASKS_PUT]", error)
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

        const task = await prisma.scheduledTask.delete({
            where: { id },
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error("[TASKS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
