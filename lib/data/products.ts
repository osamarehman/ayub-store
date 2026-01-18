import { prisma } from "@/lib/db/prisma";
import type {
  ProductFilters,
  ProductSort,
  PaginationParams,
  ProductListResponse,
  ProductListItem,
  ProductWithRelations,
} from "@/lib/types/product";
import type { Prisma } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 12;

/**
 * Helper to serialize product data for Client Components
 * Converts Prisma Decimal objects to plain numbers
 */
function serializeProduct<T extends { basePrice?: any; salePrice?: any; variants?: any[] }>(
  product: T
): T {
  return {
    ...product,
    basePrice: product.basePrice ? Number(product.basePrice) : product.basePrice,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    variants: product.variants?.map((v: any) => ({
      ...v,
      price: v.price ? Number(v.price) : v.price,
    })),
  };
}

/**
 * Helper to serialize an array of products
 */
function serializeProducts<T extends { basePrice?: any; salePrice?: any; variants?: any[] }>(
  products: T[]
): T[] {
  return products.map(serializeProduct);
}

/**
 * Get products with filtering, sorting, and pagination
 */
export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = { field: "createdAt", direction: "desc" },
  pagination: PaginationParams = {}
): Promise<ProductListResponse> {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = pagination;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  // Search filter
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Gender filter
  if (filters.gender) {
    where.gender = filters.gender as any;
  }

  // Category filter
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    where.categories = {
      some: {
        categoryId: { in: filters.categoryIds },
      },
    };
  }

  // Price range filter
  if (filters.priceRange) {
    where.variants = {
      some: {
        price: {
          gte: filters.priceRange.min,
          lte: filters.priceRange.max,
        },
      },
    };
  }

  // Featured filter
  if (filters.featured !== undefined) {
    where.isFeatured = filters.featured;
  }

  // In stock filter
  if (filters.inStock) {
    where.variants = {
      some: {
        stock: { gt: 0 },
        isActive: true,
      },
    };
  }

  // Build orderBy
  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sort.field === "price") {
    // Sort by minimum variant price
    orderBy.basePrice = sort.direction;
  } else {
    orderBy[sort.field] = sort.direction;
  }

  // Execute queries in parallel
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        brand: true,
        gender: true,
        basePrice: true,
        salePrice: true,
        mainImage: true,
        images: true,
        isActive: true,
        isFeatured: true,
        tags: true,
        metaTitle: true,
        metaDescription: true,
        createdAt: true,
        updatedAt: true,
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            size: true,
            price: true,
            stock: true,
          },
          orderBy: { price: "asc" },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: serializeProducts(products) as ProductListItem[],
    total,
    page,
    pageSize: limit,
    totalPages,
  };
}

/**
 * Get a single product by slug with all relations
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Transform the data to match our type and serialize Decimals
  return serializeProduct({
    ...product,
    categories: product.categories.map((pc) => pc.category),
  }) as ProductWithRelations;
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      brand: true,
      gender: true,
      basePrice: true,
      salePrice: true,
      mainImage: true,
      images: true,
      isActive: true,
      isFeatured: true,
      tags: true,
      metaTitle: true,
      metaDescription: true,
      createdAt: true,
      updatedAt: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          size: true,
          price: true,
          stock: true,
        },
        orderBy: { price: "asc" },
      },
    },
  });

  return serializeProducts(products) as ProductListItem[];
}

/**
 * Get products by tag
 */
export async function getProductsByTag(
  tag: string,
  limit: number = 8
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      tags: {
        has: tag,
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      brand: true,
      gender: true,
      basePrice: true,
      salePrice: true,
      mainImage: true,
      images: true,
      isActive: true,
      isFeatured: true,
      tags: true,
      metaTitle: true,
      metaDescription: true,
      createdAt: true,
      updatedAt: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          size: true,
          price: true,
          stock: true,
        },
        orderBy: { price: "asc" },
      },
    },
  });

  return serializeProducts(products) as ProductListItem[];
}

/**
 * Get all categories with product count
 */
export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: {
              product: {
                isActive: true,
              },
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    ...category,
    productCount: category._count.products,
  }));
}

/**
 * Get related products based on categories and gender
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<ProductListItem[]> {
  // First get the current product's categories and gender
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      gender: true,
      categories: {
        select: { categoryId: true },
      },
    },
  });

  if (!currentProduct) {
    return [];
  }

  const categoryIds = currentProduct.categories.map((pc) => pc.categoryId);

  // Build where clause - related by category, or by gender if same
  const orConditions: Prisma.ProductWhereInput[] = [];

  if (categoryIds.length > 0) {
    orConditions.push({
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    });
  }

  if (currentProduct.gender) {
    orConditions.push({
      gender: currentProduct.gender,
    });
  }

  // Find products with similar categories or same gender
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId }, // Exclude current product
      ...(orConditions.length > 0 ? { OR: orConditions } : {}),
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      brand: true,
      gender: true,
      basePrice: true,
      mainImage: true,
      images: true,
      isActive: true,
      isFeatured: true,
      metaTitle: true,
      metaDescription: true,
      createdAt: true,
      updatedAt: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          size: true,
          price: true,
          stock: true,
        },
        orderBy: { price: "asc" },
      },
    },
  });

  return serializeProducts(products) as ProductListItem[];
}

/**
 * Get product by ID (used internally)
 */
export async function getProductById(
  id: string
): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return serializeProduct({
    ...product,
    categories: product.categories.map((pc) => pc.category),
  }) as ProductWithRelations;
}

/**
 * Search products by query string
 */
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      brand: true,
      gender: true,
      basePrice: true,
      mainImage: true,
      images: true,
      isActive: true,
      isFeatured: true,
      metaTitle: true,
      metaDescription: true,
      createdAt: true,
      updatedAt: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          size: true,
          price: true,
          stock: true,
        },
        orderBy: { price: "asc" },
      },
    },
  });

  return serializeProducts(products) as ProductListItem[];
}
