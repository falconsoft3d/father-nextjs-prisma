import { auth } from "@/auth"
import SessionProviderWrapper from "@/components/SessionProvider"
import DashboardLayoutClient from "@/components/DashboardLayoutClient"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <SessionProviderWrapper>
      <DashboardLayoutClient
        userName={session.user?.name}
        userRole={session.user?.role}
        userImage={session.user?.image}
      >
        {children}
      </DashboardLayoutClient>
    </SessionProviderWrapper>
  )
}
