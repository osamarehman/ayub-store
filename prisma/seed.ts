import { prisma } from "../lib/db/prisma";
import { categories, products } from "./seed-data";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clean existing data (in development only)
  if (process.env.NODE_ENV !== "production") {
    console.log("🧹 Cleaning existing data...");
    await prisma.review.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log("✅ Existing data cleaned\n");
  }

  // Seed Categories
  console.log("📁 Seeding categories...");
  const categoryMap = new Map();
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });
    categoryMap.set(category.name, created.id);
    console.log(`  ✓ Created category: ${category.name}`);
  }
  console.log(`✅ Created ${categories.length} categories\n`);

  // Seed Products
  console.log("📦 Seeding products...");
  for (const product of products) {
    // Create product
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        description: product.description,
        basePrice: product.basePrice,
        mainImage: product.mainImage,
        images: product.images,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      },
    });

    // Create product variants
    for (const variant of product.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: variant.size,
          price: variant.price,
          sku: variant.sku,
          stock: variant.stock,
        },
      });
    }

    // Link categories
    for (const categoryName of product.categories) {
      const categoryId = categoryMap.get(categoryName);
      if (categoryId) {
        await prisma.productCategory.create({
          data: {
            productId: createdProduct.id,
            categoryId: categoryId,
          },
        });
      }
    }

    console.log(`  ✓ Created product: ${product.name} with ${product.variants.length} variants`);
  }
  console.log(`✅ Created ${products.length} products\n`);

  // Create sample admin user (password should be hashed in production)
  console.log("👤 Creating sample admin user...");
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@binayub.com" },
    update: {},
    create: {
      email: "admin@binayub.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}\n`);

  console.log("🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`  • ${categories.length} categories`);
  console.log(`  • ${products.length} products`);
  console.log(`  • ${products.reduce((acc, p) => acc + p.variants.length, 0)} product variants`);
  console.log(`  • 1 admin user\n`);
  console.log("🔐 Admin credentials:");
  console.log("  Email: admin@binayub.com");
  console.log("  Password: admin123\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
