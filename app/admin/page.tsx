import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin-stats";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Card, Badge, Button } from "@/components/ui";
import { StatsCard } from "@/components/admin/stats-card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Bin Ayub admin dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          description="All time"
          icon={DollarSign}
          trend={`Rs. ${stats.monthlyRevenue.toLocaleString()} this month`}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          description="All time"
          icon={ShoppingCart}
          trend={`${stats.monthlyOrders} this month`}
        />
        <StatsCard
          title="Products"
          value={stats.totalProducts.toString()}
          description="Active products"
          icon={Package}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          description="Needs attention"
          icon={AlertTriangle}
          variant={stats.pendingOrders > 0 ? "warning" : "default"}
        />
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <Card className="p-6 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {stats.lowStockProducts} product variant{stats.lowStockProducts > 1 ? "s" : ""} running low on stock (less than 5 units)
              </p>
              <Link href="/admin/products">
                <Button size="sm" variant="outline">
                  View Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderNumber}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <Badge variant={order.status === "PENDING" ? "outline" : "default"}>
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
                    <span>{order.shippingName}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products/new">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Add New Product</h3>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Orders</h3>
                <p className="text-sm text-muted-foreground">View and update orders</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">View Store</h3>
                <p className="text-sm text-muted-foreground">See your live store</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
