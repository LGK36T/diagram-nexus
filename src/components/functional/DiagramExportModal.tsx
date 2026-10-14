'use client'

import React, { useState } from 'react'
import { Copy, Download, Check, FileCode, Share2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { IDiagram } from '@/store/interfaces/diagram.interface'

interface DiagramExportModalProps {
  isOpen: boolean
  onClose: () => void
  diagram: IDiagram | null
}

export const DiagramExportModal: React.FC<DiagramExportModalProps> = ({
  isOpen,
  onClose,
  diagram,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null)

  if (!diagram) return null

  const getFullMarkdown = () => {
    return `---
title: "${diagram.title}"
status: "${diagram.status}"
tags: [${diagram.tags.map((t) => `"${t}"`).join(', ')}]
created_at: "${diagram.createdAt}"
updated_at: "${diagram.updatedAt}"
---

${diagram.notes}
`
  }

  const getReadmeSnippet = () => {
    return `### ${diagram.title}
- **Estado:** \`${diagram.status.toUpperCase()}\`
- **Etiquetas:** ${diagram.tags.map((t) => `\`#${t}\``).join(' ')}

${diagram.description ? `> ${diagram.description}` : ''}
`
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([getFullMarkdown()], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${diagram.slug}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadSnapshot = () => {
    const payload = JSON.stringify(diagram, null, 2)
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${diagram.slug}.nexus.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Exportar / Referenciar: ${diagram.title}`}>
      <div className="space-y-6">
        {/* Section 1: Snippet for README / PRs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-primary" />
            Snippet para README.md o Pull Request
          </label>
          <div className="relative">
            <pre className="p-3 bg-secondary/40 border border-border rounded-lg text-xs font-mono text-foreground overflow-x-auto">
              {getReadmeSnippet()}
            </pre>
            <button
              onClick={() => handleCopy(getReadmeSnippet(), 'snippet')}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-background border border-border text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-xs"
              title="Copiar snippet"
            >
              {copiedType === 'snippet' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Complete Markdown with Frontmatter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-primary" />
            Documentación Completa en Markdown
          </label>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={copiedType === 'markdown' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              label={copiedType === 'markdown' ? '¡Copiado!' : 'Copiar Markdown'}
              onClick={() => handleCopy(getFullMarkdown(), 'markdown')}
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              label="Descargar .md"
              onClick={handleDownloadMarkdown}
            />
          </div>
        </div>

        {/* Section 3: JSON Canvas Snapshot */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-primary" />
            Respaldo de Canvas (Tldraw Snapshot JSON)
          </label>
          <p className="text-xs text-muted-foreground">
            Descarga el archivo fuente completo con los nodos, formas y coordenadas para versionar en tu repositorio Git.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            label="Descargar Snapshot (.nexus.json)"
            onClick={handleDownloadSnapshot}
          />
        </div>
      </div>
    </Modal>
  )
}
