import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

export function CategoryCard({ category, className, style, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className={cn(
          'group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50',
          'transition-all duration-300',
          'hover:shadow-float hover:border-primary/30 hover:-translate-y-1',
          'overflow-hidden',
          className
        )}
        style={style}
      >
        {/* Gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon container */}
        <div className="relative shrink-0 h-14 w-14 rounded-xl bg-secondary flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
            {category.icon}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm truncate group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.productCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
