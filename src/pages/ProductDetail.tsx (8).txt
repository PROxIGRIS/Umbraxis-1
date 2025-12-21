import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Truck, Shield, Package, Check, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  const SIZES = product?.sizes ?? [];
  const SIZE_STOCK = product?.sizeStock ?? {};
  const isFreeSize = SIZES.length === 0;

  useEffect(() => {
    if (!product) return;
    if (isFreeSize) {
      setSelectedSize(null);
      return;
    }
    const available = SIZES.find(size => (SIZE_STOCK[size] ?? 0) > 0);
    setSelectedSize(available || SIZES[0]);
  }, [product, isFreeSize, SIZES, SIZE_STOCK]);

  const category = useMemo(() => {
    return product ? categories.find(c => c.id === product.categoryId) : null;
  }, [product, categories]);

  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.images?.length) {
      product.images.forEach(img => {
        if (img && img.trim() !== "" && img !== '/placeholder.svg' && !imgs.includes(img)) {
          imgs.push(img);
        }
      });
    }
    if (product.imageUrl && product.imageUrl.trim() !== "" && product.imageUrl !== '/placeholder.svg' && !imgs.includes(product.imageUrl)) {
      imgs.unshift(product.imageUrl);
    }
    return imgs.length > 0 ? imgs : ['/placeholder.svg'];
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [allImages]);

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity(prev => Math.max(1, prev - 1));
      return;
    }
    if (!isFreeSize && selectedSize) {
      const stock = SIZE_STOCK[selectedSize] ?? 0;
      setQuantity(prev => Math.min(stock, prev + 1));
      return;
    }
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize ?? undefined);
    navigate("/cart");
  };

  if (productLoading) {
    return (
      <Layout>
        <div className="bg-background min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,340px] lg:grid-cols-[400px,1fr,280px] gap-4">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground mb-2">Product Not Found</h1>
            <Link to="/products" className="text-primary underline text-sm">Back to Products</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStock = selectedSize ? (SIZE_STOCK[selectedSize] ?? 0) : product.stock;
  const isOutOfStock = !isFreeSize && selectedSize ? currentStock <= 0 : product.stock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const hasMultipleImages = allImages.length > 1;

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Breadcrumb - minimal */}
        <div className="max-w-6xl mx-auto px-4 py-2">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-1">›</span>
            <Link to="/products" className="hover:underline">Products</Link>
            {category && (
              <>
                <span className="mx-1">›</span>
                <span>{category.name}</span>
              </>
            )}
          </nav>
        </div>

        {/* Main Grid - Amazon 3-column on desktop */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[420px,1fr,300px] gap-6 lg:gap-4">

            {/* COL 1: Images */}
            <div className="flex gap-3">
              {/* Thumbnails - vertical strip, utilitarian */}
              {hasMultipleImages && (
                <div className="hidden sm:flex flex-col gap-1 w-[50px]">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setCurrentImageIndex(idx)}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "w-[50px] h-[50px] border p-0.5 bg-background",
                        idx === currentImageIndex
                          ? "border-primary"
                          : "border-muted hover:border-muted-foreground"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image - dominant, unboxed */}
              <div className="flex-1 relative bg-white">
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full aspect-square object-contain"
                />
                {discountPercent && discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Mobile thumbnails */}
            {hasMultipleImages && (
              <div className="flex sm:hidden gap-1.5 overflow-x-auto lg:hidden">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-14 h-14 flex-shrink-0 border p-0.5",
                      idx === currentImageIndex ? "border-primary" : "border-muted"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* COL 2: Product Info */}
            <div className="space-y-3">
              {/* Title - clear, scannable */}
              <h1 className="text-lg lg:text-xl font-medium text-foreground leading-snug">
                {product.name}
              </h1>

              {/* Category link */}
              {category && (
                <Link to={`/products?category=${category.slug}`} className="text-xs text-primary hover:underline">
                  Visit the {category.name} Store
                </Link>
              )}

              {/* PRICE BLOCK - strongest element */}
              <div className="pt-2 pb-3 border-t border-b border-border">
                {product.originalPrice && discountPercent && (
                  <div className="flex items-center gap-2 text-sm mb-0.5">
                    <span className="text-destructive font-medium">-{discountPercent}%</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-foreground leading-none">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground">
                      M.R.P.: <span className="line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
              </div>

              {/* Size selector - compact */}
              {!isFreeSize && SIZES.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Size:</span>
                    <span className="text-sm text-foreground">{selectedSize}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {SIZES.map((size) => {
                      const stock = SIZE_STOCK[size] ?? 0;
                      const disabled = stock <= 0;
                      return (
                        <button
                          key={size}
                          disabled={disabled}
                          onClick={() => { setSelectedSize(size); setQuantity(1); }}
                          className={cn(
                            "min-w-[42px] h-9 px-3 text-sm border",
                            disabled
                              ? "border-muted text-muted-foreground/40 bg-muted line-through cursor-not-allowed"
                              : selectedSize === size
                                ? "border-primary bg-primary/5 text-foreground font-medium"
                                : "border-border bg-background text-foreground hover:border-muted-foreground"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isFreeSize && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  Free Size
                </p>
              )}

              {/* Description - compressed */}
              {product.description && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-foreground mb-1">About this item</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* COL 3: Buy Box - conversion zone */}
            <div className="lg:border-l lg:border-border lg:pl-4 space-y-3">
              {/* Price repeat for buy box */}
              <div className="text-[26px] font-bold text-foreground leading-none">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              {/* Stock status - extremely obvious */}
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-destructive font-semibold text-base">
                  <AlertTriangle className="w-5 h-5" />
                  Currently unavailable
                </div>
              ) : isLowStock ? (
                <div className="text-destructive font-semibold text-sm">
                  Only {currentStock} left in stock - order soon.
                </div>
              ) : (
                <div className="text-green-600 font-semibold text-sm">In Stock</div>
              )}

              {/* Delivery info - dense, trust-building */}
              <div className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><span className="text-foreground font-medium">FREE Delivery</span> on orders over ₹499</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>100% Genuine Product</span>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Sold by <span className="text-foreground font-medium">Ravenius</span></span>
                </div>
              </div>

              {/* Quantity - tight */}
              {!isOutOfStock && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => handleQuantity('dec')}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium border-x border-border">{quantity}</span>
                    <button
                      onClick={() => handleQuantity('inc')}
                      disabled={!isFreeSize && currentStock <= quantity}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA - visually dominant */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "w-full h-11 text-base font-semibold rounded-full",
                  isOutOfStock && "cursor-not-allowed"
                )}
              >
                {isOutOfStock ? "Unavailable" : "Add to Cart"}
              </Button>

              {/* Secondary CTA */}
              {!isOutOfStock && (
                <Button
                  onClick={() => { handleAddToCart(); }}
                  variant="secondary"
                  className="w-full h-10 text-sm font-medium rounded-full"
                >
                  Buy Now
                </Button>
              )}

              {/* Trust signals - tight, repetitive */}
              <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Secure transaction
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  Authentic product guaranteed
                </p>
                <p className="text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  No returns or exchanges
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex items-center gap-3 z-50">
          <div className="flex-1">
            <div className="text-xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</div>
            {isLowStock && !isOutOfStock && (
              <div className="text-xs text-destructive font-medium">Only {currentStock} left</div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="h-11 px-8 text-base font-semibold rounded-full"
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        </div>

        {/* Spacer for mobile sticky CTA */}
        <div className="lg:hidden h-20" />
      </div>
    </Layout>
  );
}
