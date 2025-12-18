import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Shield } from "lucide-react";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Store,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// NAV ITEMS (unchanged)
const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'COD Security', href: '/admin/cod-security', icon: Shield },

  // ⭐ NEW: STOCK MANAGER
  { label: 'Stock Manager', href: '/admin/stock-manager', icon: Package },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // NEW AUTH SYSTEM
  const { isAuthenticated, isLoading, validateSession, logout } = useAdminAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Run session validation automatically
  useEffect(() => {
    validateSession().then((ok) => {
      if (!ok) navigate('/admin/login');
    });
  }, [validateSession, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking admin session...</p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) return null;

  // ==== AUTHENTICATED LAYOUT ====
  return (
    <div className="min-h-screen bg-background">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-50 h-14 border-b bg-card flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="font-semibold">Admin Panel</span>
      </header>

      <div className="flex">

        {/* SIDEBAR */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 lg:translate-x-0 lg:static',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            
            {/* LOGO */}
            <div className="h-14 flex items-center px-4 border-b">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">K</span>
                </div>
                <span className="font-bold">Admin Panel</span>
              </Link>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Store className="h-5 w-5" />
                View Store
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* OVERLAY - MOBILE ONLY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
