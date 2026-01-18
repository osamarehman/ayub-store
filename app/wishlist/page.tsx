"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";

interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  brand: string;
  basePrice: number;
  variants: {
    id: string;
    size: string;
    price: number;
    stock: number;
  }[];
}

export default function WishlistPage() {
  const { items, removeFavorite, isLoading } = useFavoritesStore();
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        // Fetch product details for each favorite
        const productIds = items.map((item) => item.productId);
        const response = await fetch("/api/products/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [items]);

  const handleRemove = async (productId: string) => {
    await removeFavorite(productId);
  };

  if (loadingProducts || isLoading) {
    return (
      <div className="py-12">
        <Container>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} item${items.length > 1 ? "s" : ""} in your wishlist`}
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding products you love by clicking the heart icon on any product
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const minPrice =
                product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : product.basePrice;
              const inStock = product.variants.some((v) => v.stock > 0);

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <OptimizedImage
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        preset="product"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!inStock && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold">
                        Rs. {minPrice.toLocaleString()}
                      </span>
                      {product.variants.length > 1 && (
                        <span className="text-xs text-muted-foreground">
                          {product.variants.length} sizes
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/products/${product.slug}`} className="flex-1">
                        <Button size="sm" className="w-full" disabled={!inStock}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {inStock ? "View Product" : "Out of Stock"}
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(product.id)}
                        className="text-destructive hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
