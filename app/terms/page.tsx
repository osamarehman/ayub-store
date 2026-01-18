import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms & Conditions | Bin Ayub",
  description: "Read the terms and conditions for using Bin Ayub website and purchasing products.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: December 22, 2025
      </p>

      <Card className="p-8 mb-6">
        <p className="text-muted-foreground">
          Welcome to Bin Ayub. By accessing or using our website (binayub.com) and purchasing
          our products, you agree to be bound by these Terms and Conditions. Please read them
          carefully before using our services.
        </p>
      </Card>

      <div className="space-y-6">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms
              and Conditions and our Privacy Policy. If you do not agree with any part of these terms,
              you must not use our website or services.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>
          <div className="text-muted-foreground space-y-3">
            <p>You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the website</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Use automated systems (bots, scrapers) without our prior written permission</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Impersonate any person or entity, or falsely state your affiliation</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">3. Product Information</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              We strive to provide accurate product descriptions, images, and pricing. However:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Product colors may vary slightly due to screen settings</li>
              <li>We reserve the right to correct pricing errors or inaccuracies</li>
              <li>Product availability is subject to change without notice</li>
              <li>All products are 100% authentic and sourced from authorized distributors</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
          <div className="text-muted-foreground space-y-3">
            <h3 className="font-semibold text-foreground">Order Placement</h3>
            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel any order for any reason</li>
              <li>Order confirmation via WhatsApp is required before processing</li>
            </ul>

            <h3 className="font-semibold text-foreground">Payment Terms</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>We accept prepaid orders only - no cash on delivery</li>
              <li>Payment must be received before order shipment</li>
              <li>Prices are in Pakistani Rupees (PKR) and include applicable taxes</li>
              <li>Promotional prices are valid for the specified period only</li>
              <li>We reserve the right to change prices without prior notice</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
          <div className="text-muted-foreground space-y-3">
            <ul className="list-disc ml-6 space-y-2">
              <li>We ship to addresses within Pakistan only</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Tracking information will be provided within 24 hours of order confirmation</li>
              <li>Risk of loss passes to you upon delivery to the courier</li>
              <li>We are not responsible for delays caused by courier services or force majeure</li>
              <li>You must inspect packages upon delivery and report damages immediately</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
          <div className="text-muted-foreground space-y-3">
            <p>Our return policy allows returns under specific conditions:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Products must be unused, unopened, and in original packaging</li>
              <li>Returns must be initiated within 7 days of delivery</li>
              <li>Opened or used perfumes cannot be returned due to hygiene reasons</li>
              <li>Return shipping costs are the customer's responsibility (unless defective)</li>
              <li>Refunds are processed within 7-10 business days after return verification</li>
              <li>We reserve the right to refuse returns that don't meet our criteria</li>
            </ul>
            <p className="mt-3">
              For complete details, please review our <a href="/shipping" className="text-primary hover:underline">Shipping & Returns Policy</a>.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              All content on this website, including text, graphics, logos, images, and software,
              is the property of Bin Ayub or its licensors and is protected by copyright and
              intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Reproduce, distribute, or display any content without our written permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Create derivative works from our website content</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">8. User Accounts</h2>
          <div className="text-muted-foreground space-y-3">
            <p>When you create an account with us, you must:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              Our website and products are provided "as is" without any warranties, express or implied,
              including but not limited to:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of information</li>
              <li>Uninterrupted or error-free website operation</li>
              <li>Results from using our products</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              To the maximum extent permitted by law, Bin Ayub shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to
              loss of profits, data, or goodwill, arising from:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Your use or inability to use our website or products</li>
              <li>Unauthorized access to your personal information</li>
              <li>Errors or omissions in website content</li>
              <li>Third-party conduct or content</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <div className="text-muted-foreground">
            <p>
              You agree to indemnify and hold harmless Bin Ayub, its officers, directors, employees,
              and agents from any claims, damages, losses, liabilities, and expenses arising from your
              violation of these Terms or misuse of our website or services.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <div className="text-muted-foreground">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Pakistan.
              Any disputes arising from these Terms or use of our website shall be subject to the
              exclusive jurisdiction of the courts of Pakistan.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">13. Modification of Terms</h2>
          <div className="text-muted-foreground">
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective
              immediately upon posting to this page. Your continued use of the website after changes
              constitutes acceptance of the modified Terms. We encourage you to review these Terms
              periodically.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
          <div className="text-muted-foreground">
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining
              provisions shall continue in full force and effect.
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-primary/5">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="text-muted-foreground space-y-2">
            <p>
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className="mt-4 space-y-1">
              <p><strong>Email:</strong> support@binayub.com</p>
              <p><strong>WhatsApp:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
              <p><strong>Website:</strong> https://binayub.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
