import { Card } from "@/components/ui";

export function ProductGridSkeleton() {
  return (
    <div>
      {/* Results Count Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        <div className="h-9 w-40 bg-muted animate-pulse rounded" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {/* Image Skeleton */}
            <div className="aspect-square bg-muted animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
