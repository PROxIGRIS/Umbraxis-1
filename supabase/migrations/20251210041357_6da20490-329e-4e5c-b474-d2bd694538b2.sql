-- Add images array column for multiple product images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[];

-- Migrate existing image_url to images array for existing products
UPDATE public.products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);