import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Container } from "@/components/ui";
import { ProductImages } from "@/components/products/product-images";
import { ProductInfo } from "@/components/products/product-info";
import { ProductCard } from "@/components/products/product-card";
import { RichTextContent } from "@/components/ui/rich-text-editor";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.id, 4);

  return (
    <div className="py-12">
      <Container>
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <ProductImages
            mainImage={product.mainImage}
            images={product.images}
            productName={product.name}
          />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <RichTextContent
              content={product.description}
              className="text-muted-foreground"
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
