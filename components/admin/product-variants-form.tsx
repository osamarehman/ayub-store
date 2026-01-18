"use client";

import { Button, Input, Card } from "@/components/ui";
import { Plus, Trash2, AlertCircle, Wand2 } from "lucide-react";
import { ProductVariantData } from "@/lib/validations/product";

interface ProductVariantsFormProps {
  variants: ProductVariantData[];
  onChange: (variants: ProductVariantData[]) => void;
  errors?: any;
  productName?: string;
  brand?: string;
}

// Generate SKU from brand, product name, and size
function generateSKU(brand: string, productName: string, size: string, existingSKUs: string[] = []): string {
  const cleanBrand = brand
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);

  const cleanName = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  const cleanSize = size
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  // Generate unique SKU with random suffix
  let attempts = 0;
  let sku: string;
  do {
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    sku = `${cleanBrand}-${cleanName}-${cleanSize}-${randomSuffix}`;
    attempts++;
  } while (existingSKUs.includes(sku) && attempts < 10);

  return sku;
}

export function ProductVariantsForm({
  variants,
  onChange,
  errors,
  productName = "",
  brand = "",
}: ProductVariantsFormProps) {
  const addVariant = () => {
    onChange([
      ...variants,
      {
        size: "",
        price: "",
        sku: "",
        stock: "0",
      },
    ]);
  };

  // Get all existing SKUs in the form (excluding the current index)
  const getExistingSKUs = (excludeIndex?: number): string[] => {
    return variants
      .filter((_, i) => i !== excludeIndex)
      .map((v) => v.sku)
      .filter(Boolean);
  };

  const generateSKUForVariant = (index: number) => {
    const variant = variants[index];
    if (!variant.size || !productName || !brand) return;

    const existingSKUs = getExistingSKUs(index);
    const newSKU = generateSKU(brand, productName, variant.size, existingSKUs);
    const updated = [...variants];
    updated[index] = { ...updated[index], sku: newSKU };
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    // Don't allow removing the last variant
    if (variants.length <= 1) {
      return;
    }
    onChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariantData, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-generate SKU when size is entered and SKU is empty
    if (field === "size" && value && !updated[index].sku && productName && brand) {
      const existingSKUs = getExistingSKUs(index);
      updated[index].sku = generateSKU(brand, productName, value, existingSKUs);
    }

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants & Pricing</h3>
          <p className="text-sm text-muted-foreground">
            Add sizes with their prices. At least one variant is required.
          </p>
        </div>
        <Button type="button" onClick={addVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Info box about pricing */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          <strong>Pricing is per variant.</strong> Each size can have its own price.
          The lowest variant price will be shown as the starting price on the store.
        </p>
      </div>

      {variants.length === 0 && (
        <Card className="p-8 text-center border-dashed border-2">
          <AlertCircle className="h-8 w-8 mx-auto text-amber-500 mb-3" />
          <p className="text-muted-foreground mb-4">
            At least one variant is required with size and price
          </p>
          <Button type="button" onClick={addVariant} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Variant
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-6">
                <span className="text-sm font-semibold text-primary">{index + 1}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Size"
                  placeholder="e.g., 50ml"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  error={errors?.variants?.[index]?.size?.message}
                  required
                />
                <Input
                  label="Price (Rs.)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value)}
                  error={errors?.variants?.[index]?.price?.message}
                  required
                />
                <div className="space-y-1">
                  <div className="flex items-end gap-1">
                    <div className="flex-1">
                      <Input
                        label="SKU"
                        placeholder="Auto-generated"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        error={errors?.variants?.[index]?.sku?.message}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateSKUForVariant(index)}
                      disabled={!variant.size || !productName || !brand}
                      title={!variant.size ? "Enter size first" : !productName || !brand ? "Enter product name and brand first" : "Generate new SKU"}
                      className="mb-[2px] h-10"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", e.target.value)}
                  error={errors?.variants?.[index]?.stock?.message}
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeVariant(index)}
                className="mt-6"
                disabled={variants.length <= 1}
                title={variants.length <= 1 ? "At least one variant is required" : "Remove variant"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
