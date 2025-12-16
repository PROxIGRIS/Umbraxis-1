import { useState } from 'react';
import { Search, Filter, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderStatus } from '@/types';
import { useOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from '@/hooks/useOrders';
import { toast } from 'sonner';

const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const paymentStatusOptions = [
  { value: 'all', label: 'All Payment Status' },
  { value: 'pending', label: 'Payment Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone.includes(search);
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });

  const updateOrderStatus = async (id: string, orderId: string, newStatus: OrderStatus) => {
    try {
      // Auto-update payment status to paid when COD order is delivered
      const order = orders.find(o => o.id === id);
      let paymentStatus: string | undefined;
      if (newStatus === 'delivered' && order?.paymentMethod === 'cod' && order?.paymentStatus === 'pending') {
        paymentStatus = 'paid';
      }
      
      await updateStatusMutation.mutateAsync({ id, status: newStatus, paymentStatus });
      
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, paymentStatus: paymentStatus || selectedOrder.paymentStatus });
      }
      
      toast.success('Order status updated' + (paymentStatus ? ' (Payment marked as paid)' : ''));
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (id: string, newPaymentStatus: string) => {
    try {
      await updatePaymentMutation.mutateAsync({ id, paymentStatus: newPaymentStatus });
      
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
      }
      
      toast.success('Payment status updated');
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Phone', 'Address', 'Total', 'Status', 'Date'],
      ...filteredOrders.map((o) => [
        o.orderId,
        o.customerName,
        o.customerPhone,
        o.customerAddress.replace(/,/g, ';'),
        o.totalAmount,
        o.status,
        formatDate(o.createdAt),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported successfully');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>

        <Button variant="outline" onClick={exportOrders} disabled={orders.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={paymentFilter}
          onValueChange={setPaymentFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paymentStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-3 px-4"><Skeleton className="h-6 w-32" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-10 w-32" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary">{order.orderId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.items.length} items
                    </td>
                    <td className="py-3 px-4 font-medium">₹{order.totalAmount}</td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {orders.length === 0
              ? 'No orders yet. Orders will appear here when customers place them.'
              : 'No orders match your filters.'}
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-xl font-bold text-primary">
                    {selectedOrder.orderId}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>

              {/* Update Status */}
              <div className="p-4 rounded-lg bg-secondary/50 space-y-4">
                <div>
                  <label className="text-sm font-medium">Update Order Status</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      updateOrderStatus(selectedOrder.id, selectedOrder.orderId, value as OrderStatus)
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="mt-2">
                      {updateStatusMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions
                        .filter((o) => o.value !== 'all')
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status Update for COD */}
                {selectedOrder.paymentMethod === 'cod' && (
                  <div>
                    <label className="text-sm font-medium">Update Payment Status</label>
                    <Select
                      value={selectedOrder.paymentStatus}
                      onValueChange={(value) =>
                        updatePaymentStatus(selectedOrder.id, value)
                      }
                      disabled={updatePaymentMutation.isPending}
                    >
                      <SelectTrigger className="mt-2">
                        {updatePaymentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Payment will auto-update to "Paid" when order is marked as Delivered
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold mb-4">Order Status</h3>
                <OrderTimeline status={selectedOrder.status} />
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage || '/placeholder.svg'}
                        alt={item.productName}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ₹{item.unitPrice}
                        </p>
                      </div>
                      <span className="text-sm font-medium">₹{item.lineTotal}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>₹{selectedOrder.deliveryFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    {selectedOrder.customerName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    {selectedOrder.customerPhone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Address:</span>{' '}
                    {selectedOrder.customerAddress}
                  </p>
                  {selectedOrder.customerNotes && (
                    <p>
                      <span className="text-muted-foreground">Notes:</span>{' '}
                      {selectedOrder.customerNotes}
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Payment:</span>{' '}
                    {selectedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : selectedOrder.paymentMethod === 'upi'
                      ? 'UPI'
                      : 'Card'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Payment Status:</span>{' '}
                    <span className={selectedOrder.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
