import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';

// Transform Supabase category to app Category type
const transformCategory = (c: any): Category => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  icon: c.icon || '📦',
  image: c.image_url,
  productCount: c.product_count || 0,
});

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(transformCategory);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - categories change rarely
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data ? transformCategory(data) : null;
    },
    enabled: !!slug,
  });
}
