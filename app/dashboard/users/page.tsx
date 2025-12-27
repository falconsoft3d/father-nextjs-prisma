import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UsersClient from "./UsersClient"
import { prisma } from "@/lib/prisma"


export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const page = Number(params?.page) || 1
  const limit = 10
  const skip = (page - 1) * limit

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
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
    }),
    prisma.user.count(),
  ])

  return (
    <UsersClient
      users={users}
      totalItems={totalItems}
      currentPage={page}
    />
  )
}
