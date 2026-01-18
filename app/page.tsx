import Link from "next/link";
import { Button, Container, Card, Badge } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/data/products";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch featured products and categories from database
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  // Only show categories that have products
  const displayCategories = categories
    .filter((cat) => cat.productCount > 0)
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <Container className="py-20 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slideUp">
              <Badge className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                New Collection 2025
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                Quality Products{" "}
                <span className="text-gradient">For Every Need</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover our curated collection of premium products. From
                electronics to fashion, find everything you need at great prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] animate-scaleIn">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  {/* Placeholder for hero image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 rounded-full blur-2xl"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm border border-border shadow-2xl">
                        <div className="text-6xl font-bold text-gradient">
                          BY
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bin Ayub Quality Products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground px-4">
              Our most popular items, carefully selected for quality and value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              // Get the cheapest variant price
              const minPrice =
                product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => Number(v.price)))
                  : Number(product.basePrice);

              const displayPrice = product.salePrice
                ? Number(product.salePrice)
                : minPrice;

              return (
                <Card
                  key={product.id}
                  hover
                  className="group overflow-hidden cursor-pointer"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <OptimizedImage
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        preset="product"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isFeatured && (
                        <Badge className="absolute top-3 right-3">Featured</Badge>
                      )}
                      {product.salePrice && (
                        <Badge
                          variant="destructive"
                          className="absolute top-3 left-3"
                        >
                          Sale
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-smooth">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">
                            Rs. {displayPrice.toLocaleString()}
                          </p>
                          {product.salePrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              Rs. {minPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {product.variants.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {product.variants.length} options
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {displayCategories.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Shop by Category
              </h2>
              <p className="text-muted-foreground px-4">
                Browse our wide selection of products by category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-muted hover:shadow-xl transition-smooth"
                >
                  {/* Placeholder background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-smooth">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {category.productCount} {category.productCount === 1 ? "Product" : "Products"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 md:p-12 lg:p-16 text-center text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Need Help?
              </h2>
              <p className="text-lg mb-8 opacity-90 px-4">
                Our team is here to help you find exactly what you need.
                Chat with us on WhatsApp for personalized assistance.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <a
                  href="https://wa.me/923472949596"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
