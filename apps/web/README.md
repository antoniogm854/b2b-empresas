# B2B EMPRESAS — Ecosistema Industrial v1.01

Plataforma SaaS multitenant para el sector industrial B2B de Latinoamérica.

---

## 🚀 Características Principales

### Registro & Onboarding Interactivo (3 Pasos)
1. **Paso 1 — Registro Inteligente**: Creación de cuenta, validación de RUC/ID y generación automática del **CUUP**. 
   - **Smart Email Detection**: Si el email ya inició registro, el sistema lo detecta, inicia sesión automáticamente en segundo plano, y dirige al usuario directo al Paso 2 para continuar sin perder tiempo.
2. **Paso 2 — Perfil Premium**: Extracción automática de datos desde SUNAT (Razón Social, Domicilio Fiscal, Actividad Económica, Representantes Legales).
3. **Paso 3 — Catálogo**: Carga de productos con SKU-CUIM asignado automáticamente.

### CUUP — Código Único de Usuario-Proveedor
- **El CUUP = RUC/ID exacto** del proveedor. Regla definitiva, invariable.
- **Inmutable**: protegido en código (`auth-service.ts`, `company-service.ts`) y en base de datos (triggers PostgreSQL).
- **Único**: constraint `UNIQUE` en la tabla `tenants`.
- Se asigna automáticamente al crear el tenant y no puede ser modificado jamás.

### Compliance Scoring (0–10 Puntos)
Sistema de gamificación para certificar calidad B2B:
| Acción | Puntos |
|---|---|
| Completar Paso 1 (Registro) | +1 pt |
| Completar Paso 2 (Perfil Premium) | +1 pt |
| Cargar mínimo 20 productos | +1 pt |
| Cargar más de 100 productos | +2 pt |
| _Próximamente: más hitos_ | _hasta 10 pt_ |

### Admin Console (`/admin-console`)
- **Directorio Maestro**: lista completa de proveedores con su CUUP.
- **Verificaciones**: aprobar/rechazar nuevas empresas.
- **Recuperación de credenciales**: recuperación segura por email con ventana temporal (25s) y timer visual.

### Acceso Corporativo (`/master`)
- Puerta de entrada al ecosistema privado (Master y Admin).
- Clave única de acceso con recuperación por sistema automatizado y timeout visual.

---

## 🛠️ Stack Tecnológico Optimizado
| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, React 19, Lucide Icons |
| Estilos | Vanilla CSS (design tokens) + Animaciones Avanzadas |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| i18n | next-intl (ES / PT / EN) con SSR routing |
| Performance | Next.js Image Opt, AVIF/WebP nativo, Headers Cache de 1 año |
| Seguridad | X-Frame-Options, Permissions-Policy, Supabase RLS |

---

## ⚡ Inicio Rápido

```bash
npm install
npm run dev
```

> **Nota DB**: Para sincronizar las últimas reglas inmutables de negocios (CUUP=RUC), ejecuta el script `supabase_v3_sync.sql` (versión 3.1) en el SQL Editor de Supabase.

---

## 📁 Estructura Principal Optimizada (Auditada)

```
src/
├── app/
│   ├── admin-console/    # Panel central master
│   ├── dashboard/        # Panel del proveedor B2B
│   ├── login/            # Acceso B2B
│   ├── master/           # Acceso corporativo privado
│   ├── register/         # Alias para landing onboarding
│   └── cdb2b/            # Onboarding digital industrial
├── components/
│   └── cdb2b/onboarding/ # Archivos core del asistente de registro (Wizard, Steps)
└── lib/
    ├── auth-service.ts   # Autenticación + pre-check de detección de usuarios
    ├── admin-service.ts  # Servicios para credenciales de admin
    ├── company-service.ts# Reglas de negocio y CRUD tenants
    ├── catalog-service.ts# Lógica de carga de productos SKU
    └── sunat-mock.ts     # Mock oficial de la API SUNAT/RUC
```

*Archivos obsoletos (`/admin/ads`, rutas temporales) y configuraciones lentas han sido removidas durante la fase de auditoría.*

---

© 2026 B2B Empresas. Todos los derechos reservados.
