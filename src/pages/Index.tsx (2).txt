import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  Star,
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

/* ---------- IMAGE SANITIZER ---------- */
const getSafeImage = (product: any) => {
  if (product.images?.length) {
    const valid = product.images.find(
      (img: string) => img && img.trim() !== "" && img !== "/placeholder.svg"
    );
    if (valid) return valid;
  }
  if (
    product.imageUrl &&
    product.imageUrl.trim() !== "" &&
    product.imageUrl !== "/placeholder.svg"
  ) {
    return product.imageUrl;
  }
  return "/placeholder.svg";
};

/* ---------- ANIMATIONS ---------- */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } 
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } 
  },
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts = [], isLoading: productsLoading } = useFeaturedProducts();

  const topCategories = useMemo(() => categories.slice(0, 4), [categories]);

  const topProducts = useMemo(() => {
    return featuredProducts.slice(0, 8).map((p) => ({
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
      <section className="relative overflow-hidden bg-secondary/50">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-60 w-60 rounded-full bg-brand/5 blur-3xl" />

        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-muted px-4 py-1.5 text-sm font-medium text-brand">
                  <Sparkles className="h-4 w-4" />
                  New Winter Collection
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground"
              >
                Elevate Your
                <br />
                <span className="text-gradient">Everyday Style.</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg"
              >
                Premium winter wear and essentials. Crafted for comfort, designed for you.
              </motion.p>

              {/* Search Form */}
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSearch}
                className="mt-8"
              >
                <div className="relative flex max-w-lg items-center rounded-2xl border border-border bg-card shadow-soft">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="h-14 pl-12 pr-32 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Explore
                  </Button>
                </div>
              </motion.form>

              {/* Feature Pills */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-wrap gap-2"
              >
                <FeaturePill icon={<Zap className="h-4 w-4" />} text="Fast Delivery" />
                <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} text="Verified Seller" />
                <FeaturePill icon={<Tag className="h-4 w-4" />} text="Best Prices" />
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Visual */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="relative h-[500px] w-[380px] rounded-3xl bg-primary overflow-hidden shadow-glow">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                    <ShoppingBag className="h-16 w-16 mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold tracking-wider">ESSENTIALS</h3>
                    <p className="mt-2 text-sm opacity-70">Premium Collection</p>
                  </div>
                </div>

                {/* Floating Stats */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-16 top-20 rounded-2xl bg-card border border-border p-4 shadow-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <Truck className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Free Delivery</p>
                      <p className="text-xs text-muted-foreground">On orders ₹499+</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-12 bottom-32 rounded-2xl bg-card border border-border p-4 shadow-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-highlight/10">
                      <Star className="h-5 w-5 text-highlight fill-highlight" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">4.9 Rating</p>
                      <p className="text-xs text-muted-foreground">2000+ Reviews</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Shop by Category
              </h2>
              <p className="mt-1 text-muted-foreground">
                Find what you're looking for
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-brand font-medium hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {topCategories.map((c, idx) => (
                <CategoryCard key={c.id} category={c} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Trending Now
              </h2>
              <p className="mt-1 text-muted-foreground">
                Our most popular products
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-brand font-medium hover:gap-3 transition-all"
            >
              Shop All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {topProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <ValueCard
              icon={<Truck className="h-6 w-6" />}
              title="Free Shipping"
              description="On orders above ₹499"
            />
            <ValueCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Secure Payment"
              description="100% secure checkout"
            />
            <ValueCard
              icon={<Tag className="h-6 w-6" />}
              title="Best Prices"
              description="Guaranteed lowest prices"
            />
            <ValueCard
              icon={<Star className="h-6 w-6" />}
              title="Premium Quality"
              description="Handpicked products"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-12 lg:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand/30 to-transparent" />
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-brand/20 blur-3xl" />

            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground">
                Get 20% Off Your First Order
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Subscribe to our newsletter and receive exclusive offers, new arrivals, and more.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button className="h-12 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------- FEATURE PILL COMPONENT ---------- */
function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-soft">
      <span className="text-brand">{icon}</span>
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}

/* ---------- VALUE CARD COMPONENT ---------- */
function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-shadow"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
