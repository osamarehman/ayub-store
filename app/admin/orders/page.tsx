import type { Metadata } from "next";
import Link from "next/link";
import { getAllOrders } from "@/lib/data/admin-orders";
import { Card, Badge } from "@/components/ui";
import { OrderFilters } from "@/components/admin/order-filters";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Orders - Admin",
  description: "Manage orders",
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    paymentStatus?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const orders = await getAllOrders(params);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all orders
        </p>
      </div>

      {/* Filters */}
      <OrderFilters />

      {/* Orders Table */}
      <Card className="p-6">
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-sm">{order.shippingName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.shippingEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "h:mm a")}
                      </span>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          order.paymentStatus === "PAID" ? "default" : "outline"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-4 text-right font-semibold">
                      Rs. {Number(order.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
