import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        const task = await prisma.scheduledTask.findUnique({
            where: { id },
        })

        if (!task) {
            return new NextResponse("Task not found", { status: 404 })
        }

        // Here you would trigger the actual background job
        console.log(`[TASK_EXECUTION] Manual trigger for task: ${task.name} (${task.function})`)

        return NextResponse.json({
            success: true,
            message: `Task "${task.name}" execution started`
        })
    } catch (error) {
        console.error("[TASK_RUN_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
