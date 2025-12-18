import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronLeft, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const { addItem, clearCart } = useCart(); 
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  }, [product]);

  const category = useMemo(() => {
    return product ? categories.find(c => c.id === product.categoryId) : null;
  }, [product, categories]);

  const allImages = useMemo(() => {
    if (!product) return [];

    const imgs: string[] = [];

    // Collect images from the images array first (real uploaded images)
    if (product.images?.length) {
      product.images.forEach(img => {
        if (img && img.trim() !== "" && img !== '/placeholder.svg' && !imgs.includes(img)) {
          imgs.push(img);
        }
      });
    }

    // Only add imageUrl if it's a REAL image (not placeholder) and not already included
    if (product.imageUrl && product.imageUrl.trim() !== "" && product.imageUrl !== '/placeholder.svg' && !imgs.includes(product.imageUrl)) {
      imgs.unshift(product.imageUrl); // Add to front only if it's a real image
    }

    // Fallback to placeholder only if NO real images exist
    return imgs.length ? imgs : ['/placeholder.svg'];
  }, [product]);

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity(prev => Math.max(1, prev - 1));
      return;
    }

    // If size selected, limit by size stock
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
        <div className="container h-screen flex flex-col justify-end pb-10">
          <Skeleton className="h-full w-full rounded-3xl" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <Button asChild variant="default" className="rounded-full">
            <Link to="/products">Return to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="bg-white min-h-screen relative font-sans">
      
      {/* --- TOP IMAGE SECTION --- */}
      <div className="relative w-full h-[55vh] md:h-[60vh] lg:h-[65vh] bg-gray-100">
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-900" />
          </button>
          
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <Heart 
              className={cn("w-6 h-6 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-900")} 
            />
          </button>
        </div>

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={allImages[currentImageIndex]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover object-top"
          />
        </AnimatePresence>

        {/* Image dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-20">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="relative z-10 -mt-8 bg-white rounded-t-[35px] px-6 pt-8 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] min-h-[45vh] flex flex-col">
        
        {/* Title + Category */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 mb-1 tracking-tight">
            {product.name}
          </h1>
          <p className="text-zinc-400 text-sm font-medium mb-3">
            {category ? category.name : ""}
          </p>
        </div>

        {/* SIZE SELECTOR */}
        {!isFreeSize && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Select size</h3>
            <div className="flex gap-4 flex-wrap">
              {SIZES.map((size) => {
                const stock = SIZE_STOCK[size] ?? 0;
                const disabled = stock <= 0;

                return (
                  <button
                    key={size}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1); // reset qty
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      disabled
                        ? "bg-zinc-200 text-zinc-400 opacity-50"
                        : selectedSize === size
                        ? "bg-yellow-400 text-zinc-900 shadow-lg scale-110"
                        : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Show stock for selected size */}
            {selectedSize && (
              <p className="text-xs text-zinc-500 mt-2">
                In stock: {SIZE_STOCK[selectedSize] ?? 0}
              </p>
            )}
          </div>
        )}

        {/* FREE SIZE MODE */}
        {isFreeSize && (
          <div className="mb-8 text-sm text-zinc-600 font-medium">
            This item does not require size selection (Free Size / Accessories)
          </div>
        )}

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mb-8 mt-auto">
          <div className="flex items-center gap-4">

            <button 
              onClick={() => handleQuantity('dec')}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-zinc-600" />
            </button>

            <span className="text-xl font-bold min-w-[1.5rem] text-center">{quantity}</span>
            
            <button 
              onClick={() => handleQuantity('inc')}
              className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold text-zinc-900">
              ₹{(product.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <Button 
          onClick={handleAddToCart}
          className="w-full h-16 rounded-3xl bg-zinc-900 text-white text-lg font-medium hover:bg-zinc-800 shadow-xl"
        >
          Add to Bag
        </Button>
        
      </div>
    </div>
  );
            }
