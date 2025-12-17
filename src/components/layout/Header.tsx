import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ShieldCheck, Tag, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/products', label: 'Shop All', icon: Tag },
    { to: '/track-order', label: 'Track Order', icon: Zap },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium Glassmorphism background - Darker and more defined */}
      <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-md" />
      
      <div className="container relative flex h-16 md:h-20 items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            // Custom styling for premium look: Black/Zinc background with Gold accent
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 shadow-xl group-hover:shadow-amber-500/30 transition-shadow duration-300"
          >
            <Tag className="h-5 w-5 text-amber-400" />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-display font-bold leading-none text-zinc-900 dark:text-white">
              MKV<span className="text-amber-500">ESSENTIALS</span>
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase mt-0.5">
              Curated Style. Daily Comfort.
            </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="ghost" className="rounded-full px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4 lg:mx-8">
          <div className={cn(
            "relative w-full transition-all duration-300",
            isSearchFocused && "transform scale-[1.02] shadow-lg"
          )}>
            {/* Ambient glow effect when focused */}
            <div className={cn(
              "absolute inset-0 rounded-full bg-indigo-500/20 blur-xl transition-opacity duration-300 pointer-events-none",
              isSearchFocused ? "opacity-70" : "opacity-0"
            )} />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search for jackets, decor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-11 pr-4 h-11 bg-zinc-100/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-transparent transition-all text-zinc-800 dark:text-white placeholder:text-zinc-400"
              />
            </div>
          </div>
        </form>

        {/* Actions (Cart & Mobile Menu) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Cart Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="icon"
              className="relative h-11 w-11 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-all shadow-lg"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-900 shadow-md shadow-amber-500/50"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-11 w-11 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5 text-zinc-900 dark:text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5 text-zinc-900 dark:text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="container py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="search"
                    placeholder="Search for jackets, decor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:ring-indigo-500/50"
                  />
                </div>
              </form>

              {/* Mobile Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.to}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium text-zinc-800 dark:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon className="h-5 w-5 text-indigo-500" />
                      <span className="text-base">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
