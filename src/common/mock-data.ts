import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export enum QrType {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
}

export enum OfferStatus {
  SAVED = 'SAVED',
  USED = 'USED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS',
  USER = 'USER',
}

export interface User {
  id: string;
  phone: string;
  fullName: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  phoneNumber?: string;
  images: string[];
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckIn {
  id: string;
  userId?: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
  deviceInfo?: string;
  isGuest: boolean;
  phone?: string;
  qrType: QrType;
  createdAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  content?: string;
  images: string[];
  userId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewReply {
  id: string;
  content: string;
  reviewId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  terms?: string;
  validFrom: Date;
  validTo: Date;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOffer {
  id: string;
  userId: string;
  offerId: string;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

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
          businessId: bId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Each Brand has 2 Places
        for (let k = 1; k <= 2; k++) {
          const pId = `p-${brId}-${k}`;
          this.places.push({
            id: pId,
            name: `Store ${k} - ${this.brands[this.brands.length - 1].name}`,
            address: `${k * 10} Street, HCMC`,
            latitude: 10.7 + Math.random() * 0.1,
            longitude: 106.6 + Math.random() * 0.1,
            openingHours: '08:00 - 22:00',
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
