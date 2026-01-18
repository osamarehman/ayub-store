/**
 * Seed Data for Bin Ayub General Store
 * General product categories and sample products
 */

export const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smartphones, accessories, and gadgets",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor, and kitchen items",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, makeup, and personal care",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports equipment and activewear",
  },
  {
    name: "Books",
    slug: "books",
    description: "Books, stationery, and educational items",
  },
];

export const products = [
  {
    name: "Wireless Bluetooth Earbuds",
    slug: "wireless-bluetooth-earbuds",
    brand: "Bin Ayub",
    description:
      "Premium wireless earbuds with active noise cancellation. Perfect for music lovers and professionals on the go.",
    basePrice: 4500,
    mainImage: "/uploads/products/earbuds.jpg",
    images: [
      "/uploads/products/earbuds-1.jpg",
      "/uploads/products/earbuds-2.jpg",
    ],
    isActive: true,
    isFeatured: true,
    categories: ["Electronics"],
    variants: [
      { size: "Standard", price: 4500, sku: "BY-EAR-STD", stock: 25 },
      { size: "Premium", price: 7500, sku: "BY-EAR-PRE", stock: 15 },
    ],
  },
  {
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    brand: "Bin Ayub",
    description:
      "Feature-rich smartwatch with health monitoring, notifications, and fitness tracking capabilities.",
    basePrice: 8500,
    mainImage: "/uploads/products/smartwatch.jpg",
    images: [
      "/uploads/products/smartwatch-1.jpg",
    ],
    isActive: true,
    isFeatured: true,
    categories: ["Electronics"],
    variants: [
      { size: "40mm", price: 8500, sku: "BY-SW-40", stock: 12 },
      { size: "44mm", price: 9500, sku: "BY-SW-44", stock: 8 },
    ],
  },
  {
    name: "Cotton T-Shirt",
    slug: "cotton-t-shirt",
    brand: "Bin Ayub",
    description:
      "Comfortable 100% cotton t-shirt in various colors. Perfect for everyday wear.",
    basePrice: 1500,
    mainImage: "/uploads/products/tshirt.jpg",
    images: [
      "/uploads/products/tshirt-1.jpg",
    ],
    isActive: true,
    isFeatured: true,
    categories: ["Fashion"],
    variants: [
      { size: "S", price: 1500, sku: "BY-TS-S", stock: 30 },
      { size: "M", price: 1500, sku: "BY-TS-M", stock: 40 },
      { size: "L", price: 1500, sku: "BY-TS-L", stock: 35 },
      { size: "XL", price: 1500, sku: "BY-TS-XL", stock: 25 },
    ],
  },
  {
    name: "Leather Wallet",
    slug: "leather-wallet",
    brand: "Bin Ayub",
    description:
      "Premium genuine leather wallet with multiple card slots and coin pocket.",
    basePrice: 2500,
    mainImage: "/uploads/products/wallet.jpg",
    images: [
      "/uploads/products/wallet-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Fashion"],
    variants: [
      { size: "Standard", price: 2500, sku: "BY-WL-STD", stock: 50 },
      { size: "Large", price: 3200, sku: "BY-WL-LRG", stock: 30 },
    ],
  },
  {
    name: "Ceramic Mug Set",
    slug: "ceramic-mug-set",
    brand: "Bin Ayub",
    description:
      "Elegant ceramic mug set of 4. Perfect for coffee or tea lovers.",
    basePrice: 1800,
    mainImage: "/uploads/products/mugs.jpg",
    images: [
      "/uploads/products/mugs-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Home & Living"],
    variants: [
      { size: "Set of 4", price: 1800, sku: "BY-MG-4", stock: 40 },
      { size: "Set of 6", price: 2500, sku: "BY-MG-6", stock: 25 },
    ],
  },
  {
    name: "Decorative Cushion",
    slug: "decorative-cushion",
    brand: "Bin Ayub",
    description:
      "Soft and stylish decorative cushion to enhance your living space.",
    basePrice: 1200,
    mainImage: "/uploads/products/cushion.jpg",
    images: [
      "/uploads/products/cushion-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Home & Living"],
    variants: [
      { size: "16 inch", price: 1200, sku: "BY-CS-16", stock: 35 },
      { size: "18 inch", price: 1500, sku: "BY-CS-18", stock: 28 },
    ],
  },
  {
    name: "Face Moisturizer",
    slug: "face-moisturizer",
    brand: "Bin Ayub",
    description:
      "Hydrating face moisturizer for all skin types. Lightweight and non-greasy formula.",
    basePrice: 1500,
    mainImage: "/uploads/products/moisturizer.jpg",
    images: [
      "/uploads/products/moisturizer-1.jpg",
    ],
    isActive: true,
    isFeatured: true,
    categories: ["Beauty"],
    variants: [
      { size: "50ml", price: 1500, sku: "BY-FM-50", stock: 45 },
      { size: "100ml", price: 2500, sku: "BY-FM-100", stock: 30 },
    ],
  },
  {
    name: "Sunscreen SPF 50",
    slug: "sunscreen-spf-50",
    brand: "Bin Ayub",
    description:
      "High protection sunscreen with SPF 50. Water-resistant formula for outdoor activities.",
    basePrice: 1200,
    mainImage: "/uploads/products/sunscreen.jpg",
    images: [
      "/uploads/products/sunscreen-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Beauty"],
    variants: [
      { size: "50ml", price: 1200, sku: "BY-SS-50", stock: 50 },
      { size: "100ml", price: 2000, sku: "BY-SS-100", stock: 35 },
    ],
  },
  {
    name: "Yoga Mat",
    slug: "yoga-mat",
    brand: "Bin Ayub",
    description:
      "Non-slip yoga mat with cushioning for comfort. Ideal for yoga, pilates, and exercise.",
    basePrice: 2000,
    mainImage: "/uploads/products/yogamat.jpg",
    images: [
      "/uploads/products/yogamat-1.jpg",
    ],
    isActive: true,
    isFeatured: true,
    categories: ["Sports"],
    variants: [
      { size: "Standard", price: 2000, sku: "BY-YM-STD", stock: 40 },
      { size: "Extra Thick", price: 2800, sku: "BY-YM-THK", stock: 25 },
    ],
  },
  {
    name: "Resistance Bands Set",
    slug: "resistance-bands-set",
    brand: "Bin Ayub",
    description:
      "Complete resistance bands set for home workouts. Includes 5 bands of different resistance levels.",
    basePrice: 1500,
    mainImage: "/uploads/products/bands.jpg",
    images: [
      "/uploads/products/bands-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Sports"],
    variants: [
      { size: "5-Band Set", price: 1500, sku: "BY-RB-5", stock: 55 },
    ],
  },
  {
    name: "Self-Help Book Collection",
    slug: "self-help-book-collection",
    brand: "Various",
    description:
      "Curated collection of bestselling self-help and productivity books.",
    basePrice: 3500,
    mainImage: "/uploads/products/books.jpg",
    images: [
      "/uploads/products/books-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Books"],
    variants: [
      { size: "3-Book Set", price: 3500, sku: "BY-BK-3", stock: 20 },
      { size: "5-Book Set", price: 5500, sku: "BY-BK-5", stock: 15 },
    ],
  },
  {
    name: "Premium Notebook",
    slug: "premium-notebook",
    brand: "Bin Ayub",
    description:
      "High-quality hardcover notebook with 200 pages. Perfect for journaling or note-taking.",
    basePrice: 800,
    mainImage: "/uploads/products/notebook.jpg",
    images: [
      "/uploads/products/notebook-1.jpg",
    ],
    isActive: true,
    isFeatured: false,
    categories: ["Books"],
    variants: [
      { size: "A5", price: 800, sku: "BY-NB-A5", stock: 60 },
      { size: "A4", price: 1200, sku: "BY-NB-A4", stock: 40 },
    ],
  },
];
