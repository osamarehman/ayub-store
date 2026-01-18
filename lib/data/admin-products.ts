import { prisma } from "@/lib/db/prisma";
import { ProductFormData } from "@/lib/validations/product";

/**
 * Check if a product slug already exists
 * @param slug - The slug to check
 * @param excludeProductId - Optional product ID to exclude (for updates)
 * @returns true if slug exists, false otherwise
 */
export async function checkSlugExists(
  slug: string,
  excludeProductId?: string
): Promise<boolean> {
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existingProduct) return false;
  if (excludeProductId && existingProduct.id === excludeProductId) return false;
  return true;
}

/**
 * Generate a unique slug by appending a number if the base slug already exists
 * @param baseSlug - The base slug to make unique
 * @param excludeProductId - Optional product ID to exclude (for updates)
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  excludeProductId?: string
): Promise<string> {
  // First check if the base slug is available
  const baseExists = await checkSlugExists(baseSlug, excludeProductId);
  if (!baseExists) return baseSlug;

  // Find all slugs that start with the base slug
  const existingSlugs = await prisma.product.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
      ...(excludeProductId && { id: { not: excludeProductId } }),
    },
    select: { slug: true },
  });

  const slugSet = new Set(existingSlugs.map((p) => p.slug));

  // Find the next available number
  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  while (slugSet.has(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createProduct(data: ProductFormData) {
  // Calculate base price from variants (use the lowest variant price)
  const variantPrices = data.variants.map((v) => parseFloat(v.price));
  const lowestPrice = Math.min(...variantPrices);
  const basePrice = data.basePrice ? parseFloat(data.basePrice) : lowestPrice;
  const salePrice = data.salePrice ? parseFloat(data.salePrice) : null;

  // Create the product
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      brand: data.brand,
      gender: data.gender,
      basePrice: basePrice,
      salePrice: salePrice,
      mainImage: data.mainImage,
      images: data.images,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      tags: data.tags || [],
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    },
  });

  // Create variants
  if (data.variants && data.variants.length > 0) {
    await Promise.all(
      data.variants.map((variant) =>
        prisma.productVariant.create({
          data: {
            productId: product.id,
            size: variant.size,
            price: parseFloat(variant.price),
            sku: variant.sku,
            stock: parseInt(variant.stock),
          },
        })
      )
    );
  }

  // Link categories
  if (data.categories && data.categories.length > 0) {
    await Promise.all(
      data.categories.map((categoryId) =>
        prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId,
          },
        })
      )
    );
  }

  return product;
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  // Convert Decimal fields to numbers for JSON serialization
  return products.map((product) => ({
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
  }));
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
  return product;
}

export async function updateProduct(id: string, data: ProductFormData) {
  // Calculate base price from variants (use the lowest variant price)
  const variantPrices = data.variants.map((v) => parseFloat(v.price));
  const lowestPrice = Math.min(...variantPrices);
  const basePrice = data.basePrice ? parseFloat(data.basePrice) : lowestPrice;
  const salePrice = data.salePrice ? parseFloat(data.salePrice) : null;

  // Update the product
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      brand: data.brand,
      gender: data.gender,
      basePrice: basePrice,
      salePrice: salePrice,
      mainImage: data.mainImage,
      images: data.images,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      tags: data.tags || [],
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    },
  });

  // Delete existing variants and recreate
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  if (data.variants && data.variants.length > 0) {
    await Promise.all(
      data.variants.map((variant) =>
        prisma.productVariant.create({
          data: {
            productId: product.id,
            size: variant.size,
            price: parseFloat(variant.price),
            sku: variant.sku,
            stock: parseInt(variant.stock),
          },
        })
      )
    );
  }

  // Delete existing categories and recreate
  await prisma.productCategory.deleteMany({ where: { productId: id } });
  if (data.categories && data.categories.length > 0) {
    await Promise.all(
      data.categories.map((categoryId) =>
        prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId,
          },
        })
      )
    );
  }

  return product;
}

export async function deleteProduct(id: string) {
  // Delete related records first
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productCategory.deleteMany({ where: { productId: id } });

  // Delete the product
  await prisma.product.delete({ where: { id } });
}
