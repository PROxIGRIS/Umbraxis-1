import { useState } from "react";
import { 
  Search, 
  ArrowRight, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Truck,
  ShoppingBag,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);

    // Fetch order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId.trim().toUpperCase())
      .maybeSingle();

    if (orderError || !orderData) {
      setError("Order not found. Please check your ID and try again.");
      setLoading(false);
      return;
    }

    // Fetch items
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderData.id);

    setOrder({
      id: orderData.id,
      orderId: orderData.order_id,
      customerName: orderData.customer_name,
      customerPhone: orderData.customer_phone,
      customerAddress: orderData.customer_address,
      customerNotes: orderData.customer_notes || undefined,
      paymentMethod: orderData.payment_method,
      paymentStatus: orderData.payment_status,
      status: orderData.status as OrderStatus,
      subtotal: Number(orderData.subtotal),
      deliveryFee: Number(orderData.delivery_fee),
      totalAmount: Number(orderData.total_amount),
      createdAt: orderData.created_at,
      invoiceUrl: orderData.invoice_url,
      items: (itemsData || []).map((item: any) => ({
        id: item.id,
        productName: item.product_name,
        productImage: item.product_image,
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        lineTotal: Number(item.line_total),
      })),
    });

    setLoading(false);
  };

  // Optimized status steps for General Retail/Fashion (removed Grocery terms)
  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Clock, desc: "We have received your order." },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Order validated." },
    { key: "packed", label: "Processing", icon: Package, desc: "Items are being prepared." }, // Changed "Packed" to "Processing" visually
    { key: "out_for_delivery", label: "Shipped", icon: Truck, desc: "On the way to you." },
    { key: "delivered", label: "Delivered", icon: ShoppingBag, desc: "Package has arrived." },
  ];

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-12 md:py-20">
        <div className="container max-w-3xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
              Track Your Order
            </h1>
            <p className="text-zinc-500 text-lg font-light">
              Enter your ID below to see where your package is.
            </p>
          </div>

          {/* Search Box - Styled to match Hero input */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative max-w-lg mx-auto"
          >
             <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-400">
              <Search className="absolute left-4 text-zinc-400 h-5 w-5" />
              <Input
                placeholder="Ex: ORD-12345..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-14 pl-12 pr-32 text-base bg-transparent border-0 focus-visible:ring-0 placeholder:text-zinc-400 text-zinc-900 dark:text-white"
              />
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 h-11 px-6 rounded-lg font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-all"
              >
                {loading ? "Searching..." : "Track"}
              </Button>
            </form>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl text-center mb-8 flex items-center justify-center gap-2"
              >
                <AlertCircle className="h-5 w-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!loading && !error && !order && (
            <div className="text-center text-zinc-400 py-12 border-2 border-dashed border-zinc-200 rounded-2xl">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Ready to track your shipment.</p>
            </div>
          )}

          {/* ORDER DETAILS */}
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              
              {/* Order Header Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Order ID</p>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 dark:text-white">
                    {order.orderId}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {order.invoiceUrl && (
                  <Button variant="outline" className="rounded-full border-zinc-300 gap-2" asChild>
                    <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" /> Invoice
                    </a>
                  </Button>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-8">Shipment Progress</h3>
                
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
                  
                  <div className="space-y-8">
                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      // Determine if this step is completed or active
                      const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status);
                      const isCompleted = idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;

                      return (
                        <div key={step.key} className="relative flex items-start gap-6">
                          {/* Icon Circle */}
                          <div 
                            className={cn(
                              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                              isCompleted 
                                ? "bg-zinc-900 border-zinc-900 text-white" 
                                : "bg-white border-zinc-200 text-zinc-300"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          {/* Text */}
                          <div className={cn("pt-1", !isCompleted && "opacity-50")}>
                            <p className={cn("font-bold text-base", isCurrent ? "text-zinc-900" : "text-zinc-700")}>
                              {step.label}
                            </p>
                            <p className="text-sm text-zinc-500 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Grid: Items & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Items List (Takes up 2 cols) */}
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6">Items Ordered</h3>
                  <div className="space-y-6">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-100 flex-shrink-0">
                          <img
                            src={item.productImage || "/placeholder.svg"}
                            className="h-full w-full object-cover"
                            alt={item.productName}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 truncate">{item.productName}</p>
                          <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm text-zinc-900">₹{item.lineTotal}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-zinc-100" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Shipping</span>
                      <span>{order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-zinc-900 text-lg pt-3 border-t border-zinc-100">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info (Takes up 1 col) */}
                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-zinc-400" />
                    Delivery Details
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-zinc-900 font-medium">{order.customerName}</p>
                      <p className="text-zinc-500">{order.customerPhone}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Shipping Address</p>
                      <p className="text-zinc-600 leading-relaxed">{order.customerAddress}</p>
                    </div>

                    {order.customerNotes && (
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mt-4">
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1">Delivery Instructions</p>
                        <p className="text-zinc-700 italic">{order.customerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
                              }
