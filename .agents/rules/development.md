---
description: Reglas de desarrollo obligatorias de arquitectura modular y TypeScript para FurnitureStore
globs: ["src/**/*"]
---

# Reglas de Desarrollo del Proyecto

1. **TypeScript Obligatorio:** Todo archivo nuevo debe ser `.ts` o `.tsx`.
2. **Estructura por Componente:** Cada componente debe tener su propia carpeta:
   - `ComponentName/ComponentName.tsx`
   - `ComponentName/ComponentName.css`
   - `ComponentName/index.ts`
3. **Estilos Aislados:** Cada componente debe importar directamente su `.css` local.
4. **Tipado Estricto:** Utilizar tipos e interfaces desde `src/types/index.ts`.
