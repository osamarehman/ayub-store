import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByNumberAdmin } from "@/lib/data/admin-orders";
import { Card, Badge } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { OrderStatusUpdate } from "@/components/admin/order-status-update";
import { ArrowLeft, MapPin, CreditCard, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AdminOrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Order Details - Admin",
  description: "View and manage order",
};

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumberAdmin(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                  >
                    <OptimizedImage
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      preset="thumbnail"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="font-semibold mb-1">{item.productName}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.productBrand}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Size: {item.variantSize}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>SKU: {item.variantSku}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Rs. {Number(item.total).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              {order.user && (
                <div>
                  <p className="text-muted-foreground mb-1">Account</p>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-muted-foreground">{order.user.email}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Contact</p>
                <p className="font-medium">{order.shippingPhone}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}
                {order.shippingArea && `, ${order.shippingArea}`}
              </p>
              {order.shippingPostalCode && <p>{order.shippingPostalCode}</p>}
              <p className="pt-2">Phone: {order.shippingPhone}</p>
            </div>
          </Card>

          {/* Special Instructions */}
          {order.notes && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Special Instructions</h2>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Right Column - Status & Payment */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Update */}
          <OrderStatusUpdate order={order} />

          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Payment Method */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <p className="text-sm">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "WhatsApp Confirmation"}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  Rs. {Number(order.subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  Rs. {Number(order.shippingCost).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    Rs. {Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {format(new Date(order.updatedAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
