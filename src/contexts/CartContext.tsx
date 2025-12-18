import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number; selectedSize?: string }
  | { type: 'REMOVE_ITEM'; productId: string; selectedSize?: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; selectedSize?: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; isOpen: boolean }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 30;
const CART_STORAGE_KEY = 'kirana-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item =>
          item.product.id === action.product.id &&
          item.selectedSize === action.selectedSize
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (action.quantity || 1),
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity || 1,
            selectedSize: action.selectedSize,
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item =>
            !(item.product.id === action.productId && item.selectedSize === action.selectedSize)
        ),
      };

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item =>
              !(item.product.id === action.productId && item.selectedSize === action.selectedSize)
          ),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.productId &&
          item.selectedSize === action.selectedSize
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.isOpen };

    case 'LOAD_CART':
      return { ...state, items: action.items };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', items: JSON.parse(savedCart) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity = 1, selectedSize?: string) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, selectedSize });
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} × ₹${product.price}${selectedSize ? ` • Size: ${selectedSize}` : ''}`,
    });
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId, selectedSize });
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity, selectedSize });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const setCartOpen = (isOpen: boolean) => dispatch({ type: 'SET_CART_OPEN', isOpen });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryFee = state.items.length > 0 ? DELIVERY_FEE : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        totalItems,
        subtotal,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
