'use client'

import React, { useEffect, useRef } from 'react'
import { Tldraw, Editor, getSnapshot, loadSnapshot, TLStoreSnapshot } from 'tldraw'
import { useDiagram } from '@/store/hooks/useDiagram.hook'

interface DiagramTldrawProps {
  diagramId: string
  initialData: Record<string, unknown> | null
}

export const DiagramTldraw: React.FC<DiagramTldrawProps> = ({ diagramId, initialData }) => {
  const { diagramUpdate, setIsSavingCanvas } = useDiagram()
  const editorRef = useRef<Editor | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMount = (editor: Editor) => {
    editorRef.current = editor

    // Load initial snapshot if present
    if (initialData) {
      try {
        loadSnapshot(editor.store, initialData as unknown as TLStoreSnapshot)
      } catch (err) {
        console.warn('No se pudo cargar el snapshot previo de Tldraw:', err)
      }
    }

    // Subscribe to store updates for debounced auto-saving
    const unsubscribe = editor.store.listen(
      () => {
        setIsSavingCanvas(true)
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(async () => {
          try {
            const snapshot = getSnapshot(editor.store)
            await diagramUpdate(diagramId, {
              canvasData: snapshot as unknown as Record<string, unknown>,
            })
          } finally {
            setIsSavingCanvas(false)
          }
        }, 700)
      },
      { source: 'user', scope: 'document' }
    )

    return () => {
      unsubscribe()
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [diagramId])

  return (
    <div className="relative w-full h-full bg-background select-none">
      <Tldraw
        key={diagramId}
        onMount={handleMount}
        autoFocus={false}
      />
    </div>
  )
}
