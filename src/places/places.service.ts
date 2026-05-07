import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesDto } from './dto/find-all-places.dto';

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
      checkInRadius: createPlaceDto.checkInRadius ?? 500,
      images: createPlaceDto.images || [],
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.places.push(place);
    return place;
  }

  async findAll(query: FindAllPlacesDto) {
    const { swLat, swLng, neLat, neLng, q, category } = query;

    let filteredPlaces = mockDb.places.map((place) => {
      const brand = mockDb.brands.find((b) => b.id === place.brandId);
      const business = brand
        ? mockDb.businesses.find((b) => b.id === brand.businessId)
        : null;
      const reviews = mockDb.reviews.filter((r) => r.placeId === place.id);
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
          : 0;

      return {
        ...place,
        brand,
        business,
        avgRating,
      };
    });

    // Filter by Bounding Box
    if (
      swLat !== undefined &&
      swLng !== undefined &&
      neLat !== undefined &&
      neLng !== undefined
    ) {
      filteredPlaces = filteredPlaces.filter((p) => {
        return (
          p.latitude >= swLat &&
          p.latitude <= neLat &&
          p.longitude >= swLng &&
          p.longitude <= neLng
        );
      });
    }

    // Filter by Keyword (Global Search)
    if (q) {
      const search = q.toLowerCase();
      filteredPlaces = filteredPlaces.filter((p) => {
        const searchFields = [
          p.name,
          p.address,
          p.phoneNumber,
          p.openTime,
          p.closeTime,
          p.brand?.name,
          p.business?.name,
          p.business?.address,
          p.business?.website,
          p.business?.description,
          p.business?.phone,
        ];

        return searchFields.some((field) =>
          field?.toLowerCase().includes(search),
        );
      });
    }

    // Filter by Category
    if (category) {
      filteredPlaces = filteredPlaces.filter(
        (p) => p.brand?.category === category,
      );
    }

    // Filter by Open Now
    if (query.isOpenNow) {
      const now = new Date();
      // Adjust to Vietnam Time (UTC+7) if needed, but for simplicity use system time
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (time?: string) => {
        if (!time) return null;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      filteredPlaces = filteredPlaces.filter((p) => {
        const open = parseTimeToMinutes(p.openTime);
        const close = parseTimeToMinutes(p.closeTime);

        if (open === null || close === null) return true; // Assume always open if no time set

        if (open <= close) {
          return currentMinutes >= open && currentMinutes <= close;
        } else {
          // Open past midnight (e.g., 22:00 - 02:00)
          return currentMinutes >= open || currentMinutes <= close;
        }
      });
    }

    // Transform to GeoJSON
    const features = filteredPlaces.map((p) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude], // GeoJSON order: [lng, lat]
      },
      properties: {
        id: p.id,
        name: p.name,
        address: p.address,
        logo: p.brand?.logoUrl || null,
        avgRating: p.avgRating,
        category: p.brand?.category || null,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
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
