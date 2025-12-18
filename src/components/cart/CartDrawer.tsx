import { Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

// Image sanitizer
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

export function CartDrawer() {
  const {
    items,
    isOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItems
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-white">

        {/* Header */}
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            Your Bag
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4 shadow-sm">
              <ShoppingBag className="h-10 w-10 text-zinc-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add something to make it yours.
            </p>
            <Button asChild onClick={() => setCartOpen(false)} className="rounded-full">
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm"
                  >
                    <img
                      src={getImage(item.product)}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover shadow-md"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>

                      <p className="text-xs text-zinc-500 mt-0.5">
                        {item.product.unit}
                      </p>

                      <p className="font-bold text-zinc-900 mt-1">
                        ₹{item.product.price}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-red-500"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Summary */}
            <div className="pt-4 space-y-4 border-t mt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-zinc-900">₹{totalAmount}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-2xl bg-zinc-900 text-white"
                  onClick={() => setCartOpen(false)}
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setCartOpen(false)}
                >
                  <Link to="/cart">View Full Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
