import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Bin Ayub",
  description: "Get in touch with Bin Ayub for questions about our products, orders, or support.",
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+923472949596";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        Have questions? We're here to help! Reach out to us through any of the following channels.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* WhatsApp */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Chat with us directly for quick responses and order confirmations.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </Card>

        {/* Email */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Send us an email for detailed inquiries or support.
              </p>
              <a
                href="mailto:support@binayub.com"
                className="text-sm text-primary hover:underline"
              >
                support@binayub.com
              </a>
            </div>
          </div>
        </Card>

        {/* Phone */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Call us during business hours for immediate assistance.
              </p>
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="text-sm text-primary hover:underline"
              >
                {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Monday - Saturday: 10:00 AM - 8:00 PM
              </p>
              <p className="text-sm text-muted-foreground">
                Sunday: 12:00 PM - 6:00 PM
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">How do I place an order?</h3>
            <p className="text-sm text-muted-foreground">
              Browse our collection, add items to cart, and checkout. We'll confirm your
              order via WhatsApp before processing payment.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-sm text-muted-foreground">
              We accept prepaid orders only. Payment details will be shared after order
              confirmation via WhatsApp.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How long does delivery take?</h3>
            <p className="text-sm text-muted-foreground">
              Orders are typically delivered within 2-5 business days across Pakistan.
              You'll receive a tracking number within 24 hours of confirmation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you have a physical store?</h3>
            <p className="text-sm text-muted-foreground">
              We're an online-only store, allowing us to offer competitive prices and
              serve customers across Pakistan.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            For more questions, visit our{" "}
            <Link href="/faq" className="text-primary hover:underline">
              FAQ page
            </Link>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
