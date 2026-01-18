import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getOrderByNumber } from "@/lib/actions/orders";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { generateWhatsAppOrderUrl } from "@/lib/utils/whatsapp";
import { Container, Card, Button, Badge } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { CheckCircle, Package, MapPin, CreditCard, MessageCircle, ArrowRight } from "lucide-react";

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your order has been received",
};

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  // Always generate WhatsApp URL for order confirmation
  const whatsappUrl = generateWhatsAppOrderUrl(order);

  return (
    <div className="py-12">
      <Container>
        {/* Success Header */}
        <Card className="p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-4">
            Your order has been saved. Please send us a message on WhatsApp to confirm your order and receive payment details.
          </p>
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg mb-4">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <span className="font-bold text-lg">{order.orderNumber}</span>
          </div>
          <div className="mt-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-success hover:bg-success/90">
                <MessageCircle className="h-5 w-5 mr-2" />
                Confirm Order on WhatsApp
              </Button>
            </a>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </h2>
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
                <p>Email: {order.shippingEmail}</p>
              </div>
            </Card>

            {/* WhatsApp Confirmation - Always show */}
            <Card className="p-6 bg-success/5 border-success/20 border-2">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-success">
                <MessageCircle className="h-5 w-5" />
                Confirm Your Order on WhatsApp
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to send your order details to our team. We'll share our bank account details so you can complete the payment.
              </p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-success hover:bg-success/90">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send Order via WhatsApp
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Your order has been saved. Please confirm on WhatsApp to proceed with payment.
              </p>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Status */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment</span>
                  <Badge
                    variant={
                      order.paymentStatus === "PAID" ? "default" : "outline"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

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
              <div className="space-y-3 mb-6">
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

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/products">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/account/orders">
                  <Button variant="outline" size="lg" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
