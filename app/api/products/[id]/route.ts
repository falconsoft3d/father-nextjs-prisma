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
        const { code, name, type, cost, price, isActive } = body

        if (!code || !name || !type) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                code,
                name,
                type,
                cost,
                price,
                isActive,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCTS_PUT]", error)
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

        const product = await prisma.product.delete({
            where: { id },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCTS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
