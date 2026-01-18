import { z } from "zod";

export const productVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.string().min(1, "Price is required"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.string().min(1, "Stock is required"),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).optional(),
  // basePrice/salePrice are auto-calculated from variants
  // Kept for backward compatibility but not shown in form
  basePrice: z.string().optional(),
  salePrice: z.string().optional(),
  mainImage: z.string().min(1, "Main image is required"),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categories: z.array(z.string()).default([]),
  // At least one variant is required - pricing is on variants
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductVariantData = z.infer<typeof productVariantSchema>;
