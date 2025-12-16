// src/pages/admin/AdminDashboard.tsx
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { useOrders } from "@/hooks/useOrders";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getLastNDays(n: number) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(new Date(d.toDateString())); // normalize to midnight
  }
  return days;
}

// map day index to short name
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminDashboard() {
  // Orders (includes items) from existing hook
  const { data: orders, isLoading: ordersLoading } = useOrders();

  // Products count & low-stock fetch
  const {
    data: productsCount,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (error) throw error;
      return count || 0;
    },
  });

  // Low stock products (threshold = 5)
  const {
    data: lowStockProducts,
    isLoading: lowStockLoading,
  } = useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock", 5)
        .order("stock", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  // Coupons usage
  const { data: couponUsage, isLoading: couponLoading } = useQuery({
    queryKey: ["coupon-usage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("coupon_code")
        .not("coupon_code", "is", null);
      if (error) throw error;
      // count by coupon_code
      const map: Record<string, number> = {};
      (data || []).forEach((o: any) => {
        const c = (o.coupon_code || "").toString().trim().toUpperCase();
        if (!c) return;
        map[c] = (map[c] || 0) + 1;
      });
      return Object.entries(map)
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count);
    },
  });

  if (ordersLoading || productsLoading || lowStockLoading || couponLoading) {
    return (
      <div className="p-6 lg:p-8">
        <Skeleton className="h-9 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const safeOrders = orders || [];

  // Basic stats
  const today = new Date().toDateString();
  const todayOrders = safeOrders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  // Recent orders (most recent first)
  const recentOrders = [...safeOrders].slice(0, 5);

  // Revenue timeseries - last 30 days
  const last30 = getLastNDays(30);
  const revenueMap = new Map<string, number>();
  last30.forEach((d) => revenueMap.set(d.toDateString(), 0));
  safeOrders.forEach((o: any) => {
    const key = new Date(o.createdAt).toDateString();
    if (revenueMap.has(key)) {
      revenueMap.set(key, (revenueMap.get(key) || 0) + (o.totalAmount || 0));
    }
  });
  const revenueSeries = last30.map((d) => ({
    date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    value: Math.round(revenueMap.get(d.toDateString()) || 0),
  }));

  // Best selling products (by quantity) - aggregate from order items
  const prodMap = new Map<string, { qty: number; revenue: number }>();
  safeOrders.forEach((o: any) => {
    (o.items || []).forEach((it: any) => {
      const name = it.productName || it.product_name || "Unknown";
      const qty = Number(it.quantity || it.qty || 0);
      const line = Number(it.lineTotal || it.line_total || qty * (it.unitPrice || it.unit_price || 0));
      if (!prodMap.has(name)) prodMap.set(name, { qty: 0, revenue: 0 });
      const cur = prodMap.get(name)!;
      cur.qty += qty;
      cur.revenue += line;
      prodMap.set(name, cur);
    });
  });
  const bestSellers = Array.from(prodMap.entries())
    .map(([name, data]) => ({ name, qty: data.qty, revenue: data.revenue }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);

  // Heatmap-like grid: day of week vs time buckets (6 buckets: 0-3,4-7,8-11,12-15,16-19,20-23)
  const timeBuckets = [
    { label: "00-03", start: 0, end: 3 },
    { label: "04-07", start: 4, end: 7 },
    { label: "08-11", start: 8, end: 11 },
    { label: "12-15", start: 12, end: 15 },
    { label: "16-19", start: 16, end: 19 },
    { label: "20-23", start: 20, end: 23 },
  ];
  const heat: Record<string, number> = {};
  WEEKDAYS.forEach((wd) =>
    timeBuckets.forEach((tb) => (heat[`${wd}-${tb.label}`] = 0))
  );
  safeOrders.forEach((o: any) => {
    const dt = new Date(o.createdAt);
    const day = WEEKDAYS[dt.getDay()];
    const hour = dt.getHours();
    const bucket = timeBuckets.find((b) => hour >= b.start && hour <= b.end);
    if (bucket) {
      heat[`${day}-${bucket.label}`] = (heat[`${day}-${bucket.label}`] || 0) + 1;
    }
  });
  // find max for coloring scale
  const heatMax = Math.max(...Object.values(heat), 1);

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingCart,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Today's Revenue",
      value: `${formatINR(todayRevenue)}`,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Active Products",
      value: productsCount ?? 0,
      icon: Package,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Total Orders",
      value: safeOrders.length,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview — sales, activity, low-stock alerts and coupon usage.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid: charts and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue chart (full width on mobile) */}
        <div className="lg:col-span-2 p-4 rounded-lg bg-card border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Revenue — last 30 days</h2>
            <div className="text-sm text-muted-foreground">
              Total: {formatINR(revenueSeries.reduce((s, r) => s + r.value, 0))}
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip formatter={(v: any) => formatINR(Number(v))} />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Best sellers */}
            <div>
              <h3 className="text-sm font-medium mb-2">Best Sellers</h3>
              <div className="space-y-2">
                {bestSellers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sales yet.</p>
                ) : (
                  bestSellers.map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.qty} sold • {formatINR(p.revenue)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">x{p.qty}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Coupon usage */}
            <div>
              <h3 className="text-sm font-medium mb-2">Top Coupons</h3>
              {couponUsage && couponUsage.length > 0 ? (
                <div className="space-y-2">
                  {couponUsage.slice(0, 6).map((c: any) => (
                    <div key={c.code} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{c.code}</p>
                        <p className="text-xs text-muted-foreground">{c.count} uses</p>
                      </div>
                      <div className="text-sm font-semibold">{c.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No coupons used yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: heatmap + low stock */}
        <div className="p-4 rounded-lg bg-card border space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Activity Heatmap</h3>
            <p className="text-xs text-muted-foreground mb-2">Orders by day & time</p>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* header row: weekdays */}
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="text-center font-medium">
                    {wd}
                  </div>
                ))}

                {/* For each time bucket, show a row of 7 cells */}
                {timeBuckets.map((tb) => (
                  <div key={tb.label} className="col-span-7 grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((wd) => {
                      const val = heat[`${wd}-${tb.label}`] || 0;
                      const intensity = Math.round((val / heatMax) * 255);
                      const bg = val === 0 ? "bg-transparent" : `bg-[rgba(14,165,233,${val / heatMax})]`;
                      return (
                        <div
                          key={`${wd}-${tb.label}`}
                          title={`${tb.label} • ${wd}: ${val} orders`}
                          className={`h-8 rounded flex items-center justify-center text-[10px] ${bg}`}
                        >
                          {val > 0 ? val : ""}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Low Stock Alerts</h3>
            <p className="text-xs text-muted-foreground mb-2">Products with stock ≤ 5</p>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 6).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
                    </div>
                    <div>
                      <Link
                        to={`/admin/products`}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No low stock items.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders list - full width below on small screens */}
      <div className="mt-6 p-4 rounded-lg bg-card border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent Orders</h3>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/orders">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.orderId} className="border-b last:border-0">
                    <td className="py-3 px-2">
                      <Link to="/admin/orders" className="font-medium text-primary hover:underline">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="py-3 px-2">{order.customerName}</td>
                    <td className="py-3 px-2 font-medium">₹{order.totalAmount}</td>
                    <td className="py-3 px-2">
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent orders.</p>
          </div>
        )}
      </div>
    </div>
  );
                      }
