"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Timer, Save, X, Play } from "lucide-react"
import TableTemplate from "@/components/TableTemplate"

interface ScheduledTask {
    id: string
    name: string
    function: string
    frequency: string
    interval: number
    isActive: boolean
    createdAt: string
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<ScheduledTask[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentTask, setCurrentTask] = useState<Partial<ScheduledTask>>({
        name: "",
        function: "",
        frequency: "Minutos",
        interval: 1,
        isActive: true,
    })

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks")
            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            }
        } catch (error) {
            console.error("Error fetching tasks:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return

        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setTasks(tasks.filter((t) => t.id !== id))
            }
        } catch (error) {
            console.error("Error deleting task:", error)
        }
    }

    const handleEdit = (task: ScheduledTask) => {
        setCurrentTask(task)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentTask({
            name: "",
            function: "",
            frequency: "Minutos",
            interval: 5,
            isActive: true,
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = currentTask.id ? "PUT" : "POST"
            const url = currentTask.id
                ? `/api/tasks/${currentTask.id}`
                : "/api/tasks"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentTask),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchTasks()
            }
        } catch (error) {
            console.error("Error saving task:", error)
        }
    }

    const handleRun = async (task: ScheduledTask) => {
        try {
            const res = await fetch(`/api/tasks/${task.id}/run`, {
                method: "POST",
            })
            if (res.ok) {
                alert(`Tarea "${task.name}" iniciada correctamente.`)
            }
        } catch (error) {
            console.error("Error executing task:", error)
        }
    }

    const columns = [
        {
            key: "name",
            label: "Tarea",
            render: (t: ScheduledTask) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center text-purple-600">
                        <Timer size={18} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{t.function}()</div>
                    </div>
                </div>
            )
        },
        {
            key: "schedule",
            label: "Frecuencia",
            render: (t: ScheduledTask) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                    Cada {t.interval} {t.frequency}
                </span>
            )
        },
        {
            key: "isActive",
            label: "Estado",
            render: (t: ScheduledTask) => (
                t.isActive ? (
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
            render: (t: ScheduledTask) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRun(t);
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Ejecutar ahora"
                    >
                        <Play size={18} />
                    </button>
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
            <div className="max-w-xl mx-auto mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {currentTask.id ? "Editar Tarea" : "Nueva Tarea Planificada"}
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                required
                                value={currentTask.name}
                                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                placeholder="Ej: Sincronización diaria"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Función</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-sm">fn:</span>
                                <input
                                    type="text"
                                    required
                                    value={currentTask.function}
                                    onChange={(e) => setCurrentTask({ ...currentTask, function: e.target.value })}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-mono text-sm"
                                    placeholder="syncData"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={currentTask.interval}
                                    onChange={(e) => setCurrentTask({ ...currentTask, interval: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                                <select
                                    value={currentTask.frequency}
                                    onChange={(e) => setCurrentTask({ ...currentTask, frequency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Minutos">Minutos</option>
                                    <option value="Hora">Hora(s)</option>
                                    <option value="Día">Día(s)</option>
                                    <option value="Semana">Semana(s)</option>
                                    <option value="Año">Año(s)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={currentTask.isActive}
                                onChange={(e) => setCurrentTask({ ...currentTask, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
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
        <div className="max-w-5xl mx-auto">
            <TableTemplate
                title="Tareas Planificadas"
                data={tasks}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                getItemId={(t) => t.id}
                newRecordLabel="Nueva Tarea"
                searchPlaceholder="Buscar tareas..."
            />
        </div>
    )
}
