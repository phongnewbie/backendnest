import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create test user
  await prisma.user.upsert({
    where: { phone: '0987654321' },
    update: {},
    create: {
      phone: '0987654321',
      fullName: 'Test User',
    },
  });

  // Create test business
  const business = await prisma.business.create({
    data: {
      name: 'ACTA Partner Group',
      description: 'Tập đoàn đối tác chiến lược của ACTA',
      email: 'contact@acta.vn',
      phone: '0123456789',
    },
  });

  // Create test brands
  const brand1 = await prisma.brand.create({
    data: {
      name: 'Coffee House',
      description: 'Chuỗi cà phê hiện đại',
      businessId: business.id,
    },
  });

  const brand2 = await prisma.brand.create({
    data: {
      name: 'Fashion Hub',
      description: 'Thời trang cao cấp',
      businessId: business.id,
    },
  });

  // Create test places
  await prisma.place.createMany({
    data: [
      {
        name: 'Coffee House - Quận 1',
        address: '123 Lê Lợi, Quận 1, TP. HCM',
        latitude: 10.771971,
        longitude: 10.698264,
        brandId: brand1.id,
        phoneNumber: '0281234567',
      },
      {
        name: 'Coffee House - Quận 3',
        address: '456 Võ Văn Tần, Quận 3, TP. HCM',
        latitude: 10.7766,
        longitude: 10.6822,
        brandId: brand1.id,
        phoneNumber: '0287654321',
      },
      {
        name: 'Fashion Hub - Flagship Store',
        address: '789 Đồng Khởi, Quận 1, TP. HCM',
        latitude: 10.7758,
        longitude: 10.7029,
        brandId: brand2.id,
        phoneNumber: '0289999999',
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
