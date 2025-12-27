import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(contacts)
    } catch (error) {
        console.error("[CONTACTS_GET]", error)
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
        const { name, vat, email, phone, address, country, isActive } = body

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                vat,
                email,
                phone,
                address,
                country,
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(contact)
    } catch (error) {
        console.error("[CONTACTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
