"use client"

import { useState, useMemo, useRef } from "react"
import { Plus, Settings, RefreshCw, Eye, ChevronLeft, ChevronRight, Download, Upload, EyeOff, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import * as XLSX from "xlsx"

interface Column<T> {
  key: string
  label: string
  render: (item: T) => React.ReactNode
  searchable?: boolean
}

interface TableTemplateProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  newRecordUrl?: string
  newRecordLabel?: string
  onRefresh?: () => void
  itemsPerPage?: number
  getItemId: (item: T) => string
  getEditUrl?: (item: T) => string
}

export default function TableTemplate<T>({
  title,
  data,
  columns,
  searchPlaceholder = "Buscar...",
  newRecordUrl,
  newRecordLabel = "New record",
  onRefresh,
  itemsPerPage = 10,
  getItemId,
  getEditUrl,
}: TableTemplateProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(c => c.key))
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter((item) => {
      return columns.some((column) => {
        if (column.searchable === false) return false
        const value = (item as any)[column.key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, searchTerm, columns])

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortColumn]
      const bValue = (b as any)[sortColumn]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortDirection === "asc") {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
      }
    })
  }, [filteredData, sortColumn, sortDirection])

  // Calcular paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Resetear página si cambia la búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Exportar a Excel
  const handleExportExcel = () => {
    const exportData = filteredData.map((item) => {
      const row: any = {}
      columns.forEach((column) => {
        if (visibleColumns.includes(column.key)) {
          const value = (item as any)[column.key]
          row[column.label] = value !== null && value !== undefined ? String(value) : ""
        }
      })
      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, title)
    XLSX.writeFile(workbook, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Importar desde Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result
        const workbook = XLSX.read(binaryStr, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        console.log("Datos importados:", jsonData)
        alert(`Se importaron ${jsonData.length} registros. Revisa la consola para ver los datos.`)
        
        // Aquí puedes agregar lógica adicional para procesar los datos importados
      } catch (error) {
        console.error("Error al importar:", error)
        alert("Error al importar el archivo Excel")
      }
    }
    reader.readAsBinaryString(file)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Toggle visibilidad de columna
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((k) => k !== columnKey)
        : [...prev, columnKey]
    )
  }

  // Manejar ordenamiento
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Si ya está ordenado por esta columna, cambiar dirección
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      // Nueva columna, ordenar ascendente
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Collections</h1>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Exportar a Excel"
          >
            <Download size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Importar desde Excel"
          >
            <Upload size={18} />
          </button>
          {newRecordUrl && (
            <Link
              href={newRecordUrl}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              {newRecordLabel}
            </Link>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {sortColumn === column.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} className="opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item) => {
                const editUrl = getEditUrl ? getEditUrl(item) : undefined
                return (
                  <tr
                    key={getItemId(item)}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => {
                      if (editUrl) window.location.href = editUrl
                    }}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              {searchTerm ? "No se encontraron resultados" : "No hay registros"}
            </p>
          </div>
        )}

        {/* Footer with pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <span>
            Total found: {filteredData.length} {searchTerm && `(filtrado de ${data.length})`}
          </span>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar solo páginas cercanas a la actual
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2 py-1 rounded text-xs ${
                          currentPage === page
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page}>...</span>
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
