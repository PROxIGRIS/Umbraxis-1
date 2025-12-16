import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Copy, Package, ArrowRight, Loader2, Download } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied to clipboard!");
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
        <div className="container py-10 md:py-16">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-6 w-48 mx-auto mb-6" />
            <Skeleton className="h-48 rounded-xl mb-8" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order. Please check the order ID.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Success Message */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll start preparing it right away.
            </p>
          </div>

          {/* Order ID */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Order ID</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {order.order_id}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={copyOrderId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Save this Order ID to track your order status
            </p>
          </div>

          {/* Order Items */}
          <div className="p-6 rounded-xl bg-card border mb-8">
            <h2 className="font-semibold text-lg mb-4">Order Details</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ₹{item.unit_price}
                    </p>
                  </div>
                  <span className="text-sm font-medium">₹{item.line_total}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{order.delivery_fee}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="p-6 rounded-xl bg-card border mb-8">
            <h2 className="font-semibold text-lg mb-4">Delivery Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
              <p><span className="text-muted-foreground">Address:</span> {order.customer_address}</p>
              {order.customer_notes && (
                <p><span className="text-muted-foreground">Notes:</span> {order.customer_notes}</p>
              )}
            </div>
          </div>

          {/* Invoice */}
          {order.invoice_url && (
            <Button asChild variant="outline" className="w-full mb-8">
              <a href={order.invoice_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </a>
            </Button>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button asChild variant="accent" size="lg">
              <Link to={`/track-order?orderId=${order.order_id}`}>
                Track Your Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="ghost" className="mt-3">
              <Link to="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
