import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

// Transform Supabase product to app Product type
// CRITICAL: Uses consistent field name 'codAllowed' (camelCase) mapped from DB 'cod_allowed'
const transformProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  categoryId: p.category_id || '',
  description: p.description || '',
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  stock: p.stock,
  unit: p.unit,
  imageUrl: p.image_url || '/placeholder.svg',
  images: p.images || [],
  isFeatured: p.is_featured || false,
  isActive: p.is_active ?? true,
  codAllowed: p.cod_allowed ?? true, // DB field: cod_allowed -> App field: codAllowed
  allowBackorder: p.allow_backorder ?? false,
  tags: p.tags || [],
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

// Check if product is purchasable (in stock OR allows backorder)
export function isPurchasable(product: Product): boolean {
  return product.isActive && (product.stock > 0 || product.allowBackorder);
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformProduct);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformProduct);
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data ? transformProduct(data) : null;
    },
    enabled: !!slug,
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformProduct);
    },
  });
}
