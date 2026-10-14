'use client'

import React, { useState } from 'react'
import {
  Layers,
  Columns,
  Square,
  FileText,
  Share2,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { useDiagram } from '@/store/hooks/useDiagram.hook'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DiagramExportModal } from '@/components/functional/DiagramExportModal'

interface HeaderProps {
  onOpenNewModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewModal }) => {
  const { selectedDiagram, activeViewMode, setActiveViewMode, isSavingCanvas } = useDiagram()
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <>
      <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">Diagram Nexus</span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {selectedDiagram && (
            <div className="hidden sm:flex items-center gap-2 max-w-xs md:max-w-md truncate">
              <span className="text-xs font-semibold text-foreground truncate">
                {selectedDiagram.title}
              </span>
              <Badge status={selectedDiagram.status} />
              {isSavingCanvas ? (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" /> Canvas guardando...
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* View mode toggle: Split / Canvas / Notes */}
          <div className="flex items-center p-0.5 bg-secondary rounded-lg border border-border">
            <button
              onClick={() => setActiveViewMode('split')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                activeViewMode === 'split'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Vista Dividida (Lienzo + Notas)"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveViewMode('canvas')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                activeViewMode === 'canvas'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Solo Lienzo de Dibujo"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveViewMode('notes')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                activeViewMode === 'notes'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Solo Documentación Markdown"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* Export / Reference */}
          {selectedDiagram && (
            <Button
              variant="outline"
              size="sm"
              icon={<Share2 className="w-3.5 h-3.5" />}
              label="Exportar"
              onClick={() => setIsExportOpen(true)}
            />
          )}

          {/* New Diagram Button */}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            label="Nuevo"
            onClick={onOpenNewModal}
          />
        </div>
      </header>

      {/* Export modal */}
      <DiagramExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        diagram={selectedDiagram}
      />
    </>
  )
}
