import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronLeft, Heart, ShoppingBag, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Swipe detection hook for mobile gallery
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { addItem } = useCart(); 
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  // Compute sizes & stock directly from DB
  const SIZES = product?.sizes ?? [];
  const SIZE_STOCK = product?.sizeStock ?? {};

  // Free-size detection (no sizes set)
  const isFreeSize = SIZES.length === 0;

  // Auto-select size when product loads
  useEffect(() => {
    if (!product) return;

    if (isFreeSize) {
      setSelectedSize(null);
      return;
    }

    // Find first size that has stock, else first size
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

    return imgs.length ? imgs : ['/placeholder.svg'];
  }, [product]);

  // Swipe handlers
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    setImageLoaded(false);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    setImageLoaded(false);
  }, [allImages.length]);

  const swipeHandlers = useSwipe(nextImage, prevImage);

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    }
  };

  // Loading skeleton
  if (productLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          {/* Mobile skeleton */}
          <div className="lg:hidden">
            <Skeleton className="w-full h-[60vh]" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="flex gap-3 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="w-14 h-14 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-16 w-full mt-8 rounded-2xl" />
            </div>
          </div>
          {/* Desktop skeleton */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:p-12 3xl:p-20 4xl:p-28 max-w-[2000px] mx-auto">
            <Skeleton className="aspect-[3/4] rounded-3xl" />
            <div className="space-y-6 py-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="w-16 h-16 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-16 w-full mt-8 rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Item Not Found</h1>
            <p className="text-muted-foreground mb-8">This product might be sold out or no longer available.</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const currentStock = selectedSize ? (SIZE_STOCK[selectedSize] ?? 0) : product.stock;
  const isOutOfStock = !isFreeSize && selectedSize ? currentStock <= 0 : product.stock <= 0;
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : null;

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* ========== MOBILE & TABLET LAYOUT ========== */}
      <div className="lg:hidden">
        {/* Image Section */}
        <div 
          className="relative w-full h-[55vh] xs:h-[60vh] md:h-[65vh] bg-muted overflow-hidden"
          {...swipeHandlers}
        >
          {/* Top Navigation Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 left-0 right-0 p-4 xs:p-5 md:p-6 flex justify-between items-center z-20"
          >
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)} 
              className="w-10 h-10 xs:w-11 xs:h-11 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center shadow-soft transition-all hover:bg-background"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-10 h-10 xs:w-11 xs:h-11 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center shadow-soft transition-all hover:bg-background"
              >
                <Share2 className="w-5 h-5 text-foreground" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "w-10 h-10 xs:w-11 xs:h-11 rounded-full backdrop-blur-md flex items-center justify-center shadow-soft transition-all",
                  isWishlisted ? "bg-destructive/10" : "bg-background/90 hover:bg-background"
                )}
              >
                <Heart 
                  className={cn(
                    "w-5 h-5 transition-all duration-300", 
                    isWishlisted ? "fill-destructive text-destructive scale-110" : "text-foreground"
                  )} 
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-shimmer" />
              )}
              <img
                src={allImages[currentImageIndex]}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "w-full h-full object-cover object-top transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Pagination Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
              {allImages.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setImageLoaded(false);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === currentImageIndex 
                      ? "w-8 bg-foreground" 
                      : "w-2 bg-foreground/30 hover:bg-foreground/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 -mt-6 bg-background rounded-t-[2rem] px-5 xs:px-6 md:px-8 pt-6 pb-8 min-h-[45vh] flex flex-col"
        >
          {/* Category & Discount Badge */}
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category.name}
              </span>
            )}
            {discountPercent && discountPercent > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-destructive/10 text-destructive rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl xs:text-4xl font-bold text-foreground">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Size Selector */}
          {!isFreeSize && SIZES.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Select Size</h3>
                {selectedSize && (
                  <span className="text-xs text-muted-foreground">
                    {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {SIZES.map((size) => {
                  const stock = SIZE_STOCK[size] ?? 0;
                  const disabled = stock <= 0;

                  return (
                    <motion.button
                      key={size}
                      whileTap={{ scale: disabled ? 1 : 0.95 }}
                      disabled={disabled}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={cn(
                        "min-w-[3.5rem] h-12 xs:h-14 px-4 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200",
                        disabled
                          ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                          : selectedSize === size
                          ? "bg-accent text-accent-foreground shadow-glow ring-2 ring-accent ring-offset-2 ring-offset-background"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Free Size Notice */}
          {isFreeSize && (
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Free Size / One Size Fits All
            </div>
          )}

          {/* Features */}
          <div className="flex gap-4 mb-6 py-4 border-y border-border overflow-x-auto scrollbar-hide">
            {[
              { icon: Truck, label: "Free Delivery" },
              { icon: Shield, label: "Genuine Product" },
              { icon: RotateCcw, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Quantity & Total */}
          <div className="flex items-center justify-between mb-6 mt-auto">
            <div className="flex items-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantity('dec')}
                disabled={quantity <= 1}
                className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </motion.button>

              <span className="text-xl font-bold min-w-[2rem] text-center text-foreground">{quantity}</span>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantity('inc')}
                disabled={!isFreeSize && currentStock <= quantity}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <span className="text-2xl xs:text-3xl font-bold text-foreground">
                ₹{(product.price * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className={cn(
                "w-full h-14 xs:h-16 rounded-2xl text-base xs:text-lg font-semibold shadow-xl transition-all",
                isOutOfStock 
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {isOutOfStock ? "Out of Stock" : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Add to Bag
                </span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ========== DESKTOP & TV LAYOUT ========== */}
      <div className="hidden lg:block">
        {/* Top Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 glass border-b border-border"
        >
          <div className="max-w-[2000px] mx-auto px-8 xl:px-12 3xl:px-20 4xl:px-28 py-4 flex items-center justify-between">
            <motion.button 
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Share2 className="w-4 h-4 text-foreground" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isWishlisted ? "bg-destructive/10" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-all", 
                    isWishlisted ? "fill-destructive text-destructive" : "text-foreground"
                  )} 
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-[2000px] mx-auto px-8 xl:px-12 3xl:px-20 4xl:px-28 py-8 xl:py-12 3xl:py-16">
          <div className="grid lg:grid-cols-2 xl:grid-cols-[1fr,1.1fr] 3xl:grid-cols-2 gap-8 xl:gap-12 3xl:gap-20">
            
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-muted animate-shimmer" />
                    )}
                    <img
                      src={allImages[currentImageIndex]}
                      alt={product.name}
                      onLoad={() => setImageLoaded(true)}
                      className={cn(
                        "w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Image Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity rotate-180"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                  </>
                )}

                {/* Discount Badge */}
                {discountPercent && discountPercent > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-bold rounded-full">
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={cn(
                        "aspect-square rounded-xl overflow-hidden bg-muted transition-all duration-200",
                        idx === currentImageIndex 
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:py-4 xl:py-8 3xl:py-12"
            >
              {/* Category */}
              {category && (
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {category.name}
                </p>
              )}

              {/* Product Name */}
              <h1 className="text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl font-bold text-foreground tracking-tight leading-tight mb-4 xl:mb-6">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6 xl:mb-8">
                <span className="text-3xl xl:text-4xl 3xl:text-5xl font-bold text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg xl:text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground text-base xl:text-lg leading-relaxed mb-8 xl:mb-10 max-w-xl">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              {!isFreeSize && SIZES.length > 0 && (
                <div className="mb-8 xl:mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Select Size</h3>
                    {selectedSize && (
                      <span className="text-sm text-muted-foreground">
                        {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {SIZES.map((size) => {
                      const stock = SIZE_STOCK[size] ?? 0;
                      const disabled = stock <= 0;

                      return (
                        <motion.button
                          key={size}
                          whileHover={{ scale: disabled ? 1 : 1.05 }}
                          whileTap={{ scale: disabled ? 1 : 0.95 }}
                          disabled={disabled}
                          onClick={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          className={cn(
                            "min-w-[4rem] h-14 xl:h-16 px-5 rounded-xl flex items-center justify-center text-sm xl:text-base font-bold transition-all duration-200",
                            disabled
                              ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                              : selectedSize === size
                              ? "bg-accent text-accent-foreground shadow-glow ring-2 ring-accent ring-offset-2 ring-offset-background"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {size}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Free Size Notice */}
              {isFreeSize && (
                <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Free Size / One Size Fits All
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8 xl:mb-10">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center gap-3 bg-secondary rounded-full p-1">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantity('dec')}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </motion.button>

                    <span className="text-lg font-bold min-w-[2rem] text-center text-foreground">{quantity}</span>
                    
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantity('inc')}
                      disabled={!isFreeSize && currentStock <= quantity}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Total & Add to Cart */}
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 xl:gap-6 mb-10">
                <div className="xl:min-w-[140px]">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total</p>
                  <span className="text-3xl xl:text-4xl font-bold text-foreground">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className={cn(
                      "w-full h-16 xl:h-[4.5rem] rounded-2xl text-lg font-semibold shadow-xl transition-all",
                      isOutOfStock 
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    )}
                  >
                    {isOutOfStock ? "Out of Stock" : (
                      <span className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5" />
                        Add to Bag
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                {[
                  { icon: Truck, label: "Free Delivery", desc: "On orders above ₹499" },
                  { icon: Shield, label: "100% Genuine", desc: "Authentic products" },
                  { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
