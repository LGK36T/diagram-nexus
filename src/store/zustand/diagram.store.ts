import { create } from 'zustand'
import {
  IDiagram,
  IDiagramCreatePayload,
  IDiagramUpdatePayload,
} from '@/store/interfaces/diagram.interface'
import { diagramService } from '@/store/services/diagram.service'

export type ViewMode = 'split' | 'canvas' | 'notes'

interface DiagramState {
  diagramList: IDiagram[]
  total: number
  selectedDiagram: IDiagram | null
  activeViewMode: ViewMode
  searchQuery: string
  selectedTag: string | null
  isSavingCanvas: boolean
  onLoading: boolean
  onError: boolean
  error: string

  diagramGetAll: () => Promise<void>
  diagramGetById: (id: string) => Promise<void>
  diagramCreate: (payload: IDiagramCreatePayload) => Promise<IDiagram | null>
  diagramUpdate: (id: string, payload: IDiagramUpdatePayload) => Promise<boolean>
  diagramDelete: (id: string) => Promise<boolean>
  setSelectedDiagram: (diagram: IDiagram | null) => void
  setActiveViewMode: (mode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string | null) => void
  setIsSavingCanvas: (saving: boolean) => void
  resetError: () => void
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  diagramList: [],
  total: 0,
  selectedDiagram: null,
  activeViewMode: 'split',
  searchQuery: '',
  selectedTag: null,
  isSavingCanvas: false,
  onLoading: false,
  onError: false,
  error: '',

  diagramGetAll: async () => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await diagramService.getAll()
      if (!response.success) {
        throw new Error(response.error ?? 'Error al obtener diagramas')
      }
      const list = response.data.data
      const currentSelected = get().selectedDiagram
      const updatedSelected = currentSelected
        ? list.find((d) => d.id === currentSelected.id) ?? list[0] ?? null
        : list[0] ?? null

      set({
        diagramList: list,
        total: response.data.total,
        selectedDiagram: updatedSelected,
        onLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener diagramas'
      set({ onLoading: false, onError: true, error: message })
    }
  },

  diagramGetById: async (id: string) => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await diagramService.getById(id)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al obtener el diagrama')
      }
      set({
        selectedDiagram: response.data,
        onLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener el diagrama'
      set({ onLoading: false, onError: true, error: message })
    }
  },

  diagramCreate: async (payload) => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await diagramService.create(payload)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al crear el diagrama')
      }
      await get().diagramGetAll()
      set({ selectedDiagram: response.data, onLoading: false })
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear el diagrama'
      set({ onLoading: false, onError: true, error: message })
      return null
    }
  },

  diagramUpdate: async (id, payload) => {
    try {
      const { data: response } = await diagramService.update(id, payload)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al actualizar diagrama')
      }
      const list = get().diagramList.map((d) => (d.id === id ? response.data : d))
      const currentSelected = get().selectedDiagram
      set({
        diagramList: list,
        selectedDiagram: currentSelected?.id === id ? response.data : currentSelected,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar diagrama'
      set({ onError: true, error: message })
      return false
    }
  },

  diagramDelete: async (id) => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await diagramService.remove(id)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al eliminar el diagrama')
      }
      await get().diagramGetAll()
      set({ onLoading: false })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el diagrama'
      set({ onLoading: false, onError: true, error: message })
      return false
    }
  },

  setSelectedDiagram: (diagram) => set({ selectedDiagram: diagram }),
  setActiveViewMode: (activeViewMode) => set({ activeViewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setIsSavingCanvas: (isSavingCanvas) => set({ isSavingCanvas }),
  resetError: () => set({ onError: false, error: '' }),
}))
