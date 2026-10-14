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
    title: 'Arquitectura Unidireccional & Flujo de Capas',
    slug: 'arquitectura-unidireccional-flujo-capas',
    description: 'Flujo de datos y separación de responsabilidades para el frontend y backend.',
    status: 'approved',
    tags: ['frontend', 'architecture', 'nextjs', 'zustand'],
    notes: `# Arquitectura Unidireccional & Flujo de Capas

## 1. Contexto y Propósito
Este diagrama define el flujo estricto de datos en la aplicación frontend, garantizando mantenibilidad, trazabilidad y testing aislado.

## 2. Flujo de Datos por Capas
\`\`\`
Page (App Router)
  └── Functional Component ('use client')
        └── Custom Hook (useDiagram)
              └── Zustand Store (diagram.store)
                    └── Service (diagram.service)
                          └── Storage / API Gateway
\`\`\`

## 3. Decisiones de Diseño (ADR)
* **ADR-001 - Acceso a Estado:** Los componentes de interfaz consumen únicamente Hooks con selectores atómicos (\`s => s.field\`), previniendo re-renderizados innecesarios.
* **ADR-002 - Lienzo Interactivo:** Integración de Tldraw desacoplada mediante importación dinámica del lado del cliente (\`ssr: false\`).
* **ADR-003 - Documentación Viva:** El editor de Markdown sincroniza notas técnicas con el identificador del diagrama.

## 4. Estado de los Componentes
Cada componente maneja 4 estados de forma obligatoria:
1. **Inicial**
2. **Carga** (\`onLoading\`)
3. **Error con reintento** (\`onError\`)
4. **Éxito / Datos**
`,
    canvasData: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2849e71-460d-4569-8f81-dc0839e94322',
    title: 'Flujo de Autenticación JWT y Refresh Tokens',
    slug: 'autenticacion-jwt-refresh-tokens',
    description: 'Ciclo de vida, rotación de credenciales y reintento en API Gateway.',
    status: 'review',
    tags: ['auth', 'security', 'backend', 'postgresql'],
    notes: `# Autenticación y Rotación de Tokens

## 1. Resumen
Estrategia de seguridad basada en doble token para aplicaciones web con sesión persistente.

## 2. Parámetros Técnicos
* **Access Token:** Vida útil de 15 minutos en memoria o cookie segura.
* **Refresh Token:** Almacenado en tabla relacional con bandera de revocación (\`is_revoked\`).
* **Rotación:** Cada consumo de un refresh token genera un nuevo par e invalida el anterior.

## 3. Diagrama de Secuencia
1. Cliente envía credenciales a \`/api/v1/auth/login\`.
2. Servidor valida password con hash seguro y emite el par de tokens.
3. El cliente adjunta el Bearer token en cada solicitud.
4. Al recibir \`401 Unauthorized\`, el interceptor solicita renovación transparente.
`,
    canvasData: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
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
      notes: payload.notes || `# ${payload.title}\n\nEscribe aquí la explicación técnica del diagrama...`,
      status: payload.status || 'draft',
      tags: payload.tags || ['arquitectura'],
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
