"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui";
import type { ProductListItem } from "@/lib/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: ProductListItem[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export function ProductGrid({ products, pagination }: ProductGridProps) {
  const searchParams = useSearchParams();

  // Build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/products?${params.toString()}`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search criteria
        </p>
        <Link href="/products">
          <Button>Clear Filters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * 12 + 1} -{" "}
          {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} products
        </p>

        {/* Sort Dropdown (client-side) */}
        <SortDropdown />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          {pagination.page > 1 ? (
            <Link href={buildPageUrl(pagination.page - 1)}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.page) <= 1;

              if (!showPage) {
                // Show ellipsis
                if (
                  pageNum === pagination.page - 2 ||
                  pageNum === pagination.page + 2
                ) {
                  return (
                    <span key={pageNum} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Link key={pageNum} href={buildPageUrl(pageNum)}>
                  <Button
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Next Button */}
          {pagination.page < pagination.totalPages ? (
            <Link href={buildPageUrl(pagination.page + 1)}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function SortDropdown() {
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page"); // Reset to first page
    window.location.href = `/products?${params.toString()}`;
  };

  const currentSort = searchParams.get("sort") || "createdAt-desc";

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="createdAt-desc">Newest First</option>
      <option value="createdAt-asc">Oldest First</option>
      <option value="name-asc">Name: A-Z</option>
      <option value="name-desc">Name: Z-A</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
