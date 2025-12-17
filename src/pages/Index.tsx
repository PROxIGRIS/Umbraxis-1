import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star, Sparkles, Shield, Heart } from "lucide-react";
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 opacity-80" />

        <div className="container relative py-14 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >

              {/* SMALL BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
                <Heart className="w-4 h-4 text-primary" />
                Trusted Family Store Since 1998
              </div>

              {/* TITLE */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight">
                Everyday essentials,
                <br />
                <span className="text-gradient">made comfortable</span>
                <br />
                <span className="text-accent">for every home.</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Quality shawls, bedsheets, t-shirts, winter wear and daily essentials. 
                Honest pricing, reliable comfort, and designs your family has trusted for years.
              </p>

              {/* SEARCH */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch}
                className="mt-8"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-card rounded-2xl border border-border/50 shadow-md overflow-hidden">
                    <Search className="absolute left-5 text-muted-foreground h-5 w-5" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search shawls, bedsheets, t-shirts..."
                      className="h-14 pl-14 pr-36 text-base bg-transparent border-0 focus-visible:ring-0"
                    />
                    <Button type="submit" className="absolute right-2 h-10 px-6 rounded-xl font-semibold shadow-md">
                      Search
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* CTA BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="rounded-xl h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/products" className="inline-flex items-center gap-2">
                    Shop Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="rounded-xl h-12 px-8 font-semibold border-border/50">
                  <Link to="/track-order">Track Order</Link>
                </Button>
              </motion.div>

              {/* FEATURES */}
              <div className="mt-10 flex flex-wrap gap-6">
                <FeaturePill icon={<Star className="w-4 h-4" />} text="Trusted Quality" />
                <FeaturePill icon={<Shield className="w-4 h-4" />} text="Fair Pricing" />
                <FeaturePill icon={<Sparkles className="w-4 h-4" />} text="Comfort First" />
              </div>

            </motion.div>

            {/* RIGHT VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="w-80 h-[420px] md:w-96 md:h-[500px] rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 shadow-xl flex items-center justify-center">
                <div className="text-7xl animate-floaty">🧣</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Clothing and home essentials for every season</p>
            </div>

            <Button asChild variant="ghost" className="rounded-xl font-medium">
              <Link to="/products" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCategories.map((c, idx) => (
                <CategoryCard key={c.id} category={c} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/40 to-secondary/20" />

        <div className="container relative">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
                <Star className="w-4 h-4 fill-current" />
                Most Loved
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Bestsellers</h2>
              <p className="text-muted-foreground mt-2">Our most reliable picks</p>
            </div>

            <Button asChild variant="ghost" className="rounded-xl font-medium">
              <Link to="/products" className="flex items-center gap-2">
                See All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {topProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
            <div className="relative px-8 py-16 md:py-20 text-center">
              <h3 className="text-2xl md:text-4xl font-display font-bold mb-4">
                Comfort your family can count on.
              </h3>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                From soft shawls to quality bedsheets and daily-wear clothing —
                we bring trusted essentials to your home with care.
              </p>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl h-12 px-8 font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Link to="/products" className="inline-flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
      }
