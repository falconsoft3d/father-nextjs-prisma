"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Coins, Save, X } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface Currency {
    id: string
    name: string
    code: string
    symbol: string
    isActive: boolean
    createdAt: string
}

export default function CurrenciesPage() {
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCurrency, setCurrentCurrency] = useState<Partial<Currency>>({
        name: "",
        code: "",
        symbol: "",
        isActive: true,
    })

    useEffect(() => {
        fetchCurrencies()
    }, [])

    const fetchCurrencies = async () => {
        try {
            const res = await fetch("/api/currencies")
            if (res.ok) {
                const data = await res.json()
                setCurrencies(data)
            }
        } catch (error) {
            console.error("Error fetching currencies:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this currency?")) return

        try {
            const res = await fetch(`/api/currencies/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setCurrencies(currencies.filter((c) => c.id !== id))
            }
        } catch (error) {
            console.error("Error deleting currency:", error)
        }
    }

    const handleEdit = (currency: Currency) => {
        setCurrentCurrency(currency)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentCurrency({
            name: "",
            code: "",
            symbol: "",
            isActive: true,
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentCurrency.id ? "PUT" : "POST"
            const url = currentCurrency.id
                ? `/api/currencies/${currentCurrency.id}`
                : "/api/currencies"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentCurrency),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchCurrencies()
            }
        } catch (error) {
            console.error("Error saving currency:", error)
        }
    }

    const columns = [
        {
            key: "name",
            label: "Nombre",
            render: (currency: Currency) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <Coins size={18} />
                    </div>
                    <span className="font-medium text-gray-900">{currency.name}</span>
                </div>
            )
        },
        {
            key: "code",
            label: "Código",
            render: (currency: Currency) => (
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                    {currency.code}
                </span>
            )
        },
        {
            key: "symbol",
            label: "Símbolo",
            render: (currency: Currency) => (
                <span className="text-gray-900 font-semibold">
                    {currency.symbol}
                </span>
            )
        },
        {
            key: "isActive",
            label: "Estado",
            render: (currency: Currency) => (
                currency.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Activo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Inactivo
                    </span>
                )
            )
        },
        {
            key: "actions",
            label: "",
            searchable: false,
            render: (currency: Currency) => (
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(currency.id);
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
                            {currentCurrency.id ? "Editar Moneda" : "Nueva Moneda"}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCurrency.name}
                                    onChange={(e) => setCurrentCurrency({ ...currentCurrency, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Ej: Dólar Americano"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código ISO</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCurrency.code}
                                    onChange={(e) => setCurrentCurrency({ ...currentCurrency, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Ej: USD"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Símbolo</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCurrency.symbol}
                                    onChange={(e) => setCurrentCurrency({ ...currentCurrency, symbol: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Ej: $"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={currentCurrency.isActive}
                                onChange={(e) => setCurrentCurrency({ ...currentCurrency, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-700">Activa</label>
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
                title="Monedas"
                data={currencies}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(c) => c.id}
                newRecordLabel="Nueva Moneda"
                searchPlaceholder="Buscar monedas..."
            />
        </div>
    )
}
