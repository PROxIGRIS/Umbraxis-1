import { Check, Clock, Package, Truck, Home, X } from 'lucide-react';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  status: OrderStatus;
}

const steps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
          <X className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <p className="font-medium text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Connector Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8 transition-colors',
                    index < currentIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p
                className={cn(
                  'font-medium',
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-primary mt-0.5">Current Status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
