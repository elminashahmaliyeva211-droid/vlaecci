/**
 * Seed script - creates default admin and sample data
 * Run: npm run db:seed
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin (admin@vlaecci.com / admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@vlaecci.com' },
    update: {},
    create: {
      email: 'admin@vlaecci.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('Admin created: admin@vlaecci.com / admin123')

  // Create categories
  const serum = await prisma.category.upsert({
    where: { slug: 'serum' },
    update: {},
    create: { name: 'Serum', slug: 'serum' },
  })
  const shampoo = await prisma.category.upsert({
    where: { slug: 'shampoo' },
    update: {},
    create: { name: 'Şampun', slug: 'shampoo' },
  })

  // Create sample products
  await prisma.product.upsert({
    where: { slug: 'serum-growth' },
    update: {},
    create: {
      name: 'Saç Böyümə Serumu',
      slug: 'serum-growth',
      description: 'Saç folikullarını gücləndirən, biotin və keratin ilə zəngin serum. Gündəlik istifadə üçün uyğundur.',
      price: 45.9,
      images: JSON.stringify(['https://placehold.co/600x800/F5F1E9/DED5C8?text=Serum']),
      categoryId: serum.id,
      benefits: JSON.stringify([
        'Biotin və keratin',
        'Saç folikullarını gücləndirir',
        'Dermatoloq təsdiqli',
      ]),
    },
  })

  await prisma.product.upsert({
    where: { slug: 'shampoo-nourishing' },
    update: {},
    create: {
      name: 'Qidalandırıcı Şampun',
      slug: 'shampoo-nourishing',
      description: 'Quru və zəif saçlar üçün sulfatsız, təbii qidalandırıcı şampun.',
      price: 28.5,
      images: JSON.stringify(['https://placehold.co/600x800/F5F1E9/DED5C8?text=Shampoo']),
      categoryId: shampoo.id,
      benefits: JSON.stringify([
        'Sulfatsız formula',
        'Təbii yağlar',
        'Saçı qurutmur',
      ]),
    },
  })

  await prisma.product.upsert({
    where: { slug: 'serum-gentle' },
    update: {},
    create: {
      name: 'Həssas Dəri Serumu',
      slug: 'serum-gentle',
      description: 'Həssas saçlı dəri üçün yumşaq, irritasiya etməyən serum.',
      price: 42.0,
      images: JSON.stringify(['https://placehold.co/600x800/F5F1E9/DED5C8?text=Gentle']),
      categoryId: serum.id,
      benefits: JSON.stringify([
        'Həssas dəri üçün',
        'Aloe vera',
        'Parabensiz',
      ]),
    },
  })

  console.log('Sample products created')

  // Sample discount code
  await prisma.discountCode.upsert({
    where: { code: 'VLAECCI15' },
    update: {},
    create: {
      code: 'VLAECCI15',
      percentage: 15,
      isActive: true,
    },
  })
  console.log('Discount code VLAECCI15 created (15% off)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
