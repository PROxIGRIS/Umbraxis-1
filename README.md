# Kirana Store - E-commerce Application

A modern, full-stack e-commerce application built for local grocery stores (kirana stores). This is a "mini Amazon" experience optimized for a single store with real-time inventory, Razorpay payment integration, and a comprehensive admin panel.

## 🛒 Features

### Customer Features
- **Product Browsing**: Browse products by category with search and filtering
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add/remove items, adjust quantities, persistent cart (localStorage)
- **Guest Checkout**: No login required - just enter delivery details
- **Multiple Payment Options**: 
  - Cash on Delivery (COD)
  - UPI Payment (via Razorpay)
  - Card Payment (via Razorpay)
- **Order Tracking**: Track order status using Order ID

### Admin Features
- **Dashboard**: Overview of orders, products, and sales
- **Product Management**: Create, edit, delete products
- **Category Management**: Manage product categories
- **Order Management**: View all orders, update order status, export to CSV

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (UI components)
- React Router (navigation)
- TanStack Query (data fetching)
- Sonner (toast notifications)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Edge Functions (serverless functions)
- Row Level Security (RLS) for data access control

**Payment Gateway:**
- Razorpay (UPI, Card, Netbanking)

### Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│   categories    │     │    products     │
├─────────────────┤     ├─────────────────┤
│ id (uuid)       │◄────│ category_id     │
│ name            │     │ id (uuid)       │
│ slug            │     │ name            │
│ icon            │     │ slug            │
│ image_url       │     │ description     │
│ product_count   │     │ price           │
│ created_at      │     │ original_price  │
│ updated_at      │     │ unit            │
└─────────────────┘     │ stock           │
                        │ image_url       │
                        │ is_featured     │
                        │ is_active       │
                        │ tags            │
                        │ created_at      │
                        │ updated_at      │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     orders      │     │  order_items    │
├─────────────────┤     ├─────────────────┤
│ id (uuid)       │◄────│ order_id        │
│ order_id (text) │     │ id (uuid)       │
│ customer_name   │     │ product_id      │
│ customer_phone  │     │ product_name    │
│ customer_address│     │ product_image   │
│ customer_notes  │     │ unit_price      │
│ payment_method  │     │ quantity        │
│ payment_status  │     │ line_total      │
│ status          │     │ created_at      │
│ subtotal        │     └─────────────────┘
│ delivery_fee    │
│ total_amount    │
│ razorpay_*      │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## 🔄 Order Flow

### Cash on Delivery (COD)
1. Customer adds items to cart
2. Proceeds to checkout and enters delivery details
3. Selects "Cash on Delivery"
4. Order is created in database with status: `pending`, payment_status: `pending`
5. Admin confirms order → status: `confirmed`
6. Order is packed → status: `packed`
7. Out for delivery → status: `out_for_delivery`
8. Delivered & payment collected → status: `delivered`, payment_status: `paid`

### Online Payment (UPI/Card)
1. Customer adds items to cart
2. Proceeds to checkout and enters delivery details
3. Selects UPI or Card payment
4. **Razorpay order is created** (NOT database order)
5. Razorpay checkout opens
6. Customer completes payment
7. **Payment verification happens on server:**
   - Signature verification (HMAC SHA256)
   - Payment status check with Razorpay API
   - Amount verification
8. **Only after successful verification**, order is created in database with:
   - status: `confirmed`
   - payment_status: `paid`
9. Customer redirected to confirmation page

**Important:** For online payments, the order is ONLY created after payment is verified. This prevents fake/failed orders from appearing in the system.

## 🔐 Payment Security

### Razorpay Integration

The payment flow is designed to prevent fraud:

1. **No Premature Order Creation**: For online payments, orders are NOT created until payment is verified.

2. **Server-Side Signature Verification**: 
   ```
   expected_signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret_key)
   ```

3. **Double Verification**: After signature verification, we also:
   - Fetch payment details from Razorpay API
   - Verify payment status is "captured" or "authorized"
   - Verify amount matches expected amount

4. **Webhook Support**: Razorpay webhooks can be configured for additional reliability (handles cases where frontend callback fails).

### Environment Variables (Secrets)

Required secrets in Supabase:
- `RAZORPAY_KEY_ID` - Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API Secret Key
- `RAZORPAY_WEBHOOK_SECRET` (optional) - For webhook signature verification

## 📁 Project Structure

```
src/
├── components/
│   ├── cart/          # Cart drawer and related components
│   ├── layout/        # Header, Footer, Layout wrapper
│   ├── orders/        # Order status badge, timeline
│   ├── products/      # Product card, category card
│   └── ui/            # shadcn/ui components
├── contexts/
│   └── CartContext.tsx # Cart state management
├── hooks/
│   ├── useCategories.ts # Category data fetching
│   ├── useOrders.ts     # Order data fetching & mutations
│   └── useProducts.ts   # Product data fetching
├── integrations/
│   └── supabase/       # Supabase client & types
├── pages/
│   ├── admin/          # Admin panel pages
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Index.tsx       # Home page
│   ├── OrderConfirmation.tsx
│   ├── ProductDetail.tsx
│   ├── Products.tsx
│   └── TrackOrder.tsx
├── types/
│   └── index.ts        # TypeScript type definitions
└── App.tsx             # Main app with routing

supabase/
└── functions/
    └── razorpay/       # Payment edge function
        └── index.ts    # Create order, verify payment, webhook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a Supabase project
   - Run the database migrations
   - Set environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **Configure Razorpay:**
   - Create a Razorpay account
   - Get API keys from Dashboard > Settings > API Keys
   - Add secrets to Supabase Edge Functions:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`

4. **Run development server:**
   ```bash
   npm run dev
   ```

### Setting Up Razorpay Webhooks (Optional)

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://<project-ref>.supabase.co/functions/v1/razorpay/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
4. Copy the webhook secret
5. Add `RAZORPAY_WEBHOOK_SECRET` to Supabase secrets

## 🔒 Security Considerations

1. **RLS Policies**: All tables have Row Level Security enabled
2. **No Customer Auth Required**: Guest checkout - no PII stored beyond order details
3. **Payment Verification**: Server-side only, with multiple verification steps
4. **Admin Protection**: Admin routes should be protected (implement auth as needed)

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Home page with featured products and categories |
| `/products` | Product listing with filters |
| `/products/:slug` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form with payment options |
| `/order-confirmation/:orderId` | Order confirmation after successful order |
| `/track-order` | Track order by Order ID |
| `/admin` | Admin dashboard |
| `/admin/products` | Admin product management |
| `/admin/categories` | Admin category management |
| `/admin/orders` | Admin order management |

## 📝 Order Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting confirmation |
| `confirmed` | Order confirmed by admin |
| `packed` | Order is packed and ready |
| `out_for_delivery` | Order is out for delivery |
| `delivered` | Order delivered successfully |
| `cancelled` | Order was cancelled |

## 💳 Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment not yet received (COD) |
| `paid` | Payment successfully received |
| `failed` | Payment failed |
| `refunded` | Payment was refunded |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own kirana store!
