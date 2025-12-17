import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  Package, 
  Clock, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Zap, 
  ShoppingBag,
  Tag
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
      <section className="relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950">
        {/* Abstract Premium Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container relative py-12 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT - Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm shadow-sm mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-sm font-medium text-zinc-800">Premium Essentials Collection</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50">
                Elevate your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  everyday style.
                </span>
              </h1>

              <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                Discover premium winter wear, quality bedsheets, and daily essentials designed for comfort and crafted to last.
              </p>

              {/* Search Bar */}
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch} 
                className="mt-10"
              >
                <div className="relative max-w-lg group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                    <Search className="absolute left-5 text-zinc-400 h-5 w-5" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jackets, shawls, home decor..."
                      className="h-16 pl-14 pr-36 text-base bg-transparent border-0 focus-visible:ring-0 placeholder:text-zinc-400 text-zinc-900"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 h-12 px-8 rounded-xl font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-none transition-all"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* Features - Premium Pills */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-wrap gap-4"
              >
                <FeaturePill icon={<Zap className="w-4 h-4 text-amber-500" />} text="Express Shipping" />
                <FeaturePill icon={<ShieldCheck className="w-4 h-4 text-indigo-500" />} text="Authentic Quality" />
                <FeaturePill icon={<Tag className="w-4 h-4 text-emerald-500" />} text="Best Prices" />
              </motion.div>
            </motion.div>

            {/* RIGHT - Premium Illustration */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-[500px]">
                {/* Decorative Circle */}
                <div className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-800" />
                <div className="absolute inset-4 rounded-full border border-zinc-100 dark:border-zinc-900" />
                
                {/* Main Floating Elements - Abstract Fashion Composition */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-64 h-80 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white p-6 relative z-10"
                  >
                     <ShoppingBag className="w-20 h-20 text-white/80 mb-4" strokeWidth={1} />
                     <span className="font-display text-2xl font-bold tracking-widest">ESSENTIALS</span>
                     <span className="text-xs text-white/50 tracking-[0.2em] mt-2">EST. 2024</span>
                  </motion.div>
                </div>

                {/* Floating Card 1 */}
                <motion.div
                  animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-20 right-0 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">New Arrivals</p>
                      <p className="text-[10px] text-zinc-500">Winter Collection</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 2 */}
                <motion.div
                  animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 left-0 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Track Order</p>
                      <p className="text-[10px] text-zinc-500">On the way</p>
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

      {/* TRENDING / BESTSELLERS SECTION */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2 text-sm uppercase tracking-wider">
                <Star className="w-4 h-4 fill-current" />
                Most Loved
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900">Trending Essentials</h2>
            </div>
            
            <div className="hidden md:block">
              <Button asChild variant="ghost" className="text-zinc-500 hover:text-zinc-900">
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
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link to="/products">Shop all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LUXURY CTA SECTION */}
      <section className="py-20">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 text-white"
          >
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-zinc-900 to-zinc-950" />
            
            <div className="relative px-8 py-20 md:py-32 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">
                Quality that speaks for itself.
              </h3>
              <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
                Join thousands of happy customers who trust us for their daily comfort and seasonal style. Fast delivery, easy returns, and premium support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full h-14 px-10 font-semibold bg-white text-zinc-900 hover:bg-zinc-100"
                >
                  <Link to="/products">
                    Start Shopping
                  </Link>
                </Button>
                <Button 
  asChild 
  size="lg" 
  variant="outline" 
  className="w-full sm:w-auto rounded-full h-14 px-10 font-semibold border-zinc-700 
             bg-transparent text-black hover:text-black hover:bg-zinc-100"
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

/* Feature Pill Component - Updated Styles */
function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-100 shadow-sm">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-zinc-700 whitespace-nowrap">{text}</span>
    </div>
  );
}
