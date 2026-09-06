# Nord Ropa — Tienda de ropa online

Tienda de ropa full-stack (catálogo, carrito, checkout con pagos reales y panel de administración) construida como proyecto personal para practicar arquitectura en capas y una integración de pagos de producción.

**Pitch corto (para tarjeta de portfolio):**
> E-commerce full-stack con Next.js, checkout integrado con MercadoPago (pagos reales tokenizados) y panel de admin con gestión de stock por variante, construido con arquitectura en capas inspirada en SOLID.

## Stack

| Capa | Tecnología |
|---|---|
| Framework full-stack | Next.js 15 (App Router) + React 18 + TypeScript |
| Base de datos | SQL vía Prisma ORM (SQLite en dev, migrable a Postgres/MySQL sin tocar lógica de negocio) |
| Autenticación | NextAuth (Credentials + JWT), roles USER/ADMIN |
| Pagos | MercadoPago Checkout Bricks (Payment Brick embebido) |
| Estilos | Tailwind CSS |
| Estado del carrito | Zustand (persistido en localStorage) |
| Validación | Zod |
| Infraestructura | Docker + despliegue en Railway |

## Funcionalidades

**Tienda (usuario)**
- Catálogo con filtro por categoría.
- Detalle de producto con selección de talle/color y stock en tiempo real.
- Carrito persistente y checkout con validación de precio y stock en el servidor.
- Registro/login y historial de pedidos ("Mis pedidos").

**Panel de administrador**
- Dashboard con métricas: productos, pedidos, ingresos, alertas de stock bajo.
- ABM de productos y categorías, con búsqueda, filtros y paginación.
- Gestión de stock por variante (talle/color/SKU).
- Gestión de pedidos con cambio de estado (Pendiente → Pagado → Enviado → Entregado/Cancelado).

## Lo más destacable a nivel técnico

- **Arquitectura en capas (SOLID)**: `domain` (interfaces de repositorio, sin dependencias externas) → `infrastructure` (adaptadores Prisma) → `application/services` (lógica de negocio) → `app` (rutas Next.js). Un único archivo (`lib/container.ts`) conecta todo — cambiar de proveedor de base de datos o agregar un método de pago nuevo no toca los servicios existentes.
- **Pagos reales, no simulados**: integración con el SDK de MercadoPago v2 (Checkout Bricks), con tokenización de tarjeta en el cliente, recálculo de montos en el servidor (nunca se confía en lo que manda el navegador) y confirmación tanto síncrona (respuesta del Brick) como asíncrona (webhook idempotente).
- **Concurrencia controlada**: el descuento de stock ocurre en la misma transacción atómica que la confirmación del pago, para evitar sobreventa si dos pagos compiten por la misma variante.
- **Seguridad**: contraseñas hasheadas con bcrypt, rutas `/admin`, `/checkout` y `/mis-pedidos` protegidas por middleware + verificación de rol en cada endpoint de API (no solo en la UI).
- **Deploy-ready**: Dockerfile multi-stage y configuración de Railway con volumen persistente para la base SQLite, pensado para un despliegue real sin depender de la PC del desarrollador.

## Capturas

Ver las imágenes en esta misma carpeta (`01-catalogo.jpg` a `10-admin-categorias.jpg`) para catálogo, checkout, y las distintas vistas del panel de administración.
