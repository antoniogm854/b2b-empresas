-- v1.01 Ecosistema B2B - Nuevas Tablas (Preservando infraestructura anterior)

-- USUARIOS INTERNOS DEL SISTEMA
CREATE TABLE IF NOT EXISTS internal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text CHECK (role IN (
    'superadmin','developer','planner','designer'
  )) NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text,
  status text CHECK (status IN (
    'pending','approved','suspended'
  )) DEFAULT 'pending',
  approved_by uuid REFERENCES internal_users(id),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- TENANTS / PROVEEDORES
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  trade_name text,
  ruc_rut_nit text,
  sector text,
  country text NOT NULL,
  city text,
  address text,
  website text,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  contact_name text NOT NULL,
  plan text CHECK (plan IN (
    'free','pro','enterprise'
  )) DEFAULT 'free',
  status text CHECK (status IN (
    'pending','active','suspended','cancelled'
  )) DEFAULT 'pending',
  import_authorized boolean DEFAULT false,
  import_last_run timestamptz,
  import_status text CHECK (import_status IN (
    'idle','running','done','error'
  )) DEFAULT 'idle',
  validated_by uuid REFERENCES internal_users(id),
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- USUARIOS DE CADA TENANT
CREATE TABLE IF NOT EXISTS tenant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN (
    'tenant_admin','operator'
  )) NOT NULL,
  full_name text NOT NULL,
  phone text,
  status text CHECK (status IN (
    'active','suspended'
  )) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- CATÁLOGO MAESTRO B2B (CMb2b)
CREATE TABLE IF NOT EXISTS catalog_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_cuim text UNIQUE,
  sku_gg text,
  sku_ge text,
  product_name text NOT NULL,
  description text,
  unit_measure text,
  brand text,
  model text,
  code_serial text,
  color text,
  size text,
  material text,
  origin text,
  observations text,
  presentation text,
  is_certified boolean DEFAULT false,
  certification_detail text,
  image_url_1 text,
  image_url_2 text,
  image_url_3 text,
  datasheet_url_1 text,
  datasheet_url_2 text,
  datasheet_url_3 text,
  source text CHECK (source IN (
    'manual','import','suggested'
  )) DEFAULT 'manual',
  source_tenant_id uuid REFERENCES tenants(id),
  source_url text,
  is_example boolean DEFAULT false,
  status text CHECK (status IN (
    'active','review','inactive'
  )) DEFAULT 'review',
  reviewed_by uuid REFERENCES internal_users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CATÁLOGO DIGITAL DE CADA PROVEEDOR
CREATE TABLE IF NOT EXISTS tenant_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  master_product_id uuid REFERENCES catalog_master(id),
  sku_cuie text UNIQUE,
  custom_name text,
  custom_description text,
  unit_price decimal,
  currency text DEFAULT 'USD',
  stock_available boolean DEFAULT true,
  dispatch_time text,
  location text,
  availability text,
  imported_from_web boolean DEFAULT false,
  import_source_url text,
  fields_to_complete text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- REGISTRO DE IMPORTACIONES DESDE WEB DEL PROVEEDOR
CREATE TABLE IF NOT EXISTS catalog_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  source_url text NOT NULL,
  source_type text CHECK (source_type IN (
    'website','ecommerce','woocommerce',
    'shopify','custom','other'
  )),
  total_products_found integer DEFAULT 0,
  total_products_imported integer DEFAULT 0,
  total_products_skipped integer DEFAULT 0,
  fields_empty_count integer DEFAULT 0,
  status text CHECK (status IN (
    'pending','running','completed','error'
  )) DEFAULT 'pending',
  error_detail text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- CONFIGURACIÓN DE DISEÑO POR TENANT (Theme Builder)
CREATE TABLE IF NOT EXISTS tenant_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) UNIQUE NOT NULL,
  template_model text CHECK (template_model IN (
    'minimal','corporate','dynamic'
  )) DEFAULT 'corporate',
  primary_color text DEFAULT '#4B6319',
  secondary_color text DEFAULT '#A2C367',
  header_bg text DEFAULT '#F5F5F5',
  hero_bg text DEFAULT '#2E3D10',
  font_family text DEFAULT 'sans-serif',
  border_radius text DEFAULT '8px',
  logo_url text,
  company_display_name text,
  updated_at timestamptz DEFAULT now()
);

