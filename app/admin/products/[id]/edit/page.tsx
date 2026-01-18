import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getAllCategories, getProductById } from "@/lib/data/admin-products";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Edit Product | Admin",
  description: "Edit product details",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!product) {
    notFound();
  }

  // Transform product data for the form
  // Note: basePrice/salePrice are auto-calculated from variants, not edited directly
  const initialData = {
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    brand: product.brand,
    gender: product.gender as "MEN" | "WOMEN" | "UNISEX" | undefined,
    mainImage: product.mainImage,
    images: product.images as string[],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    tags: product.tags as string[],
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
    categories: product.categories.map((pc) => pc.categoryId),
    variants: product.variants.map((v) => ({
      size: v.size,
      price: v.price.toString(),
      sku: v.sku,
      stock: v.stock.toString(),
    })),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details for &quot;{product.name}&quot;
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={initialData}
        productId={id}
        mode="edit"
      />
    </div>
  );
}
