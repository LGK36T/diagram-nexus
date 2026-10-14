# Changelog

Todos los cambios notables en este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-13

### Added
- **Lienzo Interactivo:** Integración de Tldraw 5+ con importación dinámica sin SSR para dibujo de diagramas vectoriales.
- **Documentación Markdown:** Editor y previsualizador en tiempo real con pestañas de edición, vista previa y modo split-view.
- **Plantilla ADR:** Inserción automática de plantilla para Architecture Decision Records.
- **Persistencia Reactiva:** Store global en Zustand 5 con selectores atómicos y autoguardado de snapshots en localStorage.
- **Catálogo de Diagramas:** Barra lateral con búsqueda en tiempo real y filtrado por etiquetas temáticas (#auth, #backend, etc.).
- **Exportación y Referencias:** Modal de exportación de snippets para README/PR, descarga de Markdown y snapshot JSON.
- **Design Tokens:** Configuración semántica de temas y variables HSL en `globals.css` según `frontend_manager`.
