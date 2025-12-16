import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrderStatus } from '@/types';

interface OrderWithItems {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productId: string | null;
    productName: string;
    productImage: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}

const transformOrder = (order: any, items: any[]): OrderWithItems => ({
  id: order.id,
  orderId: order.order_id,
  customerName: order.customer_name,
  customerPhone: order.customer_phone,
  customerAddress: order.customer_address,
  customerNotes: order.customer_notes,
  paymentMethod: order.payment_method,
  paymentStatus: order.payment_status,
  status: order.status as OrderStatus,
  subtotal: Number(order.subtotal),
  deliveryFee: Number(order.delivery_fee),
  totalAmount: Number(order.total_amount),
  createdAt: order.created_at,
  updatedAt: order.updated_at,
  items: items.map(item => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    productImage: item.product_image,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    lineTotal: Number(item.line_total),
  })),
});

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      // Fetch all order items
      const orderIds = (orders || []).map(o => o.id);
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      
      if (itemsError) throw itemsError;
      
      // Group items by order
      const itemsByOrder = (items || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {} as Record<string, any[]>);
      
      return (orders || []).map(order => 
        transformOrder(order, itemsByOrder[order.id] || [])
      );
    },
  });
}

export function useOrderByPublicId(orderId: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'public', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (orderError) {
        if (orderError.code === 'PGRST116') return null;
        throw orderError;
      }
      
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (itemsError) throw itemsError;
      
      return transformOrder(order, items || []);
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, paymentStatus }: { id: string; status: OrderStatus; paymentStatus?: string }) => {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, paymentStatus }: { id: string; paymentStatus: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
