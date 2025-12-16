import { useState } from "react";
import { Search, ArrowRight, Package, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";
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
      setError("Order not found. Please check the Order ID.");
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
      invoiceUrl: orderData.invoice_url, // ⭐ ADDED FOR INVOICE
      items: (itemsData || []).map((item) => ({
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

  const statusSteps = [
    { key: "pending", label: "Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "packed", label: "Packed", icon: Package },
    { key: "out_for_delivery", label: "Out For Delivery", icon: Package },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  return (
    <Layout>
      <div className="container py-10 md:py-16 max-w-3xl">
        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>
        <p className="text-muted-foreground text-center mb-8">
          Enter your Order ID to check the current status.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10 justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter Order ID..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button type="submit" size="lg" className="h-12">
            Search
          </Button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-center mb-6 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">Fetching order details...</p>
          </div>
        )}

        {/* Order Not Found */}
        {!loading && !error && !order && (
          <p className="text-center text-muted-foreground mt-10">
            Enter an Order ID to view details.
          </p>
        )}

        {/* ORDER FOUND */}
        {order && (
          <div className="space-y-8 mt-10">

            {/* Order ID Card */}
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-2xl font-bold text-primary">{order.orderId}</p>
            </div>

            {/* Status Timeline */}
            <div className="p-6 bg-card rounded-xl border">
              <h2 className="font-semibold text-lg mb-4">Order Status</h2>

              <div className="flex flex-col gap-6">
                {statusSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const activeIndex = statusSteps.findIndex((s) => s.key === order.status);
                  const isActive = idx <= activeIndex;

                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center border",
                          isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="p-6 rounded-xl bg-card border">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.productImage || "/placeholder.svg"}
                      className="h-12 w-12 rounded-lg object-cover"
                      alt={item.productName}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × ₹{item.unitPrice}
                      </p>
                    </div>
                    <p className="font-medium text-sm">₹{item.lineTotal}</p>
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
                  <span>₹{order.deliveryFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 rounded-xl bg-card border">
              <h2 className="font-semibold text-lg mb-4">Delivery Information</h2>
              <p><span className="text-muted-foreground">Name:</span> {order.customerName}</p>
              <p><span className="text-muted-foreground">Phone:</span> {order.customerPhone}</p>
              <p><span className="text-muted-foreground">Address:</span> {order.customerAddress}</p>
              {order.customerNotes && (
                <p><span className="text-muted-foreground">Notes:</span> {order.customerNotes}</p>
              )}
            </div>

            {/* Invoice Download */}
            {order.invoiceUrl && (
              <Button asChild variant="outline" className="w-full">
                <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
