import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer, WhatsAppButton } from "@/components/store";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";
import { SessionProvider } from "@/components/providers/session-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { siteConfig } from "@/lib/config/site";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "online shopping",
    "Pakistan store",
    "quality products",
    "electronics",
    "fashion",
    "home goods",
    "beauty products",
    "Bin Ayub",
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logos/logo-icon-blue.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <FavoritesProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </div>
            <Toaster position="bottom-right" />
            <GoogleAnalytics />
          </FavoritesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
