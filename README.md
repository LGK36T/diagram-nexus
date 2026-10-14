# Diagram Nexus

Herramienta web para creación de diagramas con Tldraw y documentación técnica en Markdown.

## Características

- **Lienzo de dibujo:** Integración con `@tldraw/tldraw` para diagramas vectoriales y esquemas técnicos.
- **Documentación Markdown:** Editor y vista previa en tiempo real (*split-view*) para contexto y decisiones de arquitectura (ADR).
- **Persistencia:** Almacenamiento y sincronización automática de snapshots del lienzo y notas.
- **Catálogo:** Organización, búsqueda y filtrado por etiquetas.
- **Exportación:** Generación de snippets para README, descarga de Markdown y respaldo JSON del canvas.

## Arquitectura

El frontend sigue una estructura modular por capas:

- `src/app`: Enrutamiento con Next.js App Router.
- `src/components/functional`: Componentes de dominio del editor y lienzo.
- `src/components/layout`: Componentes estructurales (Header, Sidebar).
- `src/components/ui`: Componentes base desacoplados con tokens semánticos.
- `src/store`: Interfaces, servicios de persistencia, stores de Zustand y custom hooks.
- `src/styles`: Tokens de diseño y estilos globales con Tailwind CSS.
- `src/utils`: Configuración y utilidades compartidas.

## Desarrollo

```bash
# Instalar dependencias
yarn

# Iniciar servidor de desarrollo
yarn dev

# Comprobar tipos
npx tsc --noEmit

# Compilar para producción
yarn build
```

## Licencia

[MIT](LICENSE)
