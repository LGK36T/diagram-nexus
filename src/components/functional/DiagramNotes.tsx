'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  FileText,
  Eye,
  Columns,
  Plus,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useDiagram } from '@/store/hooks/useDiagram.hook'
import { DiagramStatus } from '@/store/interfaces/diagram.interface'
import { Badge } from '@/components/ui/Badge'

interface DiagramNotesProps {
  diagramId: string
}

export const DiagramNotes: React.FC<DiagramNotesProps> = ({ diagramId }) => {
  const { selectedDiagram, diagramUpdate } = useDiagram()
  const [localNotes, setLocalNotes] = useState(selectedDiagram?.notes || '')
  const [localTitle, setLocalTitle] = useState(selectedDiagram?.title || '')
  const [localDesc, setLocalDesc] = useState(selectedDiagram?.description || '')
  const [localStatus, setLocalStatus] = useState<DiagramStatus>(selectedDiagram?.status || 'draft')
  const [localTags, setLocalTags] = useState<string[]>(selectedDiagram?.tags || [])
  const [newTagInput, setNewTagInput] = useState('')
  const [notesViewMode, setNotesViewMode] = useState<'write' | 'preview' | 'dual'>('dual')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (selectedDiagram && selectedDiagram.id === diagramId) {
      setLocalNotes(selectedDiagram.notes)
      setLocalTitle(selectedDiagram.title)
      setLocalDesc(selectedDiagram.description)
      setLocalStatus(selectedDiagram.status)
      setLocalTags(selectedDiagram.tags)
    }
  }, [diagramId, selectedDiagram])

  const triggerAutoSave = (updated: {
    title?: string
    description?: string
    notes?: string
    status?: DiagramStatus
    tags?: string[]
  }) => {
    setSaveStatus('saving')
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    debounceTimerRef.current = setTimeout(async () => {
      await diagramUpdate(diagramId, updated)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 600)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setLocalNotes(val)
    triggerAutoSave({ notes: val })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalTitle(val)
    triggerAutoSave({ title: val })
  }

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalDesc(val)
    triggerAutoSave({ description: val })
  }

  const handleStatusChange = (status: DiagramStatus) => {
    setLocalStatus(status)
    triggerAutoSave({ status })
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault()
      const clean = newTagInput.trim().replace(/^#/, '').toLowerCase()
      if (!localTags.includes(clean)) {
        const updated = [...localTags, clean]
        setLocalTags(updated)
        triggerAutoSave({ tags: updated })
      }
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = localTags.filter((t) => t !== tagToRemove)
    setLocalTags(updated)
    triggerAutoSave({ tags: updated })
  }

  const insertADRTemplate = () => {
    const adrSnippet = `\n\n## ADR: [Título de la decisión]
- Estado: Propuesto
- Fecha: ${new Date().toISOString().slice(0, 10)}

### Contexto
[Descripción del contexto o problema a resolver]

### Decisión
[Decisión técnica adoptada]

### Consecuencias
- Positivas: [Beneficios]
- Negativas: [Trade-offs o limitaciones]
`
    const updatedNotes = localNotes + adrSnippet
    setLocalNotes(updatedNotes)
    triggerAutoSave({ notes: updatedNotes })
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border overflow-hidden">
      {/* Top Bar: Title & Metadata Controls */}
      <div className="p-4 border-b border-border bg-secondary/20 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="Título del diagrama..."
            className="text-lg font-bold bg-transparent text-foreground border-b border-transparent hover:border-border focus:border-primary focus:outline-none w-full transition-colors"
          />

          <div className="flex items-center gap-2 shrink-0">
            {saveStatus === 'saving' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" /> Guardando...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Guardado
              </span>
            )}
            <Badge status={localStatus} />
          </div>
        </div>

        {/* Short description */}
        <input
          type="text"
          value={localDesc}
          onChange={handleDescChange}
          placeholder="Descripción breve del propósito arquitectónico..."
          className="text-xs text-muted-foreground bg-transparent w-full focus:outline-none border-b border-transparent focus:border-border pb-1"
        />

        {/* Status buttons & Tags row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
          {/* Status selector */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 border border-border">
            {(
              [
                { id: 'draft', label: 'Borrador' },
                { id: 'review', label: 'Revisión' },
                { id: 'approved', label: 'Aprobado' },
                { id: 'deprecated', label: 'Obsoleto' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => handleStatusChange(s.id)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                  localStatus === s.id
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex items-center flex-wrap gap-1">
            {localTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary text-[11px] text-muted-foreground border border-border"
              >
                #{t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ tag (Enter)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-transparent text-[11px] text-muted-foreground placeholder:text-muted-foreground/60 w-20 focus:outline-none border-b border-border focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Editor & Preview Toolbar */}
      <div className="px-4 py-2 border-b border-border bg-secondary/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setNotesViewMode('write')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
              notesViewMode === 'write'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={() => setNotesViewMode('preview')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
              notesViewMode === 'preview'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Vista Previa
          </button>
          <button
            onClick={() => setNotesViewMode('dual')}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
              notesViewMode === 'dual'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
        </div>

        <button
          onClick={insertADRTemplate}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-primary font-medium hover:bg-primary/10 cursor-pointer transition-colors"
          title="Insertar plantilla ADR"
        >
          <Plus className="w-3.5 h-3.5" />
          Plantilla ADR
        </button>
      </div>

      {/* Markdown Content Area */}
      <div className="flex-1 overflow-hidden">
        {notesViewMode === 'write' && (
          <textarea
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Escribe la explicación técnica en formato Markdown..."
            className="w-full h-full p-4 bg-background text-foreground text-sm font-mono leading-relaxed resize-none focus:outline-none"
          />
        )}

        {notesViewMode === 'preview' && (
          <div className="w-full h-full p-6 overflow-y-auto bg-background prose dark:prose-invert max-w-none text-foreground">
            <ReactMarkdown>{localNotes}</ReactMarkdown>
          </div>
        )}

        {notesViewMode === 'dual' && (
          <div className="grid grid-cols-2 h-full divide-x divide-border">
            <textarea
              value={localNotes}
              onChange={handleNotesChange}
              placeholder="Escribe en Markdown a la izquierda..."
              className="w-full h-full p-4 bg-background text-foreground text-xs font-mono leading-relaxed resize-none focus:outline-none overflow-y-auto"
            />
            <div className="w-full h-full p-5 overflow-y-auto bg-secondary/5 text-xs text-foreground leading-normal space-y-3">
              <ReactMarkdown>{localNotes}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
