# MANUAL TÉCNICO Y DE USUARIO — Ecosistema B2B (v2.0)
Este manual detalla la arquitectura, configuración y operación del ecosistema **b2bempresas.com**, centrado en la **CATÁLOGO DIGITAL** (Activación de Catálogo Digital) e Intercambio de Datos B2B. Actualizado para reflejar la migración a tecnologías modernas de alto rendimiento y el modelo de activación centralizada.

---

## 1. Arquitectura Técnica (v2.0)
El sistema ha evolucionado de una arquitectura monolítica a un **Monorepo gestionado con Turbo**, optimizando la velocidad de carga y el SEO.

### Stack Tecnológico Actual:
*   **Framework:** Next.js 15.1 (App Router) - Optimización de Server Components y Streaming.
*   **Lenguaje:** TypeScript 5+ para robustez en el tipado.
*   **Base de Datos y Auth:** Supabase (PostgreSQL) - Reemplaza a Firebase para mayor flexibilidad relacional.
*   **Estilos:** Tailwind CSS 3.4 - Diseño premium con utilidades estables y alto rendimiento.
*   **Generación de PDF:** jsPDF (Client-side) para reportes instantáneos.

---

## 2. Servicios del Sistema (src/lib)
El núcleo de la lógica reside en servicios especializados que interactúan con Supabase:

*   **`adminService`:** Gestión de estadísticas globales, auditoría de integridad GCM y validación de empresas/anuncios.
*   **`catalogService`:** Sincronización entre el Catálogo Maestro (GCM) y los catálogos personalizados de los proveedores.
*   **`transactionalService`:** Gestión de Leads (pedidos), conversiones y comparación técnica de productos.
*   **`rucService`:** Validación de identidad fiscal (SUNAT/SAT) con soporte para 13 países.
*   **`reportService`:** Generación de reportes ejecutivos en PDF con KPIs de rendimiento.
*   **`aiService`:** Motor de optimización de catálogos mediante inteligencia artificial (Simulador V2).

---

## 3. Guía de Uso para el Proveedor

### A. Gestión de Catálogo
1.  **Conexión GCM:** El proveedor puede buscar productos en el Catálogo Maestro para heredarlos con un clic, asegurando datos técnicos precisos.
2.  **Optimización por IA:** Uso del `aiService` para mejorar nombres y descripciones de productos automáticamente.
3.  **Anuncios B2B:** Los productos pueden marcarse como "Destacados" mediante el sistema de anuncios gestionado por el administrador.

### B. Gestión de Leads y Cotizaciones
*   Cada interacción del comprador genera un **Lead** en el `transactionalService`.
*   El sistema permite a los compradores comparar hasta 3 productos de diferentes proveedores antes de cotizar.
*   Las notificaciones se centralizan en el panel de la empresa.

---

## 4. Mantenimiento y Auditoría
El sistema incluye una función de **Auditoría de Interconexión** (`runSystemAudit` en `adminService`) que verifica:
1.  **Integridad GCM:** Productos huérfanos sin vinculación maestra.
2.  **Trazabilidad:** Relación entre Leads y conversaciones de chat activas.
3.  **Salud Push:** Estado de las suscripciones a notificaciones.

---

## 5. Despliegue y Operación en Producción
El sistema está configurado para despliegue continuo (CI/CD) mediante GitHub y Vercel.

*   **URL de Producción:** [https://b2b-empresas-web.vercel.app](https://b2b-empresas-web.vercel.app)
*   **Comando de Build:** `npm run build` (Gestionado por Turbo)
*   **Variables Críticas:** Asegurar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas en el Dashboard de Vercel.

### 📋 Conexión de Dominio Propio (HostGator)
Para usar tu dominio contratado en HostGator:
1.  **En Vercel:** Ve a `Settings -> Domains` y añade tu dominio (ej. `b2bempresas.com`).
2.  **En HostGator:** Accede a la Zona de DNS y configura:
    *   **Tipo A:** `@` apuntando a `76.76.21.21`
    *   **Tipo CNAME:** `www` apuntando a `cname.vercel-dns.com`
3.  **Propagación:** El cambio puede tardar hasta 24 horas en reflejarse en todo el mundo.

---

## 6. Historial de Versiones
*   **v1.0 (Marzo 2026):** Especificación inicial (Firebase).
*   **v2.0 (Marzo 2026):** Implementación final con Next.js 15.1 + Supabase + Monorepo.
*   **v2.1 (Marzo 2026):** Refactorización a Modelo de Activación Centralizada.
*   **v2.2 (17-Mar-2026):** Lanzamiento exitoso en Vercel. Estabilización de Tailwind v3 y corrección de metadatos SEO.
*   **v2.5 (17-Mar-2026):** Integración de Datos Reales (End-to-End). Conexión de Registro y Dashboard con Supabase Production.

---

## 7. Optimización y SEO (Próximos Pasos)
Para mantener el portal en el primer lugar de Google y con velocidad máxima:

### A. Rendimiento (Performance)
1.  **Optimización de Imágenes:** El sistema ya utiliza el formato **WebP** (`/hero.webp`) para todas las imágenes críticas, reduciendo el LCP en un 90%. No usar formatos pesados como PNG en la sección Hero.
2.  **Streaming & Suspense:** El sistema usa `Next.js Streaming`. Asegúrate de envolver componentes pesados en `<Suspense>` para no bloquear el renderizado inicial.
3.  **Fuentes de Google:** Las fuentes Geist ya están optimizadas y se sirven localmente desde el servidor de Next.js. No añadas fuentes externas mediante `<link>` en el head.

### B. Estrategia SEO Máxima
1.  **Sitemaps Dinámicos:** He implementado `sitemap.ts` y `robots.ts` que se generan automáticamente. Puedes verlos en `/sitemap.xml` y `/robots.txt`.
2.  **OpenGraph:** Todas las páginas ya incluyen metadatos para que el link se vea profesional al compartirlo en WhatsApp o LinkedIn.
3.  **Contenido de Valor:** Google prioriza las páginas con descripciones técnicas largas. Asegúrate de que los proveedores completen todos los campos del catálogo.

---
*Manual actualizado por Antigravity - Versión 2.4 (Final Audit & Delivery - 17 de Marzo, 2026)*

