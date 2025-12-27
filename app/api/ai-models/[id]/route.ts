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
        const { name, type, config, isActive } = body

        if (!name || !type || !config) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const aiModel = await prisma.aIModel.update({
            where: { id },
            data: {
                name,
                type,
                config,
                isActive,
            },
        })

        return NextResponse.json(aiModel)
    } catch (error) {
        console.error("[AI_MODELS_PUT]", error)
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

        const aiModel = await prisma.aIModel.delete({
            where: { id },
        })

        return NextResponse.json(aiModel)
    } catch (error) {
        console.error("[AI_MODELS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
