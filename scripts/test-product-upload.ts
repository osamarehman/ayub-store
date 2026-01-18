/**
 * Test Product Upload Script
 *
 * This script tests the complete product creation flow including image upload
 * Run with: npx tsx scripts/test-product-upload.ts
 */

import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test admin credentials
const ADMIN_EMAIL = 'admin@binayub.com';
const ADMIN_PASSWORD = 'admin123'; // Update if different

async function downloadTestImage(url: string, outputPath: string) {
  console.log(`📥 Downloading test image from ${url}...`);

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const stream = createWriteStream(outputPath);
  await finished(Readable.fromWeb(response.body as any).pipe(stream));

  console.log(`✓ Downloaded to ${outputPath}`);
}

async function loginAsAdmin() {
  console.log('\n🔐 Logging in as admin...');

  const response = await fetch(`${API_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed. Make sure admin user exists and password is correct.');
  }

  const cookies = response.headers.get('set-cookie');
  console.log('✓ Logged in successfully');

  return cookies || '';
}

async function uploadImage(imagePath: string, cookies: string): Promise<string> {
  console.log('\n📤 Uploading image to server...');

  const fileBuffer = await import('fs').then(fs =>
    fs.promises.readFile(imagePath)
  );

  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'test-product.jpg');

  const response = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: {
      'Cookie': cookies,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Upload failed: ${data.error}`);
  }

  console.log(`✓ Image uploaded: ${data.path}`);
  console.log(`  Uploaded to: ${data.uploadedTo}`);

  return data.path;
}

async function createProduct(imagePath: string, cookies: string) {
  console.log('\n📦 Creating test product...');

  const productData = {
    name: `Test Product ${Date.now()}`,
    slug: `test-product-${Date.now()}`,
    description: 'This is a test product created by the upload test script.',
    brand: 'Test Brand',
    basePrice: '5000',
    salePrice: '4500',
    mainImage: imagePath,
    images: [],
    isActive: true,
    isFeatured: false,
    tags: ['test', 'demo', 'sample'],
    metaTitle: 'Test Product - Test Brand',
    metaDescription: 'A test product for testing the upload functionality',
    categories: [], // Will be empty if no categories exist
    variants: [
      {
        size: 'Standard',
        price: '4500',
        sku: `TEST-STD-${Date.now()}`,
        stock: '10',
      },
      {
        size: 'Large',
        price: '7500',
        sku: `TEST-LRG-${Date.now()}`,
        stock: '5',
      },
    ],
  };

  const response = await fetch(`${API_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('❌ Product creation failed:');
    console.error(JSON.stringify(data, null, 2));
    throw new Error(`Failed to create product: ${data.error}`);
  }

  console.log('✓ Product created successfully!');
  console.log(`  Product ID: ${data.id}`);
  console.log(`  Product Slug: ${data.slug}`);
  console.log(`  View at: ${API_URL}/products/${data.slug}`);

  return data;
}

async function main() {
  try {
    console.log('🧪 Test Product Upload Script');
    console.log('================================\n');
    console.log(`API URL: ${API_URL}`);

    // Create temp directory
    const tempDir = join(process.cwd(), 'temp');
    await mkdir(tempDir, { recursive: true });
    const testImagePath = join(tempDir, 'test-product.jpg');

    // Download a test image
    await downloadTestImage(
      'https://picsum.photos/800/600',
      testImagePath
    );

    // Login as admin
    const cookies = await loginAsAdmin();

    // Upload image
    const imagePath = await uploadImage(testImagePath, cookies);

    // Create product
    const product = await createProduct(imagePath, cookies);

    console.log('\n✅ All tests passed!');
    console.log('\nYou can now:');
    console.log(`1. View the product: ${API_URL}/products/${product.slug}`);
    console.log(`2. Edit in admin: ${API_URL}/admin/products`);
    console.log(`3. Check the uploaded image in: public/products/`);

  } catch (error: any) {
    console.error('\n❌ Test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
