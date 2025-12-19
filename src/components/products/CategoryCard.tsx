import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

export function CategoryCard({
  category,
  className,
  style,
  index = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className={cn(
          "group relative flex items-center justify-between p-5 rounded-2xl",
          "bg-card border border-border/50",
          "transition-all duration-300",
          "hover:shadow-float hover:border-primary/30 hover:-translate-y-1",
          className
        )}
        style={style}
      >
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Text content */}
        <div className="relative z-10">
          <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
            {category.name}
          </h3>

          {category.productCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {category.productCount}{" "}
              {category.productCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="relative z-10 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
