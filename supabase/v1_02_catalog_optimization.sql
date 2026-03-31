-- ══════════════════════════════════════════════════════════════════════
-- MIGRACIÓN v1.02 — Catálogo Maestro: Slug SEO + Specs JSON + Brand Aliases
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 1. AGREGAR COLUMNAS A catalog_master
-- ──────────────────────────────────────────────────────────────────────
ALTER TABLE catalog_master
  ADD COLUMN IF NOT EXISTS slug         text UNIQUE,
  ADD COLUMN IF NOT EXISTS specs_json   jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS search_vector tsvector;  -- Full-text search

-- ──────────────────────────────────────────────────────────────────────
-- 2. FUNCIÓN: Generar SLUG desde texto
--    Convierte "Casco MSA V-Gard Blanco" → "casco-msa-v-gard-blanco"
-- ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_product_slug(
  p_name  text,
  p_brand text DEFAULT NULL,
  p_model text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  raw_slug text;
  final_slug text;
  counter int := 0;
BEGIN
  -- Concatenar nombre + marca + modelo
  raw_slug := concat_ws(' ', p_name, p_brand, p_model);

  -- Normalizar: minúsculas, reemplazar tildes, quitar caracteres especiales
  raw_slug := lower(raw_slug);
  raw_slug := translate(raw_slug, 'áéíóúàèìòùäëïöüñç', 'aeiouaeiouaeiouñc');
  raw_slug := translate(raw_slug, 'ñ', 'n');
  raw_slug := regexp_replace(raw_slug, '[^a-z0-9\s-]', '', 'g');
  raw_slug := regexp_replace(raw_slug, '\s+', '-', 'g');
  raw_slug := regexp_replace(raw_slug, '-+', '-', 'g');
  raw_slug := trim(both '-' from raw_slug);

  -- Limitar longitud a 80 caracteres
  raw_slug := left(raw_slug, 80);

  -- Asegurar unicidad: si ya existe, agregar sufijo -1, -2, etc.
  final_slug := raw_slug;
  WHILE EXISTS (SELECT 1 FROM catalog_master WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := raw_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 3. GENERAR SLUGS para los productos existentes (run once)
-- ──────────────────────────────────────────────────────────────────────
UPDATE catalog_master
SET slug = generate_product_slug(product_name, brand, model)
WHERE slug IS NULL;

-- ──────────────────────────────────────────────────────────────────────
-- 4. TRIGGER: Auto-generar slug en INSERT / UPDATE
-- ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_auto_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo generar si es nuevo o cambió el nombre/marca/modelo
  IF NEW.slug IS NULL OR
     OLD.product_name IS DISTINCT FROM NEW.product_name OR
     OLD.brand IS DISTINCT FROM NEW.brand OR
     OLD.model IS DISTINCT FROM NEW.model THEN
    NEW.slug := generate_product_slug(NEW.product_name, NEW.brand, NEW.model);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_slug_catalog_master ON catalog_master;
CREATE TRIGGER auto_slug_catalog_master
  BEFORE INSERT OR UPDATE ON catalog_master
  FOR EACH ROW EXECUTE FUNCTION trigger_auto_slug();

-- ──────────────────────────────────────────────────────────────────────
-- 5. TRIGGER: Actualizar search_vector (Full-Text Search en español)
-- ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_update_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.product_name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.model, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(NEW.sku_gg, '')), 'D');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_search_vector_catalog ON catalog_master;
CREATE TRIGGER update_search_vector_catalog
  BEFORE INSERT OR UPDATE ON catalog_master
  FOR EACH ROW EXECUTE FUNCTION trigger_update_search_vector();

-- Poblar search_vector para registros existentes
UPDATE catalog_master SET updated_at = now();

-- ──────────────────────────────────────────────────────────────────────
-- 6. TABLA: brand_aliases (Normalización de Marcas)
-- ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brand_aliases (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias      text NOT NULL,        -- Ej: "M.S.A.", "msa corp", "Msa"
  canonical  text NOT NULL,        -- Ej: "MSA"
  created_at timestamptz DEFAULT now(),
  UNIQUE(lower(alias))
);

-- Datos iniciales de aliases comunes (industria)
INSERT INTO brand_aliases (alias, canonical) VALUES
  ('m.s.a.',     'MSA'),
  ('msa corp',   'MSA'),
  ('msa safety', 'MSA'),
  ('3 m',        '3M'),
  ('three m',    '3M'),
  ('skf ab',     'SKF'),
  ('s.k.f.',     'SKF'),
  ('caterpillar inc', 'Caterpillar'),
  ('cat safety', 'Caterpillar'),
  ('honeywell safety', 'Honeywell'),
  ('petzl france', 'Petzl'),
  ('parker hannifin', 'Parker'),
  ('mobil oil', 'Mobil'),
  ('exxonmobil', 'Mobil')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────
-- 7. FUNCIÓN: Normalizar marca usando brand_aliases
-- ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION normalize_brand(raw_brand text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  canonical text;
BEGIN
  IF raw_brand IS NULL OR trim(raw_brand) = '' THEN
    RETURN raw_brand;
  END IF;

  SELECT ba.canonical INTO canonical
  FROM brand_aliases ba
  WHERE lower(ba.alias) = lower(trim(raw_brand))
  LIMIT 1;

  RETURN COALESCE(canonical, raw_brand);
END;
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 8. TEMPLATES DE SPECS JSON POR CATEGORÍA
--    (Referencia — usar desde el código para pre-poblar el editor)
-- ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS specs_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text UNIQUE NOT NULL,   -- Ej: "EPP", "Lubricantes"
  template    jsonb NOT NULL,
  created_at  timestamptz DEFAULT now()
);

INSERT INTO specs_templates (category, template) VALUES
('EPP', '{
  "norma": "",
  "clase_electrica": "",
  "material_casquete": "",
  "tipo_suspension": "",
  "resistencia_impacto": ""
}'),
('Lubricantes', '{
  "viscosidad_iso": "",
  "grado_sae": "",
  "temperatura_min_c": "",
  "temperatura_max_c": "",
  "norma_api": ""
}'),
('Materiales', '{
  "resistencia_mpa": "",
  "elongacion_pct": "",
  "norma_astm": "",
  "presentacion_kg": "",
  "origen_pais": ""
}'),
('Rodamientos', '{
  "diametro_interior_mm": "",
  "diametro_exterior_mm": "",
  "ancho_mm": "",
  "tipo": "",
  "carga_dinamica_kn": ""
}'),
('Mangueras', '{
  "diametro_pulg": "",
  "presion_max_psi": "",
  "temperatura_max_c": "",
  "material_interior": "",
  "norma_sae": ""
}')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────
-- 9. ÍNDICES para Performance
-- ──────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_catalog_master_slug    ON catalog_master(slug);
CREATE INDEX IF NOT EXISTS idx_catalog_master_search  ON catalog_master USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_catalog_master_specs   ON catalog_master USING GIN(specs_json);
CREATE INDEX IF NOT EXISTS idx_brand_aliases_alias    ON brand_aliases(lower(alias));

-- ──────────────────────────────────────────────────────────────────────
-- FIN DE MIGRACIÓN v1.02
-- Verificar con: SELECT slug, brand, specs_json FROM catalog_master LIMIT 5;
-- ──────────────────────────────────────────────────────────────────────
