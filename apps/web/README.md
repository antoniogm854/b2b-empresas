# B2B EMPRESAS — Ecosistema Industrial Premium v6.0

Plataforma Maestra de Gestión Industrial y Operaciones B2B para Latinoamérica.

---

## 🚀 Arquitectura Industrial Premium v6.0

### 🛡️ Identificación Digital Maestro (ID DNA)
El sistema garantiza trazabilidad total mediante identificadores únicos e inmutables:
- **CID-CUIE (Company Unique ID)**: Identificador autogenerado para el catálogo del proveedor (Formato: `CORP-XXXX-XXXX`).
- **SKU-CUIM (Master ID)**: Identificador global del producto en el *Catálogo Maestro B2B* (Formato: `CMB-XXXXX`).
- **SKU-MPN (Manufacturer Part Number)**: Código de fábrica del producto para precisión técnica.
- **CUUP (User-Provider Code)**: Vinculado al RUC/ID legal de la empresa.

### 📦 Ingreso Industrial Maestro (Wizard 4 Pasos)
Flujo optimizado para la carga masiva y técnica de productos:
1. **Paso 1: Identificación Técnica**: Nombre, Marca, Modelo, Serie y Activación de *Smart Specs*.
2. **Paso 2: Clasificación B2B**: Jerarquía industrial (SKU-GG, SKU-GE) y asignación de SKU-CUIM.
3. **Paso 3: Especificaciones Comerciales**: Precios, Unidades de Medida y Atributos Físicos.
4. **Paso 4: Documentación Multimedia**: Imágenes, Fichas Técnicas (PDF) y Video Manuales.

---

## 📊 Compliance Scoring & Certificación
Sistema de puntuación (0–10) para la validación de proveedores:
| Acción | Puntos |
|---|---|
| Perfil Legal Verificado (RUC) | +2 pts |
| Catálogo con CID-CUIE Activo | +2 pts |
| Más de 50 productos con Ficha Técnica | +3 pts |
| Respuesta Activa WhatsApp | +3 pts |

---

## 🛠️ Stack Tecnológico de Alto Rendimiento
| Capa | Tecnología |
|---|---|
| **Estructura** | Next.js 15 (App Router), React 19 |
| **Estilos** | CSS Puro (Industrial Design Tokens) |
| **Backend** | Supabase (PostGIS, RLS, Storage) |
| **Internationalization** | next-intl (ES / EN / PT) SSR |
| **Performance** | WebP/AVIF Nativo, ISR (Incremental Static Regeneration) |

---

## 📂 Directorio Maestro (Auditado v6.0)

```
src/
├── app/
│   ├── [slug]/           # Vitrina Digital del Proveedor (Showcase)
│   ├── dashboard/        # Centro de Control del Proveedor
│   ├── master/           # Puerta de Enlace Corporativa
│   ├── admin-console/    # Gestión Maestro de B2B Empresas
│   └── marketplace/      # Catálogo Global B2B
├── components/
│   ├── dashboard/AddProductModal.tsx # Wizard Maestro v1.04
│   └── shared/           # Componentes Globales Dinámicos
└── lib/
    ├── catalog-service.ts# Orquestación de SKU-CUIM y Smart Specs
    ├── auth-service.ts   # Seguridad Perimetral y Gestión de CUUP
    └── settings-service.ts# Configuración de Identidad de Plataforma
```

---

## ⚡ Ejecución en Local

1. Instalar dependencias: `npm install`
2. Iniciar plataforma: `npm run dev`
3. Sincronizar DB: Ejecutar `migration_cid_cuie.sql` en el SQL Editor de Supabase.

---

© 2026 B2B Empresas — Infraestructura Industrial LATAM.
