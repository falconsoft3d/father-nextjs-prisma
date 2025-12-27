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
        const { name, code, symbol, isActive } = body

        if (!name || !code || !symbol) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const currency = await prisma.currency.update({
            where: { id },
            data: {
                name,
                code,
                symbol,
                isActive,
            },
        })

        return NextResponse.json(currency)
    } catch (error) {
        console.error("[CURRENCIES_PUT]", error)
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

        const currency = await prisma.currency.delete({
            where: { id },
        })

        return NextResponse.json(currency)
    } catch (error) {
        console.error("[CURRENCIES_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
