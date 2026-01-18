import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getUserOrders, getUserStats } from "@/lib/data/user-orders";
import { Card, Badge } from "@/components/ui";
import { ShoppingBag, Package, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account and orders",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [recentOrders, stats] = await Promise.all([
    getUserOrders(session.user.id).then((orders) => orders.slice(0, 5)),
    getUserStats(session.user.id),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground">
          Manage your orders and account settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">Rs. {stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm text-primary hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link
              href="/products"
              className="text-primary hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{order.orderNumber}</span>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">Rs. {Number(order.total).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/account/profile">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Edit Profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal information</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Continue Shopping</h3>
                <p className="text-sm text-muted-foreground">Browse our perfume collection</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
