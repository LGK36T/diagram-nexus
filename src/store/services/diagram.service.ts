import { IDataResponse } from '@/store/interfaces/response.interface'
import {
  IDiagram,
  IDiagramGetAllResponse,
  IDiagramCreatePayload,
  IDiagramUpdatePayload,
} from '@/store/interfaces/diagram.interface'

const STORAGE_KEY = 'diagram_nexus_storage_v1'

const INITIAL_DIAGRAMS: IDiagram[] = [
  {
    id: 'f87a8b30-9742-4f9e-a89a-0824b4231b11',
    title: 'Arquitectura del Sistema',
    slug: 'arquitectura-del-sistema',
    description: 'Vista general de componentes, capas y persistencia.',
    status: 'draft',
    tags: ['arquitectura', 'general'],
    notes: `# Arquitectura del Sistema

Notas técnicas y decisiones de diseño asociadas a este diagrama.

## Componentes
- Frontend: Next.js y Tldraw
- Estado: Zustand
- Documentación: Markdown

## Decisiones Técnicas
- Editor de dibujo desacoplado del ciclo de renderizado principal.
- Persistencia reactiva local con soporte para exportación.
`,
    canvasData: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function getStoredDiagrams(): IDiagram[] {
  if (typeof window === 'undefined') return INITIAL_DIAGRAMS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DIAGRAMS))
      return INITIAL_DIAGRAMS
    }
    return JSON.parse(raw) as IDiagram[]
  } catch {
    return INITIAL_DIAGRAMS
  }
}

function saveStoredDiagrams(diagrams: IDiagram[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams))
}

export const diagramService = {
  getAll: async (): Promise<{ data: IDataResponse<IDiagramGetAllResponse> }> => {
    const list = getStoredDiagrams()
    return {
      data: {
        success: true,
        data: {
          data: list,
          total: list.length,
        },
      },
    }
  },

  getById: async (id: string): Promise<{ data: IDataResponse<IDiagram> }> => {
    const list = getStoredDiagrams()
    const item = list.find((d) => d.id === id)
    if (!item) {
      return {
        data: {
          success: false,
          data: null as unknown as IDiagram,
          error: 'Diagrama no encontrado',
        },
      }
    }
    return {
      data: {
        success: true,
        data: item,
      },
    }
  },

  create: async (payload: IDiagramCreatePayload): Promise<{ data: IDataResponse<IDiagram> }> => {
    const list = getStoredDiagrams()
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `diag-${Date.now()}`
    const now = new Date().toISOString()
    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const newDiagram: IDiagram = {
      id: newId,
      title: payload.title,
      slug: slug || `diagram-${Date.now()}`,
      description: payload.description || '',
      notes: payload.notes || `# ${payload.title}\n\nDocumentación del diagrama...\n`,
      status: payload.status || 'draft',
      tags: payload.tags || ['general'],
      canvasData: payload.canvasData || null,
      createdAt: now,
      updatedAt: now,
    }

    const updatedList = [newDiagram, ...list]
    saveStoredDiagrams(updatedList)

    return {
      data: {
        success: true,
        data: newDiagram,
      },
    }
  },

  update: async (
    id: string,
    payload: IDiagramUpdatePayload
  ): Promise<{ data: IDataResponse<IDiagram> }> => {
    const list = getStoredDiagrams()
    const index = list.findIndex((d) => d.id === id)
    if (index === -1) {
      return {
        data: {
          success: false,
          data: null as unknown as IDiagram,
          error: 'Diagrama no encontrado para actualizar',
        },
      }
    }

    const current = list[index]
    const updated: IDiagram = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString(),
    }

    list[index] = updated
    saveStoredDiagrams(list)

    return {
      data: {
        success: true,
        data: updated,
      },
    }
  },

  remove: async (id: string): Promise<{ data: IDataResponse<boolean> }> => {
    const list = getStoredDiagrams()
    const filtered = list.filter((d) => d.id !== id)
    saveStoredDiagrams(filtered)
    return {
      data: {
        success: true,
        data: true,
      },
    }
  },
}
