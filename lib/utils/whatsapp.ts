import type { Order, OrderItem } from "@prisma/client";

interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * Generate WhatsApp order confirmation URL
 * Pre-fills message with order details
 */
export function generateWhatsAppOrderUrl(order: OrderWithItems): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
    /[\s\+\-\(\)]/g,
    ""
  );

  if (!whatsappNumber) {
    throw new Error("WhatsApp number not configured");
  }

  // Build order message
  const message = buildOrderMessage(order);

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Return WhatsApp URL
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Build formatted order message for WhatsApp
 */
function buildOrderMessage(order: OrderWithItems): string {
  const lines: string[] = [];

  lines.push(`Hi! I've placed an order on Bin Ayub.`);
  lines.push("");
  lines.push(`*Order #${order.orderNumber}*`);
  lines.push("");
  lines.push("*Items:*");

  // Add order items
  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.productName} (${item.variantSize}) x${item.quantity}`
    );
    lines.push(`   Rs. ${Number(item.price).toLocaleString()}`);
  });

  lines.push("");
  lines.push("*Order Summary:*");
  lines.push(`Subtotal: Rs. ${Number(order.subtotal).toLocaleString()}`);
  lines.push(`Shipping: Rs. ${Number(order.shippingCost).toLocaleString()}`);
  lines.push(`*Total: Rs. ${Number(order.total).toLocaleString()}*`);
  lines.push("");
  lines.push("*Delivery Address:*");
  lines.push(order.shippingName);
  lines.push(order.shippingAddress);
  lines.push(`${order.shippingCity}${order.shippingArea ? `, ${order.shippingArea}` : ""}`);
  if (order.shippingPostalCode) {
    lines.push(`Postal Code: ${order.shippingPostalCode}`);
  }
  lines.push(`Phone: ${order.shippingPhone}`);

  if (order.notes) {
    lines.push("");
    lines.push("*Special Instructions:*");
    lines.push(order.notes);
  }

  lines.push("");
  lines.push(`*Payment Method:* ${order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer/WhatsApp"}`);

  if (order.paymentMethod === "WHATSAPP") {
    lines.push("");
    lines.push("Please share payment details. Thank you!");
  }

  return lines.join("\n");
}

/**
 * Generate customer support WhatsApp URL
 */
export function generateSupportWhatsAppUrl(message?: string): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
    /[\s\+\-\(\)]/g,
    ""
  );

  if (!whatsappNumber) {
    return "#";
  }

  const defaultMessage = "Hi! I need help with my order.";
  const encodedMessage = encodeURIComponent(message || defaultMessage);

  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
