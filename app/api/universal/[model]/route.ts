import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Helper to check if API is enabled
async function isApiEnabled() {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: "enable_universal_api" },
    })
    return setting?.value === "true"
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ model: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!(await isApiEnabled())) {
            return new NextResponse("Universal API is disabled", { status: 403 })
        }

        const { model } = await params
        // Normalize model name to camelCase (e.g., "products" -> "product"? No, prisma client uses model names which are usually singular camelCase like 'user', 'product')
        // But endpoints might be plural /users.
        // I will trust the user sends the prisma model name, e.g. "user", "product".
        // Or I'll try to match it.

        const prismaModel = (prisma as any)[model]

        if (!prismaModel || typeof prismaModel.findMany !== 'function') {
            return new NextResponse(`Model '${model}' not found`, { status: 404 })
        }

        const data = await prismaModel.findMany({
            take: 100,
        })

        return NextResponse.json(data)
    } catch (error) {
        console.error("[UNIVERSAL_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ model: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!(await isApiEnabled())) {
            return new NextResponse("Universal API is disabled", { status: 403 })
        }

        const { model } = await params
        const body = await req.json()
        const prismaModel = (prisma as any)[model]

        if (!prismaModel || typeof prismaModel.create !== 'function') {
            return new NextResponse(`Model '${model}' not found`, { status: 404 })
        }

        const data = await prismaModel.create({
            data: body
        })

        return NextResponse.json(data)
    } catch (error) {
        console.error("[UNIVERSAL_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
