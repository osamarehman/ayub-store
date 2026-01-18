import type { ProductVariant } from "@prisma/client";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  // Sort variants by price
  const sortedVariants = [...variants].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Select Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {sortedVariants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onVariantChange(variant.id)}
              disabled={isOutOfStock}
              className={`
                relative p-3 border-2 rounded-lg text-center transition-all
                ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="font-semibold text-sm mb-1">{variant.size}</div>
              <div className="text-xs text-muted-foreground">
                Rs. {Number(variant.price).toLocaleString()}
              </div>
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-destructive rotate-12" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
