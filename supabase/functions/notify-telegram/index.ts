import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();

    if (!order) {
      console.error("Missing order data in request");
      return new Response(
        JSON.stringify({ error: "Missing order data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!TOKEN || !CHAT_ID) {
      console.error("Telegram credentials not configured");
      return new Response(
        JSON.stringify({ error: "Telegram not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending Telegram notification for order: ${order.order_id}`);

    // Format order items if available
    let itemsList = "";
    if (order.items && Array.isArray(order.items)) {
      itemsList = order.items
        .map((item: any) => `• ${item.product_name} x${item.quantity} - ₹${item.line_total}`)
        .join("\n");
    }

    const text = `
🔔 *NEW ORDER RECEIVED!*

📦 *Order ID:* \`${order.order_id}\`
💰 *Total Amount:* ₹${order.total_amount}
💳 *Payment:* ${order.payment_method?.toUpperCase() || "N/A"} (${order.payment_status || "pending"})

👤 *Customer:* ${order.customer_name}
📞 *Phone:* ${order.customer_phone}

🏠 *Delivery Address:*
${order.customer_address}

${order.customer_notes ? `📝 *Notes:* ${order.customer_notes}` : ""}

${itemsList ? `🛒 *Items:*\n${itemsList}` : ""}

---
*Subtotal:* ₹${order.subtotal || 0}
*Delivery:* ₹${order.delivery_fee || 0}
*Total:* ₹${order.total_amount}
`;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram API error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send Telegram notification", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Telegram notification sent successfully for order: ${order.order_id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Telegram notification error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
