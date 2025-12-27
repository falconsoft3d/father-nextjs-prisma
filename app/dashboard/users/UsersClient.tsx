"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TableTemplate from "@/components/TableTemplate"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

export default function UsersClient({
  users,
  totalItems,
  currentPage
}: {
  users: User[]
  totalItems: number
  currentPage: number
}) {
  const router = useRouter()
  // const [users, setUsers] = useState(initialUsers) // Don't use state for data anymore, it comes from props
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const columns = [
    {
      key: "email",
      label: "email",
      render: (user: User) => (
        <span className="text-sm text-gray-900">{user.email}</span>
      ),
    },
    {
      key: "name",
      label: "name",
      render: (user: User) => (
        <span className="text-sm text-gray-900">{user.name || "N/A"}</span>
      ),
    },
    {
      key: "role",
      label: "role",
      render: (user: User) => (
        <span
          className={`inline-block px-2 py-0.5 text-xs rounded ${user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
            }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "created",
      render: (user: User) => (
        <span className="text-sm text-gray-600">
          {new Date(user.createdAt).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
      searchable: false,
    },
    {
      key: "updatedAt",
      label: "updated",
      render: (user: User) => (
        <span className="text-sm text-gray-600">
          {new Date(user.createdAt).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
      searchable: false,
    },
  ]

  return (
    <div>
      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <TableTemplate
        title="users"
        data={users}
        columns={columns}
        searchPlaceholder='Search term or filter like created > "2022-01-01"...'
        newRecordUrl="/dashboard/users/new"
        newRecordLabel="New record"
        onRefresh={() => router.refresh()}
        getItemId={(user) => user.id}
        getEditUrl={(user) => `/dashboard/users/${user.id}/edit`}
        itemsPerPage={10}
        isServerSide={true}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={(page) => router.push(`/dashboard/users?page=${page}`)}
      />
    </div>
  )
}