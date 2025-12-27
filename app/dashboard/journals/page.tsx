"use client"

import { useState, useEffect } from "react"
import { Book, Pencil, Trash2, Save, X } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface Currency {
    id: string
    code: string
    name: string
}

interface Journal {
    id: string
    code: string
    name: string
    currencyId: string
    currency?: Currency
    createdAt: string
}

export default function JournalsPage() {
    const [journals, setJournals] = useState<Journal[]>([])
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentJournal, setCurrentJournal] = useState<Partial<Journal>>({
        code: "",
        name: "",
        currencyId: "",
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [journalRes, currencyRes] = await Promise.all([
                fetch("/api/journals"),
                fetch("/api/currencies")
            ])

            if (journalRes.ok && currencyRes.ok) {
                const journalsData = await journalRes.json()
                const currenciesData = await currencyRes.json()
                setJournals(journalsData)
                setCurrencies(currenciesData)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este diario?")) return

        try {
            const res = await fetch(`/api/journals/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setJournals(journals.filter((j) => j.id !== id))
            }
        } catch (error) {
            console.error("Error deleting journal:", error)
        }
    }

    const handleEdit = (journal: Journal) => {
        setCurrentJournal(journal)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentJournal({
            code: "",
            name: "",
            currencyId: currencies[0]?.id || "",
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentJournal.id ? "PUT" : "POST"
            const url = currentJournal.id
                ? `/api/journals/${currentJournal.id}`
                : "/api/journals"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentJournal),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchData() // Refresh to get relation data populated
            }
        } catch (error) {
            console.error("Error saving journal:", error)
        }
    }

    const columns = [
        {
            key: "code",
            label: "Código",
            render: (j: Journal) => <span className="font-mono text-sm font-medium text-gray-900">{j.code}</span>
        },
        {
            key: "name",
            label: "Nombre",
            render: (j: Journal) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Book size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{j.name}</span>
                </div>
            )
        },
        {
            key: "currency",
            label: "Moneda",
            render: (j: Journal) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {j.currency?.code || "N/A"}
                </span>
            )
        },
        {
            key: "actions",
            label: "",
            searchable: false,
            render: (j: Journal) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(j);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(j.id);
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
                            {currentJournal.id ? "Editar Diario" : "Nuevo Diario"}
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                                <input
                                    type="text"
                                    required
                                    value={currentJournal.code}
                                    onChange={(e) => setCurrentJournal({ ...currentJournal, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-mono"
                                    placeholder="BNK1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={currentJournal.name}
                                    onChange={(e) => setCurrentJournal({ ...currentJournal, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Banco Principal"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                                <select
                                    value={currentJournal.currencyId}
                                    onChange={(e) => setCurrentJournal({ ...currentJournal, currencyId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    required
                                >
                                    <option value="">Seleccionar Moneda</option>
                                    {currencies.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.code} - {c.name}
                                        </option>
                                    ))}
                                </select>
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
                title="Diarios"
                data={journals}
                columns={columns}
                onCreate={handleCreate}
                getItemId={(j) => j.id}
                newRecordLabel="Nuevo Diario"
                searchPlaceholder="Buscar diarios..."
            />
        </div>
    )
}
