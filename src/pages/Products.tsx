import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Filter, ListOrdered } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

type SortOption = "default" | "price-low" | "price-high" | "name";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // ---------------------------------------------------------
  // IMAGE SANITIZER — MATCHES PRODUCT DETAIL EXACTLY
  // ---------------------------------------------------------
  const sanitizeImages = (product: any) => {
    const imgs: string[] = [];

    if (product.images?.length) {
      product.images.forEach((img: string) => {
        if (
          img &&
          img.trim() !== "" &&
          img !== "/placeholder.svg" &&
          !imgs.includes(img)
        ) {
          imgs.push(img);
        }
      });
    }

    if (
      product.imageUrl &&
      product.imageUrl.trim() !== "" &&
      product.imageUrl !== "/placeholder.svg" &&
      !imgs.includes(product.imageUrl)
    ) {
      imgs.unshift(product.imageUrl);
    }

    return imgs.length ? imgs : ["/placeholder.svg"];
  };

  // ---------------------------------------------------------
  // CATEGORY RESOLUTION
  // ---------------------------------------------------------
  const selectedCategoryData = useMemo(() => {
    return selectedCategory
      ? categories.find(c => c.slug === selectedCategory)
      : null;
  }, [selectedCategory, categories]);

  // ---------------------------------------------------------
  // PRODUCT FILTERING + IMAGE FIX
  // ---------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategoryData) {
      result = result.filter(p => p.categoryId === selectedCategoryData.id);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    // Attach sanitized images
    return result.map(p => ({
      ...p,
      allImages: sanitizeImages(p)
    }));
  }, [searchQuery, selectedCategory, selectedCategoryData, sortBy, products]);

  // ---------------------------------------------------------
  // FILTER HANDLERS
  // ---------------------------------------------------------
  const handleCategoryChange = (value: string) => {
    const slug = value === "all" ? "" : value;
    setSelectedCategory(slug);

    const params = new URLSearchParams(searchParams);
    if (slug) params.set("category", slug);
    else params.delete("category");

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("default");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || sortBy !== "default";

  const isLoading = productsLoading || categoriesLoading;

  // ---------------------------------------------------------
  // ANIMATION
  // ---------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
        <div className="container py-10 md:py-16">

          {/* ------------------------------------------------------ */}
          {/* HEADER */}
          {/* ------------------------------------------------------ */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
              {selectedCategoryData
                ? selectedCategoryData.name
                : "Shop All Essentials"}
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-2">
              {filteredProducts.length} item
              {filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>

          {/* ------------------------------------------------------ */}
          {/* FILTER BAR */}
          {/* ------------------------------------------------------ */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10 p-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">

            {/* SEARCH FIELD */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 rounded-full bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>

            {/* CATEGORY SELECT */}
            <Select
              value={selectedCategory || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* SORT SELECT */}
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                <ListOrdered className="h-4 w-4 mr-2 text-amber-500" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* RESET */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-12 rounded-full flex gap-2 text-zinc-600 hover:text-red-500"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* ------------------------------------------------------ */}
          {/* PRODUCT GRID */}
          {/* ------------------------------------------------------ */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            >
              {filteredProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <Search className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                No products found
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
                Try adjusting your filters or search terms.
              </p>
              <Button
                className="h-12 px-8 rounded-full bg-zinc-900 dark:bg-amber-500 dark:text-zinc-900"
                onClick={clearFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
