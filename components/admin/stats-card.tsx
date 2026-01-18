import { Card } from "@/components/ui";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            variant === "warning"
              ? "bg-warning/10"
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              variant === "warning" ? "text-warning" : "text-primary"
            )}
          />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p className="text-sm text-muted-foreground mt-2">{trend}</p>
        )}
      </div>
    </Card>
  );
}
