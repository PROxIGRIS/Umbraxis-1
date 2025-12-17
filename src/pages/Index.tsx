import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  Package, 
  Sparkles, 
  Zap, 
  ShoppingBag,
  Tag,
  Star,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryCard } from "@/components/products/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts = [], isLoading: productsLoading } = useFeaturedProducts();

  const topCategories = useMemo(() => categories.slice(0, 8), [categories]);
  const topProducts = useMemo(() => featuredProducts.slice(0, 10), [featuredProducts]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        
        {/* Cinematic Background Blurs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-[80px]" />
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-zinc-200/20 dark:bg-zinc-800/20 rounded-full blur-[60px]" />

        <div className="container relative py-16 md:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT - Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl relative z-10"
            >
              {/* Premium Badge */}
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md shadow-sm mb-8 overflow-hidden whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-800">New Winter Collection</span>
              </motion.div>

              {/* Headline with Drawing Effect */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50">
                Elevate your <br/>
                <span className="relative inline-block text-zinc-900 dark:text-white">
                  {/* The Text */}
                  <span className="relative z-10">everyday style</span>
                  
                  {/* The Drawing Line Animation */}
                  <div className="absolute -bottom-2 left-0 w-full h-4 overflow-visible pointer-events-none z-0">
                    <svg
                      viewBox="0 0 300 20"
                      className="w-full h-full text-indigo-500"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M5 12c40-5 90-8 140-4 40 3 80 10 150 2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                </span>
                .
              </h1>

              <p className="mt-8 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
                Discover premium winter wear, artisan shawls, and home essentials. 
                <span className="font-medium text-zinc-900 dark:text-zinc-200"> Crafted for comfort. Designed to last.</span>
              </p>

              {/* Enhanced Search Bar */}
              <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onSubmit={handleSearch} 
                className="mt-10"
              >
                <div className="relative max-w-lg group">
                  {/* Glow Effect on Hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                  
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                    <Search className="absolute left-5 text-zinc-400 h-5 w-5" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jackets, shawls, decor..."
                      className="h-16 pl-14 pr-36 text-base bg-transparent border-0 focus-visible:ring-0 placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 h-12 px-8 rounded-xl font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* Trust Pills */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 flex flex-wrap gap-3"
              >
                <FeaturePill icon={<Zap className="w-3.5 h-3.5 text-amber-500" />} text="Fast Delivery" />
                <FeaturePill icon={<ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />} text="Verified Quality" />
                <FeaturePill icon={<Tag className="w-3.5 h-3.5 text-emerald-500" />} text="Best Prices" />
              </motion.div>
            </motion.div>

            {/* RIGHT - Layered Visuals */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:flex items-center justify-center perspective-1000"
            >
              <div className="relative w-[500px] h-[600px]">
                
                {/* Back Card (Rotated) */}
                <motion.div 
                  animate={{ rotate: [6, 4, 6] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-zinc-900 rounded-[3rem] rotate-6 opacity-10 scale-95"
                />
                
                {/* Main Visual Card */}
                <motion.div 
                   animate={{ y: [0, -15, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute inset-4 bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-between p-10 text-white overflow-hidden border border-zinc-800"
                >
                   {/* Abstract Grid Background */}
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                   <div className="w-full flex justify-between items-center z-10">
                      <span className="font-mono text-xs text-zinc-400">FW/24</span>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                   </div>

                   <div className="relative z-10 text-center">
                     <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]">
                        <ShoppingBag className="w-10 h-10 text-white" />
                     </div>
                     <h3 className="text-3xl font-display font-bold tracking-widest">ESSENTIALS</h3>
                     <p className="text-zinc-400 text-sm mt-2 tracking-widest uppercase">Premium Selection</p>
                   </div>

                   <div className="w-full z-10">
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white"
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <div className="flex justify-between mt-3 text-xs text-zinc-500 font-mono">
                        <span>LOADING COLLECTION</span>
                        <span>100%</span>
                      </div>
                   </div>
                </motion.div>

                {/* Floating Notification Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-24 -right-8 bg-white/90 backdrop-blur-md p-4 pr-8 rounded-2xl shadow-xl border border-white/50 z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Order Dispatched</p>
                      <p className="text-xs text-zinc-500">Just now</p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 tracking-tight">Curated Categories</h2>
              <p className="text-zinc-500 mt-2 text-lg">Browse our premium collection by category</p>
            </div>

            <Button asChild variant="outline" className="rounded-full px-6 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
              <Link to="/products" className="flex items-center gap-2">
                View all collections <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl bg-zinc-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCategories.map((c, idx) => (
                <CategoryCard key={c.id} category={c} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-bold mb-2 text-xs uppercase tracking-widest">
                <Star className="w-4 h-4 fill-current" />
                Customer Favorites
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900">Trending Now</h2>
            </div>
            
            <div className="hidden md:block">
              <Button asChild variant="ghost" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50">
                <Link to="/products" className="flex items-center gap-2">
                  Shop all <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl bg-zinc-200/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {topProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          
          <div className="md:hidden mt-8 text-center">
            <Button asChild variant="outline" className="w-full rounded-xl h-12">
              <Link to="/products">Shop all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LUXURY CTA SECTION */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 text-white shadow-2xl"
          >
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-zinc-900/50 to-transparent" />
            
            {/* Content */}
            <div className="relative px-8 py-20 md:py-28 text-center max-w-4xl mx-auto z-10">
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight leading-tight">
                Quality that speaks for itself.
              </h3>
              <p className="text-lg md:text-xl text-zinc-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                Join thousands of happy customers who trust us for their daily comfort and seasonal style. Fast delivery, easy returns, and premium support.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105"
                >
                  <Link to="/products">
                    Start Shopping
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-semibold border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white transition-all"
                >
                  <Link to="/about">
                    Our Story
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

/* Feature Pill Component */
function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-zinc-200/50 shadow-sm hover:bg-white hover:shadow-md transition-all cursor-default">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">{text}</span>
    </div>
  );
                }
