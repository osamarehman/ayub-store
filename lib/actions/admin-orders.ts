"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function updateOrderStatus(
  orderNumber: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.order.update({
      where: { orderNumber },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderNumber}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updatePaymentStatus(
  orderNumber: string,
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.order.update({
      where: { orderNumber },
      data: { paymentStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderNumber}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}
