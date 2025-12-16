import { useMemo } from 'react';
import { CartItem, Product } from '@/types';

interface CartCodAnalysis {
  // Items that allow COD
  codEnabledItems: CartItem[];
  codEnabledSubtotal: number;
  
  // Items that do NOT allow COD (must be paid online)
  codDisabledItems: CartItem[];
  codDisabledSubtotal: number;
  
  // Summary
  hasMixedCart: boolean;
  allItemsAllowCod: boolean;
  noItemsAllowCod: boolean;
}

/**
 * Analyzes cart items for COD eligibility
 * Used to handle mixed carts where some items require online payment
 */
export function useCartCodAnalysis(items: CartItem[]): CartCodAnalysis {
  return useMemo(() => {
    const codEnabledItems = items.filter(item => item.product.codEnabled);
    const codDisabledItems = items.filter(item => !item.product.codEnabled);
    
    const codEnabledSubtotal = codEnabledItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );
    
    const codDisabledSubtotal = codDisabledItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );
    
    const allItemsAllowCod = codDisabledItems.length === 0;
    const noItemsAllowCod = codEnabledItems.length === 0;
    const hasMixedCart = !allItemsAllowCod && !noItemsAllowCod;
    
    return {
      codEnabledItems,
      codEnabledSubtotal,
      codDisabledItems,
      codDisabledSubtotal,
      hasMixedCart,
      allItemsAllowCod,
      noItemsAllowCod,
    };
  }, [items]);
}

/**
 * Check if a product is purchasable (in stock OR allows backorder)
 */
export function canAddToCart(product: Product): boolean {
  if (!product.isActive) return false;
  return product.stock > 0 || product.allowBackorder;
}
