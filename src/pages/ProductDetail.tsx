import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Shield, 
  Package, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  Phone,
  CreditCard,
  Smartphone,
  Banknote,
  RefreshCw,
  Lock,
  ZoomIn,
  ChevronLeft
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// UTILITY: Estimate delivery date (real calculation based on current date)
// ============================================================================
function getDeliveryEstimate(): { min: string; max: string; display: string } {
  const today = new Date();
  const minDays = 3;
  const maxDays = 7;
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return {
    min: formatDate(minDate),
    max: formatDate(maxDate),
    display: `${formatDate(minDate)} - ${formatDate(maxDate)}`
  };
}

// ============================================================================
// COMPONENT: Stock Status Display (reusable)
// ============================================================================
function StockStatus({ 
  stock, 
  isOutOfStock, 
  isLowStock,
  variant = 'default'
}: { 
  stock: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  variant?: 'default' | 'compact' | 'inline';
}) {
  if (isOutOfStock) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-destructive font-semibold",
        variant === 'compact' && "text-sm",
        variant === 'inline' && "text-xs"
      )}>
        <AlertTriangle className={cn("flex-shrink-0", variant === 'inline' ? "w-3 h-3" : "w-4 h-4")} />
        <span>Currently unavailable</span>
      </div>
    );
  }
  
  if (isLowStock) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-destructive font-semibold",
        variant === 'compact' && "text-sm",
        variant === 'inline' && "text-xs"
      )}>
        <AlertTriangle className={cn("flex-shrink-0", variant === 'inline' ? "w-3 h-3" : "w-4 h-4")} />
        <span>Only {stock} left in stock — order now</span>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2 text-primary font-semibold",
      variant === 'compact' && "text-sm",
      variant === 'inline' && "text-xs"
    )}>
      <Check className={cn("flex-shrink-0", variant === 'inline' ? "w-3 h-3" : "w-4 h-4")} />
      <span>In stock. Ready to ship.</span>
    </div>
  );
}

