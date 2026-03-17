# MANUAL TÉCNICO Y DE USUARIO — Ecosistema B2B (v2.0)

Este manual detalla la arquitectura, configuración y operación del ecosistema **b2bempresas.com**, centrado en la **APP_CD** (Activación de Catálogo Digital) y los servicios centrales integrados. Actualizado para reflejar la migración a tecnologías modernas de alto rendimiento y el modelo de activación centralizada.

---

## 1. Arquitectura Técnica (v2.0)
El sistema ha evolucionado de una arquitectura monolítica a un **Monorepo gestionado con Turbo**, optimizando la velocidad de carga y el SEO.

### Stack Tecnológico Actual:
*   **Framework:** Next.js 16 (App Router) - Optimización de Server Components y Streaming.
*   **Lenguaje:** TypeScript 5+ para robustez en el tipado.
*   **Base de Datos y Auth:** Supabase (PostgreSQL) - Reemplaza a Firebase para mayor flexibilidad relacional.
*   **Estilos:** Tailwind CSS 4+ - Diseño premium con utilidades de última generación.
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

## 5. Historial de Versiones
*   **v1.0 (Marzo 2026):** Especificación inicial (Firebase).
*   **v2.0 (Marzo 2026):** Implementación final con Next.js 16 + Supabase + Monorepo.
*   **v2.1 (Marzo 2026):** Refactorización a Modelo de Activación Centralizada (No Descargable).

---
*Manual actualizado por Antigravity - Versión 2.1 (17 de Marzo, 2026)*

