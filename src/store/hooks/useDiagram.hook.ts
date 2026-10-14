import { useDiagramStore } from '@/store/zustand/diagram.store'

export const useDiagram = () => {
  const diagramGetAll      = useDiagramStore((s) => s.diagramGetAll)
  const diagramGetById     = useDiagramStore((s) => s.diagramGetById)
  const diagramCreate      = useDiagramStore((s) => s.diagramCreate)
  const diagramUpdate      = useDiagramStore((s) => s.diagramUpdate)
  const diagramDelete      = useDiagramStore((s) => s.diagramDelete)
  const diagramList        = useDiagramStore((s) => s.diagramList)
  const total              = useDiagramStore((s) => s.total)
  const selectedDiagram    = useDiagramStore((s) => s.selectedDiagram)
  const setSelectedDiagram = useDiagramStore((s) => s.setSelectedDiagram)
  const activeViewMode     = useDiagramStore((s) => s.activeViewMode)
  const setActiveViewMode  = useDiagramStore((s) => s.setActiveViewMode)
  const searchQuery        = useDiagramStore((s) => s.searchQuery)
  const setSearchQuery     = useDiagramStore((s) => s.setSearchQuery)
  const selectedTag        = useDiagramStore((s) => s.selectedTag)
  const setSelectedTag     = useDiagramStore((s) => s.setSelectedTag)
  const isSavingCanvas     = useDiagramStore((s) => s.isSavingCanvas)
  const setIsSavingCanvas  = useDiagramStore((s) => s.setIsSavingCanvas)
  const onLoading          = useDiagramStore((s) => s.onLoading)
  const onError            = useDiagramStore((s) => s.onError)
  const error              = useDiagramStore((s) => s.error)
  const resetError         = useDiagramStore((s) => s.resetError)

  return {
    diagramGetAll,
    diagramGetById,
    diagramCreate,
    diagramUpdate,
    diagramDelete,
    diagramList,
    total,
    selectedDiagram,
    setSelectedDiagram,
    activeViewMode,
    setActiveViewMode,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    isSavingCanvas,
    setIsSavingCanvas,
    onLoading,
    onError,
    error,
    resetError,
  }
}
