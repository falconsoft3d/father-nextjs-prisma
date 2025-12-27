import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("[PRODUCTS_GET]", error)
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
        const { code, name, type, cost, price, isActive } = body

        if (!code || !name || !type) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                code,
                name,
                type,
                cost: cost || 0,
                price: price || 0,
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
