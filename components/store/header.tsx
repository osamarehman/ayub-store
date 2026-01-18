"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Container, Button } from "@/components/ui";
import { siteConfig } from "@/lib/config/site";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { SearchModal } from "./search-modal";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Heart,
  MessageCircle,
  LogOut,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const cartCount = useCartStore((state) => state.getCartCount());
  const favoritesCount = useFavoritesStore((state) => state.getFavoritesCount());

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logos/logo-icon-blue.svg"
              alt="Bin Ayub"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="hidden font-bold sm:inline-block text-xl text-gradient">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="text-sm font-medium transition-smooth text-muted-foreground hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* WhatsApp */}
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-success transition-smooth"
              aria-label="WhatsApp Support"
            >
              <MessageCircle className="h-4 w-4" />
            </a>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              prefetch={false}
              className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Account / Auth */}
            {!session ? (
              <Link href="/login" prefetch={false}>
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden sm:flex h-9"
                >
                  Login
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/account"
                  prefetch={false}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
                  aria-label="Account"
                >
                  <User className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              prefetch={false}
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t animate-slideDown">
            <nav className="flex flex-col gap-1 py-4">
              {siteConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="border-t my-2" />
              <Link
                href="/wishlist"
                prefetch={false}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-smooth flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              {!session ? (
                <Link
                  href="/login"
                  prefetch={false}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-smooth flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/account"
                    prefetch={false}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-smooth flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-smooth flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-success rounded-md transition-smooth flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </a>
            </nav>
          </div>
        )}
      </Container>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
