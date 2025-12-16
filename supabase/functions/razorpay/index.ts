import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    if (action === "create-order") {
      return await handleCreateOrder(req);
    } else if (action === "verify-payment") {
      return await handleVerifyPayment(req);
    } else if (action === "webhook") {
      return await handleWebhook(req);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    console.error("Razorpay function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleCreateOrder(req: Request) {
  const { amount, currency = "INR", receipt, notes } = await req.json();

  if (!amount || amount <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid amount" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log(`Creating Razorpay order: amount=${amount}, currency=${currency}, receipt=${receipt}`);

  // Create Razorpay order
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
    }),
  });

  if (!razorpayResponse.ok) {
    const errorData = await razorpayResponse.json();
    console.error("Razorpay order creation failed:", errorData);
    return new Response(
      JSON.stringify({ error: errorData.error?.description || "Failed to create order" }),
      { status: razorpayResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const razorpayOrder = await razorpayResponse.json();
  console.log("Razorpay order created:", razorpayOrder.id);

  return new Response(
    JSON.stringify({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleVerifyPayment(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_data,
  } = await req.json();

  console.log(`Verifying payment: order_id=${razorpay_order_id}, payment_id=${razorpay_payment_id}`);

  // Verify signature using HMAC SHA256
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(RAZORPAY_KEY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = `${razorpay_order_id}|${razorpay_payment_id}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const expectedSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const isValid = expectedSignature === razorpay_signature;
  console.log(`Signature verification: ${isValid ? "success" : "failed"}`);

  if (!isValid) {
    console.error("Invalid signature - possible fraud attempt");
    return new Response(
      JSON.stringify({ success: false, error: "Invalid payment signature - payment verification failed" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Fetch payment details from Razorpay to double-verify
  const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
    headers: {
      Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
    },
  });

  if (!paymentResponse.ok) {
    console.error("Failed to fetch payment details from Razorpay");
    return new Response(
      JSON.stringify({ success: false, error: "Failed to verify payment with Razorpay" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const paymentDetails = await paymentResponse.json();
  
  // Verify payment is actually captured/authorized
  if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
    console.error(`Payment status is ${paymentDetails.status}, not captured/authorized`);
    return new Response(
      JSON.stringify({ success: false, error: `Payment not completed. Status: ${paymentDetails.status}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Verify amount matches
  const expectedAmount = Math.round(order_data.total_amount * 100);
  if (paymentDetails.amount !== expectedAmount) {
    console.error(`Amount mismatch: expected ${expectedAmount}, got ${paymentDetails.amount}`);
    return new Response(
      JSON.stringify({ success: false, error: "Payment amount mismatch" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Payment verified - now create the order in database
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create order with confirmed status since payment is verified
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: order_data.order_id,
      customer_name: order_data.customer_name,
      customer_phone: order_data.customer_phone,
      customer_address: order_data.customer_address,
      customer_notes: order_data.customer_notes || null,
      payment_method: order_data.payment_method,
      payment_status: "paid",
      status: "confirmed",
      subtotal: order_data.subtotal,
      delivery_fee: order_data.delivery_fee,
      total_amount: order_data.total_amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create order in database" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Create order items
  const orderItems = order_data.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image: item.product_image,
    unit_price: item.unit_price,
    quantity: item.quantity,
    line_total: item.line_total,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to create order items:", itemsError);
    // Delete the order since items failed
    await supabase.from("orders").delete().eq("id", order.id);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create order items" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log(`Order ${order_data.order_id} created successfully with payment verified`);

  // Send Telegram notification to shop owner
  try {
    const telegramResponse = await fetch(
      `${supabaseUrl}/functions/v1/notify-telegram`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          order: {
            order_id: order_data.order_id,
            customer_name: order_data.customer_name,
            customer_phone: order_data.customer_phone,
            customer_address: order_data.customer_address,
            customer_notes: order_data.customer_notes,
            payment_method: order_data.payment_method,
            payment_status: "paid",
            subtotal: order_data.subtotal,
            delivery_fee: order_data.delivery_fee,
            total_amount: order_data.total_amount,
            items: order_data.items,
          },
        }),
      }
    );
    console.log(`Telegram notification sent: ${telegramResponse.ok}`);
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
    // Don't fail the order if notification fails
  }

  return new Response(
    JSON.stringify({ success: true, orderId: order_data.order_id }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Webhook handler for Razorpay events (optional but recommended for reliability)
async function handleWebhook(req: Request) {
  const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  
  // Get the raw body for signature verification
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // If webhook secret is configured, verify the signature
  if (webhookSecret && signature) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const computedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(computedSignature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      console.error("Webhook signature verification failed");
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  const event = JSON.parse(body);
  console.log(`Webhook event received: ${event.event}`);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle different payment events
  switch (event.event) {
    case "payment.captured":
      // Payment was successfully captured
      const capturedPayment = event.payload.payment.entity;
      console.log(`Payment captured: ${capturedPayment.id}`);
      
      // Update order if it exists (for cases where webhook arrives before frontend verification)
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          razorpay_payment_id: capturedPayment.id,
        })
        .eq("razorpay_order_id", capturedPayment.order_id);
      break;

    case "payment.failed":
      // Payment failed
      const failedPayment = event.payload.payment.entity;
      console.log(`Payment failed: ${failedPayment.id}`);
      
      // Update order status if exists
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("razorpay_order_id", failedPayment.order_id);
      break;

    case "refund.processed":
      // Refund was processed
      const refund = event.payload.refund.entity;
      console.log(`Refund processed: ${refund.id}`);
      
      await supabase
        .from("orders")
        .update({
          payment_status: "refunded",
        })
        .eq("razorpay_payment_id", refund.payment_id);
      break;

    default:
      console.log(`Unhandled webhook event: ${event.event}`);
  }

  return new Response(
    JSON.stringify({ received: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
