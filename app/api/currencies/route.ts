import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const currencies = await prisma.currency.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(currencies)
    } catch (error) {
        console.error("[CURRENCIES_GET]", error)
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
        const { name, code, symbol, isActive } = body

        if (!name || !code || !symbol) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const currency = await prisma.currency.create({
            data: {
                name,
                code,
                symbol,
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(currency)
    } catch (error) {
        console.error("[CURRENCIES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
