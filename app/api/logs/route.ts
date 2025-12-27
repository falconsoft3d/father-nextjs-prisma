import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const logs = await prisma.systemLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100, // Limit to last 100 for performance/safety
        })

        return NextResponse.json(logs)
    } catch (error) {
        console.error("[LOGS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
