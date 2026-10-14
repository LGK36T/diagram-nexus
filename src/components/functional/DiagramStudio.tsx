'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { PanelLeftClose, PanelLeftOpen, Plus, Layers } from 'lucide-react'
import { useDiagram } from '@/store/hooks/useDiagram.hook'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DiagramNotes } from '@/components/functional/DiagramNotes'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { InputText } from '@/components/ui/InputText'

// Dynamic import for Tldraw without SSR to prevent hydration mismatches
const DiagramTldrawDynamic = dynamic(
  () =>
    import('@/components/functional/DiagramTldraw').then((mod) => mod.DiagramTldraw),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full bg-background">
        <Spinner size="lg" />
        <p className="text-xs text-muted-foreground mt-3 font-medium">
          Cargando lienzo interactivo...
        </p>
      </div>
    ),
  }
)

export const DiagramStudio: React.FC = () => {
  const {
    diagramGetAll,
    diagramCreate,
    selectedDiagram,
    activeViewMode,
    onLoading,
    onError,
    error,
  } = useDiagram()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTags, setNewTags] = useState('arquitectura, diseño')
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    diagramGetAll()
  }, [diagramGetAll])

  const handleCreateDiagram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      setCreateError('El título es requerido')
      return
    }

    setCreateError('')
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean)

    const created = await diagramCreate({
      title: newTitle.trim(),
      description: newDesc.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['arquitectura'],
      status: 'draft',
    })

    if (created) {
      setNewTitle('')
      setNewDesc('')
      setNewTags('arquitectura, diseño')
      setIsNewModalOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <Header onOpenNewModal={() => setIsNewModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} />

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute z-20 top-2 left-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-xs border border-border shadow-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title={isSidebarOpen ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {onLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground mt-3">Cargando...</p>
            </div>
          )}

          {onError && !onLoading && (
            <div className="p-8 max-w-lg mx-auto my-auto w-full">
              <ErrorMessage message={error} onRetry={diagramGetAll} />
            </div>
          )}

          {!onLoading && !onError && !selectedDiagram && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="p-4 rounded-full bg-secondary text-primary mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No hay diagramas disponibles</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Crea un diagrama para comenzar a editar.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                label="Nuevo Diagrama"
                className="mt-4"
                onClick={() => setIsNewModalOpen(true)}
              />
            </div>
          )}

          {!onLoading && !onError && selectedDiagram && (
            <div className="flex-1 flex overflow-hidden">
              {/* Canvas View */}
              {(activeViewMode === 'split' || activeViewMode === 'canvas') && (
                <div
                  className={`h-full relative overflow-hidden transition-all duration-150 ${
                    activeViewMode === 'split' ? 'w-full md:w-3/5 lg:w-3/5' : 'w-full'
                  }`}
                >
                  <DiagramTldrawDynamic
                    diagramId={selectedDiagram.id}
                    initialData={selectedDiagram.canvasData}
                  />
                </div>
              )}

              {/* Notes View */}
              {(activeViewMode === 'split' || activeViewMode === 'notes') && (
                <div
                  className={`h-full overflow-hidden transition-all duration-150 ${
                    activeViewMode === 'split' ? 'w-full md:w-2/5 lg:w-2/5' : 'w-full'
                  }`}
                >
                  <DiagramNotes diagramId={selectedDiagram.id} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Nuevo Diagrama"
      >
        <form onSubmit={handleCreateDiagram} className="space-y-4">
          <InputText
            id="diagram-title"
            label="Título de la Arquitectura *"
            placeholder="Ej. Flujo de Pagos con Webhooks y Worker"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            error={createError}
            autoFocus
          />

          <InputText
            id="diagram-desc"
            label="Descripción Corta"
            placeholder="Resumen del subsistema o caso de uso"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <InputText
            id="diagram-tags"
            label="Etiquetas (separadas por coma)"
            placeholder="backend, postgres, worker, stripe"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              label="Cancelar"
              onClick={() => setIsNewModalOpen(false)}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              label="Crear Diagrama"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
