import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface OrderRow {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes: string | null;
  payment_method: string;
  payment_status: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

async function generateInvoicePdf(order: OrderRow, items: OrderItemRow[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = 800;

  // Header
  page.drawText("KiranaStore", {
    x: margin,
    y,
    size: 20,
    font: bold,
    color: rgb(0.1, 0.5, 0.3),
  });
  y -= 18;
  page.drawText("Your trusted neighborhood grocery store", {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Invoice title + meta
  y -= 30;
  page.drawText("INVOICE", {
    x: margin,
    y,
    size: 16,
    font: bold,
  });

  const createdDate = new Date(order.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  page.drawText(`Order ID: ${order.order_id}`, {
    x: margin,
    y: y - 18,
    size: 10,
    font,
  });
  page.drawText(`Date: ${createdDate}`, {
    x: margin,
    y: y - 32,
    size: 10,
    font,
  });

  // Customer details
  y -= 70;
  page.drawText("Bill To:", { x: margin, y, size: 12, font: bold });
  y -= 14;
  page.drawText(order.customer_name, { x: margin, y, size: 10, font });
  y -= 12;
  page.drawText(order.customer_phone, { x: margin, y, size: 10, font });
  y -= 12;
  
  // Handle multi-line address
  const addressLines = order.customer_address.split(/[,\n]/);
  addressLines.forEach((line) => {
    if (line.trim()) {
      page.drawText(line.trim(), { x: margin, y, size: 10, font });
      y -= 12;
    }
  });

  if (order.customer_notes) {
    y -= 6;
    page.drawText(`Notes: ${order.customer_notes}`, {
      x: margin,
      y,
      size: 9,
      font,
    });
    y -= 16;
  } else {
    y -= 10;
  }

  // Table header
  const colX = {
    name: margin,
    qty: 330,
    price: 390,
    total: 460,
  };

  page.drawText("Item", { x: colX.name, y, size: 11, font: bold });
  page.drawText("Qty", { x: colX.qty, y, size: 11, font: bold });
  page.drawText("Price", { x: colX.price, y, size: 11, font: bold });
  page.drawText("Total", { x: colX.total, y, size: 11, font: bold });
  y -= 8;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 555, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 16;

  // Items
  items.forEach((item) => {
    // Truncate long product names
    const name = item.product_name.length > 40 
      ? item.product_name.substring(0, 37) + "..." 
      : item.product_name;
    
    page.drawText(name, {
      x: colX.name,
      y,
      size: 10,
      font,
    });
    page.drawText(String(item.quantity), {
      x: colX.qty,
      y,
      size: 10,
      font,
    });
    page.drawText(`Rs.${item.unit_price.toFixed(2)}`, {
      x: colX.price,
      y,
      size: 10,
      font,
    });
    page.drawText(`Rs.${item.line_total.toFixed(2)}`, {
      x: colX.total,
      y,
      size: 10,
      font,
    });
    y -= 14;
  });

  // Summary
  y -= 10;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 555, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 20;

  const summaryX = 390;

  page.drawText("Subtotal:", {
    x: summaryX,
    y,
    size: 10,
    font,
  });
  page.drawText(`Rs.${order.subtotal.toFixed(2)}`, {
    x: colX.total,
    y,
    size: 10,
    font,
  });

  y -= 14;
  page.drawText("Delivery Fee:", {
    x: summaryX,
    y,
    size: 10,
    font,
  });
  page.drawText(`Rs.${order.delivery_fee.toFixed(2)}`, {
    x: colX.total,
    y,
    size: 10,
    font,
  });

  y -= 16;
  page.drawLine({
    start: { x: summaryX, y },
    end: { x: 555, y },
    thickness: 0.5,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 16;

  page.drawText("Total:", {
    x: summaryX,
    y,
    size: 11,
    font: bold,
  });
  page.drawText(`Rs.${order.total_amount.toFixed(2)}`, {
    x: colX.total,
    y,
    size: 11,
    font: bold,
    color: rgb(0.1, 0.5, 0.3),
  });

  // Payment info
  y -= 30;
  page.drawText(`Payment Method: ${order.payment_method.toUpperCase()}`, {
    x: margin,
    y,
    size: 10,
    font,
  });
  page.drawText(`Payment Status: ${order.payment_status.toUpperCase()}`, {
    x: margin + 200,
    y,
    size: 10,
    font,
  });

  // Footer
  y -= 40;
  page.drawText("Thank you for shopping with KiranaStore!", {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdfDoc.save();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Generating invoice for order:", orderId);

    // 1. Fetch order by public order_id
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch items using the internal UUID
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("Failed to fetch order items:", itemsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch order items" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found", items?.length || 0, "items for order");

    // 3. Generate PDF
    const pdfBytes = await generateInvoicePdf(order as OrderRow, (items || []) as OrderItemRow[]);

    // 4. Upload to storage - use simple filename without nested path
    const fileName = `invoice-${order.order_id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload invoice:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload invoice" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from("invoices")
      .getPublicUrl(fileName);

    console.log("Invoice uploaded:", publicUrl);

    // 5. Save URL on order
    await supabase
      .from("orders")
      .update({ invoice_url: publicUrl })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ success: true, invoiceUrl: publicUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Invoice generation error:", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
