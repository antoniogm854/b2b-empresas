# MANUAL TÉCNICO Y DE USUARIO — Ecosistema B2B (v6.0 - Premium 2026)
Este manual detalla la arquitectura, configuración y operación del ecosistema **b2bempresas.com**, centrado en la **CATÁLOGO DIGITAL** e Intercambio de Datos B2B. Actualizado para reflejar el rediseño Industrial Premium, glassmorphism e integración real de SUNAT.

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
*   **`transactionalService`:** Gestión de Leads (pedidos), conversiones y gestión de contactos de venta.
*   **`sunat.ts`:** Servicio oficial de validación de identidad industrial mediante RUC (Sincronizado con API real).
*   **`reportService`:** Generación de reportes ejecutivos en PDF con KPIs de rendimiento.
*   **`aiService`:** Motor de optimización de catálogos mediante inteligencia artificial.

---

## 3. Mapa Funcional del Dashboard (Panel de Control)
El Dashboard es el centro operativo para el **ADMIN-CATÁLOGO** (Proveedor). Todos los usuarios-proveedores ven este patrón funcional para administrar su ecosistema:

### A. Estructura del Sidebar (Menú Lateral)
1.  **VISTA GENERAL:** Dashboard ejecutivo con KPIs en tiempo real: Leads nuevos, productos activos e interacciones totales de la red.
2.  **PERFIL DE EMPRESA:** Gestión de la identidad industrial. Permite editar RUC, Razón Social, Domicilio Fiscal y Carga de Isotipo/Logo corporativo.
3.  **DISEÑO DE PAGINA:** Módulo de personalización estética avanzada. Control de paleta de colores corporativa (6 Presets) y selección de tipografía técnica (DIGITAR CATALOGO). El sistema utiliza **Classic Industrial** como modelo base predeterminado.
4.  **CATALOGO DIGITAL (GESTIÓN MAESTRO):** El núcleo del sistema. Permite agregar SKUs, sincronizar con el Catálogo Maestro (GCM) y gestionar el inventario digital visible en el Marketplace.
5.  **DOCUMENTOS ADJUNTOS:** Repositorio de archivos técnicos, certificaciones ISO, catálogos en PDF y documentación de cumplimiento legal.
6.  **ESTADÍSTICAS:** Análisis profundo de visualizaciones por producto, origen de los leads y tasa de conversión industrial.
7.  **LEADS DE CONTACTOS - VENTAS:** Listado inteligente de prospectos que han solicitado cotización o información técnica de los suministros.
8.  **MENSAJES CLIENTES:** Centro de mensajería interna para comunicación directa con compradores y soporte técnico de la red.
9.  **CONFIGURACIÓN:** Ajustes de cuenta de usuario, seguridad (MFA), preferencias de notificación y selector de tema (Modo Claro/Oscuro).

### B. Herramientas de Cabecera (Top Bar)
*   **Theme Toggle:** Selector de Modo Claro/Oscuro con persistencia en base de datos. Optimizado para Modo Claro por defecto según requerimientos de legibilidad industrial.
*   **Notificaciones:** Alertas en tiempo real sobre nuevos leads o cambios en el estado de validación industrial.

---

## 4. Guía de Uso para el Proveedor (Flujo de Gestión)

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
*   **v2.6 (18-Mar-2026):** Simplificación del registro: Eliminación de campos nombre y slug iniciales. Redirección automática a configuración de perfil post-registro.
*   **v2.7 (18-Mar-2026):** Estabilización de Registro (v2.0.4). Corrección de error de RLS mediante inicio de sesión forzado post-registro. Implementación de rotación de caché de Service Worker (v4) para asegurar visualización de cambios. Auditoría integral de documentación.
*   **v2.8 (19-Mar-2026):** Fase de Estabilización & Auditoría. Implementación de registro de empresa paralelo e independiente. Reemplazo de datos "demo" por contextos reales en Leads, Analytics, Mensajes y Comparador.
*   **v3.0 (22-Mar-2026):** Implementación del Onboarding Modular Pro. Integración de validación SUNAT estricta, algoritmo de Compliance B2B, y formulario de catálogo industrial con automatización de SKUs. Redirección definitiva del flujo de registro legacy al nuevo wizard.
*   **v4.1 (22-Mar-2026):** Implementación de Persistencia Temprana. Registro de usuario tras Paso 1. Generación de CUUP único de 10 dígitos.
*   **v4.2 (22-Mar-2026):** Auditoría Global de Sistema. Limpieza de servicios obsoletos y actualización de bitácoras.
*   **v5.0 (23-Mar-2026):** Rediseño Industrial Premium. Implementación de Glassmorphism, fondos generados por IA, marcas de agua corporativas y limpieza de UI obsoleta (Comparador/Instalación). Reordenamiento funcional del menú lateral.
*   **v6.0 (25-Mar-2026):** Reingeniería "Industrial Premium 2026". Implementación de "Diseño de Pagina" con presets avanzados, alineación de terminología B2B (DIGITAR CATALOGO) y limpieza integral de componentes legacy (Buscador Maestro, SKU inputs). Estabilización de telefonía comercial desacoplada.

