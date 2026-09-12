# Reglas de Desarrollo del Proyecto (FurnitureStore)

Este repositorio sigue directrices estrictas de arquitectura, tipado y desarrollo que deben ser respetadas en cada cambio o nueva característica.

## 1. Lenguaje y Tipado
- **TypeScript Obligatorio:** Todo archivo en `src/` debe ser `.ts` o `.tsx`. No se permite el uso de JavaScript plano (`.js`/`.jsx`) en el código de aplicación.
- **Tipado Fuerte:** Definir interfaces o tipos explícitos para props, modelos de datos, retornos de hooks y estados en `src/types/index.ts` o archivos de tipos locales.
- **Evitar `any`:** Utilizar tipos estrictos, `unknown` con type guards o genéricos en lugar de `any`.

## 2. Arquitectura Modular de Componentes
Todo componente debe residir en su propia carpeta con la siguiente estructura:
```text
src/components/[categoria]/[NombreComponente]/
├── [NombreComponente].tsx    # Lógica y marcado JSX del componente
├── [NombreComponente].css    # Estilos CSS específicos y aislados del componente
└── index.ts                 # Barrel export limpio para importaciones directas
```

### Ejemplo de `index.ts`:
```typescript
export { default } from './NombreComponente';
export * from './NombreComponente';
```

### Ejemplo de importación de estilos en `[NombreComponente].tsx`:
```typescript
import './NombreComponente.css';
```

## 3. Gestión de Estilos
- **Estilos de Componente:** Las reglas visuales que pertenecen a un componente deben estar en su archivo `.css` local.
- **Estilos Globales (`src/index.css`):** Reservado para tokens de diseño en `:root`, reset CSS, tipografías globales y clases de utilidad compartidas.

## 4. Calidad y Cero Placeholders
- Todos los datos deben ser funcionales y respetar el flujo del negocio (catálogo, variantes, checkout a WhatsApp, panel administrativo).
- Siempre verificar la compilación estricta con `npx tsc --noEmit` y `npm run build` tras realizar modificaciones.
