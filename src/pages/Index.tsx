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

// Define animation variants outside component to prevent re-creation
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts = [], isLoading: productsLoading } = useFeaturedProducts();

  // Reduced slice size for faster initial paint on low-end devices
  const topCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const topProducts = useMemo(() => featuredProducts.slice(0, 6), [featuredProducts]);

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
        
        {/* OPTIMIZATION: Removed heavy blur blobs. Used simple gradient mesh instead */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 pointer-events-none" />

        <div className="container relative py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* LEFT - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-2xl relative z-10"
            >
              {/* Premium Badge - Static styles instead of animated width */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-zinc-200 bg-white shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-800">
                  New Collection
                </span>
              </div>

              {/* Headline - Removed SVG Drawing Animation */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                Elevate your <br />
                <span className="text-indigo-600 dark:text-indigo-400">
                  everyday style.
                </span>
              </h1>

              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
                Discover premium winter wear and essentials.
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {" "}Crafted for comfort.
                </span>
              </p>

              {/* Search Bar - Removed Glow/Blur effects */}
              <form onSubmit={handleSearch} className="mt-8">
                <div className="relative max-w-lg flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <Search className="absolute left-4 text-zinc-400 h-5 w-5" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="h-14 pl-12 pr-32 text-base bg-transparent border-0 focus-visible:ring-0 placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 h-11 px-6 rounded-lg font-medium bg-zinc-900 hover:bg-zinc-800 text-white"
                  >
                    Explore
                  </Button>
                </div>
              </form>

              {/* Trust Pills - Static entry */}
              <div className="mt-8 flex flex-wrap gap-2">
                <FeaturePill icon={<Zap className="w-3.5 h-3.5 text-amber-500" />} text="Fast Delivery" />
                <FeaturePill icon={<ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />} text="Verified" />
                <FeaturePill icon={<Tag className="w-3.5 h-3.5 text-emerald-500" />} text="Best Prices" />
              </div>
            </motion.div>

            {/* RIGHT - Visuals */}
            {/* OPTIMIZATION: Fully hidden in DOM on Mobile to save render cost */}
            <div className="hidden lg:flex relative items-center justify-center">
              <div className="relative w-[400px] h-[500px]">
                {/* Simplified Card - Removed rotations and noise textures */}
                <div className="absolute inset-4 bg-zinc-900 rounded-[2rem] shadow-xl flex flex-col items-center justify-between p-8 text-white border border-zinc-800">
                  
                  <div className="w-full flex justify-between items-center">
                    <span className="font-mono text-xs text-zinc-500">FW/24</span>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold tracking-widest">ESSENTIALS</h3>
                  </div>

                  <div className="w-full">
                    {/* Replaced infinite width animation with static bar */}
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-3/4" />
                    </div>
                  </div>
                </div>

                {/* Static Notification Card - No float animation */}
                <div className="absolute top-20 -right-4 bg-white p-3 pr-6 rounded-xl shadow-lg border border-zinc-100 z-20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Dispatched</p>
                      <p className="text-[10px] text-zinc-500">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-12 bg-white dark:bg-zinc-950">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-900">Categories</h2>
            </div>
            <Link to="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topCategories.map((c, idx) => (
                <CategoryCard key={c.id} category={c} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-bold mb-1 text-[10px] uppercase tracking-widest">
                <Star className="w-3 h-3 fill-current" />
                Favorites
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-900">Trending</h2>
            </div>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl bg-zinc-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {topProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="w-full md:w-auto rounded-lg h-12 border-zinc-300">
              <Link to="/products">Shop all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SIMPLE CTA SECTION - Removed Noise Texture & Gradient Overlay */}
      <section className="py-16">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white shadow-lg p-8 md:p-16 text-center">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Quality First.
            </h3>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of happy customers. Fast delivery and premium support.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-white text-zinc-950 hover:bg-zinc-200">
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* Optimized Feature Pill - No Backdrop Blur */
function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-[10px] sm:text-xs font-bold text-zinc-700 uppercase tracking-wide">{text}</span>
    </div>
  );
}
