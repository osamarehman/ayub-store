"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ProductVariantsForm } from "./product-variants-form";
import { ImagePicker, MultiImagePicker } from "./image-picker";
import { ProductFormData, ProductVariantData } from "@/lib/validations/product";
import { generateSlug } from "@/lib/utils/format";
import { ArrowLeft, Save, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import toast from "react-hot-toast";

interface ProductFormProps {
  categories: Array<{ id: string; name: string }>;
  initialData?: Partial<ProductFormData>;
  productId?: string;
  mode?: "create" | "edit";
}

export function ProductForm({
  categories,
  initialData,
  productId,
  mode = "create",
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [currentCategories, setCurrentCategories] = useState(categories);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);
  const slugCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const isSubmitting = useRef(false); // Synchronous guard against multiple submissions

  const defaultFormData: Partial<ProductFormData> = {
    name: "",
    slug: "",
    description: "",
    brand: "",
    gender: undefined,
    mainImage: "",
    images: [],
    isActive: true,
    isFeatured: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    categories: [],
    // At least one variant is required with pricing
    variants: [
      {
        size: "",
        price: "",
        sku: "",
        stock: "0",
      },
    ],
  };

  const [formData, setFormData] = useState<Partial<ProductFormData>>(
    initialData || defaultFormData
  );

  // Check if a slug is available
  const checkSlugAvailability = useCallback(
    async (slug: string) => {
      if (!slug.trim()) {
        setSlugError(null);
        return;
      }

      setCheckingSlug(true);
      try {
        const response = await fetch("/api/admin/products/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            excludeProductId: productId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error checking slug:", data.error);
          return;
        }

        if (!data.available) {
          setSlugError("This slug is already in use. Please choose a different one.");
        } else {
          setSlugError(null);
        }
      } catch (error) {
        console.error("Error checking slug:", error);
      } finally {
        setCheckingSlug(false);
      }
    },
    [productId]
  );

  // Debounced slug check
  const debouncedSlugCheck = useCallback(
    (slug: string) => {
      if (slugCheckTimeout.current) {
        clearTimeout(slugCheckTimeout.current);
      }
      slugCheckTimeout.current = setTimeout(() => {
        checkSlugAvailability(slug);
      }, 500);
    },
    [checkSlugAvailability]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (slugCheckTimeout.current) {
        clearTimeout(slugCheckTimeout.current);
      }
    };
  }, []);

  const handleNameChange = (name: string) => {
    const newSlug = generateSlug(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: newSlug,
    }));
    // Check slug availability when name changes
    if (newSlug) {
      debouncedSlugCheck(newSlug);
    } else {
      setSlugError(null);
    }
  };

  const handleSlugChange = (slug: string) => {
    // Clean the slug: lowercase and replace spaces with hyphens
    const cleanedSlug = slug.toLowerCase().replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      slug: cleanedSlug,
    }));
    // Check slug availability when manually edited
    if (cleanedSlug) {
      debouncedSlugCheck(cleanedSlug);
    } else {
      setSlugError(null);
    }
  };

  const handleGenerateUniqueSlug = async () => {
    if (!formData.slug) return;

    setGeneratingSlug(true);
    try {
      const response = await fetch("/api/admin/products/generate-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseSlug: formData.slug,
          excludeProductId: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to generate unique slug");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        slug: data.slug,
      }));
      setSlugError(null);
      toast.success("Unique slug generated!");
    } catch (error) {
      console.error("Error generating unique slug:", error);
      toast.error("Failed to generate unique slug");
    } finally {
      setGeneratingSlug(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const categories = prev.categories || [];
      const newCategories = categories.includes(categoryId)
        ? categories.filter((id) => id !== categoryId)
        : [...categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setAddingCategory(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create category");
        return;
      }

      toast.success("Category created!");
      setNewCategoryName("");
      setCurrentCategories((prev) => [...prev, data]);
      // Add to selected categories
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), data.id],
      }));
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous guard against multiple rapid submissions
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;

    setLoading(true);
    setErrors({});

    // Clear any pending slug check timeout
    if (slugCheckTimeout.current) {
      clearTimeout(slugCheckTimeout.current);
    }

    // Do a final slug availability check before submitting
    if (formData.slug) {
      try {
        const slugResponse = await fetch("/api/admin/products/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: formData.slug,
            excludeProductId: productId,
          }),
        });
        const slugData = await slugResponse.json();
        if (!slugData.available) {
          setSlugError("This slug is already in use. Please choose a different one.");
          setLoading(false);
          isSubmitting.current = false;
          toast.error("Please fix the slug - it's already in use");
          return;
        }
      } catch (error) {
        console.error("Error checking slug:", error);
      }
    }

    const isEdit = mode === "edit" && productId;
    const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const errorMap: any = {};
          data.details.forEach((error: any) => {
            // For simple paths like "name", "brand", use flat key
            if (error.path.length === 1) {
              errorMap[error.path[0]] = error.message;
            }
            // For nested paths like ["variants", 0, "size"], build nested object
            else if (error.path[0] === "variants" && error.path.length === 3) {
              const [, index, field] = error.path;
              if (!errorMap.variants) {
                errorMap.variants = {};
              }
              if (!errorMap.variants[index]) {
                errorMap.variants[index] = {};
              }
              errorMap.variants[index][field] = { message: error.message };
            }
            // Fallback for other nested paths
            else {
              const path = error.path.join(".");
              errorMap[path] = error.message;
            }
          });
          setErrors(errorMap);
          toast.error("Please fix the validation errors");
        } else {
          toast.error(data.error || `Failed to ${isEdit ? "update" : "create"} product`);
        }
        return;
      }

      toast.success(`Product ${isEdit ? "updated" : "created"} successfully!`);
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} product:`, error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const isEdit = mode === "edit";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Back Button */}
      <Link href="/admin/products">
        <Button type="button" variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      {/* Inactive Product Warning */}
      {!formData.isActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              This product is currently inactive
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Customers cannot see or purchase this product. It will show a 404 page if accessed directly.
              Enable the &quot;Active&quot; toggle below to make it visible on the store.
            </p>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={errors.name}
            required
          />
          <div className="space-y-2">
            <div className="relative">
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                error={slugError || errors.slug}
                hint="URL-friendly version of the name"
                required
              />
              {checkingSlug && (
                <div className="absolute right-3 top-9">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {slugError && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateUniqueSlug}
                disabled={generatingSlug}
                className="text-xs"
              >
                {generatingSlug ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate unique slug"
                )}
              </Button>
            )}
          </div>
          <Input
            label="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            error={errors.brand}
            required
          />
          <Select
            label="Gender (Optional)"
            value={formData.gender || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value ? (e.target.value as "MEN" | "WOMEN" | "UNISEX") : undefined,
              })
            }
            options={[
              { value: "", label: "Not specified" },
              { value: "MEN", label: "Men" },
              { value: "WOMEN", label: "Women" },
              { value: "UNISEX", label: "Unisex" },
            ]}
            error={errors.gender}
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Description</label>
          <RichTextEditor
            content={formData.description || ""}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Write a detailed product description..."
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
        </div>
      </Card>

      {/* Product Status */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Product Status</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Control visibility and featured status
        </p>
        <div className="space-y-4">
          <div
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 transition-colors",
              formData.isActive
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            )}
          >
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded mt-0.5 h-5 w-5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                {formData.isActive ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.isActive
                  ? "This product is visible to customers and available for purchase."
                  : "This product is hidden from customers. They will see a 404 error if they try to access it directly."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="rounded mt-0.5"
            />
            <div>
              <span className="text-sm font-medium">Featured</span>
              <p className="text-xs text-muted-foreground mt-1">
                Display in featured sections on homepage and category pages
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Product Images</h2>
        <div className="space-y-6">
          {/* Main Image */}
          <div>
            <ImagePicker
              label="Main Image *"
              placeholder="Select or upload main product image"
              value={formData.mainImage || ""}
              onChange={(path) => setFormData({ ...formData, mainImage: path })}
            />
            {errors.mainImage && (
              <p className="text-sm text-destructive mt-1">{errors.mainImage}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: 1200x1200px (1:1 square)
            </p>
          </div>

          {/* Additional Images */}
          <div>
            <MultiImagePicker
              label="Additional Images"
              values={formData.images || []}
              onChange={(paths) => setFormData({ ...formData, images: paths })}
              maxImages={8}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Add up to 8 additional product images
            </p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select categories for this product or create a new one
        </p>

        {/* Add New Category */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter new category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            disabled={addingCategory || !newCategoryName.trim()}
            variant="outline"
          >
            {addingCategory ? "Adding..." : "Add Category"}
          </Button>
        </div>

        {currentCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.categories?.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/50">
            No categories yet. Create your first category above.
          </p>
        )}
        {errors.categories && (
          <p className="mt-2 text-sm text-error">{errors.categories}</p>
        )}
      </Card>

      {/* Variants */}
      <Card className="p-6">
        <ProductVariantsForm
          variants={formData.variants || []}
          onChange={(variants) => setFormData({ ...formData, variants })}
          errors={errors}
          productName={formData.name}
          brand={formData.brand}
        />
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Product Tags</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select tags to control where this product appears on the website
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "featured", label: "Featured" },
            { value: "popular", label: "Popular" },
            { value: "new", label: "New Arrival" },
            { value: "bestseller", label: "Best Seller" },
            { value: "sale", label: "On Sale" },
            { value: "limited", label: "Limited Edition" },
          ].map((tag) => (
            <label
              key={tag.value}
              className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.tags?.includes(tag.value)}
                onChange={(e) => {
                  const tags = formData.tags || [];
                  const newTags = e.target.checked
                    ? [...tags, tag.value]
                    : tags.filter((t) => t !== tag.value);
                  setFormData({ ...formData, tags: newTags });
                }}
                className="rounded"
              />
              <span className="text-sm">{tag.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* SEO */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">SEO</h2>
        <div className="space-y-6">
          <Input
            label="Meta Title"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            hint="SEO title for search engines (optional)"
          />
          <Textarea
            label="Meta Description"
            value={formData.metaDescription}
            onChange={(e) =>
              setFormData({ ...formData, metaDescription: e.target.value })
            }
            placeholder="SEO description for search engines..."
            hint="Optional: Helps with search engine visibility"
            className="min-h-24"
          />
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Link href="/admin/products">
          <Button type="button" variant="outline" disabled={loading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={loading || !!slugError || checkingSlug}>
          {loading ? (
            isEdit ? "Updating..." : "Creating..."
          ) : checkingSlug ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking slug...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Product" : "Create Product"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
