import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Correctly type params for Next.js 15+
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
        const { code, name, currencyId } = body

        if (!code || !name || !currencyId) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const journal = await prisma.journal.update({
            where: { id },
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
        console.error("[JOURNALS_PUT]", error)
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
        await prisma.journal.delete({
            where: { id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[JOURNALS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
