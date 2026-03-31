/**
 * ══════════════════════════════════════════════════════════
 * UTILIDAD: Normalización de Marcas — Brand Normalization
 * ══════════════════════════════════════════════════════════
 * Convierte variantes de un mismo fabricante a su nombre canónico.
 * Ej: "M.S.A.", "msa corp", "MSA Safety" → "MSA"
 *
 * Esta tabla se sincroniza con brand_aliases en Supabase.
 * Para agregar nuevas marcas: añadir aquí Y en la tabla brand_aliases.
 */

import { supabase } from './supabase';

// ── Map local estático (rápido, sin DB) ──────────────────────────────
const BRAND_MAP: Record<string, string> = {
  // MSA
  'm.s.a.':          'MSA',
  'msa corp':        'MSA',
  'msa safety':      'MSA',
  'mineros safety':  'MSA',

  // 3M
  '3 m':             '3M',
  'three m':         '3M',
  '3m company':      '3M',

  // SKF
  's.k.f.':          'SKF',
  'skf ab':          'SKF',
  'skf group':       'SKF',

  // Caterpillar / CAT
  'caterpillar inc': 'Caterpillar',
  'cat safety':      'Caterpillar',
  'cat work':        'Caterpillar',

  // Honeywell
  'honeywell safety':     'Honeywell',
  'honeywell analytics':  'Honeywell',

  // Petzl
  'petzl france':    'Petzl',

  // Parker
  'parker hannifin': 'Parker',
  'parker corp':     'Parker',

  // Mobil / ExxonMobil
  'mobil oil':       'Mobil',
  'exxonmobil':      'Mobil',
  'exxon mobil':     'Mobil',

  // Aceros Arequipa
  'a. arequipa':     'Aceros Arequipa',
  'arequipa steel':  'Aceros Arequipa',

  // Pacasmayo
  'cementos pacasmayo': 'Pacasmayo',

  // Tekno
  'pinturas tekno':  'Tekno',
  'tekno s.a.':      'Tekno',
};

/**
 * Normaliza el nombre de una marca usando el mapa local.
 * Retorna el nombre canónico si existe alias, o el original si no.
 */
export function normalizeBrand(raw: string | null | undefined): string | null {
  if (!raw || raw.trim() === '') return raw ?? null;
  const key = raw.trim().toLowerCase();
  return BRAND_MAP[key] ?? raw.trim();
}

/**
 * Normaliza una marca usando la tabla brand_aliases en Supabase.
 * Más precisa que el mapa local, pero requiere una consulta a la DB.
 * Usar en flujos de importación masiva (no en tiempo real).
 */
export async function normalizeBrandFromDB(raw: string): Promise<string> {
  if (!raw || raw.trim() === '') return raw;

  const { data } = await supabase
    .from('brand_aliases')
    .select('canonical')
    .eq('alias', raw.trim().toLowerCase())
    .maybeSingle();

  return data?.canonical ?? raw.trim();
}

/**
 * ── SLUG GENERATOR ───────────────────────────────────────
 * Genera una URL amigable para SEO desde el nombre del producto.
 * Ej: "Casco MSA V-Gard Blanco" → "casco-msa-v-gard-blanco"
 */
export function generateSlug(
  name: string,
  brand?: string | null,
  model?: string | null
): string {
  const parts = [name, brand, model].filter(Boolean).join(' ');

  return parts
    .toLowerCase()
    .normalize('NFD')                         // Descompone caracteres unicode
    .replace(/[\u0300-\u036f]/g, '')          // Elimina diacríticos (tildes)
    .replace(/[^a-z0-9\s-]/g, '')            // Quita caracteres especiales
    .replace(/\s+/g, '-')                     // Espacios → guiones
    .replace(/-+/g, '-')                      // Múltiples guiones → uno
    .replace(/^-|-$/g, '')                    // Trim de guiones
    .substring(0, 80);                        // Máximo 80 caracteres
}

/**
 * ── SPECS TEMPLATES ──────────────────────────────────────
 * Templates de especificaciones técnicas por categoría.
 * Se usan para pre-poblar el editor de specs en el dashboard.
 */
export const SPECS_TEMPLATES: Record<string, Record<string, string>> = {
  EPP: {
    norma:              '',
    clase_electrica:    '',
    material_casquete:  '',
    tipo_suspension:    '',
    resistencia_impacto: '',
  },
  Lubricantes: {
    viscosidad_iso:     '',
    grado_sae:          '',
    temperatura_min_c:  '',
    temperatura_max_c:  '',
    norma_api:          '',
  },
  Materiales: {
    resistencia_mpa:    '',
    elongacion_pct:     '',
    norma_astm:         '',
    presentacion_kg:    '',
    origen_pais:        '',
  },
  Rodamientos: {
    diametro_interior_mm:  '',
    diametro_exterior_mm:  '',
    ancho_mm:              '',
    tipo:                  '',
    carga_dinamica_kn:     '',
  },
  Mangueras: {
    diametro_pulg:      '',
    presion_max_psi:    '',
    temperatura_max_c:  '',
    material_interior:  '',
    norma_sae:          '',
  },
};

/**
 * Retorna el template de specs para una categoría dada.
 * Si no existe template, retorna un objeto vacío.
 */
export function getSpecsTemplate(category: string | null | undefined): Record<string, string> {
  if (!category) return {};
  return SPECS_TEMPLATES[category] ?? {};
}
