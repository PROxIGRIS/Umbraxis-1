import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
  const topProducts = useMemo(() => featuredProducts.slice(0, 12), [featuredProducts]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <Layout>

      {/* AMAZON STYLE TOP SEARCH BAR */}
      <section className="bg-white dark:bg-zinc-900 border-b shadow-sm">
        <div className="container py-6 flex flex-col items-center gap-4">

          <form onSubmit={handleSearch} className="w-full max-w-2xl flex">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="flex-1 h-12 rounded-l-md border border-zinc-300 dark:border-zinc-700"
            />
            <Button
              type="submit"
              className="h-12 px-4 rounded-r-md bg-amber-400 text-black font-bold"
            >
              <Search className="w-5 h-5" />
            </Button>
          </form>

        </div>
      </section>

      {/* CATEGORY ROW */}
      <section className="bg-white dark:bg-zinc-900 py-6">
        <div className="container">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Shop by Category
          </h2>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {topCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="bg-zinc-50 dark:bg-zinc-800 py-10">
        <div className="container">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Recommended for You
          </h2>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="h-12 px-6 rounded-lg">
              <Link to="/products">See All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HOT DEALS SECTION */}
      <section className="bg-white dark:bg-zinc-900 py-10">
        <div className="container">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Hot Deals Today
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(productsLoading ? Array.from({ length: 6 }) : topProducts.slice(0, 6)).map(
              (p, i) =>
                productsLoading ? (
                  <Skeleton
                    key={i}
                    className="aspect-[3/4] rounded-lg bg-zinc-200 dark:bg-zinc-700"
                  />
                ) : (
                  <ProductCard key={p.id} product={p} />
                )
            )}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-amber-400 text-black text-center py-10">
        <div className="container">
          <h3 className="text-xl font-semibold mb-2">Shop Smarter. Live Better.</h3>
          <p className="text-sm mb-5">
            Fast delivery, secure shopping, trusted by customers.
          </p>

          <Button
            asChild
            className="bg-black text-white h-12 px-8 rounded-lg font-semibold"
          >
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>

    </Layout>
  );
}
