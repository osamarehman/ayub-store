import { prisma } from '../lib/db/prisma'

async function main() {
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      mainImage: true,
      images: true,
      slug: true,
    }
  })

  console.log('Products in database:')
  console.log(JSON.stringify(products, null, 2))

  await prisma.$disconnect()
}

main()
