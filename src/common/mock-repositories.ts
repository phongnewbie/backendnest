import { Injectable } from '@nestjs/common';
import { Prisma, User, Business, Brand, Place } from '@prisma/client';
import { mockDb } from './mock-data';
import { IUsersRepository } from '../auth/users.repository.interface';
import {
  IBusinessesRepository,
  BusinessWithBrands,
} from '../businesses/businesses.repository.interface';
import {
  IBrandsRepository,
  BrandWithDetails,
  BrandWithPlaces,
} from '../brands/brands.repository.interface';
import {
  IPlacesRepository,
  PlaceWithBrandAndReviews,
  PlaceWithFullDetails,
} from '../places/places.repository.interface';
import { CreatePlaceDto } from '../places/dto/create-place.dto';
import { UpdatePlaceDto } from '../places/dto/update-place.dto';
import { FindAllPlacesDto } from '../places/dto/find-all-places.dto';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { UpdateBusinessDto } from '../businesses/dto/update-business.dto';

@Injectable()
export class MockUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const newUser: User = {
      id: mockDb.generateId(),
      phone: data.phone,
      fullName: data.fullName,
      password: data.password || '',
      role: data.role || 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.users.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = mockDb.users.find((u) => u.id === id);
    return user || null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = mockDb.users.find((u) => u.phone === phone);
    return user || null;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const index = mockDb.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updated = {
      ...mockDb.users[index],
      ...data,
      updatedAt: new Date(),
    } as User;
    mockDb.users[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<User> {
    const index = mockDb.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    const user = mockDb.users.splice(index, 1)[0];
    return user;
  }
}

@Injectable()
export class MockBusinessesRepository implements IBusinessesRepository {
  async create(data: Prisma.BusinessUncheckedCreateInput): Promise<Business> {
    const newBusiness: Business = {
      id: mockDb.generateId(),
      name: data.name,
      description: data.description ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      website: data.website ?? null,
      logoUrl: data.logoUrl ?? null,
      userId: data.userId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.businesses.push(newBusiness);
    return newBusiness;
  }

  async findAll(
    skip: number,
    limit: number,
  ): Promise<[number, BusinessWithBrands[]]> {
    const businesses = mockDb.businesses.map((b) => ({
      ...b,
      brands: mockDb.brands.filter((br) => br.businessId === b.id),
    })) as BusinessWithBrands[];
    return [businesses.length, businesses.slice(skip, skip + limit)];
  }

  async findById(id: string): Promise<BusinessWithBrands | null> {
    const business = mockDb.businesses.find((b) => b.id === id);
    if (!business) return null;
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }

  async findByUserId(userId: string): Promise<BusinessWithBrands | null> {
    const business = mockDb.businesses.find((b) => b.userId === userId);
    if (!business) return null;
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }

  async update(id: string, data: UpdateBusinessDto): Promise<Business> {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Business not found');
    const updated = {
      ...mockDb.businesses[index],
      ...data,
      updatedAt: new Date(),
    };
    mockDb.businesses[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<Business> {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Business not found');
    const business = mockDb.businesses.splice(index, 1)[0];
    return business;
  }
}

@Injectable()
export class MockBrandsRepository implements IBrandsRepository {
  async create(data: CreateBrandDto): Promise<Brand> {
    const newBrand: Brand = {
      id: mockDb.generateId(),
      name: data.name,
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      category: data.category ?? 'OTHER',
      businessId: data.businessId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.brands.push(newBrand);
    return newBrand;
  }

  async findAll(): Promise<BrandWithDetails[]> {
    return mockDb.brands.map((br) => ({
      ...br,
      business: mockDb.businesses.find(
        (b) => b.id === br.businessId,
      ) as Business,
      places: mockDb.places.filter((p) => p.brandId === br.id),
    }));
  }

  async findMyBrands(
    businessId: string,
    skip: number,
    limit: number,
  ): Promise<[number, BrandWithPlaces[]]> {
    const brands = mockDb.brands.filter((br) => br.businessId === businessId);
    const paginated = brands.slice(skip, skip + limit).map((br) => ({
      ...br,
      places: mockDb.places.filter((p) => p.brandId === br.id),
    })) as BrandWithPlaces[];
    return [brands.length, paginated];
  }

  async findById(id: string): Promise<BrandWithDetails | null> {
    const brand = mockDb.brands.find((br) => br.id === id);
    if (!brand) return null;
    return {
      ...brand,
      business: mockDb.businesses.find(
        (b) => b.id === brand.businessId,
      ) as Business,
      places: mockDb.places.filter((p) => p.brandId === brand.id),
    };
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    const index = mockDb.brands.findIndex((br) => br.id === id);
    if (index === -1) throw new Error('Brand not found');
    const updated = {
      ...mockDb.brands[index],
      ...data,
      updatedAt: new Date(),
    };
    mockDb.brands[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<Brand> {
    const index = mockDb.brands.findIndex((br) => br.id === id);
    if (index === -1) throw new Error('Brand not found');
    const brand = mockDb.brands.splice(index, 1)[0];
    return brand;
  }
}

@Injectable()
export class MockPlacesRepository implements IPlacesRepository {
  async create(data: CreatePlaceDto): Promise<Place> {
    const newPlace: Place = {
      id: mockDb.generateId(),
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      checkInRadius: data.checkInRadius ?? 500,
      openTime: data.openTime ?? null,
      closeTime: data.closeTime ?? null,
      phoneNumber: data.phoneNumber ?? null,
      images: data.images ?? [],
      brandId: data.brandId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.places.push(newPlace);
    return newPlace;
  }

  async findAll(query: FindAllPlacesDto): Promise<PlaceWithBrandAndReviews[]> {
    let places = mockDb.places;

    if (query.q) {
      const q = query.q.toLowerCase();
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q),
      );
    }

    if (query.swLat !== undefined && query.neLat !== undefined) {
      places = places.filter(
        (p) => p.latitude >= query.swLat! && p.latitude <= query.neLat!,
      );
    }
    if (query.swLng !== undefined && query.neLng !== undefined) {
      places = places.filter(
        (p) => p.longitude >= query.swLng! && p.longitude <= query.neLng!,
      );
    }

    return places.map((p) => ({
      ...p,
      brand: mockDb.brands.find((br) => br.id === p.brandId) as Brand,
      reviews: mockDb.reviews
        .filter((r) => r.placeId === p.id)
        .map((r) => ({ rating: r.rating })),
    }));
  }

  async findById(id: string): Promise<PlaceWithFullDetails | null> {
    const place = mockDb.places.find((p) => p.id === id);
    if (!place) return null;
    const brand = mockDb.brands.find((br) => br.id === place.brandId);
    return {
      ...place,
      brand: {
        ...brand,
        business: mockDb.businesses.find((b) => b.id === brand?.businessId),
      },
      reviews: mockDb.reviews
        .filter((r) => r.placeId === place.id)
        .map((r) => ({
          ...r,
          user: mockDb.users.find((u) => u.id === r.userId),
          replies: mockDb.reviewReplies.filter((re) => re.reviewId === r.id),
        })),
      offers: mockDb.offers.filter((o) => o.placeId === place.id),
      _count: {
        checkins: mockDb.checkins.filter((c) => c.placeId === place.id).length,
        reviews: mockDb.reviews.filter((r) => r.placeId === place.id).length,
      },
    } as unknown as PlaceWithFullDetails;
  }

  async update(id: string, data: UpdatePlaceDto): Promise<Place> {
    const index = mockDb.places.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Place not found');
    const updated = {
      ...mockDb.places[index],
      ...data,
      updatedAt: new Date(),
    };
    mockDb.places[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<Place> {
    const index = mockDb.places.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Place not found');
    const place = mockDb.places.splice(index, 1)[0];
    return place;
  }
}
