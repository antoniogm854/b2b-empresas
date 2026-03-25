# MANUAL TÉCNICO Y DE USUARIO — Industrial Premium (v1.01.2026)

Este manual detalla la arquitectura, configuración y operación del ecosistema **b2bempresas.com**, centrado en la **CATÁLOGO DIGITAL** e Intercambio de Datos B2B. Actualizado para reflejar el lanzamiento v1.01 con arquitectura Monorepo, analíticas en tiempo real y SEO dinámico.

---

## 1. Arquitectura Técnica (v1.01)
El sistema utiliza un **Monorepo gestionado con Turborepo**, optimizando la velocidad de carga y permitiendo la coexistencia de múltiples aplicaciones y paquetes compartidos.

### Stack Tecnológico:
*   **Framework:** Next.js 15.1 (App Router).
*   **Lenguaje:** TypeScript 5+.
*   **Base de Datos y Auth:** Supabase (PostgreSQL).
*   **Estilos:** Tailwind CSS 3.4 - Diseño industrial premium con glassmorphism.
*   **Orquestación:** Turborepo para gestión de builds y pipelines.

---

## 2. Servicios del Sistema (apps/web/src/lib)
*   **`analyticsService`**: (v1.01) Motor de tracking en tiempo real para `catalog_views` y `buyer_contacts`.
*   **`adminService`**: Gestión de estadísticas globales y auditoría de integridad.
*   **`catalogService`**: Sincronización entre el Catálogo Maestro y los catálogos de proveedores.
*   **`companyService`**: Operaciones sobre `tenants` y perfiles corporativos.
*   **`sunat.ts`**: Validación oficial de RUC/ID industrial.

---

## 3. Despliegue en Producción (Vercel)
Para un despliegue exitoso del monorepo, usa la siguiente configuración en el Dashboard de Vercel:

*   **Root Directory:** `.` (Raíz del proyecto, NO `apps/web`).
*   **Build Command:** `npx turbo run build --filter=web`
*   **Output Directory:** `apps/web/.next`
*   **Install Command:** `npm install`
*   **Framework Preset:** `Next.js`

### Variables de Entorno Críticas:
*   `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave pública anónima de Supabase.

---

## 4. Estética Industrial Premium
El sistema aplica un lenguaje visual de alto contraste:
1.  **Glassmorphism:** Capas traslúcidas de baja opacidad.
2.  **Acentos:** Negro Zinc-950 con acento Verde Esmeralda (`#4B6319` / `#A2C367`).
3.  **Typography:** Fuentes técnicas sans-serif para máxima legibilidad.

---

## 5. Historial de Versiones
*   **v1.01.2026-Premium (25-Mar-2026):** **Lanzamiento Oficial**. Implementación de Dashboard de Analíticas, SEO dinámico con OpenGraph, Rediseño de Landing Page v1.01 y migración final a arquitectura Monorepo Optimizada.

---
*Manual actualizado por Antigravity - Versión final v1.01.2026*

