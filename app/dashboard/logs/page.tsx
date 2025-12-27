"use client"

import { useState, useEffect } from "react"
import { ScrollText, Calendar, Database, Activity } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface SystemLog {
    id: number
    description: string
    origin: string
    createdAt: string
}

export default function LogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/logs")
            if (res.ok) {
                const data = await res.json()
                setLogs(data)
            }
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            key: "id",
            label: "Secuencia",
            render: (l: SystemLog) => (
                <span className="font-mono text-sm text-gray-500">#{l.id}</span>
            )
        },
        {
            key: "description",
            label: "Descripción",
            render: (l: SystemLog) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                        <Activity size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{l.description}</span>
                </div>
            )
        },
        {
            key: "origin",
            label: "Origen",
            render: (l: SystemLog) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <Database size={12} />
                    {l.origin}
                </span>
            )
        },
        {
            key: "createdAt",
            label: "Fecha",
            render: (l: SystemLog) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(l.createdAt).toLocaleString()}</span>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <TableTemplate
                title="Logs del Sistema"
                data={logs}
                columns={columns}
                getItemId={(l) => String(l.id)}
                searchPlaceholder="Buscar logs..."
            // No onCreate or onEdit for Read-Only Logs
            />
        </div>
    )
}
