/**
 * Format text to title case (capitalize first letter of each word)
 * Handles comma-separated values, underscores, and hyphens
 */
export function toTitleCase(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(/[,\s]+/) // Split by comma or whitespace
    .map((word) =>
      word
        .split(/[-_]/) // Also handle hyphens and underscores
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-")
    )
    .join(", ");
}

/**
 * Format price in PKR currency
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

/**
 * Format date for Pakistan locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `BY-${timestamp}-${randomStr}`.toUpperCase();
}
