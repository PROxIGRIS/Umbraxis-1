export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: Category;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  imageUrl: string;
  images?: string[];
  isFeatured: boolean;
  isActive: boolean;
  codEnabled: boolean;
  allowBackorder: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  landmark?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}
