import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getUserOrderByNumber } from "@/lib/data/user-orders";
import { Card, Badge } from "@/components/ui";
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details",
};

interface OrderDetailsPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await getUserOrderByNumber(session.user.id, params.orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
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
        </div>
        <p className="text-muted-foreground">
          Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Size: {item.variantSize}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <div className="space-y-2">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingCity}, {order.shippingPostalCode}
              </p>
              {order.shippingPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Phone className="h-4 w-4" />
                  <span>{order.shippingPhone}</span>
                </div>
              )}
              {order.shippingEmail && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{order.shippingEmail}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Rs. {Number(order.shippingCost).toLocaleString()}</span>
              </div>
              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Rs. {Number(order.tax).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rs. {Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Payment</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Method</p>
                <p className="font-medium capitalize">
                  {order.paymentMethod.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge
                  variant={order.paymentStatus === "PAID" ? "default" : "outline"}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Order Status */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Delivery Status</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
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
              </div>

              {order.status === "DELIVERED" && (
                <p className="text-sm text-muted-foreground">
                  Your order has been delivered successfully!
                </p>
              )}

              {order.status === "SHIPPED" && (
                <p className="text-sm text-muted-foreground">
                  Your order is on the way and will arrive soon.
                </p>
              )}

              {order.status === "PROCESSING" && (
                <p className="text-sm text-muted-foreground">
                  Your order is being prepared for shipment.
                </p>
              )}

              {order.status === "PENDING" && (
                <p className="text-sm text-muted-foreground">
                  Your order has been received and will be processed soon.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
