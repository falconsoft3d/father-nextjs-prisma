"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Package, Save, X } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface Product {
    id: string
    code: string
    name: string
    type: string
    cost: number
    price: number
    isActive: boolean
    createdAt: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        code: "",
        name: "",
        type: "Almacenable",
        cost: 0,
        price: 0,
        isActive: true,
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id))
            }
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    const handleEdit = (product: Product) => {
        setCurrentProduct(product)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentProduct({
            code: "",
            name: "",
            type: "Almacenable",
            cost: 0,
            price: 0,
            isActive: true,
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentProduct.id ? "PUT" : "POST"
            const url = currentProduct.id
                ? `/api/products/${currentProduct.id}`
                : "/api/products"

            // Ensure numbers are numbers
            const payload = {
                ...currentProduct,
                cost: Number(currentProduct.cost),
                price: Number(currentProduct.price),
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchProducts()
            }
        } catch (error) {
            console.error("Error saving product:", error)
        }
    }

    const columns = [
        {
            key: "code",
            label: "Código",
            render: (p: Product) => <span className="font-mono text-sm text-gray-900 font-medium">{p.code}</span>
        },
        {
            key: "name",
            label: "Producto",
            render: (p: Product) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600">
                        <Package size={18} />
                    </div>
                    <span className="font-medium text-gray-900">{p.name}</span>
                </div>
            )
        },
        {
            key: "type",
            label: "Tipo",
            render: (p: Product) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.type === "Almacenable"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                    }`}>
                    {p.type}
                </span>
            )
        },
        {
            key: "cost",
            label: "Costo",
            render: (p: Product) => <span className="text-gray-600">{Number(p.cost).toFixed(2)}</span>
        },
        {
            key: "price",
            label: "Precio",
            render: (p: Product) => <span className="text-gray-900 font-semibold">{Number(p.price).toFixed(2)}</span>
        },
        {
            key: "isActive",
            label: "Estado",
            render: (p: Product) => (
                p.isActive ? (
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
            render: (p: Product) => (
                <div className="flex justify-end">
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
                            {currentProduct.id ? "Editar Producto" : "Nuevo Producto"}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                                <input
                                    type="text"
                                    required
                                    value={currentProduct.code}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-mono"
                                    placeholder="PROD-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Nombre del producto"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={currentProduct.type}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Almacenable">Almacenable</option>
                                    <option value="Servicio">Servicio</option>
                                </select>
                            </div>
                            <div className="col-span-1"></div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={currentProduct.cost}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, cost: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={currentProduct.price}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={currentProduct.isActive}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-700">Activo</label>
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
                title="Productos"
                data={products}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(p) => p.id}
                newRecordLabel="Nuevo Producto"
                searchPlaceholder="Buscar productos..."
            />
        </div>
    )
}
