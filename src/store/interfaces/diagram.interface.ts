export type DiagramStatus = 'draft' | 'review' | 'approved' | 'deprecated'

export interface IDiagram {
  id: string
  title: string
  slug: string
  description: string
  notes: string
  status: DiagramStatus
  tags: string[]
  canvasData: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface IDiagramGetAllResponse {
  data: IDiagram[]
  total: number
}

export interface IDiagramCreatePayload {
  title: string
  description?: string
  notes?: string
  status?: DiagramStatus
  tags?: string[]
  canvasData?: Record<string, unknown> | null
}

export interface IDiagramUpdatePayload {
  title?: string
  description?: string
  notes?: string
  status?: DiagramStatus
  tags?: string[]
  canvasData?: Record<string, unknown> | null
}
