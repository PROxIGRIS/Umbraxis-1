import { Header } from './Header';
import Footer from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
      <CartDrawer />
    </div>
  );
}
