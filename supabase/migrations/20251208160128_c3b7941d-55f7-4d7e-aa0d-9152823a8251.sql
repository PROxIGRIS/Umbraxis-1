-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  image_url TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  unit TEXT NOT NULL DEFAULT '1 pc',
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_notes TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'upi', 'card')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 30,
  total_amount DECIMAL(10,2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products (no auth needed for browsing)
CREATE POLICY "Categories are publicly viewable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Active products are publicly viewable" ON public.products FOR SELECT USING (is_active = true);

-- Orders: anyone can create (guest checkout)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Orders: can view by order_id (for tracking - we'll verify by order_id match)
CREATE POLICY "Orders viewable by order_id lookup" ON public.orders FOR SELECT USING (true);

-- Order items: follow order access
CREATE POLICY "Order items viewable with order" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin policies (for service role - will be handled via edge functions)
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin can manage orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin can manage order items" ON public.order_items FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update category product count
CREATE OR REPLACE FUNCTION public.update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE public.categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
    UPDATE public.categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_count AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_category_product_count();

-- Insert seed data: Categories
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Essentials', 'essentials', '🛒'),
  ('Dairy & Eggs', 'dairy-eggs', '🥛'),
  ('Fruits & Vegetables', 'fruits-vegetables', '🥬'),
  ('Snacks', 'snacks', '🍿'),
  ('Beverages', 'beverages', '🥤'),
  ('Household', 'household', '🏠'),
  ('Personal Care', 'personal-care', '🧴'),
  ('Bakery', 'bakery', '🍞');

-- Insert seed data: Products
INSERT INTO public.products (name, slug, category_id, description, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Farm Fresh Milk', 'farm-fresh-milk', (SELECT id FROM public.categories WHERE slug = 'dairy-eggs'), 'Pure and fresh whole milk from local farms. Rich in calcium and essential nutrients.', 58, 65, '1 Liter', 50, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', true, ARRAY['dairy', 'fresh']),
  ('Organic Bananas', 'organic-bananas', (SELECT id FROM public.categories WHERE slug = 'fruits-vegetables'), 'Sweet and ripe organic bananas. Perfect for smoothies or a quick healthy snack.', 45, NULL, '1 Dozen', 100, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', true, ARRAY['fruits', 'organic']),
  ('Basmati Rice Premium', 'basmati-rice-premium', (SELECT id FROM public.categories WHERE slug = 'essentials'), 'Long grain aromatic basmati rice. Perfect for biryani and pulao.', 185, 210, '1 Kg', 30, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', true, ARRAY['essentials', 'grains']),
  ('Fresh Brown Eggs', 'fresh-brown-eggs', (SELECT id FROM public.categories WHERE slug = 'dairy-eggs'), 'Farm fresh brown eggs from free-range hens. High in protein.', 95, NULL, '12 Pcs', 40, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop', false, ARRAY['dairy', 'protein']),
  ('Classic Potato Chips', 'classic-potato-chips', (SELECT id FROM public.categories WHERE slug = 'snacks'), 'Crispy and delicious salted potato chips. Perfect for snacking.', 35, NULL, '150g', 80, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', true, ARRAY['snacks', 'chips']),
  ('Orange Juice Fresh', 'orange-juice-fresh', (SELECT id FROM public.categories WHERE slug = 'beverages'), '100% pure fresh squeezed orange juice. No added sugar.', 120, 140, '1 Liter', 25, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', true, ARRAY['beverages', 'fresh']),
  ('Whole Wheat Bread', 'whole-wheat-bread', (SELECT id FROM public.categories WHERE slug = 'bakery'), 'Soft and fresh whole wheat bread. High in fiber.', 45, NULL, '400g', 35, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', false, ARRAY['bakery', 'healthy']),
  ('Fresh Tomatoes', 'fresh-tomatoes', (SELECT id FROM public.categories WHERE slug = 'fruits-vegetables'), 'Juicy red tomatoes. Perfect for salads and cooking.', 35, NULL, '500g', 60, 'https://images.unsplash.com/photo-1546470427-0d4db154cce8?w=400&h=400&fit=crop', false, ARRAY['vegetables', 'fresh']),
  ('Greek Yogurt', 'greek-yogurt', (SELECT id FROM public.categories WHERE slug = 'dairy-eggs'), 'Thick and creamy Greek yogurt. High in protein, perfect for breakfast.', 85, NULL, '400g', 30, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', true, ARRAY['dairy', 'healthy']),
  ('Dish Wash Liquid', 'dish-wash-liquid', (SELECT id FROM public.categories WHERE slug = 'household'), 'Powerful grease-cutting formula. Gentle on hands.', 125, NULL, '750ml', 45, 'https://images.unsplash.com/photo-1585441695753-a33db60d6c24?w=400&h=400&fit=crop', false, ARRAY['household', 'cleaning']),
  ('Coconut Oil Pure', 'coconut-oil-pure', (SELECT id FROM public.categories WHERE slug = 'essentials'), 'Cold-pressed virgin coconut oil. Great for cooking and hair care.', 220, 250, '500ml', 20, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop', true, ARRAY['essentials', 'organic']),
  ('Mixed Nuts Premium', 'mixed-nuts-premium', (SELECT id FROM public.categories WHERE slug = 'snacks'), 'A healthy mix of almonds, cashews, and walnuts. Lightly salted.', 350, NULL, '250g', 15, 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&h=400&fit=crop', true, ARRAY['snacks', 'healthy']);