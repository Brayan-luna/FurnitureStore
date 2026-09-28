-- Migración aditiva para habilitar la galería de imágenes por producto.
-- Conserva image_url y todas las fotos existentes; las copia como portada inicial.
ALTER TABLE public.store_products
  ADD COLUMN IF NOT EXISTS image_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.store_products
SET image_urls = jsonb_build_array(image_url)
WHERE (image_urls IS NULL OR image_urls = '[]'::jsonb)
  AND image_url IS NOT NULL
  AND image_url <> '';
