-- Add COD control and backorder settings to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cod_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_backorder boolean DEFAULT false;

-- Create function to reduce stock when order is confirmed
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger when status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    -- Reduce stock for all items in this order
    UPDATE public.products p
    SET stock = GREATEST(0, p.stock - oi.quantity),
        updated_at = now()
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
    AND oi.product_id = p.id;
    
    -- Log the stock reduction
    RAISE NOTICE 'Stock reduced for order %', NEW.order_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for stock reduction
DROP TRIGGER IF EXISTS trigger_reduce_stock_on_order_confirmed ON public.orders;
CREATE TRIGGER trigger_reduce_stock_on_order_confirmed
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_stock_on_order_confirmed();

-- Function to check if product is purchasable (stock > 0 OR allow_backorder = true)
CREATE OR REPLACE FUNCTION public.is_product_purchasable(product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_record RECORD;
BEGIN
  SELECT stock, allow_backorder, is_active INTO product_record
  FROM public.products
  WHERE id = product_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  IF NOT product_record.is_active THEN
    RETURN false;
  END IF;
  
  RETURN product_record.stock > 0 OR product_record.allow_backorder = true;
END;
$$;