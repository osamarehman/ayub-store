import { prisma } from "@/lib/db/prisma";

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return orders;
}

export async function getUserOrderByNumber(userId: string, orderNumber: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      orderNumber,
    },
    include: {
      items: true,
    },
  });

  return order;
}

export async function getUserStats(userId: string) {
  const [totalOrders, pendingOrders, totalSpent] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.order.count({
      where: {
        userId,
        status: { in: ["PENDING", "PROCESSING"] },
      },
    }),
    prisma.order.aggregate({
      where: {
        userId,
        paymentStatus: "PAID",
      },
      _sum: {
        total: true,
      },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalSpent: Number(totalSpent._sum.total) || 0,
  };
}
