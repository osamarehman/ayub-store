import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { RefreshCw, Package, Clock, AlertTriangle, CheckCircle, XCircle, Phone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Bin Ayub",
  description: "Learn about our returns and exchanges policy at Bin Ayub. We want you to be completely satisfied with your purchase.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Returns & Exchanges</h1>
      <p className="text-muted-foreground mb-8">
        We want you to be completely satisfied with your purchase. If something isn't right, we're here to help.
      </p>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold">7 Days</h3>
          <p className="text-sm text-muted-foreground">Return Window</p>
        </Card>
        <Card className="p-4 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold">Original Condition</h3>
          <p className="text-sm text-muted-foreground">Unused & Sealed</p>
        </Card>
        <Card className="p-4 text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold">7-10 Days</h3>
          <p className="text-sm text-muted-foreground">Refund Processing</p>
        </Card>
      </div>

      {/* Return Eligibility */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-semibold">Eligible for Return</h2>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            You may return your order if all of the following conditions are met:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Product is unused and in its original condition</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Original packaging, box, and seals are intact</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Return is requested within 7 days of delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Product has no signs of use, damage, or tampering</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>You have your order number and proof of purchase</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Non-Returnable Items */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-semibold">Non-Returnable Items</h2>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Due to hygiene and safety reasons, we cannot accept returns for:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Opened or used perfumes (even if only sprayed once)</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Products with broken, missing, or tampered seals</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Products with missing or damaged packaging</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Sale, clearance, or promotional items (unless defective)</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Products returned after 7 days of delivery</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* How to Return */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">How to Return</h2>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Contact Us</h3>
              <p className="text-muted-foreground">
                Reach out via WhatsApp or email within 7 days of receiving your order.
                Provide your order number and reason for return.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Get Return Authorization</h3>
              <p className="text-muted-foreground">
                Our team will review your request and provide a Return Authorization (RA) number
                along with return shipping instructions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pack & Ship</h3>
              <p className="text-muted-foreground">
                Securely pack the product in its original packaging. Ship it back using a
                tracked courier service for your protection.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Receive Your Refund</h3>
              <p className="text-muted-foreground">
                Once we receive and inspect the returned item, your refund will be processed
                within 7-10 business days to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Damaged Products */}
      <Card className="p-8 mb-8 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-semibold">Damaged or Defective Products</h2>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            If you receive a damaged or defective product, we apologize for the inconvenience.
            Please follow these steps:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="font-semibold text-amber-700 dark:text-amber-400">1.</span>
              <span>Report the issue within <strong>48 hours</strong> of delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-amber-700 dark:text-amber-400">2.</span>
              <span>Send clear photos of the damaged product and packaging via WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-amber-700 dark:text-amber-400">3.</span>
              <span>Keep all original packaging until the issue is resolved</span>
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            For damaged or defective products, we will arrange a <strong>free replacement</strong> or
            <strong> full refund</strong> including any shipping costs you may have paid.
          </p>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Return shipping costs are the responsibility of the customer (unless the product is defective)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            We recommend using a tracked shipping service for returns
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Refunds are processed to the original payment method only
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Exchange requests are subject to product availability
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            We reserve the right to refuse returns that don't meet our policy requirements
          </li>
        </ul>
      </Card>

      {/* Contact */}
      <Card className="p-6 bg-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Need Help with a Return?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Our customer support team is available to assist you with any return or exchange questions.
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
          <Link
            href="/shipping"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            View Shipping Policy
          </Link>
        </div>
      </Card>
    </div>
  );
}
