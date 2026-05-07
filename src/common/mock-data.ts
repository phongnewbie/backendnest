import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  QrType,
  OfferStatus,
  UserRole,
  BrandCategory,
  User as PrismaUser,
  Business as PrismaBusiness,
  Brand as PrismaBrand,
  Place as PrismaPlace,
  CheckIn as PrismaCheckIn,
  Review as PrismaReview,
  ReviewReply as PrismaReviewReply,
  Offer as PrismaOffer,
  UserOffer as PrismaUserOffer,
} from '@prisma/client';

export { QrType, OfferStatus, UserRole, BrandCategory };

export type User = PrismaUser;
export type Business = PrismaBusiness;
export type Brand = PrismaBrand;
export type Place = PrismaPlace;
export type CheckIn = PrismaCheckIn;
export type Review = PrismaReview;
export type ReviewReply = PrismaReviewReply;
export type Offer = PrismaOffer;
export type UserOffer = PrismaUserOffer;

class MockDb {
  users: User[] = [];
  businesses: Business[] = [];
  brands: Brand[] = [];
  places: Place[] = [];
  checkins: CheckIn[] = [];
  reviews: Review[] = [];
  reviewReplies: ReviewReply[] = [];
  offers: Offer[] = [];
  userOffers: UserOffer[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const password = bcrypt.hashSync('password123', 10);
    const imageUrl =
      'https://scr.vn/wp-content/uploads/2020/07/H%C3%ACnh-%E1%BA%A3nh-phong-c%E1%BA%A3nh-y%C3%AAn-b%C3%ACnh.jpg';

    // 1. Create Default Users
    this.users.push(
      {
        id: 'u1',
        phone: '0901234567',
        fullName: 'Nguyễn Văn A',
        password,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'u2',
        phone: '0900000000',
        fullName: 'Hệ thống Admin',
        password,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'u3',
        phone: '0901111111',
        fullName: 'Chủ Doanh Nghiệp',
        password,
        role: UserRole.BUSINESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    // 2. Create Default Business
    this.businesses.push({
      id: 'b1',
      name: 'ACTA Corp',
      description: 'A leading tech company',
      email: 'contact@acta.com',
      phone: '+84123456789',
      address: '123 Nguyen Hue, Dist 1, HCMC',
      website: 'https://acta.vn',
      logoUrl: imageUrl,
      userId: 'u3',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add more brands and places for business b1 to test pagination
    for (let i = 1; i <= 15; i++) {
      const brId = `br-b1-extra-${i}`;
      this.brands.push({
        id: brId,
        name: `Brand Extra ${i} of ACTA Corp`,
        logoUrl: imageUrl,
        description: `Description for brand extra ${i}`,
        category: BrandCategory.COFFEE,
        businessId: 'b1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      for (let j = 1; j <= 4; j++) {
        const pId = `p-${brId}-${j}`;
        this.places.push({
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
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 3. Generate 20 more Business Users & Businesses
    for (let i = 4; i <= 23; i++) {
      const uId = `u${i}`;
      const bId = `b${i}`;

      this.users.push({
        id: uId,
        phone: `090${i.toString().padStart(7, '0')}`,
        fullName: `Owner of Business ${i - 3}`,
        password,
        role: UserRole.BUSINESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.businesses.push({
        id: bId,
        name: `Business ${i - 3}`,
        description: `Description for business ${i - 3}`,
        email: `contact${i}@business.com`,
        phone: `028${i.toString().padStart(7, '0')}`,
        address: `${i} Le Loi, District ${i % 12 || 1}, HCMC`,
        website: `https://business${i}.vn`,
        logoUrl: imageUrl,
        userId: uId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Each Business has 2 Brands
      for (let j = 1; j <= 2; j++) {
        const brId = `br-${bId}-${j}`;
        this.brands.push({
          id: brId,
          name: `Brand ${j} of ${this.businesses[this.businesses.length - 1].name}`,
          logoUrl: imageUrl,
          description: `Best brand ${j}`,
          category:
            j % 2 === 0 ? BrandCategory.RESTAURANT : BrandCategory.COFFEE,
          businessId: bId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Each Brand has 4 Places
        for (let k = 1; k <= 4; k++) {
          const pId = `p-${brId}-${k}`;
          this.places.push({
            id: pId,
            name: `Store ${k} - ${this.brands[this.brands.length - 1].name}`,
            address: `${k * 10} Street, HCMC`,
            latitude: 10.7 + Math.random() * 0.1,
            longitude: 106.6 + Math.random() * 0.1,
            checkInRadius: 500,
            openTime: '08:00',
            closeTime: '22:00',
            phoneNumber: `028${Math.floor(Math.random() * 10000000)}`,
            images: [imageUrl],
            brandId: brId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Each Place has 1 Offer
          this.offers.push({
            id: `o-${pId}`,
            title: `Discount 20% at Store ${k}`,
            description: 'Apply for all drinks',
            terms: 'No combo',
            validFrom: new Date(),
            validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            placeId: pId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    // 4. Add some normal users
    for (let i = 24; i <= 50; i++) {
      this.users.push({
        id: `u${i}`,
        phone: `091${i.toString().padStart(7, '0')}`,
        fullName: `Regular User ${i}`,
        password,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  generateId() {
    return randomUUID();
  }
}

export const mockDb = new MockDb();
