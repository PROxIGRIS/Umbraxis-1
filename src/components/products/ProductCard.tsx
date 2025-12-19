import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Sparkles, Ban, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { isPurchasable } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

/* ---------------- SAFE IMAGE RESOLVER ---------------- */

function getSafeProductImage(product: any) {
  // 1. allImages (preferred)
  if (Array.isArray(product.allImages)) {
    const valid = product.allImages.find(
      (img: string) =>
        img &&
        img.trim() !== '' &&
        img !== '/placeholder.svg'
    );
    if (valid) return valid;
  }

  // 2. images array
  if (Array.isArray(product.images)) {
    const valid = product.images.find(
      (img: string) =>
        img &&
        img.trim() !== '' &&
        img !== '/placeholder.svg'
    );
    if (valid) return valid;
  }

  // 3. imageUrl
  if (
    product.imageUrl &&
    product.imageUrl.trim() !== '' &&
    product.imageUrl !== '/placeholder.svg'
  ) {
    return product.imageUrl;
  }

  // 4. final fallback
  return '/placeholder.svg';
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;
  const canPurchase = isPurchasable(product);

  const imageSrc = getSafeProductImage(product);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={cn(
        'group relative flex flex-col rounded-2xl bg-card overflow-hidden transition-all duration-300',
        'border border-border/50 hover:border-primary/30',
        'hover:shadow-float',
        !canPurchase && 'opacity-75',
        className
      )}
      style={style}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-bold shadow-accent"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {discount}% OFF
            </span>
          </motion.div>
        )}

        {product.codAllowed === false && (
          <div className="px-2 py-1 rounded-lg bg-warning/20 text-warning text-[10px] font-semibold flex items-center gap-1">
            <Ban className="w-3 h-3" />
            No COD
          </div>
        )}

        {product.stock === 0 && product.allowBackorder && (
          <div className="px-2 py-1 rounded-lg bg-info/20 text-info text-[10px] font-semibold flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Pre-order
          </div>
        )}
      </div>

      {/* Featured dot */}
      {product.isFeatured && (
        <div className="absolute top-3 right-3 z-10 w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
      )}

      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-secondary/30"
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {!canPurchase && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mt-1.5 font-medium">
          {product.unit}
        </p>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-primary">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {canPurchase && (
            <>
              {isInCart ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center bg-primary rounded-xl overflow-hidden shadow-md"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-primary-foreground"
                    onClick={() =>
                      updateQuantity(product.id, cartItem!.quantity - 1)
                    }
                  >
                    −
                  </Button>
                  <span className="w-8 text-center text-sm font-bold text-primary-foreground">
                    {cartItem!.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-primary-foreground"
                    onClick={() =>
                      updateQuantity(product.id, cartItem!.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <Button
                  size="sm"
                  className="h-9 gap-2 rounded-xl font-semibold shadow-md"
                  onClick={() => addItem(product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
