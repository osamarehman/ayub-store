"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [selectedGender, setSelectedGender] = useState<string>(
    searchParams.get("gender") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("maxPrice") || ""
  );

  // Update filters in URL
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Gender
    if (selectedGender) {
      params.set("gender", selectedGender);
    } else {
      params.delete("gender");
    }

    // Categories
    params.delete("category");
    selectedCategories.forEach((cat) => {
      params.append("category", cat);
    });

    // Price
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    // Reset to first page
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGender("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedGender || selectedCategories.length > 0 || minPrice || maxPrice;

  return (
    <Card className="p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-3">Gender</h3>
        <div className="space-y-2">
          {["MEN", "WOMEN", "UNISEX"].map((gender) => (
            <label key={gender} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={selectedGender === gender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="mr-2 accent-primary"
              />
              <span className="text-sm capitalize">
                {gender.toLowerCase()}
              </span>
            </label>
          ))}
          {selectedGender && (
            <button
              onClick={() => setSelectedGender("")}
              className="text-xs text-muted-foreground hover:text-primary ml-6"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-sm mb-3">Categories</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== category.id)
                      );
                    }
                  }}
                  className="mr-2 accent-primary"
                />
                <span className="text-sm flex-1">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.productCount})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-3">Price Range (Rs.)</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </Card>
  );
}
