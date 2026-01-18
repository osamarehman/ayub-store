import type { Product, ProductVariant, Category } from "@prisma/client";

export type ProductWithRelations = Product & {
  variants: ProductVariant[];
  categories: Category[];
};

export type ProductListItem = Product & {
  variants: Pick<ProductVariant, "id" | "size" | "price" | "stock">[];
};

export interface ProductFilters {
  search?: string;
  gender?: string;
  categoryIds?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  featured?: boolean;
}

export interface ProductSort {
  field: "name" | "price" | "createdAt";
  direction: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
