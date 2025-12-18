import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronLeft, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug, useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Assuming CartContext exposes a clearCart or similar, otherwise we just add.
  // We need 'items' to check logic, but for "Buy Now" we rely on local state first.
  const { addItem, clearCart } = useCart(); 
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  // Mock sizes since they aren't in the original type definition
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

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

  // Logic to handle "Buy Now" - Open cart with only this item
  const handleBuyNow = () => {
    if (!product) return;

    // 1. Optional: Clear existing cart to ensure "only that item"
    // If your context supports clearCart(), use it. 
    if (clearCart) clearCart();

    // 2. Add the item with specific quantity
    // We loop to add the specific quantity since addItem usually adds 1
    for (let i = 0; i < quantity; i++) {
       addItem(product); 
    }

    // 3. Navigate directly to cart
    navigate('/cart');
  };

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity(prev => Math.max(1, prev - 1));
    } else {
      setQuantity(prev => prev + 1);
    }
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
        
        {/* Navigation Overlay */}
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

        {/* Image Display */}
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

        {/* Image Dots (if multiple) */}
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

      {/* --- BOTTOM DETAILS SHEET --- */}
      <div className="relative z-10 -mt-8 bg-white rounded-t-[35px] px-6 pt-8 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] min-h-[45vh] flex flex-col">
        
        {/* Header Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 mb-1 tracking-tight">
            {product.name}
          </h1>
          <p className="text-zinc-400 text-sm font-medium mb-3">
            {category ? category.name : "Women's Collection"}
          </p>
          
          {/* Rating (Mocked to match image) */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={cn("w-4 h-4", star <= 4 ? "fill-zinc-900 text-zinc-900" : "text-zinc-300")} 
              />
            ))}
            <span className="ml-2 text-xs font-bold text-zinc-500">(5.0)</span>
          </div>
        </div>

        {/* Size Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Select size</h3>
          <div className="flex gap-4">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  selectedSize === size
                    ? "bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30 scale-110" // Selected: Yellow
                    : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200" // Default: Grey
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Price Row */}
        <div className="flex items-center justify-between mb-8 mt-auto">
          <div className="flex items-center gap-4">
            {/* Decrease */}
            <button 
              onClick={() => handleQuantity('dec')}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-zinc-600" />
            </button>
            
            {/* Number */}
            <span className="text-xl font-bold min-w-[1.5rem] text-center">{quantity}</span>
            
            {/* Increase */}
            <button 
              onClick={() => handleQuantity('inc')}
              className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold text-zinc-900">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Buy Now Button */}
        <Button 
          onClick={handleBuyNow}
          className="w-full h-16 rounded-3xl bg-zinc-900 text-white text-lg font-medium hover:bg-zinc-800 shadow-xl shadow-zinc-900/20"
        >
          Add to Bag
        </Button>
        
      </div>
    </div>
  );
}
