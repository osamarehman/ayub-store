import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | Bin Ayub",
  description: "Learn how Bin Ayub collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: December 22, 2025
      </p>

      <Card className="p-8 mb-6">
        <p className="text-muted-foreground">
          At Bin Ayub, we are committed to protecting your privacy and ensuring the security
          of your personal information. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you visit our website binayub.com or make a purchase.
        </p>
      </Card>

      <div className="space-y-6">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
              <p className="mb-2">When you place an order or create an account, we may collect:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name and contact information (email, phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Order history and preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
              <p className="mb-2">When you visit our website, we may automatically collect:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website or source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and tracking information</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Improve our website and customer experience</li>
              <li>Send promotional emails (you can opt-out anytime)</li>
              <li>Detect and prevent fraud or unauthorized activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Service Providers:</strong> Courier services for delivery, payment processors, and IT service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
            </ul>
            <p className="mt-4">
              All third-party service providers are required to maintain the confidentiality of your
              information and use it only for the specific purposes we authorize.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
              These measures include:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Secure Socket Layer (SSL) encryption for data transmission</li>
              <li>Secure servers and databases with restricted access</li>
              <li>Regular security assessments and updates</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience,
              analyze site traffic, and understand user preferences. You can control cookie settings
              through your browser, but disabling cookies may affect website functionality.
            </p>
            <p className="mt-3">
              For more details, please read our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at support@binayub.com or via WhatsApp at {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <div className="text-muted-foreground">
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children. If you believe we have inadvertently
              collected information from a child, please contact us immediately.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
          <div className="text-muted-foreground">
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the privacy practices of these external sites. We encourage you to review their
              privacy policies before providing any personal information.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <div className="text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices
              or legal requirements. We will notify you of any material changes by posting the updated
              policy on this page with a new "Last Updated" date. We encourage you to review this
              policy periodically.
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-primary/5">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <div className="text-muted-foreground space-y-2">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
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
