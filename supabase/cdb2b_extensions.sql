-- CDB2B Extensions for v1.01 Schema

-- 1. Extend tenants table with CDB2B tracking and compliance
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS cuup text UNIQUE,
ADD COLUMN IF NOT EXISTS compliance_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS compliance_stars integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS whatsapp_notify_phone text;

-- 2. Extend tenant_catalog for better product detail in the Digital Catalog
ALTER TABLE tenant_catalog
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS model text,
ADD COLUMN IF NOT EXISTS origin text,
ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS documents text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_most_requested boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- 3. Ensure theme templates support the 3 requested layouts
-- The tenant_themes table already exists. We ensure template_model check constraint 
-- includes our requirements (Classic, Modern, Tech-Spec).
-- If existing values are corporate/minimal/dynamic, we might map them or update the constraint.

-- Update tenant_themes template_model check if needed
ALTER TABLE tenant_themes 
DROP CONSTRAINT IF EXISTS tenant_themes_template_model_check;

ALTER TABLE tenant_themes
ADD CONSTRAINT tenant_themes_template_model_check 
CHECK (template_model IN ('classic', 'modern', 'tech_spec', 'minimal', 'corporate', 'dynamic'));

-- 4. Function to generate CUUP (Código Único de Usuario-Proveedor)
-- Format: C-YYYY-[ID_SERIAL] or similar
CREATE OR REPLACE FUNCTION generate_cuup() RETURNS trigger AS $$
BEGIN
  IF NEW.cuup IS NULL THEN
    NEW.cuup := 'C-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generate_cuup ON tenants;
CREATE TRIGGER tr_generate_cuup
BEFORE INSERT ON tenants
FOR EACH ROW
EXECUTE FUNCTION generate_cuup();

-- 5. Helpful Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_cuup ON tenants(cuup);
CREATE INDEX IF NOT EXISTS idx_tenant_catalog_most_requested ON tenant_catalog(is_most_requested) WHERE is_most_requested = true;
