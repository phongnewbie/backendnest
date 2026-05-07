import { PrismaClient, UserRole, BrandCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('password123', 10);
  const imageUrl =
    'https://scr.vn/wp-content/uploads/2020/07/H%C3%ACnh-%E1%BA%A3nh-phong-c%E1%BA%A3nh-y%C3%AAn-b%C3%ACnh.jpg';

  console.log('Seeding started...');

  // 1. Create Default Users
  await prisma.user.upsert({
    where: { phone: '0901234567' },
    update: {},
    create: {
      id: 'u1',
      phone: '0901234567',
      fullName: 'Nguyễn Văn A',
      password,
      role: UserRole.USER,
    },
  });

  await prisma.user.upsert({
    where: { phone: '0900000000' },
    update: {},
    create: {
      id: 'u2',
      phone: '0900000000',
      fullName: 'Hệ thống Admin',
      password,
      role: UserRole.ADMIN,
    },
  });

  const u3 = await prisma.user.upsert({
    where: { phone: '0901111111' },
    update: {},
    create: {
      id: 'u3',
      phone: '0901111111',
      fullName: 'Chủ Doanh Nghiệp',
      password,
      role: UserRole.BUSINESS,
    },
  });

  // 2. Create Default Business
  const b1 = await prisma.business.upsert({
    where: { id: 'b1' },
    update: {},
    create: {
      id: 'b1',
      name: 'ACTA Corp',
      description: 'A leading tech company',
      email: 'contact@acta.com',
      phone: '+84123456789',
      address: '123 Nguyen Hue, Dist 1, HCMC',
      website: 'https://acta.vn',
      logoUrl: imageUrl,
      userId: u3.id,
    },
  });

  // Add more brands and places for business b1
  for (let i = 1; i <= 15; i++) {
    const brId = `br-b1-extra-${i}`;
    await prisma.brand.upsert({
      where: { id: brId },
      update: {},
      create: {
        id: brId,
        name: `Brand Extra ${i} of ACTA Corp`,
        logoUrl: imageUrl,
        description: `Description for brand extra ${i}`,
        category: BrandCategory.COFFEE,
        businessId: b1.id,
      },
    });

    for (let j = 1; j <= 4; j++) {
      const pId = `p-${brId}-${j}`;
      await prisma.place.upsert({
        where: { id: pId },
        update: {},
        create: {
          id: pId,
          name: `Store ${j} - Brand Extra ${i}`,
          address: `${i * 5 + j} Extra St, HCMC`,
          latitude: 10.75 + Math.random() * 0.05,
          longitude: 106.65 + Math.random() * 0.05,
          checkInRadius: 500,
          openTime: '09:00',
          closeTime: '21:00',
          phoneNumber: `0289${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0')}`,
          images: [imageUrl],
          brandId: brId,
        },
      });
    }
  }

  // 3. Generate 20 more Business Users & Businesses
  for (let i = 4; i <= 23; i++) {
    const uId = `u${i}`;
    const bId = `b${i}`;
    const phone = `090${i.toString().padStart(7, '0')}`;

    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        id: uId,
        phone,
        fullName: `Owner of Business ${i - 3}`,
        password,
        role: UserRole.BUSINESS,
      },
    });

    const business = await prisma.business.upsert({
      where: { id: bId },
      update: {},
      create: {
        id: bId,
        name: `Business ${i - 3}`,
        description: `Description for business ${i - 3}`,
        email: `contact${i}@business.com`,
        phone: `028${i.toString().padStart(7, '0')}`,
        address: `${i} Le Loi, District ${i % 12 || 1}, HCMC`,
        website: `https://business${i}.vn`,
        logoUrl: imageUrl,
        userId: user.id,
      },
    });

    // Each Business has 2 Brands
    for (let j = 1; j <= 2; j++) {
      const brId = `br-${bId}-${j}`;
      await prisma.brand.upsert({
        where: { id: brId },
        update: {},
        create: {
          id: brId,
          name: `Brand ${j} of ${business.name}`,
          logoUrl: imageUrl,
          description: `Best brand ${j}`,
          category:
            j % 2 === 0 ? BrandCategory.RESTAURANT : BrandCategory.COFFEE,
          businessId: bId,
        },
      });

      // Each Brand has 4 Places
      for (let k = 1; k <= 4; k++) {
        const pId = `p-${brId}-${k}`;
        await prisma.place.upsert({
          where: { id: pId },
          update: {},
          create: {
            id: pId,
            name: `Store ${k} - Brand ${j} of ${business.name}`,
            address: `${k * 10} Street, HCMC`,
            latitude: 10.7 + Math.random() * 0.1,
            longitude: 106.6 + Math.random() * 0.1,
            checkInRadius: 500,
            openTime: '08:00',
            closeTime: '22:00',
            phoneNumber: `028${Math.floor(Math.random() * 10000000)}`,
            images: [imageUrl],
            brandId: brId,
          },
        });

        // Each Place has 1 Offer
        await prisma.offer.upsert({
          where: { id: `o-${pId}` },
          update: {},
          create: {
            id: `o-${pId}`,
            title: `Discount 20% at Store ${k}`,
            description: 'Apply for all drinks',
            terms: 'No combo',
            validFrom: new Date(),
            validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            placeId: pId,
          },
        });
      }
    }
  }

  // 4. Add some normal users
  for (let i = 24; i <= 50; i++) {
    const phone = `091${i.toString().padStart(7, '0')}`;
    await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        id: `u${i}`,
        phone,
        fullName: `Regular User ${i}`,
        password,
        role: UserRole.USER,
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
