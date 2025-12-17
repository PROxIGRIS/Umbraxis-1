import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Copy, Package, ArrowRight, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      // Use toast consistent with the new theme (assuming sonner/shadcn defaults work with dark mode)
      toast.success("Order ID copied to clipboard!", {
        style: { 
          backgroundColor: 'var(--amber-500)', 
          color: 'var(--zinc-900)',
          borderColor: 'var(--amber-400)'
        }
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!orderId) return;

      // 1. Fetch order
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();

      if (!orderData || orderErr) {
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // 2. Fetch order items
      const { data: itemData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id);

      setItems(itemData || []);
      setLoading(false);
    }

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-[70vh] py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-center items-center mb-6">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
              <Skeleton className="h-10 w-3/4 mx-auto mb-3 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-6 w-1/2 mx-auto mb-10 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-16 rounded-xl mb-8 bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800" />
                <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800" />
                <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-[70vh] py-20">
          <div className="container py-16 text-center">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Order Not Found</h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6">
              We couldn't find this order. Please check the order ID or go back to the homepage.
            </p>
            <Button asChild className="rounded-full h-12 px-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 py-10 md:py-16">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >

            {/* Success Message */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border-4 border-amber-500/20"
              >
                <CheckCircle2 className="h-10 w-10 text-amber-500" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-zinc-900 dark:text-white">
                Order Placed Successfully!
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                Thank you for choosing MKV Essentials. Your order is confirmed.
              </p>
            </div>

            {/* Order ID */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-amber-500/50 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Your Order ID</p>
                  <p className="text-3xl md:text-4xl font-mono font-bold text-amber-500 tracking-tight">
                    {order.order_id}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={copyOrderId}
                  className="rounded-full h-10 w-10 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Copy className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </Button>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                Please save this unique ID to track your order status.
              </p>
            </div>

            {/* Order Items & Summary */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 shadow-md">
              <h2 className="font-semibold text-xl mb-4 text-zinc-900 dark:text-white">Order Details</h2>

              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      className="h-14 w-14 rounded-xl object-cover border border-zinc-100 dark:border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate text-zinc-900 dark:text-white">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.quantity} × ₹{item.unit_price}
                      </p>
                    </div>
                    <span className="text-base font-semibold text-zinc-900 dark:text-white">₹{item.line_total}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-zinc-200 dark:bg-zinc-800" />

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                  <span className="font-medium text-zinc-900 dark:text-white">₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-zinc-500 dark:text-zinc-400">Delivery Fee</span>
                  <span className="font-medium text-zinc-900 dark:text-white">₹{order.delivery_fee}</span>
                </div>

                <Separator className="bg-zinc-200 dark:bg-zinc-800" />

                <div className="flex justify-between font-bold text-xl">
                  <span className="text-zinc-900 dark:text-white">Total Amount</span>
                  <span className="text-amber-500">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 shadow-md">
              <h2 className="font-semibold text-xl mb-4 text-zinc-900 dark:text-white">Shipping Details</h2>
              <div className="space-y-3 text-base text-zinc-700 dark:text-zinc-300">
                <p><span className="text-zinc-500 dark:text-zinc-400 font-medium">Recipient:</span> {order.customer_name}</p>
                <p><span className="text-zinc-500 dark:text-zinc-400 font-medium">Contact:</span> {order.customer_phone}</p>
                <p><span className="text-zinc-500 dark:text-zinc-400 font-medium">Address:</span> {order.customer_address}</p>
                {order.customer_notes && (
                  <p><span className="text-zinc-500 dark:text-zinc-400 font-medium">Special Notes:</span> {order.customer_notes}</p>
                )}
              </div>
            </div>

            {/* Invoice */}
            {order.invoice_url && (
              <Button asChild variant="outline" className="w-full mb-8 h-12 rounded-full border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white">
                <a href={order.invoice_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2 text-indigo-500" />
                  Download Invoice
                </a>
              </Button>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                // Primary CTA matching the Amber accent
                className="h-12 rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold shadow-lg shadow-amber-500/30 transition-all"
              >
                <Link to={`/track-order?orderId=${order.order_id}`}>
                  <Package className="mr-2 h-4 w-4" />
                  Track Your Order
                </Link>
              </Button>

              <Button 
                asChild 
                variant="ghost" 
                size="lg"
                className="h-12 rounded-full px-8 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
