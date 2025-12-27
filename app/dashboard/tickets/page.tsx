"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Ticket, Save, X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface TicketData {
    id: number
    title: string
    description: string
    solution?: string
    status: string
    createdAt: string
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<TicketData[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentTicket, setCurrentTicket] = useState<Partial<TicketData>>({
        title: "",
        description: "",
        solution: "",
        status: "Abierto",
    })

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/tickets")
            if (res.ok) {
                const data = await res.json()
                setTickets(data)
            }
        } catch (error) {
            console.error("Error fetching tickets:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return

        try {
            const res = await fetch(`/api/tickets/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setTickets(tickets.filter((t) => t.id !== id))
            }
        } catch (error) {
            console.error("Error deleting ticket:", error)
        }
    }

    const handleEdit = (ticket: TicketData) => {
        setCurrentTicket(ticket)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentTicket({
            title: "",
            description: "",
            solution: "",
            status: "Abierto",
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentTicket.id ? "PUT" : "POST"
            const url = currentTicket.id
                ? `/api/tickets/${currentTicket.id}`
                : "/api/tickets"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentTicket),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchTickets()
            }
        } catch (error) {
            console.error("Error saving ticket:", error)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Abierto":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle size={12} />
                        Abierto
                    </span>
                )
            case "En Progreso":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <Clock size={12} />
                        En Progreso
                    </span>
                )
            case "Cerrado":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={12} />
                        Cerrado
                    </span>
                )
            default:
                return <span className="text-gray-500 text-xs">{status}</span>
        }
    }

    const columns = [
        {
            key: "id",
            label: "#",
            render: (t: TicketData) => (
                <span className="font-mono text-sm text-gray-500">#{t.id}</span>
            )
        },
        {
            key: "title",
            label: "Título",
            render: (t: TicketData) => (
                <div className="font-medium text-gray-900">{t.title}</div>
            )
        },
        {
            key: "status",
            label: "Estado",
            render: (t: TicketData) => getStatusBadge(t.status)
        },
        {
            key: "createdAt",
            label: "Fecha",
            render: (t: TicketData) => (
                <span className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</span>
            )
        },
        {
            key: "actions",
            label: "",
            searchable: false,
            render: (t: TicketData) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(t);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {currentTicket.id ? `Editar Ticket #${currentTicket.id}` : "Nuevo Ticket"}
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={currentTicket.title}
                                    onChange={(e) => setCurrentTicket({ ...currentTicket, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Resumen del problema"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select
                                    value={currentTicket.status}
                                    onChange={(e) => setCurrentTicket({ ...currentTicket, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Abierto">Abierto</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                required
                                rows={4}
                                value={currentTicket.description}
                                onChange={(e) => setCurrentTicket({ ...currentTicket, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                placeholder="Detalles del ticket..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solución</label>
                            <textarea
                                rows={3}
                                value={currentTicket.solution || ""}
                                onChange={(e) => setCurrentTicket({ ...currentTicket, solution: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50"
                                placeholder="Resolución aplicada..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                <Save size={16} />
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <TableTemplate
                title="Tickets de Soporte"
                data={tickets}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(t) => String(t.id)}
                newRecordLabel="Nuevo Ticket"
                searchPlaceholder="Buscar tickets..."
            />
        </div>
    )
}
