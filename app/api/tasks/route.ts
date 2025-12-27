import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const tasks = await prisma.scheduledTask.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(tasks)
    } catch (error) {
        console.error("[TASKS_GET]", error)
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
        const { name, function: func, frequency, interval, isActive } = body

        if (!name || !func || !frequency) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const task = await prisma.scheduledTask.create({
            data: {
                name,
                function: func,
                frequency,
                interval: Number(interval) || 1,
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error("[TASKS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
