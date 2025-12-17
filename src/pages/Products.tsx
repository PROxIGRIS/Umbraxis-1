import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, Filter, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils'; // Assuming you have a utility class helper

type SortOption = 'default' | 'price-low' | 'price-high' | 'name';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const selectedCategoryData = useMemo(() => {
    return selectedCategory ? categories.find(c => c.slug === selectedCategory) : null;
  }, [selectedCategory, categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategoryData) {
      result = result.filter(p => p.categoryId === selectedCategoryData.id);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'default':
        // Default sort (e.g., by ID or order added) - ensure stability if possible
        // Assuming products come in a natural order if 'default' is selected.
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedCategoryData, sortBy, products]);

  const handleCategoryChange = (value: string) => {
    const slug = value === 'all' ? '' : value;
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== 'default';
  const isLoading = productsLoading || categoriesLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };


  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-10 md:py-16">
          
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 tracking-tight text-zinc-900 dark:text-white">
              {selectedCategoryData ? selectedCategoryData.name : 'Shop All Essentials'}
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available in this collection.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800">
            
            {/* Search Input - Sleek Style */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search products, keywords, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus-visible:ring-indigo-500/50 text-zinc-900 dark:text-white"
              />
            </div>

            {/* Category & Sort Selects */}
            <div className="flex flex-wrap gap-3 items-center">
              
              {/* Category Select */}
              <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-full border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus-visible:ring-indigo-500/50">
                  <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug} className="dark:hover:bg-zinc-700">
                      <span className="mr-2">{cat.icon}</span> {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Select */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-full border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus-visible:ring-indigo-500/50">
                  <ListOrdered className="h-4 w-4 mr-2 text-amber-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters} 
                  className="gap-2 h-12 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Category Pills (Secondary Filter/Navigation) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className={cn(
                'rounded-full h-10 px-4 font-semibold transition-all',
                !selectedCategory 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400' 
                  : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
              )}
            >
              All
            </Button>
            {categories.map((cat, i) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(cat.slug)}
                className={cn(
                  'rounded-full h-10 px-4 gap-1.5 font-semibold transition-all',
                  selectedCategory === cat.slug
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400'
                    : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <Skeleton className="aspect-[3/4] rounded-2xl bg-zinc-200/50 dark:bg-zinc-800" />
                </motion.div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
            >
              <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-zinc-900 dark:text-white">No matching products found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Please check your spelling or try adjusting your filters and category selection.
              </p>
              <Button 
                onClick={clearFilters}
                className="rounded-full h-12 px-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
      }
