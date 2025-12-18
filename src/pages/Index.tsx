import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Zap,
  Tag,
  Star,
  ShieldCheck,
  Clock,
  TrendingUp,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

// --- OPTIMIZED UTILS ---

// Reduced motion check for accessibility and low-end devices
const transitionSettings = { duration: 0.4, ease: "easeOut" };

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts = [], isLoading: productsLoading } = useFeaturedProducts();

  // Memoize heavy operations
  const topCategories = useMemo(() => categories.slice(0, 10), [categories]);
  const topProducts = useMemo(() => featuredProducts.slice(0, 10), [featuredProducts]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        
        {/* --- MOBILE SEARCH HEADER (Sticky) --- */}
        <header className="sticky top-0 z-40 bg-white border-b border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 px-4 py-3 shadow-sm lg:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="search"
              placeholder="Search for products, brands and more"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </header>

        {/* --- HERO SECTION (Optimized) --- */}
        <section className="relative overflow-hidden pt-6 pb-12 lg:py-20">
          {/* Static CSS Gradient Background - GPU Efficient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-zinc-50 to-zinc-50 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-zinc-950 opacity-70 pointer-events-none" />
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Left Content */}
              <motion.div 
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transitionSettings}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Mega Winter Sale</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                  Discover the <br className="hidden sm:block" />
                  <span className="text-indigo-600 dark:text-indigo-400">Extraordinary.</span>
                </h1>
                
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                  Shop the latest trends with confidence. Verified quality, lightning-fast delivery, and prices that make sense.
                </p>

                {/* Desktop Search */}
                <form onSubmit={handleSearch} className="hidden lg:block mt-8 relative max-w-md">
                  <div className="relative flex items-center">
                    <input 
                      className="w-full h-14 pl-6 pr-32 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-indigo-500 focus:ring-0 transition-colors shadow-sm text-lg"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" className="absolute right-2 h-10 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                      Search
                    </Button>
                  </div>
                </form>

                {/* Trust Badges - Optimized layout */}
                <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Genuine Products
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Easy Returns
                  </div>
                </div>
              </motion.div>

              {/* Right Content - Static Image with Light Animation instead of 3D Card */}
              <motion.div 
                className="relative hidden lg:block"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, ...transitionSettings }}
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 shadow-2xl ring-1 ring-zinc-900/5">
                  {/* Replace this with a real banner image in production */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <div className="text-center p-8">
                       <span className="block text-9xl font-black opacity-20 select-none">50%</span>
                       <h3 className="text-3xl font-bold relative -mt-12">Winter Collection</h3>
                       <Button variant="secondary" className="mt-6 rounded-full" asChild>
                         <Link to="/products">Shop Now</Link>
                       </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- CATEGORY RAIL (Mobile Optimized - Horizontal Scroll) --- */}
        <section className="py-4 lg:py-10 border-b border-zinc-100 dark:border-zinc-800">
          <div className="container">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg lg:text-2xl font-bold text-zinc-900 dark:text-white">Shop by Category</h2>
              <Link to="/categories" className="text-indigo-600 text-sm font-medium flex items-center">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
              {categoriesLoading ? (
                 Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="flex-none w-20 lg:w-32 text-center space-y-2">
                     <Skeleton className="w-16 h-16 lg:w-24 lg:h-24 rounded-full mx-auto" />
                     <Skeleton className="h-3 w-12 mx-auto" />
                   </div>
                 ))
              ) : (
                topCategories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/products?category=${cat.slug}`}
                    className="flex-none snap-start group w-20 lg:w-28 flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-zinc-200 dark:border-zinc-700">
                      {/* Fallback Icon if no image */}
                      <Smartphone className="w-6 h-6 lg:w-8 lg:h-8" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center line-clamp-1">
                      {cat.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* --- FLASH SALE BANNER --- */}
        <section className="py-8 bg-gradient-to-r from-rose-500 to-orange-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="container relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-rose-100 font-medium text-sm uppercase tracking-wide">
                <Clock className="w-4 h-4 animate-pulse" /> Limited Time Offer
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">End of Season Sale</h2>
              <p className="text-rose-100 mt-1">Up to 70% off on premium brands.</p>
            </div>
            <div className="flex items-center gap-3">
              <CountdownBox num={12} label="Hrs" />
              <span className="text-2xl font-bold mb-4">:</span>
              <CountdownBox num={45} label="Mins" />
              <span className="text-2xl font-bold mb-4">:</span>
              <CountdownBox num={18} label="Secs" />
            </div>
            <Button size="lg" className="bg-white text-rose-600 hover:bg-rose-50 border-none font-bold shadow-lg rounded-full px-8">
              Grab Deals
            </Button>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-950/50">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl lg:text-3xl font-bold text-zinc-900 dark:text-white">Recommended for You</h2>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
                {topProducts.map((product) => (
                  <ProductCardWrapper key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="min-w-[200px] bg-white dark:bg-zinc-900 rounded-full" asChild>
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- APP DOWNLOAD CTA (Trust Signal) --- */}
        <section className="py-16 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
          <div className="container">
            <div className="bg-indigo-600 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="relative z-10 max-w-xl text-center md:text-left mb-8 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Shop faster on the app</h3>
                <p className="text-indigo-100 text-lg mb-6">Get exclusive deals, real-time tracking, and personalized recommendations.</p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <div className="h-10 w-32 bg-black/20 rounded-lg flex items-center justify-center border border-white/20 cursor-pointer hover:bg-black/30 transition">
                    <span className="text-xs font-bold">App Store</span>
                  </div>
                  <div className="h-10 w-32 bg-black/20 rounded-lg flex items-center justify-center border border-white/20 cursor-pointer hover:bg-black/30 transition">
                    <span className="text-xs font-bold">Google Play</span>
                  </div>
                </div>
              </div>

              {/* Mockup or Illustration */}
              <div className="relative z-10">
                 <Smartphone className="w-32 h-32 text-indigo-200 opacity-80" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}

// --- OPTIMIZED SUB-COMPONENTS ---

function CountdownBox({ num, label }: { num: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 min-w-[60px] text-center border border-white/10">
      <div className="text-xl md:text-2xl font-bold leading-none">{num}</div>
      <div className="text-[10px] uppercase opacity-80 mt-1">{label}</div>
    </div>
  );
}

// A wrapper to ensure layout stability for product cards
function ProductCardWrapper({ product }: { product: any }) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
       {/* Pass product props to your existing card component, or build a simple optimized one here */}
       <ProductCard product={product} />
    </div>
  );
            }
