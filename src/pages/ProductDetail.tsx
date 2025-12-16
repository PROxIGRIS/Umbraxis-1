import { useParams, Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Tag, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug, useProducts, isPurchasable } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState, useCallback } from 'react';

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

  // Get all images (main + additional)
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

  // Related products (same category)
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
          <Skeleton className="h-6 w-64 mb-6" />
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
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
      <div className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${category.slug}`} className="hover:text-foreground transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                  {discount}% OFF
                </div>
              )}

              {/* Image navigation */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-primary w-6' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {category && (
              <Link
                to={`/products?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.unit}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.stock > 0 ? (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  In Stock ({product.stock})
                </Badge>
              ) : product.allowBackorder ? (
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  Pre-order Available
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                  Out of Stock
                </Badge>
              )}
              
              {product.codAllowed === false && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Online Payment Only
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Add to Cart */}
            {canPurchase && (
              <div className="flex items-center gap-4 mt-auto">
                {cartItem ? (
                  <div className="flex items-center gap-3 bg-secondary rounded-xl p-2">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-semibold text-lg">{cartItem.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="lg" className="flex-1 max-w-xs gap-2" onClick={() => addItem(product)}>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
