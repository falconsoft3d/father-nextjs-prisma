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
        const { name, vat, email, phone, address, country, isActive } = body

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const contact = await prisma.contact.update({
            where: { id },
            data: {
                name,
                vat,
                email,
                phone,
                address,
                country,
                isActive,
            },
        })

        return NextResponse.json(contact)
    } catch (error) {
        console.error("[CONTACTS_PUT]", error)
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

        const contact = await prisma.contact.delete({
            where: { id },
        })

        return NextResponse.json(contact)
    } catch (error) {
        console.error("[CONTACTS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
