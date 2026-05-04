import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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
  users: User[] = [
    {
      id: 'u1',
      phone: '0901234567',
      fullName: 'Nguyễn Văn A',
      password: bcrypt.hashSync('password123', 10),
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'u2',
      phone: '0900000000',
      fullName: 'Hệ thống Admin',
      password: bcrypt.hashSync('password123', 10),
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'u3',
      phone: '0901111111',
      fullName: 'Chủ Doanh Nghiệp',
      password: bcrypt.hashSync('password123', 10),
      role: UserRole.BUSINESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  businesses: Business[] = [
    {
      id: 'b1',
      name: 'ACTA Group',
      description: 'Tập đoàn đa ngành',
      email: 'contact@acta.vn',
      phone: '0281234567',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  brands: Brand[] = [
    {
      id: 'br1',
      name: 'Highlands Coffee',
      logoUrl: 'https://minio.acta.vn/public/highlands.png',
      description: 'Cà phê Việt',
      businessId: 'b1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  places: Place[] = [
    {
      id: 'p1',
      name: 'Highlands Coffee Lê Lợi',
      address: '123 Lê Lợi, Quận 1, TP.HCM',
      latitude: 10.776,
      longitude: 106.701,
      openingHours: '07:00 - 22:00',
      phoneNumber: '0287654321',
      images: ['https://minio.acta.vn/public/place1.jpg'],
      brandId: 'br1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  checkins: CheckIn[] = [];
  reviews: Review[] = [];
  reviewReplies: ReviewReply[] = [];
  offers: Offer[] = [
    {
      id: 'o1',
      title: 'Giảm 20% cho hóa đơn trên 100k',
      description: 'Áp dụng cho mọi loại nước',
      terms: 'Không áp dụng cùng CTKM khác',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      placeId: 'p1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  userOffers: UserOffer[] = [];

  generateId() {
    return uuidv4();
  }
}

export const mockDb = new MockDb();
