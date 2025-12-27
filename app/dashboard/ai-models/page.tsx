"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Bot, Save, X } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

enum AIModelType {
    OPENAI = "OPENAI",
    OLLAMA = "OLLAMA",
    ANTHROPIC = "ANTHROPIC",
}

interface AIModel {
    id: string
    name: string
    type: string
    config: any
    isActive: boolean
    createdAt: string
}

export default function AIModelsPage() {
    const [models, setModels] = useState<AIModel[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentModel, setCurrentModel] = useState<Partial<AIModel>>({
        name: "",
        type: AIModelType.OPENAI,
        isActive: true,
        config: {},
    })

    useEffect(() => {
        fetchModels()
    }, [])

    const fetchModels = async () => {
        try {
            const res = await fetch("/api/ai-models")
            if (res.ok) {
                const data = await res.json()
                setModels(data)
            }
        } catch (error) {
            console.error("Error fetching models:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this model?")) return

        try {
            const res = await fetch(`/api/ai-models/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setModels(models.filter((m) => m.id !== id))
            }
        } catch (error) {
            console.error("Error deleting model:", error)
        }
    }

    const handleEdit = (model: AIModel) => {
        setCurrentModel(model)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentModel({
            name: "",
            type: AIModelType.OPENAI,
            isActive: true,
            config: {},
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        const configData = { ...currentModel.config }

        try {
            const method = currentModel.id ? "PUT" : "POST"
            const url = currentModel.id
                ? `/api/ai-models/${currentModel.id}`
                : "/api/ai-models"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...currentModel,
                    config: configData
                }),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchModels()
            }
        } catch (error) {
            console.error("Error saving model:", error)
        }
    }

    const updateConfig = (key: string, value: string) => {
        setCurrentModel(prev => ({
            ...prev,
            config: { ...prev.config, [key]: value }
        }))
    }

    const columns = [
        {
            key: "name",
            label: "Nombre",
            render: (model: AIModel) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                        <Bot size={18} />
                    </div>
                    <span className="font-medium text-gray-900">{model.name}</span>
                </div>
            )
        },
        {
            key: "type",
            label: "Tipo",
            render: (model: AIModel) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {model.type}
                </span>
            )
        },
        {
            key: "isActive",
            label: "Estado",
            render: (model: AIModel) => (
                model.isActive ? (
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
            render: (model: AIModel) => (
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(model.id);
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
                            {currentModel.id ? "Editar Modelo" : "Nuevo Modelo"}
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
                                    value={currentModel.name}
                                    onChange={(e) => setCurrentModel({ ...currentModel, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    placeholder="Ej: GPT-4 Production"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={currentModel.type}
                                    onChange={(e) => setCurrentModel({ ...currentModel, type: e.target.value, config: {} })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value={AIModelType.OPENAI}>OpenAI (Chat GPT)</option>
                                    <option value={AIModelType.OLLAMA}>Ollama (Local)</option>
                                    <option value={AIModelType.ANTHROPIC}>Anthropic (Claude)</option>
                                </select>
                            </div>
                        </div>

                        {/* Dynamic Configuration Fields */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Configuración {currentModel.type}</h3>

                            {currentModel.type === AIModelType.OPENAI && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                                        <input
                                            type="password"
                                            value={currentModel.config?.apiKey || ""}
                                            onChange={(e) => updateConfig("apiKey", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="sk-..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Model Name</label>
                                        <input
                                            type="text"
                                            value={currentModel.config?.modelName || "gpt-3.5-turbo"}
                                            onChange={(e) => updateConfig("modelName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="gpt-4, gpt-3.5-turbo"
                                        />
                                    </div>
                                </>
                            )}

                            {currentModel.type === AIModelType.OLLAMA && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Base URL</label>
                                        <input
                                            type="text"
                                            value={currentModel.config?.baseUrl || "http://localhost:11434"}
                                            onChange={(e) => updateConfig("baseUrl", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="http://localhost:11434"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Model Name</label>
                                        <input
                                            type="text"
                                            value={currentModel.config?.modelName || "llama2"}
                                            onChange={(e) => updateConfig("modelName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="llama2, mistral"
                                        />
                                    </div>
                                </>
                            )}

                            {currentModel.type === AIModelType.ANTHROPIC && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                                        <input
                                            type="password"
                                            value={currentModel.config?.apiKey || ""}
                                            onChange={(e) => updateConfig("apiKey", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="sk-ant-..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Model Name</label>
                                        <input
                                            type="text"
                                            value={currentModel.config?.modelName || "claude-3-opus-20240229"}
                                            onChange={(e) => updateConfig("modelName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                            placeholder="claude-3-opus..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={currentModel.isActive}
                                onChange={(e) => setCurrentModel({ ...currentModel, isActive: e.target.checked })}
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
                title="Modelos IA"
                data={models}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(m) => m.id}
                newRecordLabel="Nuevo Modelo"
                searchPlaceholder="Buscar modelos..."
            />
        </div>
    )
}
