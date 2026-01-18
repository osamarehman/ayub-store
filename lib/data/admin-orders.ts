import { prisma } from "@/lib/db/prisma";

export async function getAllOrders(filters?: {
  status?: string;
  paymentStatus?: string;
  search?: string;
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      { shippingName: { contains: filters.search, mode: "insensitive" } },
      { shippingEmail: { contains: filters.search, mode: "insensitive" } },
      { shippingPhone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return orders;
}

export async function getOrderByNumberAdmin(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return order;
}
