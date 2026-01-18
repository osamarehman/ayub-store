import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getAllCategories } from "@/lib/data/admin-products";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Add New Product | Admin",
  description: "Add a new product to the store",
};

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await getAllCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product listing for your store
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
