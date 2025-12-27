import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const aiModels = await prisma.aIModel.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(aiModels)
    } catch (error) {
        console.error("[AI_MODELS_GET]", error)
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
        const { name, type, config, isActive } = body

        if (!name || !type || !config) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        console.log("Creating AI Model with body:", body);

        const aiModel = await prisma.aIModel.create({
            data: {
                name,
                type,
                config,
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(aiModel)
    } catch (error) {
        console.error("[AI_MODELS_POST] Error details:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
