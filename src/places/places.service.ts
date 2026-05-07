import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  async create(createPlaceDto: CreatePlaceDto, requestUserId: string) {
    const brand = mockDb.brands.find((b) => b.id === createPlaceDto.brandId);
    if (!brand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }

    const business = mockDb.businesses.find((b) => b.id === brand.businessId);

    // Strict Ownership check: Only the business owner can create places
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo địa điểm cho thương hiệu này',
      );
    }

    const place = {
      ...createPlaceDto,
      images: createPlaceDto.images || [],
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.places.push(place);
    return place;
  }

  async findAll() {
    return mockDb.places.map((place) => ({
      ...place,
      brand: mockDb.brands
        .filter((b) => b.id === place.brandId)
        .map((b) => ({ id: b.id, name: b.name, logoUrl: b.logoUrl }))[0],
      _count: {
        checkIns: mockDb.checkins.filter((c) => c.placeId === place.id).length,
        reviews: mockDb.reviews.filter((r) => r.placeId === place.id).length,
      },
    }));
  }

  async findOne(id: string) {
    const place = mockDb.places.find((p) => p.id === id);
    if (!place) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    const brand = mockDb.brands.find((b) => b.id === place.brandId);
    const business = brand
      ? mockDb.businesses.find((bus) => bus.id === brand.businessId)
      : null;

    const reviews = mockDb.reviews
      .filter((r) => r.placeId === id)
      .map((r) => ({
        ...r,
        user: mockDb.users
          .filter((u) => u.id === r.userId)
          .map((u) => ({ id: u.id, fullName: u.fullName }))[0],
        reply: mockDb.reviewReplies.find((rep) => rep.reviewId === r.id),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        : 0;

    const now = new Date();
    const offers = mockDb.offers.filter(
      (o) => o.placeId === id && o.validTo >= now,
    );

    return {
      ...place,
      brand: brand
        ? {
            ...brand,
            business: business
              ? { id: business.id, name: business.name }
              : null,
          }
        : null,
      reviews,
      averageRating: avgRating,
      offers,
      _count: {
        checkIns: mockDb.checkins.filter((c) => c.placeId === place.id).length,
        reviews: reviews.length,
      },
    };
  }

  async update(
    id: string,
    updatePlaceDto: UpdatePlaceDto,
    requestUserId: string,
  ) {
    const index = mockDb.places.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Không thể cập nhật: Địa điểm với ID ${id} không tồn tại`,
      );
    }

    const place = mockDb.places[index];
    const brand = mockDb.brands.find((b) => b.id === place.brandId);
    const business = brand
      ? mockDb.businesses.find((b) => b.id === brand.businessId)
      : null;

    // Strict Ownership check: Only the business owner can update
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa địa điểm này');
    }

    // Ensure brandId is not updated
    const { ...updateData } = updatePlaceDto;

    mockDb.places[index] = {
      ...mockDb.places[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return mockDb.places[index];
  }

  async remove(id: string, requestUserId: string) {
    const index = mockDb.places.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Không thể xóa: Địa điểm với ID ${id} không tồn tại`,
      );
    }

    const place = mockDb.places[index];
    const brand = mockDb.brands.find((b) => b.id === place.brandId);
    const business = brand
      ? mockDb.businesses.find((b) => b.id === brand.businessId)
      : null;

    // Strict Ownership check: Only the business owner can remove
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa địa điểm này');
    }

    const deleted = mockDb.places.splice(index, 1);
    return deleted[0];
  }
}
