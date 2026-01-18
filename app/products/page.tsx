import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/data/products";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Container } from "@/components/ui";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import type { ProductFilters as Filters, ProductSort } from "@/lib/types/product";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of luxury perfumes and fragrances",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    gender?: string;
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Parse filters from search params
  const filters: Filters = {
    search: params.search,
    gender: params.gender,
    categoryIds: params.category
      ? Array.isArray(params.category)
        ? params.category
        : [params.category]
      : undefined,
    priceRange:
      params.minPrice || params.maxPrice
        ? {
            min: params.minPrice ? parseFloat(params.minPrice) : 0,
            max: params.maxPrice ? parseFloat(params.maxPrice) : 999999,
          }
        : undefined,
  };

  // Parse sort
  const sortParam = params.sort || "createdAt-desc";
  const [field, direction] = sortParam.split("-") as [any, "asc" | "desc"];
  const sort: ProductSort = {
    field: field || "createdAt",
    direction: direction || "desc",
  };

  // Parse pagination
  const page = params.page ? parseInt(params.page) : 1;

  // Fetch data
  const [productsData, categories] = await Promise.all([
    getProducts(filters, sort, { page, limit: 12 }),
    getCategories(),
  ]);

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-muted-foreground">
            Discover our curated selection of luxury fragrances
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid
                products={productsData.products}
                pagination={{
                  page: productsData.page,
                  totalPages: productsData.totalPages,
                  total: productsData.total,
                }}
              />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
