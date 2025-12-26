import { auth } from "@/auth"
import ProfileEditor from "./ProfileEditor"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Perfil</h1>
        <p className="text-sm text-gray-600">
          Gestiona tu información personal y contraseña
        </p>
      </div>

      <ProfileEditor user={session?.user} />
    </div>
  )
}