---

## 7. Optimización y SEO (Próximos Pasos)
Para mantener el portal en el primer lugar de Google y con velocidad máxima:

### A. Rendimiento (Performance)
1.  **Optimización de Imágenes:** El sistema ya utiliza el formato **WebP** (`/hero.webp`) para todas las imágenes críticas, reduciendo el LCP en un 90%. No usar formatos pesados como PNG en la sección Hero.
2.  **Streaming & Suspense:** El sistema usa `Next.js Streaming`. Asegúrate de envolver componentes pesados en `<Suspense>` para no bloquear el renderizado inicial.
3.  **Fuentes de Google:** Las fuentes Geist ya están optimizadas y se sirven localmente desde el servidor de Next.js. No añadas fuentes externas mediante `<link>` en el head.

### C. Compliance B2B
*   **Compliance Engine**: Algoritmo que puntúa de 1 a 10 la confiabilidad del proveedor basándose en la completitud de datos críticos (RUC, Logo, Bio, Redes, Web).
*   **Indicadores Visuales**: Representación de 1 a 5 estrellas en el Catálogo Digital, incentivando la transparencia industrial.

### D. Integración PWA (Aplicativo Digital)
*   **Manifest Dinámico**: Configurado en `src/app/manifest.ts` para permitir la instalación de la plataforma como una app nativa.
*   **Iconografía**: Uso estandarizado del logo corporativo de b2bempresas.com para fortalecer el respaldo institucional.
*   **Start URL**: Redirección directa al `/dashboard` para agilizar la gestión administrativa.

### E. Validación Industrial (SUNAT)
*   **Motor de Consulta**: Integración con servicios de búsqueda de RUC para validar `Estado` y `Condición`.
*   **Alertas de Bloqueo**: Restricción de visibilidad si la empresa cuenta con un estatus No Activo o No Habido.

### B. Estrategia SEO Máxima
1.  **Sitemaps Dinámicos:** He implementado `sitemap.ts` y `robots.ts` que se generan automáticamente. Puedes verlos en `/sitemap.xml` y `/robots.txt`.
2.  **OpenGraph:** Todas las páginas ya incluyen metadatos para que el link se vea profesional al compartirlo en WhatsApp o LinkedIn.
3.  **Contenido de Valor:** Google prioriza las páginas con descripciones técnicas largas. Asegúrate de que los proveedores completen todos los campos del catálogo.

## 8. Nomenclatura Estándar del Ecosistema
Para asegurar la coherencia en el desarrollo futuro, se establece el siguiente esquema de identidades:

*   **ADMIN MASTER:** Consola central de administración global.
*   **ADMIN-PÁGINA:** Operador central de b2bempresas.com.
*   **ADMIN-CATÁLOGO:** Proveedor con identidad validada y catálogo activo.
*   **PROVEEDOR:** Empresa con registro inicial (en proceso de validación).
*   **COMPRADOR:** Empresa o persona que consume los catálogos para cotizar.
*   **CUUP:** Código Único de Usuario-Proveedor (10 dígitos numéricos). Identificador universal del ecosistema.

---

## 9. Lógica de Onboarding y Persistencia (v4+)
Para maximizar la conversión y asegurar el archivado de leads, el sistema utiliza un flujo de persistencia anticipada:

1.  **Validación en Tiempo Real:** Al ingresar el RUC en el Paso 1, un `useEffect` dispara la búsqueda de datos para tenerlos listos antes del clic.
2.  **Archivado tras Paso 1:** Al hacer clic en "COMENZAR AHORA", se crea el registro en `auth.users`, `profiles`, e importa el `tenant` inicial con la información recolectada.
3.  **Generación de CUUP:** El sistema asigna un código numérico único basado en el prefijo del RUC y un componente aleatorio, guardándolo inmediatamente en la columna `cuup` de la tabla `tenants`.
4.  **Resiliencia:** Si el usuario abandona en el Paso 2 o 3, su registro básico ya está asegurado en el Panel Central para gestión administrativa.

---
## 10. Estética Industrial Premium (v5.0)
Para proyectar una imagen de alta gama, el sistema utiliza:
1.  **Glassmorphism:** Uso de la clase CSS `.glass` para contenedores traslúcidos con desenfoque de fondo.
2.  **Fondo IA:** Imagen de servicios industriales (`/b2b_industrial_bg_...`) aplicada vía pseudo-elementos con opacidad ultra-baja (3-5%).
3.  **Marcas de Agua:** Integración de `.watermark-logo` en layouts para posicionamiento fijo del isotipo corporativo.

---
*Manual actualizado por Antigravity - Versión 6.0 (Reingeniería Industrial Premium 2026 - 25 de Marzo, 2026)*

