import Link from "next/link";
import { Container } from "@/components/ui";
import { siteConfig } from "@/lib/config/site";
import { MessageCircle, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const footerLinks = {
    shop: [
      { label: "All Products", href: "/products" },
      { label: "Featured", href: "/products?featured=true" },
      { label: "New Arrivals", href: "/products?tag=new" },
      { label: "Best Sellers", href: "/products?tag=bestseller" },
      { label: "On Sale", href: "/products?tag=sale" },
    ],
    categories: [
      { label: "Electronics", href: "/products?category=electronics" },
      { label: "Fashion", href: "/products?category=fashion" },
      { label: "Home & Living", href: "/products?category=home-living" },
      { label: "Beauty", href: "/products?category=beauty" },
      { label: "Sports", href: "/products?category=sports" },
    ],
    help: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="border-t bg-muted/50">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">BY</span>
              </div>
              <span className="font-bold text-xl text-gradient">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Quality products for every need. Find everything you&apos;re looking for.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-success/10 text-success hover:bg-success hover:text-white transition-smooth"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Help & Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-border/50">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="block text-xs text-muted-foreground hover:text-primary transition-smooth py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">
                WhatsApp: {siteConfig.whatsappNumber}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
