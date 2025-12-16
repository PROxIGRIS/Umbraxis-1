import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Loader2, Tag, Truck, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { CheckoutFormData, PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CODOTPModal } from '@/components/checkout/CODOTPModal';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DeliverySettings {
  free_delivery_min_amount: number;
  default_delivery_fee: number;
}

interface PaymentRules {
  cod_max_amount: number;
  is_cod_enabled: boolean;
  message_if_disabled: string;
}

interface AppliedCoupon {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  max_discount: number | null;
}

interface OTPOrderSummary {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
}

// AI Address Evaluation Helper
const evaluateAddress = async (fullAddress: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("ai-evaluate-address", {
      body: { address: fullAddress },
    });

    if (error) {
      console.error("AI score error:", error);
      return { aiScore: null, aiReason: "AI evaluation failed" };
    }

    return {
      aiScore: data.aiScore ?? null,
      aiReason: data.reason ?? "No explanation returned",
    };
  } catch (err) {
    console.error("AI score exception:", err);
    return { aiScore: null, aiReason: "AI crashed internally" };
  }
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Settings state
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    free_delivery_min_amount: 500,
    default_delivery_fee: 30,
  });
  const [paymentRules, setPaymentRules] = useState<PaymentRules>({
    cod_max_amount: 5000,
    is_cod_enabled: true,
    message_if_disabled: 'Cash on Delivery is not available for this order amount.',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // OTP Modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSummary, setOtpSummary] = useState<OTPOrderSummary | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | undefined>();

  // AI Address Scoring state
  const [aiResult, setAiResult] = useState<{ aiScore: number | null; aiReason: string } | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiReason, setAiReason] = useState<string | null>(null);

  // Calculate discount amount
  const calculateDiscount = (): number => {
    if (!appliedCoupon) return 0;

    let discount = 0;
    if (appliedCoupon.discount_type === 'percent') {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    } else {
      discount = appliedCoupon.discount_value;
    }

    return Math.min(discount, subtotal);
  };

  const discountAmount = calculateDiscount();

  // Calculate delivery fee with free delivery logic
  const isFreeDelivery = subtotal >= deliverySettings.free_delivery_min_amount;
  const deliveryFee = items.length > 0 ? (isFreeDelivery ? 0 : deliverySettings.default_delivery_fee) : 0;

  // Calculate final payable
  const finalPayable = subtotal - discountAmount + deliveryFee;

  // Check for product-level COD restrictions
  const itemsDisallowingCOD = items.filter(item => {
    if (item.product.codAllowed === undefined) {
      console.warn(`codAllowed field missing for product: ${item.product.name}`);
      return false;
    }
    return item.product.codAllowed === false;
  });
  const anyItemDisallowsCOD = itemsDisallowingCOD.length > 0;

  // Check if COD is allowed
  const isCodDisabledByGlobal = !paymentRules.is_cod_enabled;
  const isCodDisabledByAmount = finalPayable > paymentRules.cod_max_amount;
  const isCodDisabled = isCodDisabledByGlobal || isCodDisabledByAmount || anyItemDisallowsCOD;

  const getCodDisabledReason = (): string => {
    if (isCodDisabledByGlobal) {
      return 'Cash on Delivery is currently disabled by the store.';
    }
    if (anyItemDisallowsCOD) {
      return 'Some items in your cart are prepaid-only and do not support Cash on Delivery.';
    }
    if (isCodDisabledByAmount) {
      return `Cash on Delivery is not available for orders above ₹${paymentRules.cod_max_amount.toLocaleString()}.`;
    }
    return paymentRules.message_if_disabled;
  };

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      setSettingsLoading(true);
      try {
        const { data: deliveryData } = await supabase
          .from('delivery_settings')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (deliveryData) {
          setDeliverySettings({
            free_delivery_min_amount: deliveryData.free_delivery_min_amount,
            default_delivery_fee: deliveryData.default_delivery_fee,
          });
        }

        const { data: paymentData } = await supabase
          .from('payment_rules')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (paymentData) {
          setPaymentRules({
            cod_max_amount: paymentData.cod_max_amount,
            is_cod_enabled: paymentData.is_cod_enabled,
            message_if_disabled: paymentData.message_if_disabled || 'COD not available',
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Auto-switch to online payment if COD is disabled
  useEffect(() => {
    if (isCodDisabled && formData.paymentMethod === 'cod') {
      setFormData((prev) => ({ ...prev, paymentMethod: 'upi' }));
    }
  }, [isCodDisabled, formData.paymentMethod]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !coupon) {
        toast.error('Invalid coupon code');
        setCouponLoading(false);
        return;
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast.error('This coupon has expired');
        setCouponLoading(false);
        return;
      }

      if (subtotal < coupon.min_order_value) {
        toast.error(`Minimum order value of ₹${coupon.min_order_value} required for this coupon`);
        setCouponLoading(false);
        return;
      }

      setAppliedCoupon({
        code: coupon.code,
        discount_type: coupon.discount_type as 'percent' | 'flat',
        discount_value: coupon.discount_value,
        max_discount: coupon.max_discount,
      });

      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Complete COD order helper (used after direct creation or OTP verification)
  const completeCodOrder = async (orderId: string, orderData: any) => {
    try {
      // Generate invoice
      await supabase.functions.invoke('generate-invoice', {
        body: { orderId },
      });

      // Send Telegram notification
      supabase.functions.invoke('notify-telegram', {
        body: {
          order: {
            order_id: orderId,
            customer_name: formData.fullName,
            customer_phone: formData.phone,
            customer_address: orderData.fullAddress,
            customer_notes: formData.notes || null,
            payment_method: 'cod',
            payment_status: 'pending',
            subtotal: orderData.subtotal,
            delivery_fee: orderData.deliveryFee,
            discount_amount: orderData.discountAmount,
            coupon_code: appliedCoupon?.code || null,
            total_amount: orderData.finalPayable,
            items: items.map((item) => ({
              product_name: item.product.name,
              quantity: item.quantity,
              line_total: item.product.price * item.quantity,
            })),
            ai_score: aiScore,
            ai_reason: aiReason,
          },
        },
      }).catch(err => console.error('Telegram notification failed:', err));

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error completing COD order:', error);
      throw error;
    }
  };

  // Handle COD order with OTP security
  const handleCodOrder = async () => {
    const fullAddress = formData.landmark ? `${formData.address}, Landmark: ${formData.landmark}` : formData.address;

    // AI Address Evaluation
    const aiEvaluation = await evaluateAddress(fullAddress);
    setAiResult(aiEvaluation);
    setAiScore(aiEvaluation.aiScore);
    setAiReason(aiEvaluation.aiReason);

    try {
      const { data, error } = await supabase.functions.invoke('create-cod-order', {
        body: {
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_address: fullAddress,
          customer_notes: formData.notes || null,
          coupon_code: appliedCoupon?.code || null,
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          ai_score: aiScore,
          ai_reason: aiReason,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Failed to place order');
        setIsSubmitting(false);
        return;
      }

      // Check if OTP is required
      if (data.otp_required) {
        // OTP flow - open modal
        setOtpPhone(formData.phone);
        setOtpSummary(data.order_summary);
        setOtpError(undefined);
        setOtpModalOpen(true);
        setIsSubmitting(false);
        toast.info('OTP sent to your phone for verification');
        return;
      }

      // Direct order creation (OTP not required)
      const orderId = data.orderId;
      await completeCodOrder(orderId, {
        fullAddress,
        subtotal: data.order_summary?.subtotal || subtotal,
        deliveryFee: data.order_summary?.deliveryFee || deliveryFee,
        discountAmount: data.order_summary?.discountAmount || discountAmount,
        finalPayable: data.order_summary?.totalAmount || finalPayable,
      });

    } catch (error: unknown) {
      console.error('COD order error:', error);
      const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (otp: string) => {
    setOtpVerifying(true);
    setOtpError(undefined);

    const fullAddress = formData.landmark ? `${formData.address}, Landmark: ${formData.landmark}` : formData.address;

    try {
      const { data, error } = await supabase.functions.invoke('cod-verify-otp', {
        body: {
          phone: otpPhone,
          otp: otp,
        },
      });

      if (error) {
        console.error('OTP verification error:', error);
        setOtpError('Verification failed. Please try again.');
        setOtpVerifying(false);
        return;
      }

      if (!data?.success) {
        setOtpError(data?.error || 'Invalid OTP');
        setOtpVerifying(false);
        return;
      }

      // OTP verified, order created
      const orderId = data.orderId;
      setOtpModalOpen(false);

      await completeCodOrder(orderId, {
        fullAddress,
        subtotal: data.order_summary?.subtotal || otpSummary?.subtotal || subtotal,
        deliveryFee: data.order_summary?.deliveryFee || otpSummary?.deliveryFee || deliveryFee,
        discountAmount: data.order_summary?.discountAmount || otpSummary?.discountAmount || discountAmount,
        finalPayable: data.order_summary?.totalAmount || otpSummary?.totalAmount || finalPayable,
      });

    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      const message = error instanceof Error ? error.message : 'Verification failed';
      setOtpError(message);
    } finally {
      setOtpVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const fullAddress = formData.landmark ? `${formData.address}, Landmark: ${formData.landmark}` : formData.address;

    try {
      const { data, error } = await supabase.functions.invoke('create-cod-order', {
        body: {
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_address: fullAddress,
          customer_notes: formData.notes || null,
          coupon_code: appliedCoupon?.code || null,
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        },
      });

      if (error || !data?.success) {
        toast.error('Failed to resend OTP');
        return;
      }

      if (data.order_summary) {
        setOtpSummary(data.order_summary);
      }
      toast.success('OTP resent successfully');

    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP');
    }
  };

  // Handle online payment
  const handleOnlinePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const fullAddress = formData.landmark ? `${formData.address}, Landmark: ${formData.landmark}` : formData.address;

    // AI Address Evaluation
    const aiEvaluation = await evaluateAddress(fullAddress);
    setAiResult(aiEvaluation);
    setAiScore(aiEvaluation.aiScore);
    setAiReason(aiEvaluation.aiReason);

    try {
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount: finalPayable,
          currency: 'INR',
          notes: {
            customer_name: formData.fullName,
            customer_phone: formData.phone,
          },
        },
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to create payment order');
      }

      const orderData = {
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        customer_address: fullAddress,
        customer_notes: formData.notes || null,
        coupon_code: appliedCoupon?.code || null,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        ai_score: aiScore,
        ai_reason: aiReason,
      };

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Kirana Store',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_data: orderData,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              toast.error(verifyData?.error || 'Payment verification failed. Please contact support.');
              setIsSubmitting(false);
              return;
            }

            const orderId = verifyData.orderId;

            await supabase.functions.invoke('generate-invoice', {
              body: { orderId },
            });

            supabase.functions.invoke('notify-telegram', {
              body: {
                order: {
                  order_id: orderId,
                  customer_name: formData.fullName,
                  customer_phone: formData.phone,
                  customer_address: fullAddress,
                  payment_method: 'online',
                  payment_status: 'paid',
                  ai_score: aiScore,
                  ai_reason: aiReason,
                },
              },
            }).catch(err => console.error('Telegram notification failed:', err));

            clearCart();
            toast.success('Payment successful!');
            navigate(`/order-confirmation/${orderId}`);

          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support if amount was deducted.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: {
          color: '#10B981',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.info('Payment cancelled. No order was created.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      razorpay.open();

    } catch (error: unknown) {
      console.error('Payment error:', error);
      const message = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    if (formData.paymentMethod === 'cod') {
      await handleCodOrder();
    } else {
      await handleOnlinePayment();
    }
  };

  // Empty cart state
  if (items.length === 0 && !isSubmitting) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground">Add items to your cart before checkout.</p>
          <Button asChild>
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Delivery Details */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Delivery Details</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={cn(errors.fullName && 'border-destructive')}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={cn(errors.phone && 'border-destructive')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={cn(errors.address && 'border-destructive')}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near hospital, school, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions"
                    rows={2}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: value as PaymentMethod,
                    }))
                  }
                  className="space-y-3"
                >
                  {isCodDisabled ? (
                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50 opacity-60">
                      <Banknote className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {getCodDisabledReason()}
                        </div>
                        {anyItemDisallowsCOD && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {itemsDisallowingCOD.map(item => (
                              <Badge key={item.product.id} variant="outline" className="text-xs">
                                {item.product.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="cod"
                      className={cn(
                        'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors',
                        formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      )}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Banknote className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </label>
                  )}

                  <label
                    htmlFor="upi"
                    className={cn(
                      'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors',
                      formData.paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, etc.</p>
                    </div>
                  </label>

                  <label
                    htmlFor="card"
                    className={cn(
                      'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors',
                      formData.paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Credit or Debit card</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6 space-y-4 sticky top-4">
                <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        {item.product.codAllowed === false && (
                          <Badge variant="outline" className="text-xs mt-1 border-amber-500 text-amber-600">
                            Prepaid
                          </Badge>
                        )}
                        <p className="text-muted-foreground">
                          {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <p className="font-medium text-foreground">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-400">{appliedCoupon.code}</span>
                      <Badge variant="secondary" className="text-xs">
                        {appliedCoupon.discount_type === 'percent'
                          ? `${appliedCoupon.discount_value}% off`
                          : `₹${appliedCoupon.discount_value} off`
                        }
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Delivery Fee
                      {isFreeDelivery && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          <Truck className="h-3 w-3 mr-1" />
                          Free!
                        </Badge>
                      )}
                    </span>
                    <span className={cn('text-foreground', isFreeDelivery && 'line-through text-muted-foreground')}>
                      ₹{deliverySettings.default_delivery_fee}
                    </span>
                  </div>

                  {!isFreeDelivery && subtotal > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(deliverySettings.free_delivery_min_amount - subtotal).toFixed(0)} more for free delivery
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{finalPayable.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || settingsLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : formData.paymentMethod === 'cod' ? (
                    `Place Order • ₹${finalPayable.toFixed(2)}`
                  ) : (
                    `Pay ₹${finalPayable.toFixed(2)}`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our Terms of Service
                </p>

                {/* AI Address Score Debug Box */}
                {aiResult && (
                  <div className="mt-3 p-3 rounded-lg bg-yellow-100 text-yellow-900 text-sm">
                    <strong>AI Address Score:</strong> {aiResult.aiScore}  
                    <br />
                    <strong>Reason:</strong> {aiResult.aiReason}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* COD OTP Modal */}
      <CODOTPModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        phone={otpPhone}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isVerifying={otpVerifying}
        error={otpError}
        orderSummary={otpSummary}
      />
    </Layout>
  );
}
