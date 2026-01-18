"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Pencil, Trash2, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    gender: string;
    basePrice: { toString(): string } | number | string;
    mainImage: string;
    isActive: boolean;
    isFeatured: boolean;
    categories: Array<{
      category: {
        id: string;
        name: string;
      };
    }>;
    variants: Array<{
      id: string;
      size: string;
      price: { toString(): string } | number | string;
      stock: number;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const performDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to delete product");
        return;
      }

      toast.success(`"${product.name}" has been deleted`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toast.custom(
      (t) => (
        <div
          className={cn(
            "bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-md",
            t.visible ? "animate-enter" : "animate-leave"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Delete Product</h4>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to delete <strong>"{product.name}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    performDelete();
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  return (
    <Link href={`/admin/products/${product.id}/edit`}>
      <Card
        className={cn(
          "p-6 hover:shadow-md transition-shadow cursor-pointer",
          !product.isActive && "opacity-80 border-amber-300 bg-amber-50/50"
        )}
      >
        <div className="flex items-start gap-6">
          {/* Product Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <OptimizedImage
              src={product.mainImage}
              alt={product.name}
              fill
              preset="thumbnail"
              className="object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand} - {product.gender}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={product.isActive ? "default" : "destructive"}
                    className={cn(
                      !product.isActive && "flex items-center gap-1"
                    )}
                  >
                    {!product.isActive && <EyeOff className="h-3 w-3" />}
                    {product.isActive ? "Active" : "INACTIVE - Hidden"}
                  </Badge>
                  {product.isFeatured && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                  {product.categories.map((pc) => (
                    <Badge key={pc.category.id} variant="outline">
                      {pc.category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-right mr-4">
                  <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                  <p className="text-xl font-bold">
                    Rs. {Number(product.basePrice).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/admin/products/${product.id}/edit`);
                    }}
                    title="Edit product"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                {product.variants.length} Variant{product.variants.length !== 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="px-3 py-1.5 bg-muted rounded text-sm"
                  >
                    <span className="font-medium">{variant.size}</span>
                    <span className="mx-2">-</span>
                    <span>Rs. {Number(variant.price).toLocaleString()}</span>
                    <span className="mx-2">-</span>
                    <span className="text-muted-foreground">
                      Stock: {variant.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
