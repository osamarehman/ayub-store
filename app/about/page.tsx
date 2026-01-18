import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us | Bin Ayub",
  description: "Learn about Bin Ayub - Your trusted destination for quality products in Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About Bin Ayub</h1>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-muted-foreground mb-4">
          Bin Ayub is Pakistan&apos;s premier destination for quality products at great prices.
          We are passionate about bringing the best products to customers
          across Pakistan.
        </p>
        <p className="text-muted-foreground mb-4">
          Founded with a vision to make quality products accessible, we curate a carefully
          selected collection of electronics, fashion, home goods, beauty products, and more
          that meet the needs of every customer.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Quality Products</h3>
            <p className="text-sm text-muted-foreground">
              Every product we sell is guaranteed to be of high quality and sourced
              from trusted suppliers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quality Assured</h3>
            <p className="text-sm text-muted-foreground">
              We carefully inspect each product to ensure it meets our high standards
              before it reaches you.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              We ship across Pakistan and provide tracking numbers within 24 hours
              of order confirmation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Customer First</h3>
            <p className="text-sm text-muted-foreground">
              Our team is dedicated to providing exceptional service and support
              throughout your shopping experience.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Bin Ayub?</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Wide selection of quality products across multiple categories</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Carefully curated collection and personalized recommendations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Secure ordering via WhatsApp confirmation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Competitive pricing and exclusive offers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Nationwide delivery across Pakistan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Responsive customer support team</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
