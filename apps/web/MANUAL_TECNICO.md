# Manual Técnico — B2B Empresas v6.0

## 📂 Archivo Maestro de Identidad y Datos

### 🆔 Sistema de Identificadores (Industrial DNA)
El ecosistema utiliza tres niveles de identificación para garantizar la interoperabilidad global:

1.  **CUUP (User-Provider)**: Vinculado al `ruc` legal. Se gestiona en la tabla `tenants`. Es la clave primaria de identidad corporativa.
2.  **CID-CUIE (Company Unique Item ID)**: Gestionado en `tenant_catalog`. Se autogenera con el prefijo `CORP-` al vincular o crear productos.
3.  **SKU-CUIM (Global Master ID)**: Gestionado en `catalog_master`. Es el identificador único universal de la pieza industrial en toda la red B2B (Prefijo: `CMB-`).

### 📊 Base de Datos (Supabase / PostgreSQL)

| Tabla | Propósito | Claves Primarias/Relaciones |
|---|---|---|
| `tenants` | Datos de la empresa proveedora | `id` (UUID), `ruc_rut_nit` (UNIQUE) |
| `tenant_catalog` | Inventario específico del proveedor | `master_product_id` -> `catalog_master.id` |
| `catalog_master` | Catálogo Maestro Global | `sku_cuim` (UNIQUE), `slug` (INDEX) |
| `specs_templates` | Plantillas para Smart Specs | `category` (TEXT) |

---

## 🛠️ Lógica de Negocio en Componentes Core

### 1. Wizard de Ingreso (`AddProductModal.tsx`)
- **Reducción de Latencia**: Se eliminó un paso intermedio para integrar las categorías en el Paso 1.
- **Auto-rellenado**: Al seleccionar una categoría, se consultan las `specs_templates` vía Supabase y se inyectan dinámicamente en el formulario.

### 2. Sincronización de Identidad (`catalog-service.ts`)
- `linkMasterProduct`: Vincula registros del Maestro al catálogo local del Tenant manteniendo la integridad del SKU-CUIM.
- `bulkCreateProducts`: Genera automáticamente `slugs` normalizados y asigna `CID-CUIE` inmutables.

---

## 🌐 Internacionalización (SSR)
Configurado con `next-intl`:
- Ubicación de mensajes: `/messages/[locale].json`
- El `middleware.ts` gestiona la detección de idioma y país para la redirección regional (Región América).
- **Rutas Limpias**: Las páginas institucionales han sido normalizadas (ej: `/terms`, `/privacy`) para evitar duplicaciones por idioma en el árbol de rutas de `app/`.

---

## 🏎️ Optimización de Performance & SEO

### Generación de Metadatos
En cada `page.tsx`, se utiliza `generateMetadata` consultando el `getTranslations` de `next-intl` y el `company-service` para SEO dinámico en perfiles de empresa.

### Auditoría de Recursos Estáticos
- **Imágenes**: Prioridad en el uso de `next/image` con descriptores WebP (Lossless para logos industriales).
- **Favicons**: Generados dinámicamente vía `src/app/manifest.ts`.

---

## 🔄 Procedimiento de Actualización
Tras cualquier cambio en el esquema de Supabase, se recomienda:
1. Exportar el SQL Schema.
2. Actualizar las interfaces en `src/lib/catalog-service.ts` y `src/lib/company-service.ts`.
3. Ejecutar `npm run build` para validar tipos.

---

© 2026 Centro de Ingeniería B2B Empresas.
