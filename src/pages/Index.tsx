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

/* ---------------- IMAGE SANITIZER (THE IMPORTANT PART) ---------------- */

const getSafeImage = (product: any) => {
  // Prefer images array
  if (product.images?.length) {
    const valid = product.images.find(
      (img: string) => img && img.trim() !== "" && img !== "/placeholder.svg"
    );
    if (valid) return valid;
  }

  // Fallback to imageUrl
  if (
    product.imageUrl &&
    product.imageUrl.trim() !== "" &&
    product.imageUrl !== "/placeholder.svg"
  ) {
    return product.imageUrl;
  }

  // Final fallback
  return "/placeholder.svg";
};

/* ---------------- ANIMATIONS ---------------- */

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts = [], isLoading: productsLoading } =
    useFeaturedProducts();

  const topCategories = useMemo(
    () => categories.slice(0, 4),
    [categories]
  );

  // 🔥 FIX APPLIED HERE
  const topProducts = useMemo(() => {
    return featuredProducts.slice(0, 6).map((p) => ({
      ...p,
      imageUrl: getSafeImage(p),
    }));
  }, [featuredProducts]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20" />

        <div className="container relative py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border bg-white">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-bold uppercase">
                  New Collection
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
                Elevate your <br />
                <span className="text-indigo-600">everyday style.</span>
              </h1>

              <p className="mt-6 text-lg text-zinc-600 max-w-lg">
                Premium winter wear and essentials. Crafted for comfort.
              </p>

              <form onSubmit={handleSearch} className="mt-8">
                <div className="relative max-w-lg flex items-center bg-white rounded-xl border">
                  <Search className="absolute left-4 h-5 w-5 text-zinc-400" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="h-14 pl-12 pr-32 border-0"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 h-11 px-6 bg-zinc-900 text-white"
                  >
                    Explore
                  </Button>
                </div>
              </form>

              <div className="mt-8 flex gap-2">
                <FeaturePill icon={<Zap className="w-4 h-4" />} text="Fast Delivery" />
                <FeaturePill icon={<ShieldCheck className="w-4 h-4" />} text="Verified" />
                <FeaturePill icon={<Tag className="w-4 h-4" />} text="Best Prices" />
              </div>
            </motion.div>

            <div className="hidden lg:flex justify-center">
              <div className="w-[400px] h-[500px] bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-white">
                <ShoppingBag className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold tracking-widest">
                  ESSENTIALS
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex justify-between mb-8">
            <h2 className="text-3xl font-bold">Categories</h2>
            <Link to="/products" className="text-indigo-600 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
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

      {/* TRENDING */}
      <section className="py-12 bg-zinc-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Trending</h2>

          {productsLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- FEATURE PILL ---------------- */

function FeaturePill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border">
      {icon}
      <span className="text-xs font-bold uppercase">{text}</span>
    </div>
  );
}
