# 🛋️ Tienda Web de Muebles Infantiles - React + WhatsApp Checkout

Plataforma de comercio electrónico para venta de muebles y camas cunas convertibles, con cotización y checkout directo hacia WhatsApp y panel administrativo independiente.

## 🌟 Características Principales

1. **Catálogo Interactivo con Variantes (Referencia Imagen 1):**
   - Tarjetas de producto (`ProductCard`) con badge flotante de categoría.
   - Selector dinámico de **Tipo** (Sencilla, Semidoble, etc.).
   - Selector dinámico de **Adicionales** (Solita, Con colchón, Combo + lencería).
   - Cálculo del precio reactivo en tiempo real (Base + modificador de tipo + modificador de adicional).
   - Botón directo `+ Agregar al pedido` y botón de consulta rápida por WhatsApp.

2. **Header y Hero Banner (Referencia Imagen 2):**
   - Barra de navegación moderna con branding dinámico y contador de carrito `Mi Pedido`.
   - Hero banner redondeado con imagen de fondo, textos, botones CTA y metadata de contacto (WhatsApp, Instagram, Web).

3. **Checkout Directo a WhatsApp:**
   - Drawer lateral "Mi Pedido" con resumen de productos, desglose de variantes y cálculo de total.
   - Generación de mensaje estructurado con emojis y datos del cliente para enviar directamente al número de WhatsApp configurado.

4. **Panel de Administración Privado (`/admin`):**
   - Pantalla de inicio de sesión protegida para el administrador.
   - **Gestor de Productos:** Formulario para crear y editar productos con opciones dinámicas de tipos y adicionales con precio.
   - **Gestor de Categorías:** Configuración de categorías con iconos y colores personalizados.
   - **Identidad de Empresa (White-Label):** Permite cambiar el nombre de la empresa, logo, WhatsApp, Instagram, slogan y banner para adaptar la tienda a múltiples clientes o marcas del sector.
   - **Respaldo:** Exportación e importación de la configuración completa en formato JSON.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

```bash
# 1. Instalar dependencias (si aún no se han instalado)
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

El servidor estará disponible en:
- **Tienda Pública:** [http://localhost:5173/](http://localhost:5173/)
- **Panel Administrativo:** [http://localhost:5173/admin](http://localhost:5173/admin)

### Credenciales por Defecto de Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
