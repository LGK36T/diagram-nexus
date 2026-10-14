# Diagram Nexus

> **Estudio Visual de Arquitectura y Documentación Técnica (POC)**  
> Construido con **Next.js 15+ (App Router)**, **React 19**, **TypeScript 5+**, **Tldraw 5+**, **Zustand 5**, **Tailwind CSS** y **Axios**.

---

## 🎯 ¿Qué problema resuelve?

Tener solo imágenes PNG en un repositorio carece de contexto técnico y pierde la capacidad de edición futura. **Diagram Nexus** unifica:
1. **Lienzo Infinito Interactivo (Tldraw):** Crea diagramas vectoriales, cajas, relaciones, flujos y notas visuales.
2. **Documentación Markdown (ADR):** Redacta el contexto, decisiones de arquitectura y especificaciones junto al diagrama en una vista dividida (*Split-View*).
3. **Persistencia Dual Automática:** Guarda el estado editable (snapshot JSON de Tldraw) y las notas Markdown.
4. **Catálogo y Referencias:** Filtra por etiquetas (`#auth`, `#backend`, `#architecture`), busca en texto y exporta snippets listos para incrustar en `README.md` o Pull Requests.

---

## 🏗️ Arquitectura por Capas (`frontend_manager`)

El proyecto sigue estrictamente el flujo unidireccional y las reglas de diseño establecidas en las guías técnicas:

```
src/
├── app/
│   ├── layout.tsx                     # Root layout con metadatos y tokens
│   └── page.tsx                       # Página delgada (Server Component)
├── components/
│   ├── functional/
│   │   ├── DiagramStudio.tsx          # Orquestador functional ('use client', 4 estados)
│   │   ├── DiagramTldraw.tsx          # Lienzo dinámico Tldraw (sin SSR) con autosave debounced
│   │   ├── DiagramNotes.tsx           # Editor y vista previa Markdown en tiempo real
│   │   └── DiagramExportModal.tsx     # Generador de referencias y exportación
│   ├── layout/
│   │   ├── Header.tsx                 # Barra superior con selector de vistas y estados
│   │   └── Sidebar.tsx                # Catálogo de diagramas con búsqueda y tags
│   └── ui/                            # Componentes desacoplados con tokens semánticos
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── InputText.tsx
│       ├── Spinner.tsx
│       ├── ErrorMessage.tsx
│       └── Modal.tsx
├── store/
│   ├── interfaces/                    # Contratos de datos (IDiagram, IDataResponse)
│   ├── services/                      # diagramService con persistencia tipada
│   ├── zustand/                       # diagramStore (ciclo onLoading, onError, error)
│   └── hooks/                         # useDiagram (selectores atómicos desacoplados)
├── styles/
│   └── globals.css                    # Design tokens semánticos HSL
└── utils/
    ├── api.ts                         # Cliente Axios configurado
    ├── config.ts                      # Configuración centralizada
    └── cn.ts                          # Utilidad de combinación de clases Tailwind
```

---

## 🚀 Puesta en Marcha

### Requisitos
- Node.js 20+ (probado en Node.js 26)
- Yarn 1.22+

### Comandos

```bash
# Instalar dependencias
yarn

# Iniciar servidor de desarrollo con Turbopack
yarn dev

# Chequeo estricto de tipos TypeScript
npx tsc --noEmit

# Compilación de producción
yarn build
```

---

## 💡 Próximos Pasos (Evolución Full-Stack)

1. **Backend Express 5:** Conectar las llamadas de `diagram.service.ts` al API Gateway siguiendo las plantillas de `skills/backend_manager`.
2. **PostgreSQL 17:** Persistir diagramas y sus esquemas en stored procedures `app.diagram_*` definidos según `skills/database_manager`.
3. **Exportación SVG en Servidor:** Generar renders vectoriales estáticos mediante un worker para previsualizaciones ultrarrápidas en repositorios Git.
