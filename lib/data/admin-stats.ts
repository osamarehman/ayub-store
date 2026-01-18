import { prisma } from "@/lib/db/prisma";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      totalRevenue,
      monthlyOrders,
      monthlyRevenue,
      totalProducts,
      lowStockProducts,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),

      // Total revenue (only PAID orders)
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),

      // Monthly orders
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),

      // Monthly revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),

      // Total products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Low stock products (stock < 5)
      prisma.productVariant.count({
        where: {
          stock: { lt: 5 },
          isActive: true,
        },
      }),

      // Pending orders
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),

      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          shippingName: true,
        },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      monthlyOrders,
      monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
      totalProducts,
      lowStockProducts,
      pendingOrders,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}
