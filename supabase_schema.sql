-- ==============================================================================
-- SCHEMA & TABLAS PARA LA TIENDA DE MUEBLES INFANTILES (JOHA.VIC) EN SUPABASE
-- Copia y pega este script en el "SQL Editor" de tu proyecto de Supabase y dale "Run".
-- ==============================================================================

-- 1. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.store_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.store_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES public.store_categories(id) ON DELETE SET NULL,
  base_price NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  customization_type TEXT DEFAULT 'bed_customizer',
  bed_rules JSONB,
  types JSONB DEFAULT '[]'::jsonb,
  additionals JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE ADICIONALES SUELTOS
CREATE TABLE IF NOT EXISTS public.store_addons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE CONFIGURACIONES (JSON SETTINGS)
-- Guarda la configuración de Identidad/WhatsApp y las opciones del Personalizador de Camas
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) CON ACCESO PÚBLICO
-- ==============================================================================

ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (cualquier cliente puede ver la tienda)
CREATE POLICY "Public Read Categories" ON public.store_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.store_products FOR SELECT USING (true);
CREATE POLICY "Public Read Addons" ON public.store_addons FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);

-- Políticas de escritura (permite guardar desde el panel de administración con la clave anon)
CREATE POLICY "Public Insert Categories" ON public.store_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Categories" ON public.store_categories FOR UPDATE USING (true);
CREATE POLICY "Public Delete Categories" ON public.store_categories FOR DELETE USING (true);

CREATE POLICY "Public Insert Products" ON public.store_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.store_products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.store_products FOR DELETE USING (true);

CREATE POLICY "Public Insert Addons" ON public.store_addons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Addons" ON public.store_addons FOR UPDATE USING (true);
CREATE POLICY "Public Delete Addons" ON public.store_addons FOR DELETE USING (true);

CREATE POLICY "Public Insert Settings" ON public.store_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Settings" ON public.store_settings FOR UPDATE USING (true);
CREATE POLICY "Public Delete Settings" ON public.store_settings FOR DELETE USING (true);

-- ==============================================================================
-- DATOS INICIALES (CATEGORÍAS DE EJEMPLO)
-- ==============================================================================
INSERT INTO public.store_categories (id, name, sort_order)
VALUES
  ('plus', 'Línea PLUS', 1),
  ('premium', 'Línea PREMIUM', 2),
  ('tapizada', 'Tapizadas', 3),
  ('natural', 'Madera Natural', 4),
  ('peinadoras', 'Peinadoras', 5),
  ('comodas', 'Cómodas & Gaveteros', 6)
ON CONFLICT (id) DO NOTHING;
