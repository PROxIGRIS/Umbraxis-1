// src/constants/categoryIcons.ts

import {
  Shirt,
  Snowflake,
  Wind,
  Scarf,
  Layers,
  Crown,
  BedDouble,
  Home,
  ShoppingBag,
  Watch,
  Briefcase,
  Sparkles,
  Package,
  Gift,
  Flame,
} from "lucide-react";

/**
 * ICON MAP
 * We store ONLY the key (string) in DB.
 * We resolve it to the Lucide icon here.
 */
export const CATEGORY_ICONS = {
  // Clothing – core
  tshirts: Shirt,            // T-Shirts
  shirts: Shirt,             // Shirts
  winter_wear: Snowflake,    // Jackets, sweaters, hoodies
  jackets: Wind,             // Jackets / outerwear
  shawls: Scarf,             // Shawls
  layers: Layers,            // Layered clothing / combos

  // Home & lifestyle
  home_textiles: Home,       // Bedsheets, blankets, curtains
  bedsheets: BedDouble,      // Bedsheets specifically

  // Accessories
  accessories: Watch,        // General accessories
  bags: Briefcase,           // Bags
  essentials: ShoppingBag,   // Daily-use basics

  // Premium / collections
  premium: Crown,            // Premium collection
  new_arrivals: Sparkles,    // New / latest drops
  festive: Flame,            // Festive wear
  gift_sets: Gift,           // Gift packs / combos

  // Fallback
  general: Package,          // Default / uncategorized
} as const;

/**
 * This is what you loop over in Admin UI
 */
export const CATEGORY_ICON_OPTIONS = Object.keys(
  CATEGORY_ICONS
) as Array<keyof typeof CATEGORY_ICONS>;
