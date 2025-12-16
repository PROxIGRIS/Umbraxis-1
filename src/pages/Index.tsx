import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Truck, Clock, Shield, Star, Leaf, Zap, Gift } from "lucide-react";
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
        {/* Mesh gradient background */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="container relative py-12 md:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* LEFT - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm font-medium mb-6"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
                  <Leaf className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground">Fresh from local farms</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold">NEW</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight">
                Groceries that
                <br />
                <span className="relative">
                  <span className="text-gradient">land at your door</span>
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full" 
                    viewBox="0 0 300 12" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.path 
                      d="M2 8C50 2 100 12 150 6C200 0 250 10 298 4" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </motion.svg>
                </span>
                <br />
                <span className="text-accent">in minutes.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Handpicked daily essentials from your trusted neighbourhood store — 
                ordered in seconds, delivered fresh.
              </p>

              {/* Search Bar */}
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch} 
                className="mt-8"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                    <Search className="absolute left-5 text-muted-foreground h-5 w-5" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for rice, oil, milk..."
                      className="h-14 pl-14 pr-36 text-base bg-transparent border-0 focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 h-10 px-6 rounded-xl font-semibold shadow-md"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="rounded-xl h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/products" className="inline-flex items-center gap-2">
                    Browse products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="rounded-xl h-12 px-8 font-semibold border-border/50">
                  <Link to="/track-order">Track order</Link>
                </Button>
              </motion.div>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap gap-6"
              >
                <FeaturePill icon={<Zap className="w-4 h-4" />} text="30 min delivery" />
                <FeaturePill icon={<Clock className="w-4 h-4" />} text="7AM - 10PM" />
                <FeaturePill icon={<Shield className="w-4 h-4" />} text="Quality assured" />
              </motion.div>
            </motion.div>

            {/* RIGHT - Illustration / Hero image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -left-8 p-4 rounded-2xl glass-card shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Fast Delivery</p>
                      <p className="text-xs text-muted-foreground">Within 30 mins</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 p-4 rounded-2xl glass-card shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Fresh Daily</p>
                      <p className="text-xs text-muted-foreground">Quality checked</p>
                    </div>
                  </div>
                </motion.div>

                {/* Main visual */}
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary to-accent/10 flex items-center justify-center shadow-float">
                  <div className="text-8xl animate-floaty">🥬</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Shop by category</h2>
              <p className="text-muted-foreground mt-2">Jump straight to what you need</p>
            </div>

            <Button asChild variant="ghost" className="rounded-xl font-medium">
              <Link to="/products" className="flex items-center gap-2">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

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
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30" />
        
        <div className="container relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
                <Star className="w-4 h-4 fill-current" />
                Popular
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Bestsellers</h2>
              <p className="text-muted-foreground mt-2">What locals love most</p>
            </div>

            <Button asChild variant="ghost" className="rounded-xl font-medium">
              <Link to="/products" className="flex items-center gap-2">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

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

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative px-8 py-16 md:py-20 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                  Ready to order?
                </h3>
                <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
                  No account required — add items, checkout, and we'll take care of delivery.
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary" 
                  className="rounded-xl h-12 px-8 font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <Link to="/products" className="inline-flex items-center gap-2">
                    Start shopping
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
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
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
