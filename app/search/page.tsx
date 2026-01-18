import { Suspense } from "react";
import type { Metadata } from "next";
import { searchProducts } from "@/lib/data/products";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Container, Card } from "@/components/ui";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search for products",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Search products
  const products = query ? await searchProducts(query, 20) : [];

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              {products.length} result{products.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          {!query ? (
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Start searching</h2>
              <p className="text-muted-foreground">
                Use the search bar above to find products
              </p>
            </Card>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all products
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Suspense>
      </Container>
    </div>
  );
}
