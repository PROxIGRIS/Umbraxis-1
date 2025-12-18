import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

// --------------------------------------------------
// IMAGE SANITIZER (same as ProductDetail + ProductCard)
// --------------------------------------------------
const getImage = (p: any) => {
  const imgs: string[] = [];

  if (p.images?.length) {
    p.images.forEach((img: string) => {
      if (img && img.trim() !== "" && img !== "/placeholder.svg" && !imgs.includes(img)) {
        imgs.push(img);
      }
    });
  }

  if (
    p.imageUrl &&
    p.imageUrl.trim() !== "" &&
    p.imageUrl !== "/placeholder.svg" &&
    !imgs.includes(p.imageUrl)
  ) {
    imgs.unshift(p.imageUrl);
  }

  return imgs.length ? imgs[0] : "/placeholder.svg";
};

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    totalAmount,
  } = useCart();

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------
  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-[60vh]">
          <div className="container py-20">
            <div className="max-w-lg mx-auto text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border-4 border-amber-500/20">
                  <ShoppingBag className="h-10 w-10 text-amber-500" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-display font-bold mb-3 text-zinc-900 dark:text-white">
                Your cart is empty
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
                Looks like you haven't added anything yet.
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-8 bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-amber-500 dark:text-zinc-900 font-semibold"
              >
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --------------------------------------------------
  // CART WITH ITEMS
  // --------------------------------------------------
  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-10 md:py-16">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-display font-bold text-zinc-900 dark:text-white">
                Your Shopping Bag
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-full px-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-5">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="flex gap-6 p-4 md:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md"
                >
                  <Link to={`/product/${item.product.slug}`}>
                    <img
                      src={getImage(item.product)}
                      className="h-28 w-28 md:h-32 md:w-32 rounded-xl object-cover shadow-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="text-xl font-semibold hover:text-amber-500 transition text-zinc-900 dark:text-white">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {item.product.unit}
                    </p>

                    <p className="text-lg font-bold text-amber-500 mt-2">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity & Price Row */}
                    <div className="flex items-center justify-between mt-6">

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 bg-white dark:bg-zinc-800"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center font-semibold text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 bg-white dark:bg-zinc-800"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-full"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-base font-semibold text-amber-500 hover:underline mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="sticky top-28 p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
              >
                <h2 className="font-display font-bold text-2xl mb-6 text-zinc-900 dark:text-white">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery Fee</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      ₹{deliveryFee.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-xl">
                    <span className="text-zinc-900 dark:text-white">Estimated Total</span>
                    <span className="text-amber-500">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-6 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold shadow-lg shadow-amber-500/30"
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  Free delivery for orders above ₹500
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
