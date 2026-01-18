import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/data/user-orders";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Card, Badge } from "@/components/ui";
import { Package, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track all your orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
              <Link href={`/account/orders/${order.orderNumber}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        Order {order.orderNumber}
                      </h3>
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
                      <Badge
                        variant={
                          order.paymentStatus === "PAID" ? "default" : "outline"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.createdAt), "PPP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-xl font-bold">
                      Rs. {Number(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Package className="h-4 w-4" />
                    <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.variantSize} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-2 bg-muted rounded-lg text-sm text-muted-foreground">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* View Details Link */}
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
