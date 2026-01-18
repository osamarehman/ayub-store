import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getAllProducts } from "@/lib/data/admin-products";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
import { Button, Card } from "@/components/ui";
import { ProductCard } from "@/components/admin/product-card";
import { Plus, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Products | Admin",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await getAllProducts();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products yet</h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first product
            </p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
