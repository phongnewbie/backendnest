import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesDto } from './dto/find-all-places.dto';
import type {
  IPlacesRepository,
  PlaceWithFullDetails,
} from './places.repository.interface';
import type { IBrandsRepository } from '../brands/brands.repository.interface';
import type { IBusinessesRepository } from '../businesses/businesses.repository.interface';
import { Place } from '@prisma/client';

@Injectable()
export class PlacesService {
  constructor(
    @Inject('IPLACES_REPOSITORY')
    private readonly placesRepository: IPlacesRepository,
    @Inject('IBRANDS_REPOSITORY')
    private readonly brandsRepository: IBrandsRepository,
    @Inject('IBUSINESSES_REPOSITORY')
    private readonly businessesRepository: IBusinessesRepository,
  ) {}

  async create(
    createPlaceDto: CreatePlaceDto,
    requestUserId: string,
  ): Promise<Place> {
    const brand = await this.brandsRepository.findById(createPlaceDto.brandId);
    if (!brand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }

    const business = await this.businessesRepository.findById(brand.businessId);

    // Strict Ownership check: Only the business owner can create places
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo địa điểm cho thương hiệu này',
      );
    }

    return this.placesRepository.create(createPlaceDto);
  }

  async findAll(query: FindAllPlacesDto) {
    const places = await this.placesRepository.findAll(query);

    let filteredPlaces = places.map((place) => {
      const avgRating =
        place.reviews.length > 0
          ? place.reviews.reduce(
              (acc: number, curr: { rating: number }) => acc + curr.rating,
              0,
            ) / place.reviews.length
          : 0;

      return {
        ...place,
        avgRating,
      };
    });

    // Filter by Open Now
    if (query.isOpenNow) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (time?: string | null) => {
        if (!time) return null;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      filteredPlaces = filteredPlaces.filter((p) => {
        const open = parseTimeToMinutes(p.openTime);
        const close = parseTimeToMinutes(p.closeTime);

        if (open === null || close === null) return true;

        if (open <= close) {
          return currentMinutes >= open && currentMinutes <= close;
        } else {
          return currentMinutes >= open || currentMinutes <= close;
        }
      });
    }

    // Transform to GeoJSON
    const features = filteredPlaces.map((p) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude],
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

  async findOne(
    id: string,
  ): Promise<PlaceWithFullDetails & { averageRating: number }> {
    const place = await this.placesRepository.findById(id);

    if (!place) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    const avgRating =
      place.reviews.length > 0
        ? place.reviews.reduce(
            (acc: number, curr: { rating: number }) => acc + curr.rating,
            0,
          ) / place.reviews.length
        : 0;

    return {
      ...place,
      averageRating: avgRating,
    };
  }

  async update(
    id: string,
    updatePlaceDto: UpdatePlaceDto,
    requestUserId: string,
  ): Promise<Place> {
    const place = await this.placesRepository.findById(id);

    if (!place) {
      throw new NotFoundException(
        `Không thể cập nhật: Địa điểm với ID ${id} không tồn tại`,
      );
    }

    const business = await this.businessesRepository.findById(
      place.brand.businessId,
    );

    // Strict Ownership check: Only the business owner can update
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa địa điểm này');
    }

    return this.placesRepository.update(id, updatePlaceDto);
  }

  async remove(id: string, requestUserId: string): Promise<Place> {
    const place = await this.placesRepository.findById(id);

    if (!place) {
      throw new NotFoundException(
        `Không thể xóa: Địa điểm với ID ${id} không tồn tại`,
      );
    }

    const business = await this.businessesRepository.findById(
      place.brand.businessId,
    );

    // Strict Ownership check: Only the business owner can remove
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa địa điểm này');
    }

    return this.placesRepository.delete(id);
  }
}