// ============================================================================
// COMPONENT: Delivery Estimate Display (reusable)
// ============================================================================
function DeliveryInfo({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
  const delivery = getDeliveryEstimate();
  
  return (
    <div className={cn(
      "flex items-start gap-2",
      variant === 'compact' && "text-sm",
      variant === 'inline' && "text-xs"
    )}>
      <Truck className={cn(
        "flex-shrink-0 text-muted-foreground",
        variant === 'inline' ? "w-3 h-3 mt-0.5" : "w-4 h-4 mt-0.5"
      )} />
      <div>
        <span className="text-foreground">
          {variant === 'inline' ? 'Delivery: ' : 'Estimated delivery: '}
        </span>
        <span className="font-semibold text-foreground">{delivery.display}</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Payment Methods Display
// ============================================================================
function PaymentMethods({ codAllowed }: { codAllowed: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Payment options</p>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          <span>Card</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Smartphone className="w-4 h-4" />
          <span>UPI</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          <span>Net Banking</span>
        </div>
        {codAllowed && (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Banknote className="w-4 h-4" />
            <span>Cash on Delivery</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Trust Signals Block
// ============================================================================
function TrustSignals() {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
      <div className="flex items-center gap-2 text-sm">
        <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">Secure checkout</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">100% genuine product</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">Price inclusive of all taxes</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">No hidden charges</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Exchange Policy
// ============================================================================
function ExchangePolicy() {
  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-start gap-2">
        <RefreshCw className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Exchange Policy</p>
          <p className="text-xs text-muted-foreground mt-1">
            Exchange applicable for defective items only. Contact support within 7 days of delivery.
            <span className="text-muted-foreground/70"> Terms & conditions apply.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: Seller Information
// ============================================================================
function SellerInfo() {
  return (
    <div className="text-sm space-y-1.5 border-t border-border pt-4">
      <div className="flex items-start gap-2">
        <Package className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-muted-foreground">Sold by: </span>
          <span className="font-medium text-foreground">Ravenius Official</span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Truck className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-muted-foreground">Fulfilled by: </span>
          <span className="font-medium text-foreground">Ravenius</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: ProductDetail
// ============================================================================
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showZoomHint, setShowZoomHint] = useState(true);

  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  const SIZES = product?.sizes ?? [];
  const SIZE_STOCK = product?.sizeStock ?? {};
  const isFreeSize = SIZES.length === 0;

  // Determine COD availability from product data
  const codAllowed = product?.codAllowed ?? product?.codEnabled ?? true;

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
    setImageLoaded(false);
  }, [allImages]);

  // Hide zoom hint after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowZoomHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantity = useCallback((type: 'inc' | 'dec') => {
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
  }, [isFreeSize, selectedSize, SIZE_STOCK]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product, quantity, selectedSize ?? undefined);
    navigate("/cart");
  }, [product, quantity, selectedSize, addItem, navigate]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addItem(product, quantity, selectedSize ?? undefined);
    navigate("/checkout");
  }, [product, quantity, selectedSize, addItem, navigate]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
    setImageLoaded(false);
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
    setImageLoaded(false);
  }, [allImages.length]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (productLoading) {
    return (
      <Layout>
        <div className="bg-background min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Skeleton className="h-4 w-48 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================================
  // NOT FOUND STATE
  // ============================================================================
  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="text-primary font-medium hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const currentStock = selectedSize ? (SIZE_STOCK[selectedSize] ?? 0) : product.stock;
  const isOutOfStock = !isFreeSize && selectedSize ? currentStock <= 0 : product.stock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const hasMultipleImages = allImages.length > 1;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <Layout>
      <div className="bg-background min-h-screen pb-32 lg:pb-8">
        
        {/* ================================================================== */}
        {/* BREADCRUMB NAVIGATION                                              */}
        {/* ================================================================== */}
        <div className="max-w-6xl mx-auto px-4 py-3 border-b border-border">
          <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            {category && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                <Link 
                  to={`/products?category=${category.slug}`} 
                  className="hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* ================================================================== */}
        {/* MAIN CONTENT GRID                                                  */}
        {/* ================================================================== */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ============================================================== */}
            {/* LEFT COLUMN: PRODUCT IMAGES                                    */}
            {/* ============================================================== */}
            <div className="space-y-4">
              
              {/* Main Image Container */}
              <div className="relative bg-muted/30 rounded-lg overflow-hidden aspect-square border border-border">
                
                {/* Loading Spinner */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {/* Product Image */}
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1} of ${allImages.length}`}
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                  className={cn(
                    "w-full h-full object-contain cursor-zoom-in transition-opacity duration-200",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onClick={() => setShowZoomHint(false)}
                />

                {/* Discount Badge - Top Left */}
                {discountPercent && discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </div>
                )}

                {/* Image Counter - Top Right */}
                {hasMultipleImages && (
                  <div className="absolute top-3 right-3 bg-foreground/80 text-background text-xs font-medium px-2 py-1 rounded">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}

                {/* Zoom Hint - Center Bottom */}
                {showZoomHint && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1.5">
                    <ZoomIn className="w-3 h-3" />
                    <span>Tap to zoom</span>
                  </div>
                )}

                {/* Navigation Arrows - Desktop */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center shadow-md border border-border transition-colors hidden sm:flex"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center shadow-md border border-border transition-colors hidden sm:flex"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Swipe Hint */}
              {hasMultipleImages && (
                <p className="text-center text-xs text-muted-foreground sm:hidden">
                  Swipe or tap arrows to view more images
                </p>
              )}

              {/* Thumbnail Strip */}
              {hasMultipleImages && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Actual product images ({allImages.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { 
                          setCurrentImageIndex(idx); 
                          setImageLoaded(false);
                          setShowZoomHint(false);
                        }}
                        className={cn(
                          "w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden transition-all",
                          idx === currentImageIndex
                            ? "border-primary ring-1 ring-primary"
                            : "border-border hover:border-muted-foreground"
                        )}
                        aria-label={`View image ${idx + 1}`}
                        aria-current={idx === currentImageIndex ? 'true' : 'false'}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`} 
                          loading="lazy" 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: PRODUCT DETAILS                                  */}
            {/* ============================================================== */}
            <div className="space-y-6">
              
              {/* Category Link */}
              {category && (
                <Link 
                  to={`/products?category=${category.slug}`}
                  className="inline-block text-sm text-primary font-medium hover:underline"
                >
                  {category.name}
                </Link>
              )}

              {/* Product Title */}
              <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {/* ============================================================ */}
              {/* PRICE BLOCK                                                   */}
              {/* ============================================================ */}
              <div className="space-y-3 pb-4 border-b border-border">
                
                {/* Price Display */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      M.R.P. ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent && discountPercent > 0 && (
                    <span className="text-sm font-semibold text-primary">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Savings Callout */}
                {savings > 0 && (
                  <p className="text-sm text-primary font-medium">
                    You save ₹{savings.toLocaleString('en-IN')} on this order
                  </p>
                )}

                {/* Tax Inclusive Note */}
                <p className="text-xs text-muted-foreground">
                  Price inclusive of all taxes
                </p>

                {/* Stock Status (repeated near price) */}
                <StockStatus 
                  stock={currentStock} 
                  isOutOfStock={isOutOfStock} 
                  isLowStock={isLowStock}
                  variant="compact"
                />

                {/* Delivery Estimate (repeated near price) */}
                {!isOutOfStock && (
                  <DeliveryInfo variant="compact" />
                )}
              </div>

              {/* ============================================================ */}
              {/* SIZE SELECTOR                                                 */}
              {/* ============================================================ */}
              {!isFreeSize && SIZES.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Size: <span className="font-bold">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((size) => {
                      const stock = SIZE_STOCK[size] ?? 0;
                      const disabled = stock <= 0;
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          disabled={disabled}
                          onClick={() => { 
                            setSelectedSize(size); 
                            setQuantity(1); 
                          }}
                          className={cn(
                            "min-w-[48px] h-10 px-4 text-sm font-medium rounded border transition-colors",
                            disabled && "border-muted bg-muted text-muted-foreground/50 line-through cursor-not-allowed",
                            !disabled && isSelected && "border-primary bg-primary text-primary-foreground",
                            !disabled && !isSelected && "border-border bg-background text-foreground hover:border-foreground"
                          )}
                          aria-label={`Select size ${size}${disabled ? ' (out of stock)' : ''}`}
                          aria-pressed={isSelected}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {/* Stock status repeated near size selector */}
                  {selectedSize && (
                    <StockStatus 
                      stock={currentStock} 
                      isOutOfStock={isOutOfStock} 
                      isLowStock={isLowStock}
                      variant="inline"
                    />
                  )}
                </div>
              )}

              {/* Free Size Indicator */}
              {isFreeSize && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="font-medium">Free Size — One size fits all</span>
                </div>
              )}

              {/* ============================================================ */}
              {/* QUANTITY SELECTOR                                             */}
              {/* ============================================================ */}
              {!isOutOfStock && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">Quantity:</span>
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => handleQuantity('dec')}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-base font-semibold border-x border-border">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity('inc')}
                        disabled={!isFreeSize && currentStock <= quantity}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Stock warning near quantity */}
                  {isLowStock && (
                    <p className="text-xs text-destructive">
                      Limited stock available. Order soon.
                    </p>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* PRIMARY CTA SECTION (Desktop)                                 */}
              {/* ============================================================ */}
              <div className="hidden lg:block space-y-4 pt-2">
                
                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    size="lg"
                    className="w-full h-12 text-base font-bold"
                  >
                    {isOutOfStock ? "Currently Unavailable" : "Buy Now"}
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-semibold border-2"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                {/* Delivery & Stock Reassurance (repeated near CTA) */}
                {!isOutOfStock && (
                  <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <DeliveryInfo variant="compact" />
                    <StockStatus 
                      stock={currentStock} 
                      isOutOfStock={isOutOfStock} 
                      isLowStock={isLowStock}
                      variant="compact"
                    />
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* PAYMENT METHODS                                               */}
              {/* ============================================================ */}
              <PaymentMethods codAllowed={codAllowed} />

              {/* ============================================================ */}
              {/* TRUST SIGNALS                                                 */}
              {/* ============================================================ */}
              <TrustSignals />

              {/* ============================================================ */}
              {/* EXCHANGE POLICY                                               */}
              {/* ============================================================ */}
              <ExchangePolicy />

              {/* ============================================================ */}
              {/* PRODUCT DESCRIPTION                                           */}
              {/* ============================================================ */}
              {product.description && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <h2 className="text-sm font-bold text-foreground">About this item</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* ============================================================ */}
              {/* SELLER INFORMATION                                            */}
              {/* ============================================================ */}
              <SellerInfo />

              {/* ============================================================ */}
              {/* CUSTOMER SUPPORT                                              */}
              {/* ============================================================ */}
              <div className="text-sm border-t border-border pt-4">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">Need help? </span>
                    <a href="tel:+917644059445" className="font-medium text-foreground hover:underline">
                      +91 76440 59445
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* MOBILE STICKY CTA BAR                                              */}
        {/* ================================================================== */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-pb">
          <div className="px-4 py-3 space-y-2">
            
            {/* Price and Stock Row */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {/* Delivery estimate in mobile CTA */}
                {!isOutOfStock && (
                  <DeliveryInfo variant="inline" />
                )}
              </div>
              <StockStatus 
                stock={currentStock} 
                isOutOfStock={isOutOfStock} 
                isLowStock={isLowStock}
                variant="inline"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="outline"
                className="flex-1 h-12 font-semibold border-2"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 h-12 font-bold"
              >
                {isOutOfStock ? "Unavailable" : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
