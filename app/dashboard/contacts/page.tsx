"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, UsersRound, Save, X, Mail, Phone, MapPin, Globe } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface Contact {
    id: string
    name: string
    vat: string
    email: string
    phone: string
    address: string
    country: string
    isActive: boolean
    createdAt: string
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentContact, setCurrentContact] = useState<Partial<Contact>>({
        name: "",
        vat: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        isActive: true,
    })

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const res = await fetch("/api/contacts")
            if (res.ok) {
                const data = await res.json()
                setContacts(data)
            }
        } catch (error) {
            console.error("Error fetching contacts:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return

        try {
            const res = await fetch(`/api/contacts/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setContacts(contacts.filter((c) => c.id !== id))
            }
        } catch (error) {
            console.error("Error deleting contact:", error)
        }
    }

    const handleEdit = (contact: Contact) => {
        setCurrentContact(contact)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentContact({
            name: "",
            vat: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            isActive: true,
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentContact.id ? "PUT" : "POST"
            const url = currentContact.id
                ? `/api/contacts/${currentContact.id}`
                : "/api/contacts"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentContact),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchContacts()
            }
        } catch (error) {
            console.error("Error saving contact:", error)
        }
    }

    const columns = [
        {
            key: "name",
            label: "Nombre / Empresa",
            render: (c: Contact) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <UsersRound size={18} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                        {c.vat && <div className="text-xs text-gray-500">VAT: {c.vat}</div>}
                    </div>
                </div>
            )
        },
        {
            key: "contact",
            label: "Contacto",
            render: (c: Contact) => (
                <div className="flex flex-col gap-1">
                    {c.email && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail size={12} />
                            <span>{c.email}</span>
                        </div>
                    )}
                    {c.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Phone size={12} />
                            <span>{c.phone}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: "location",
            label: "Ubicación",
            render: (c: Contact) => (
                <div className="flex flex-col gap-1">
                    {c.country && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium">
                            <Globe size={12} />
                            <span>{c.country}</span>
                        </div>
                    )}
                    {c.address && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate max-w-[150px]" title={c.address}>
                            <MapPin size={12} />
                            <span>{c.address}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: "isActive",
            label: "Estado",
            render: (c: Contact) => (
                c.isActive ? (
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
            render: (c: Contact) => (
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(c.id);
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
                            {currentContact.id ? "Editar Contacto" : "Nuevo Contacto"}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Empresa</label>
                                <input
                                    type="text"
                                    required
                                    value={currentContact.name}
                                    onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">VAT / Tax ID</label>
                                <input
                                    type="text"
                                    value={currentContact.vat || ""}
                                    onChange={(e) => setCurrentContact({ ...currentContact, vat: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="B-12345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={currentContact.email || ""}
                                    onChange={(e) => setCurrentContact({ ...currentContact, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    value={currentContact.phone || ""}
                                    onChange={(e) => setCurrentContact({ ...currentContact, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="+34 600 000 000"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    value={currentContact.address || ""}
                                    onChange={(e) => setCurrentContact({ ...currentContact, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="Calle Principal 123"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                                <input
                                    type="text"
                                    value={currentContact.country || ""}
                                    onChange={(e) => setCurrentContact({ ...currentContact, country: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                                    placeholder="España"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={currentContact.isActive}
                                onChange={(e) => setCurrentContact({ ...currentContact, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
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
                title="Contactos"
                data={contacts}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(c) => c.id}
                newRecordLabel="Nuevo Contacto"
                searchPlaceholder="Buscar contactos..."
            />
        </div>
    )
}
