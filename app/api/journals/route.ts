import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const journals = await prisma.journal.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                currency: true
            }
        })
        return NextResponse.json(journals)
    } catch (error) {
        console.error("[JOURNALS_GET]", error)
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
        const { code, name, currencyId } = body

        if (!code || !name || !currencyId) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const journal = await prisma.journal.create({
            data: {
                code,
                name,
                currencyId
            },
            include: {
                currency: true
            }
        })

        return NextResponse.json(journal)
    } catch (error) {
        console.error("[JOURNALS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
