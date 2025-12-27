"use client"

import { useState, useEffect } from "react"
import { CreditCard, Pencil, Trash2, Save, X, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface Journal {
    id: string
    code: string
    name: string
}

interface Contact {
    id: string
    name: string
}

interface Payment {
    id: string
    code: number
    reference?: string | null
    type: string // "Entrada", "Salida"
    amount: number
    date: string
    journalId: string
    journal?: Journal
    contactId?: string | null
    contact?: Contact | null
    createdAt: string
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [journals, setJournals] = useState<Journal[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentPayment, setCurrentPayment] = useState<Partial<Payment>>({
        reference: "",
        type: "Entrada",
        amount: 0,
        date: new Date().toISOString().split('T')[0], // Default today
        journalId: "",
        contactId: "",
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [paymentRes, journalRes, contactRes] = await Promise.all([
                fetch("/api/payments"),
                fetch("/api/journals"),
                fetch("/api/contacts")
            ])

            if (paymentRes.ok && journalRes.ok && contactRes.ok) {
                const paymentsData = await paymentRes.json()
                const journalsData = await journalRes.json()
                const contactsData = await contactRes.json()
                setPayments(paymentsData)
                setJournals(journalsData)
                setContacts(contactsData)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este pago?")) return

        try {
            const res = await fetch(`/api/payments/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setPayments(payments.filter((p) => p.id !== id))
            }
        } catch (error) {
            console.error("Error deleting payment:", error)
        }
    }

    const handleEdit = (payment: Payment) => {
        setCurrentPayment({
            ...payment,
            date: new Date(payment.date).toISOString().split('T')[0]
        })
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentPayment({
            reference: "",
            type: "Entrada",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            journalId: journals[0]?.id || "",
            contactId: "",
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentPayment.id ? "PUT" : "POST"
            const url = currentPayment.id
                ? `/api/payments/${currentPayment.id}`
                : "/api/payments"

            const payload = {
                ...currentPayment,
                amount: Number(currentPayment.amount)
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchData()
            }
        } catch (error) {
            console.error("Error saving payment:", error)
        }
    }

    const columns = [
        {
            key: "code",
            label: "Código",
            render: (p: Payment) => <span className="font-mono text-sm font-medium text-gray-900">
                {String(p.code).padStart(6, '0')}
            </span>
        },
        {
            key: "reference",
            label: "Referencia",
            render: (p: Payment) => <span className="text-sm text-gray-600">{p.reference || "-"}</span>
        },
        {
            key: "type",
            label: "Tipo",
            render: (p: Payment) => (
                <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${p.type === "Entrada"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {p.type === "Entrada" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {p.type}
                </div>
            )
        },
        {
            key: "amount",
            label: "Importe",
            render: (p: Payment) => <span className="font-semibold text-gray-900">{Number(p.amount).toFixed(2)}</span>
        },
        {
            key: "contact",
            label: "Contacto",
            render: (p: Payment) => (
                <span className="text-sm text-gray-600">
                    {p.contact?.name || "-"}
                </span>
            )
        },
        {
            key: "journal",
            label: "Diario",
            render: (p: Payment) => (
                <span className="text-sm text-gray-600">
                    {p.journal?.name || "N/A"}
                </span>
            )
        },
        {
            key: "date",
            label: "Fecha",
            render: (p: Payment) => (
                <span className="text-sm text-gray-600">
                    {new Date(p.date).toLocaleDateString()}
                </span>
            )
        },
        {
            key: "actions",
            label: "",
            searchable: false,
            render: (p: Payment) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(p);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
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
                            {currentPayment.id ? "Editar Pago" : "Nuevo Pago"}
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                                <input
                                    type="text"
                                    value={currentPayment.reference || ""}
                                    onChange={(e) => setCurrentPayment({ ...currentPayment, reference: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="REF-123"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    value={currentPayment.date}
                                    onChange={(e) => setCurrentPayment({ ...currentPayment, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={currentPayment.type}
                                    onChange={(e) => setCurrentPayment({ ...currentPayment, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Entrada">Entrada</option>
                                    <option value="Salida">Salida</option>
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diario</label>
                                <select
                                    value={currentPayment.journalId}
                                    onChange={(e) => setCurrentPayment({ ...currentPayment, journalId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    required
                                >
                                    <option value="">Seleccionar Diario</option>
                                    {journals.map(j => (
                                        <option key={j.id} value={j.id}>
                                            {j.code} - {j.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                                <select
                                    value={currentPayment.contactId || ""}
                                    onChange={(e) => setCurrentPayment({ ...currentPayment, contactId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="">Sin contacto</option>
                                    {contacts.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Importe</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={currentPayment.amount}
                                        onChange={(e) => setCurrentPayment({ ...currentPayment, amount: Number(e.target.value) })}
                                        className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
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
                title="Pagos"
                data={payments}
                columns={columns}
                onCreate={handleCreate}
                getItemId={(p) => p.id}
                newRecordLabel="Nuevo Pago"
                searchPlaceholder="Buscar pagos..."
            />
        </div>
    )
}
