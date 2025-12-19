import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AppLoader } from "@/components/ui/AppLoader";

import ScrollToTop from "@/components/ScrollToTop";

// =====================
// Customer Pages
// =====================
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";

// Contact Page
import Contact from "./pages/Contact";

// Returns Page (NEW)
import Returns from "./pages/Returns";
import About from "./pages/About";

// =====================
// Legal Pages
// =====================
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// =====================
// Admin Pages
// =====================
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLogin from "./pages/admin/AdminLogin";

// Coupons
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminCreateCoupon from "./pages/admin/AdminCreateCoupon";

// COD Security
import { CODSecuritySettings } from "./pages/admin/CODSecuritySettings";

// Stock Manager
import StockManager from "./pages/admin/StockManager";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <AppLoader />

          <BrowserRouter>
            <ScrollToTop />

            <Routes>

              {/* =====================
                  Customer Routes
              ====================== */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route path="/track-order" element={<TrackOrder />} />

              {/* Contact */}
              <Route path="/contact" element={<Contact />} />

              {/* Returns & Refunds */}
              <Route path="/returns" element={<Returns />} />
              <Route path="/about" element={<About />} />

              {/* =====================
                  Legal Pages
              ====================== */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* =====================
                  Admin Auth
              ====================== */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* =====================
                  Protected Admin Routes
              ====================== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />

                {/* Coupons */}
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="coupons/new" element={<AdminCreateCoupon />} />

                {/* COD Security */}
                <Route path="cod-security" element={<CODSecuritySettings />} />

                {/* Stock Manager */}
                <Route path="stock-manager" element={<StockManager />} />
              </Route>

              {/* =====================
                  404
              ====================== */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
