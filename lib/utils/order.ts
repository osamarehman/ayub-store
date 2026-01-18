/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Calculate shipping cost based on city and total
 */
export function calculateShipping(city: string, total: number): number {
  const SHIPPING_THRESHOLD = 3000;
  const FREE_SHIPPING_CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];

  // Free shipping if total is above threshold
  if (total >= SHIPPING_THRESHOLD) {
    return 0;
  }

  // Major cities - Rs. 200
  if (FREE_SHIPPING_CITIES.includes(city)) {
    return 200;
  }

  // Other cities - Rs. 300
  return 300;
}
