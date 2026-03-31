# MANUAL TÉCNICO Y DE USUARIO — Industrial Premium (v6.1.8)

Este manual detalla la arquitectura, configuración y operación del ecosistema **b2bempresas.com**, centrado en la **CATÁLOGO DIGITAL** e Intercambio de Datos B2B. Actualizado para reflejar la v6.1.8 con arquitectura Monorepo, analíticas en tiempo real y SEO dinámico.

---

## 1. Arquitectura Técnica (v6.1.8)
El sistema utiliza un **Monorepo gestionado con Turborepo**, optimizando la velocidad de carga y permitiendo la coexistencia de múltiples aplicaciones y paquetes compartidos.

### Stack Tecnológico:
*   **Framework:** Next.js 15.1 (App Router).
*   **Lenguaje:** TypeScript 5+.
*   **Base de Datos y Auth:** Supabase (PostgreSQL).
*   **Estilos:** Tailwind CSS 3.4 - Diseño industrial premium con glassmorphism.
*   **Orquestación:** Turborepo para gestión de builds y pipelines.

---

## 2. Servicios del Sistema (apps/web/src/lib)
*   **`analyticsService`**: Motor de tracking en tiempo real para `catalog_views` y `buyer_contacts`.
*   **`adminService`**: Gestión de estadísticas globales y administración del **Catálogo Maestro B2B**.
*   **`catalogService`**: Motor de Deduplicación Semántica y Sincronización Dual (Local/Global) con generación de **Digital DNA** (SKU-CUIM/CUIE).
*   **`companyService`**: Operaciones sobre `tenants` y perfiles corporativos.
*   **`sunat.ts`**: Validación oficial de RUC/ID industrial.

---

## 3. Despliegue en Producción (Vercel)
Para un despliegue exitoso del monorepo, usa la siguiente configuración en el Dashboard de Vercel:
*   **Root Directory:** `.`
*   **Build Command:** `npx turbo run build --filter=web`
*   **Output Directory:** `apps/web/.next`
*   **Install Command:** `npm install`
*   **Framework Preset:** `Next.js`

---

## 4. Estética Industrial Premium
El sistema aplica un lenguaje visual de alto contraste:
1.  **Glassmorphism:** Capas traslúcidas de baja opacidad.
2.  **Acentos:** Negro Zinc-950 con acento Verde Esmeralda (`#4B6319` / `#A2C367`) y **CAT Yellow** (`#FFB800`).
3.  **Typography:** Fuentes técnicas sans-serif para máxima legibilidad.

---

## 5. Historial de Versiones
*   **v1.01.2026-Premium (25-Mar-2026):** **Lanzamiento Oficial**. Analíticas en tiempo real, SEO dinámico (OpenGraph) y Rediseño Hero v1.01.
*   **v1.01.6 (26-Mar-2026):** **Gestión Profesional de Catálogos**. Detección de duplicados, fusión de datos y soporte para catálogos PDF/Web.
*   **v1.01.11 (26-Mar-2026):** **Seguridad Consolidada**. Acceso directo desde Gate Maestro y bypass middleware.
*   **v1.01.13 (27-Mar-2026):** **Estabilización PWA**. Implementación de botón flotante de instalación y purga final de código.
*   **v1.01.6-HEAD (30-Mar-2026):** **Master Gate & Dashboard Freemium**. Límite de 20 productos y optimización LCP en Hero.
*   **v6.1.8 (31-Mar-2026):** **Industrial Premium v6.1.8**. Hero de alta fidelidad, buscador industrial unificado y Digital DNA (SKU-CUIM).

---
*Manual actualizado v6.1.8 - Enfoque Industrial Premium*
