import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Cookie Policy | Bin Ayub",
  description: "Learn about how Bin Ayub uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: December 22, 2025
      </p>

      <Card className="p-8 mb-6">
        <p className="text-muted-foreground">
          This Cookie Policy explains how Bin Ayub ("we", "us", or "our") uses cookies and
          similar technologies on our website binayub.com. By using our website, you consent
          to the use of cookies as described in this policy.
        </p>
      </Card>

      <div className="space-y-6">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              Cookies are small text files that are placed on your device (computer, smartphone,
              or tablet) when you visit a website. They are widely used to make websites work more
              efficiently and provide information to website owners.
            </p>
            <p>
              Cookies allow websites to remember your actions and preferences (such as login status,
              language, font size, and other display preferences) over a period of time, so you don't
              have to keep re-entering them whenever you return to the site.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Essential Cookies</h3>
              <p className="text-muted-foreground">
                These cookies are necessary for the website to function properly. They enable basic
                features like page navigation, secure areas access, and shopping cart functionality.
                Without these cookies, the website cannot function properly.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Examples:</strong> Session cookies, authentication cookies, security cookies
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Functionality Cookies</h3>
              <p className="text-muted-foreground">
                These cookies allow our website to remember choices you make (such as your username,
                language, or region) and provide enhanced, personalized features.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Examples:</strong> Language preferences, font size, display preferences
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Analytics and Performance Cookies</h3>
              <p className="text-muted-foreground">
                These cookies help us understand how visitors interact with our website by collecting
                and reporting information anonymously. This helps us improve our website and services.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Examples:</strong> Google Analytics, page visit tracking, bounce rate analysis
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Marketing and Advertising Cookies</h3>
              <p className="text-muted-foreground">
                These cookies track your browsing habits to show you relevant advertisements. They
                may be set by us or third-party advertising partners.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Examples:</strong> Facebook Pixel, Google Ads cookies, retargeting cookies
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <div className="text-muted-foreground">
            <p className="mb-3">We use cookies for the following purposes:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Authentication:</strong> To identify you when you log in to your account</li>
              <li><strong>Security:</strong> To protect your account and prevent fraud</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Shopping Cart:</strong> To keep track of items in your cart</li>
              <li><strong>Analytics:</strong> To understand how you use our website and improve it</li>
              <li><strong>Marketing:</strong> To show you relevant ads and measure campaign effectiveness</li>
              <li><strong>User Experience:</strong> To provide personalized content and recommendations</li>
            </ul>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <div className="text-muted-foreground space-y-3">
            <p>
              Some cookies on our website are set by third-party services we use. These may include:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Social Media Platforms:</strong> Facebook, Instagram for social sharing and ads</li>
              <li><strong>Payment Processors:</strong> To process secure payments</li>
              <li><strong>Advertising Networks:</strong> To display targeted advertisements</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy policies and cookie policies. We recommend
              reviewing them for more information about their data practices.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
          <div className="text-muted-foreground space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can set
                your browser to reject cookies or delete certain cookies. However, if you disable
                cookies, some features of our website may not function properly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-foreground">How to Manage Cookies:</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-foreground">Opt-Out Tools</h3>
              <p>You can opt-out of specific third-party cookies:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                <li>Facebook: <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Ad Preferences</a></li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Cookie Duration</h2>
          <div className="text-muted-foreground space-y-3">
            <p>Cookies can be either:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
            </ul>
            <p className="mt-3">
              The duration of each cookie varies depending on its purpose, typically ranging from
              a few hours to several months or years.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <div className="text-muted-foreground">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or legal requirements. We will notify you of any material changes by posting the updated
              policy on this page with a new "Last Updated" date.
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-primary/5">
          <h2 className="text-2xl font-semibold mb-4">Questions About Cookies?</h2>
          <div className="text-muted-foreground space-y-2">
            <p>
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="mt-4 space-y-1">
              <p><strong>Email:</strong> support@binayub.com</p>
              <p><strong>WhatsApp:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
              <p><strong>Website:</strong> https://binayub.com</p>
            </div>
            <p className="mt-4">
              For more information about how we handle your personal data, please read our{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
