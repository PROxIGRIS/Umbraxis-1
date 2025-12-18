import { useParams, Link } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Tag, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug, useProducts, isPurchasable } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, items, updateQuantity } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const cartItem = product ? items.find((item) => item.product.id === product.id) : null;
  const category = useMemo(() => {
    return product ? categories.find(c => c.id === product.categoryId) : null;
  }, [product, categories]);

  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.imageUrl) imgs.push(product.imageUrl);
    if (product.images?.length) {
      product.images.forEach(img => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs.length ? imgs : ['/placeholder.svg'];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const canPurchase = product ? isPurchasable(product) : false;

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (productLoading) {
    return (
      <Layout>
        <div className="container py-6 md:py-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-[4/5] rounded-2xl w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Item Not Found</h1>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/products text-zinc-900">Return to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        <div className="container py-4 md:py-10">
          
          {/* Breadcrumb - Hidden on very small screens for space */}
          <nav className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 mb-8">
            <Link to="/" className="hover:text-zinc-900">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-zinc-900">Collection</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/products?category=${category.slug}`} className="hover:text-zinc-900">
                  {category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 group">
                <motion.img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-tighter">
                    {discount}% OFF
                  </div>
                )}

                {/* Simplified Nav for Mobile Performance */}
                {allImages.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <Button
                      variant="white"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-md pointer-events-auto opacity-80 active:scale-90 md:group-hover:opacity-100"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="white"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-md pointer-events-auto opacity-80 active:scale-90 md:group-hover:opacity-100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Thumbnails - Optimized for touch scrolling */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all",
                        idx === currentImageIndex ? 'border-zinc-900' : 'border-transparent opacity-50'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                {category && (
                  <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    {category.name}
                  </p>
                )}
                <h1 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-zinc-400 line-through font-light">₹{product.originalPrice}</span>
                )}
              </div>

              <div className="space-y-6">
                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base font-light">
                  {product.description}
                </p>

                {/* Product Meta Info */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-100">
                   <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Delivery</p>
                        <p className="text-xs text-zinc-900 font-medium">Fast Shipping</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Quality</p>
                        <p className="text-xs text-zinc-900 font-medium">Premium Grade</p>
                      </div>
                   </div>
                </div>

                {/* Status & Add to Cart */}
                <div className="pt-4">
                  {!product.stock && !product.allowBackorder ? (
                    <div className="bg-zinc-100 text-zinc-500 py-4 text-center rounded-2xl font-bold uppercase tracking-widest text-xs">
                      Currently Out of Stock
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      {cartItem ? (
                        <div className="flex items-center justify-between bg-zinc-100 rounded-full p-1.5 w-full sm:w-40">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full h-10 w-10 hover:bg-white"
                            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold text-lg">{cartItem.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full h-10 w-10 hover:bg-white"
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="lg" 
                          className="flex-1 rounded-full h-14 text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white gap-2" 
                          onClick={() => addItem(product)}
                        >
                          <ShoppingBag className="h-5 w-5" />
                          Add to Selection
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {product.codAllowed === false && (
                    <p className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" />
                      Prepaid Orders Only for this item
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-zinc-900">Recommended for You</h2>
                <Link to="/products" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 underline decoration-zinc-200 underline-offset-4">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
