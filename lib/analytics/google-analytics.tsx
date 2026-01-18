"use client";

import Script from "next/script";

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Analytics event tracking (extensible for future server-side events)
export const analytics = {
  // Track page view
  pageView: (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: url,
      });
    }
  },

  // Track events
  event: ({
    action,
    category,
    label,
    value,
  }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // E-commerce events
  ecommerce: {
    addToCart: (product: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "add_to_cart", {
          currency: "PKR",
          value: product.price * product.quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              quantity: product.quantity,
            },
          ],
        });
      }
    },

    purchase: (order: {
      transactionId: string;
      value: number;
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>;
    }) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
          transaction_id: order.transactionId,
          value: order.value,
          currency: "PKR",
          items: order.items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        });
      }
    },
  },
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
