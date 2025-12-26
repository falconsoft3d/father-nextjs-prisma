import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UsersClient from "./UsersClient"
import { prisma } from "@/lib/prisma"

export default async function UsersPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return <UsersClient users={users} />
}
