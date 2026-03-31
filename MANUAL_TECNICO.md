# MANUAL TÉCNICO Y DE USUARIO — Industrial Premium (v1.01.4)

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
*   **`adminService`**: Gestión de estadísticas globales y auditoría de integridad (Showcase/Companies).
*   **`showcaseService`**: (v1.01.4) Gestión de productos destacados y vitrina B2B (anteriormente `adService`).
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

---

## 4. Estética Industrial Premium
El sistema aplica un lenguaje visual de alto contraste:
1.  **Glassmorphism:** Capas traslúcidas de baja opacidad.
2.  **Acentos:** Negro Zinc-950 con acento Verde Esmeralda (`#4B6319` / `#A2C367`).
3.  **Typography:** Fuentes técnicas sans-serif para máxima legibilidad.

## 5. Estándar de Diseño "Industrial Premium" v6.0

Para garantizar una imagen corporativa coherente desde la primera instalación, el sistema aplica automáticamente el modelo **"CLASSIC INDUSTRIAL"**.

### Protocolo de Pre-grabado (Pre-configuration)
- **Activación**: Al momento del registro (`authService.signUp`).
- **Configuración Maestra**: Definida en `lib/constants.ts` (`DEFAULT_CATALOG_SETTINGS`).
- **Template ID**: `classic`.
- **Paleta Técnica**: Primario `#4B6319` (Verde Industrial), Secundario `#A2C367` (Lima).
- **Tipografía**: `Inter` (Legibilidad técnica).

### Estructura de Visualización (Flyer Layout)
- **Cuadrícula**: Grid de 3 columnas para productos regulares.
- **Héroe**: Espacio de alto impacto para producto estrella con "look & feel" de folleto técnico.
- **Footer Corporativo**: Incluye sincronización digital (QR), datos fiscales y canales de soporte industrial.

---

## 6. Protocolos de Seguridad y Validación (v1.01.4)
1.  **Doble Capa de Seguridad (Master-Login):** Todo acceso corporativo vía "Clave Maestra" fuerza el cierre de sesiones previas (`mode=welcome`) y exige la validación de credenciales individuales (User/Pass).
2.  **Validación de Canales Digitales:** Los campos de redes sociales cuentan con mapeo estricto de dominios (ej: LinkedIn, TikTok) e impiden el guardado de datos cruzados o inválidos mediante alertas visuales en rojo.
3.  **Compliance Score:** Auditoría automatizada de perfil (vía `Step2Profile.tsx`) que asigna puntaje basado en la veracidad técnica de los datos.

---

## 7. Historial de Versiones
*   **v1.01.2026-Premium (25-Mar-2026):** Lanzamiento Oficial. Analíticas, SEO dinámico con OpenGraph, Rediseño Landing v1.01, Monorepo y **Seguridad Corporativa Dual**.
*   **v1.01.4 (25-Mar-2026):** **Auditoría & Optimización**. Purga de terminología "Anuncios", implementación de `showcaseService` y Bitácora Maestra.
*   **v1.01.6 (30-Mar-2026):** **Master Gate & Dashboard Freemium**.
    *   **Master Gate**: Aislamiento del portal en `/master` (sin `MainLayout` público) y redirección directa al `/admin-console` evadiendo bucles de login.
    *   **Dashboard Freemium**: Se establece el protocolo de ingesta de 20 productos gratuitos limitados a 1 CSV Loader masivo, posponiendo la creación 1 a 1 para usuarios pro.
    *   **SEO Técnico**: Inyección estática LCP en Hero Section y mapeo dinámico de subdirectorios Tenant en `sitemap.ts`.

---

## VII. Protocolo de Resguardo y Registro de Acciones (Auditoría)

Para garantizar la integridad operativa de `b2bempresas.com` y que ninguna acción técnica o administrativa quede sin supervisión, se establece el siguiente protocolo:

### 1. Registro de Cambios Técnicos (Bitácora Maestra)
- Toda modificación estructural (Standard v6.0, Sincronización Maestro) se registra en la `bitacora_maestra.md`.
- **Propósito**: Mantener un historial legible para el Administrador Central.

### 2. Control de Versiones (Git)
- Se debe realizar un `git commit` descriptivo antes de cada despliegue a Vercel.

### 3. Supervisión de Configuraciones (Panel Maestro)
- Las configuraciones se almacenan en `tenants.catalog_settings`. Se recomienda auditoría manual periódica comparando con la Bitácora.

---
---
*Manual actualizado v1.01.6 - Enfoque Industrial Premium*