-- LINKS Y QR DEL CATÁLOGO DIGITAL POR TENANT
CREATE TABLE IF NOT EXISTS catalog_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) UNIQUE NOT NULL,
  public_url text UNIQUE NOT NULL,
  qr_code_url text,
  is_active boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- VISITAS AL CATÁLOGO DIGITAL POR COMPRADORES
CREATE TABLE IF NOT EXISTS catalog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_link_id uuid REFERENCES catalog_links(id) NOT NULL,
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  viewer_ip text,
  viewer_country text,
  viewer_device text,
  viewer_browser text,
  referrer text,
  duration_seconds integer,
  products_viewed text[],
  created_at timestamptz DEFAULT now()
);

-- CONTACTOS COMPRADOR → PROVEEDOR
CREATE TABLE IF NOT EXISTS buyer_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  buyer_company text,
  message text,
  products_interested text[],
  status text CHECK (status IN (
    'new','read','responded'
  )) DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- LISTA DE ESPERA DEL CATÁLOGO DIGITAL
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  name text,
  company text,
  country text,
  sector text,
  source text DEFAULT 'landing',
  notified_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- MENSAJES DE CONTACTO (formulario web)
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  sector text,
  country text,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  source text DEFAULT 'web_contact',
  status text CHECK (status IN (
    'pending','read','responded'
  )) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- BLOG Y ARTÍCULOS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_es text NOT NULL,
  title_pt text,
  content_es text NOT NULL,
  content_pt text,
  excerpt_es text,
  excerpt_pt text,
  category text,
  cover_image_url text,
  author text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CONTENIDO CMS EDITABLE POR SECCIÓN Y PÁGINA
CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  content_es text,
  content_pt text,
  updated_by uuid REFERENCES internal_users(id),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- LOGS DE AUDITORÍA DEL SISTEMA
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_role text,
  action text NOT NULL,
  entity text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- ÍNDICES PARA OPTIMIZAR CONSULTAS FRECUENTES
CREATE INDEX IF NOT EXISTS idx_catalog_master_status ON catalog_master(status);
CREATE INDEX IF NOT EXISTS idx_catalog_master_sku_gg ON catalog_master(sku_gg);
CREATE INDEX IF NOT EXISTS idx_catalog_master_is_example ON catalog_master(is_example);
CREATE INDEX IF NOT EXISTS idx_tenant_catalog_tenant ON tenant_catalog(tenant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_views_tenant ON catalog_views(tenant_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- INSERTAR PRODUCTOS DE EJEMPLO
INSERT INTO catalog_master (
  sku_gg, sku_ge, product_name, brand, unit_measure, is_example, status
) VALUES 
('EPP', 'Protección_cabeza', 'Casco de seguridad minero clase E', '3M', 'unidad', true, 'active'),
('EPP', 'Iluminación', 'Lámpara frontal recargable minería subterránea', 'Petzl', 'unidad', true, 'active'),
('EPP', 'Protección_pies', 'Botas seguridad punta acero norma ASTM F2413', 'Caterpillar', 'par', true, 'active'),
('Materiales', 'Cementos', 'Cemento Portland tipo I bolsa 42.5kg', 'Pacasmayo', 'bolsa', true, 'active'),
('Materiales', 'Aceros', 'Varilla acero corrugado 1/2" x 9m', 'Aceros Arequipa', 'varilla', true, 'active'),
('Pinturas', 'Industriales', 'Pintura epóxica anticorrosiva gris 1 galón', 'Tekno', 'galón', true, 'active'),
('Rodamientos', 'Bolas', 'Rodamiento de bolas SKF 6205-2RS', 'SKF', 'unidad', true, 'active'),
('Lubricantes', 'Hidráulicos', 'Aceite hidráulico ISO VG 46 bidón 20L', 'Mobil', 'bidón', true, 'active'),
('Mangueras', 'Industriales', 'Manguera industrial flexible 1" 150 PSI x metro', 'Parker', 'metro', true, 'active'),
('Almacén', 'Pallets', 'Pallet plástico 1200x1000mm carga 1500kg', 'Rotom', 'unidad', true, 'active'),
('Embalaje', 'Cintas', 'Cinta embalaje transparente 48mm x 100m', '3M', 'rollo', true, 'active'),
('Izaje', 'Manual', 'Grúa hidráulica manual 2 toneladas', 'Truper', 'unidad', true, 'active')
ON CONFLICT DO NOTHING;
