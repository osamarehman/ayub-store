"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas/checkout";
import { generateOrderNumber, calculateShipping } from "@/lib/utils/order";
import type { CartItem } from "@/lib/types/cart";

interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

/**
 * Create a new order from checkout data and cart items
 */
export async function createOrder(
  checkoutData: CheckoutInput,
  cartItems: CartItem[]
): Promise<CreateOrderResult> {
  try {
    // Get session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to checkout" };
    }

    // Validate checkout data
    const validatedData = checkoutSchema.safeParse(checkoutData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid checkout data" };
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    const { name, email, phone, address, city, area, postalCode, paymentMethod, notes } =
      validatedData.data;

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variantPrice * item.quantity,
      0
    );
    const shippingCost = calculateShipping(city, subtotal);
    const total = subtotal + shippingCost;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id!,

          // Customer Info
          customerName: name,
          customerEmail: email,
          customerPhone: phone,

          // Shipping Info
          shippingName: name,
          shippingEmail: email,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingArea: area || null,
          shippingPostalCode: postalCode || null,

          // Payment
          paymentMethod: paymentMethod as "COD" | "WHATSAPP",
          paymentStatus: "PENDING",

          // Totals
          subtotal,
          shippingCost,
          total,

          // Order Status
          status: "PENDING",

          // Notes
          notes: notes || null,

          // Order Items
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productSlug: item.productSlug,
              productBrand: item.productBrand,
              productImage: item.productImage,
              variantId: item.variantId,
              variantSize: item.variantSize,
              variantSku: item.variantSku,
              quantity: item.quantity,
              price: item.variantPrice,
              total: item.variantPrice * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product variant stock
      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Revalidate paths
    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");

    return {
      success: true,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order. Please try again.",
    };
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
