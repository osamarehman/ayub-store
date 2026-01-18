import type { Metadata } from "next";
import { Card } from "@/components/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Bin Ayub",
  description: "Find answers to common questions about ordering, shipping, payments, and more at Bin Ayub.",
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Ordering & Payment",
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse our collection, add items to your cart, and proceed to checkout. Fill in your delivery details and submit your order. Our team will contact you via WhatsApp to confirm your order and share payment details."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept prepaid orders only. After order confirmation via WhatsApp, we'll share our bank account details for direct bank transfer or mobile wallet payment options."
        },
        {
          q: "Do you accept cash on delivery (COD)?",
          a: "Currently, we only accept prepaid orders to ensure authenticity and reduce cancellations. Payment must be confirmed before we ship your order."
        },
        {
          q: "Is my payment information secure?",
          a: "We do not store any payment information on our website. All payment transactions are done through secure banking channels after order confirmation."
        },
        {
          q: "Can I cancel or modify my order?",
          a: "Yes, you can cancel or modify your order before it's shipped. Contact us immediately via WhatsApp if you need to make changes. Once shipped, the order cannot be modified."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Delivery typically takes 2-3 business days for major cities and 3-5 business days for other areas across Pakistan. Remote locations may take up to 7 business days."
        },
        {
          q: "Do you deliver nationwide?",
          a: "Yes! We deliver to all cities and towns across Pakistan."
        },
        {
          q: "What are the shipping charges?",
          a: "We offer FREE shipping on orders above Rs. 5,000. For orders below Rs. 5,000, a flat shipping fee of Rs. 200 applies."
        },
        {
          q: "Will I get a tracking number?",
          a: "Yes! You'll receive a tracking number via WhatsApp and SMS within 24 hours of order confirmation. You can track your shipment in real-time."
        },
        {
          q: "What if I'm not available during delivery?",
          a: "Our courier partner will attempt delivery 2-3 times. If unsuccessful, the package will be held at the local courier office for pickup. You'll be notified via call/SMS."
        }
      ]
    },
    {
      category: "Products & Authenticity",
      questions: [
        {
          q: "Are all your perfumes authentic?",
          a: "Absolutely! We guarantee 100% authentic products sourced directly from authorized distributors. Every bottle is inspected for quality before shipping."
        },
        {
          q: "How do I know if a perfume is original?",
          a: "All our perfumes come with original packaging, batch codes, and authenticity seals. We stand behind the authenticity of every product we sell."
        },
        {
          q: "Do you sell testers or used bottles?",
          a: "No, we only sell brand new, unused, and sealed products. All fragrances are in their original retail packaging."
        },
        {
          q: "What if I receive a fake or damaged product?",
          a: "This is extremely rare, but if it happens, contact us immediately with photos. We'll arrange a full refund or replacement at no cost to you."
        },
        {
          q: "Can I request a sample before buying?",
          a: "We currently don't offer sample services, but we provide detailed descriptions and notes for each fragrance to help you make an informed decision."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We accept returns within 7 days of delivery if the product is unused and in original packaging with intact seals. Used or opened perfumes cannot be returned due to hygiene reasons."
        },
        {
          q: "How do I return a product?",
          a: "Contact us via WhatsApp or email within 7 days with your order number and reason for return. We'll provide return instructions and authorization."
        },
        {
          q: "When will I get my refund?",
          a: "Refunds are processed within 7-10 business days after we receive and verify the returned product. The amount will be credited back to your original payment method."
        },
        {
          q: "Can I exchange a product?",
          a: "Yes, exchanges are possible for unused products in original condition. Contact us to arrange an exchange for a different fragrance or size."
        },
        {
          q: "Who pays for return shipping?",
          a: "Return shipping costs are borne by the customer unless the product is defective or we sent the wrong item. We recommend using a tracked courier service."
        }
      ]
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          q: "Do I need an account to order?",
          a: "No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, and get exclusive offers."
        },
        {
          q: "Is my personal information safe?",
          a: "Yes, we take data privacy seriously. Your information is encrypted and never shared with third parties. Read our Privacy Policy for details."
        },
        {
          q: "How do I track my orders?",
          a: "Log into your account and go to 'My Orders' to see all your order history and tracking information. You'll also receive updates via WhatsApp."
        },
        {
          q: "Can I save multiple addresses?",
          a: "Yes! In your account settings, you can save multiple delivery addresses for faster checkout."
        }
      ]
    },
    {
      category: "Contact & Support",
      questions: [
        {
          q: "How can I contact customer support?",
          a: "You can reach us via WhatsApp at +923472949596 or email at support@binayub.com. We're available Monday-Saturday, 10 AM - 8 PM."
        },
        {
          q: "How quickly do you respond to queries?",
          a: "We typically respond to WhatsApp messages within 1-2 hours during business hours and emails within 24 hours."
        },
        {
          q: "Do you have a physical store?",
          a: "We're an online-only store, which allows us to offer competitive prices and serve customers across Pakistan efficiently."
        },
        {
          q: "Can I visit your warehouse to pick up my order?",
          a: "Currently, we only offer delivery service. Self-pickup is not available at this time."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Find answers to the most common questions about Bin Ayub. Can't find what you're looking for?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
        .
      </p>

      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, faqIndex) => (
                <Card key={faqIndex} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6 mt-8 bg-primary/5">
        <h3 className="font-semibold mb-3">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our customer support team is ready to help you with any questions not covered here.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Contact Support
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            WhatsApp Us
          </a>
        </div>
      </Card>
    </div>
  );
}
