'use client'

import React, { useMemo } from 'react'
import { Search, FolderGit2, Trash2, Calendar } from 'lucide-react'
import { useDiagram } from '@/store/hooks/useDiagram.hook'
import { Badge } from '@/components/ui/Badge'
import { IDiagram } from '@/store/interfaces/diagram.interface'

interface SidebarProps {
  isOpen: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const {
    diagramList,
    selectedDiagram,
    setSelectedDiagram,
    diagramDelete,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
  } = useDiagram()

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    diagramList.forEach((d) => d.tags.forEach((t) => tagsSet.add(t)))
    return Array.from(tagsSet)
  }, [diagramList])

  // Filter diagrams
  const filteredDiagrams = useMemo(() => {
    return diagramList.filter((d) => {
      const matchQuery =
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchTag = !selectedTag || d.tags.includes(selectedTag)

      return matchQuery && matchTag
    })
  }, [diagramList, searchQuery, selectedTag])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('¿Estás seguro de que deseas eliminar este diagrama?')) {
      await diagramDelete(id)
    }
  }

  return (
    <aside
      className={`${
        isOpen ? 'w-72 md:w-80' : 'w-0'
      } transition-all duration-200 ease-in-out border-r border-border bg-background flex flex-col shrink-0 overflow-hidden select-none`}
    >
      {/* Header of Sidebar */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider">
          <FolderGit2 className="w-4 h-4 text-primary" />
          <span>Catálogo ({diagramList.length})</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border bg-secondary/10">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título, tag o texto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/60 text-xs text-foreground placeholder:text-muted-foreground rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-transparent transition-all"
          />
        </div>

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 cursor-pointer transition-colors ${
                selectedTag === null
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 cursor-pointer transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Diagrams List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {filteredDiagrams.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No se encontraron diagramas con los filtros actuales.
          </div>
        ) : (
          filteredDiagrams.map((d: IDiagram) => {
            const isSelected = selectedDiagram?.id === d.id
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDiagram(d)}
                className={`p-3 cursor-pointer transition-colors group relative ${
                  isSelected
                    ? 'bg-primary/10 border-l-2 border-l-primary'
                    : 'hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <h4
                    className={`text-xs font-semibold leading-tight truncate ${
                      isSelected ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    {d.title}
                  </h4>
                  <Badge status={d.status} className="shrink-0 scale-90" />
                </div>

                {d.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                    {d.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(d.updatedAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDelete(e, d.id)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Eliminar diagrama"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
