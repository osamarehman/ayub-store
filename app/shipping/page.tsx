import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { Package, Truck, Clock, MapPin, RefreshCw, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Returns | Bin Ayub",
  description: "Learn about our shipping policy, delivery times, and return process at Bin Ayub.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Shipping & Returns</h1>

      {/* Shipping Policy */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Shipping Policy</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Coverage
            </h3>
            <p className="text-muted-foreground">
              We deliver to all major cities across Pakistan including Karachi, Lahore, Islamabad,
              Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and more.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Delivery Time
            </h3>
            <ul className="text-muted-foreground space-y-1 ml-6">
              <li>• Major Cities: 2-3 business days</li>
              <li>• Other Cities: 3-5 business days</li>
              <li>• Remote Areas: 5-7 business days</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Order Processing
            </h3>
            <p className="text-muted-foreground mb-2">
              Once you place an order, our team will:
            </p>
            <ol className="text-muted-foreground space-y-1 ml-6 list-decimal">
              <li>Confirm your order via WhatsApp</li>
              <li>Share payment details (prepaid orders only)</li>
              <li>Process your order after payment confirmation</li>
              <li>Send tracking number within 24 hours</li>
              <li>Ship your order with secure packaging</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Tracking Your Order
            </h3>
            <p className="text-muted-foreground">
              You will receive a tracking number via WhatsApp and SMS within 24 hours of order
              confirmation. You can track your shipment in real-time using this tracking number
              on our courier partner's website.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">📦 Shipping Charges</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Orders above Rs. 5,000: <span className="font-semibold text-green-600">FREE Shipping</span></li>
              <li>• Orders below Rs. 5,000: Rs. 200 shipping fee</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Returns & Exchange Policy */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Returns & Exchange Policy</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Return Eligibility</h3>
            <p className="text-muted-foreground mb-3">
              We want you to love your purchase! If you're not satisfied, we accept returns under
              the following conditions:
            </p>
            <ul className="text-muted-foreground space-y-2 ml-6">
              <li>• Product is unused and in original condition</li>
              <li>• Original packaging and seals are intact</li>
              <li>• Return requested within 7 days of delivery</li>
              <li>• Product has no signs of use or tampering</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Non-Returnable Items</h3>
            <p className="text-muted-foreground mb-2">
              Due to the nature of fragrances, we cannot accept returns for:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-6">
              <li>• Opened or used perfumes</li>
              <li>• Products with broken seals</li>
              <li>• Products with missing packaging</li>
              <li>• Sale or clearance items (unless defective)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How to Return</h3>
            <ol className="text-muted-foreground space-y-2 ml-6 list-decimal">
              <li>Contact us via WhatsApp or email within 7 days of delivery</li>
              <li>Provide your order number and reason for return</li>
              <li>Wait for return authorization from our team</li>
              <li>Ship the product back in original packaging</li>
              <li>Refund will be processed within 7-10 business days after receiving the return</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Damaged or Defective Products</h3>
            <p className="text-muted-foreground">
              If you receive a damaged or defective product, please contact us immediately with
              photos. We will arrange a replacement or full refund at no additional cost to you.
              You must report any damage within 48 hours of delivery.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
              ⚠️ Important Note
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Return shipping costs are the responsibility of the customer unless the product
              is defective or incorrect. We recommend using a tracked shipping service for
              returns.
            </p>
          </div>
        </div>
      </Card>

      {/* Contact for Shipping Issues */}
      <Card className="p-6 bg-primary/5">
        <h3 className="font-semibold mb-3">Need Help with Shipping or Returns?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our customer support team is here to help with any shipping or return questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            WhatsApp Us
          </a>
          <a
            href="mailto:support@binayub.com"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Email Support
          </a>
        </div>
      </Card>
    </div>
  );
}
